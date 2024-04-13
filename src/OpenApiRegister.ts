import { OpenAPIRegistry, ResponseConfig, ZodContentObject } from '@asteasolutions/zod-to-openapi';
import { reasonPhrase } from './httpStatusCodes';
import { InternalEndpointDefinition } from './types';
import * as zod from 'zod';

function formatPath(path: string) {
	return path
		.split('/')
		.map((segment) => {
			if (segment.startsWith(':')) {
				return `{${segment.slice(1)}}`;
			}

			return segment;
		})
		.join('/');
}

export function registerEndpointWithOpenApi(
	endpoint: InternalEndpointDefinition,
	registry: OpenAPIRegistry
) {
	registry.registerPath({
		path: formatPath(endpoint.path.value),
		method: endpoint.method.toLowerCase() as Lowercase<InternalEndpointDefinition['method']>,
		tags: endpoint.tags,
		request: {
			params: zod.object(endpoint.path.parameters),
			query: zod.object(endpoint.query),
		},
		responses: endpoint.response.reduce<{ [statusCode: string]: ResponseConfig }>(
			(obj, response) => {
				const [status, schema] = response;
				const content: ZodContentObject | undefined =
					schema !== undefined ? { 'application/json': { schema } } : undefined;
				obj[status] = {
					description: reasonPhrase(status),
					content,
				};
				return obj;
			},
			{}
		),
	});
}
