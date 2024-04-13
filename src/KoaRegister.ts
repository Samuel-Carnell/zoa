import * as koa from 'koa';
import KoaRouter from '@koa/router';
import { EndpointDefinition, HttpMethod, InternalEndpointDefinition } from './types';
import * as zod from 'zod';
import rawBody from 'raw-body';
import { HttpStatusCode } from 'httpStatusCodes';

const pathValidation = (parameters: EndpointDefinition['path']['parameters']): koa.Middleware => {
	return (ctx: any, next: any) => {
		const errors: any[] = [];
		const schema = zod.object(parameters);
		const result = schema.safeParse(ctx.params);
		if (!result.success) {
			for (const error of result.error.errors) {
				errors.push({ name: error.path[0], message: error.message });
			}
		}

		const hasError = errors.length > 0;
		if (hasError) {
			setResponse(ctx.response, '422', 'application/problem+json', {
				type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
				title: 'Path contained one or more validation errors.',
				status: 422,
				errors: errors,
			});
			return;
		}

		ctx._internalRequest.path = ctx.params;
		return next();
	};
};

const queryValidation = (query: EndpointDefinition['query']) => {
	return (ctx: koa.Context, next: koa.Next) => {
		const errors: any[] = [];
		const schema = zod.object(query);
		const result = schema.safeParse(ctx.query);
		if (!result.success) {
			for (const error of result.error.errors) {
				errors.push({ name: error.path[0], message: error.message });
			}
		}

		const hasError = errors.length > 0;
		if (hasError) {
			setResponse(ctx.response, '422', 'application/problem+json', {
				type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
				title: 'Query contained one or more validation errors.',
				status: 422,
				errors: errors,
			});
			return;
		}

		ctx._internalRequest.query = ctx.query;
		return next();
	};
};

const bodyValidation = (
	bodySchema: NonNullable<EndpointDefinition['request']['body']>
): koa.Middleware => {
	return async (ctx: any, next: any) => {
		let parsedBody;
		const body = await rawBody(ctx.request.req).then((body) => body.toString());
		try {
			parsedBody = JSON.parse(body);
		} catch {
			setResponse(ctx.response, '422', 'application/problem+json', {
				type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
				title: 'Malformed request body.',
				status: 400,
				detail: 'Request body contains invalid JSON.',
			});
			return;
		}

		const errors: any[] = [];
		const result = bodySchema.safeParse(parsedBody);
		if (!result.success) {
			for (const error of result.error.errors) {
				errors.push({ name: error.path.join('.'), message: error.message });
			}
		}

		const hasError = errors.length > 0;
		if (hasError) {
			setResponse(ctx.response, '422', 'application/problem+json', {
				type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
				title: 'Body contained one or more validation errors.',
				status: 422,
				errors: errors,
			});
			return;
		}

		ctx._internalRequest.body = parsedBody;
		return next();
	};
};

function setResponse(
	response: koa.Response,
	status: HttpStatusCode,
	mimeType: string,
	body?: unknown
) {
	response.status = parseInt(status);
	if (body !== undefined) {
		response.body = body;
		response.append('content-type', mimeType);
	}
}

export function registerEndpointWithKoaRouter(
	endpoint: InternalEndpointDefinition,
	router: KoaRouter
) {
	const middleware = [
		...endpoint.middleware,
		(ctx: koa.Context, next: koa.Next) => {
			ctx._internalRequest = {};
			next();
		},
	];
	if (Object.entries(endpoint.path.parameters).length > 0) {
		middleware.push(pathValidation(endpoint.path.parameters));
	}

	if (endpoint.query !== undefined) {
		middleware.push(queryValidation(endpoint.query));
	}

	if (endpoint.request.body !== undefined) {
		middleware.push(bodyValidation(endpoint.request.body));
	}

	const method = endpoint.method.toLowerCase() as Lowercase<HttpMethod>;
	router[method](endpoint.path.value, ...middleware, (ctx: koa.Context) => {
		if (endpoint.handler === undefined) {
			ctx.response.status = 503;
			return;
		}

		const [status, body] = endpoint.handler({
			...ctx.request,
			endpoint: endpoint as unknown as EndpointDefinition,
			path: ctx._internalRequest.path,
			query: ctx._internalRequest.query,
			body: ctx._internalRequest.body,
		});
		setResponse(ctx.response, status, 'application/json', body);
	});
}
