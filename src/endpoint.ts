import { HttpStatusCode } from './httpStatusCodes';
import {
	EndpointDefinition,
	InternalEndpointDefinition,
	RequestValue,
	ResponseValue,
} from './types';
import * as zod from 'zod';

export class Endpoint<TEndpointDefinition extends EndpointDefinition> {
	constructor(private _endpoint: InternalEndpointDefinition<TEndpointDefinition>) {}

	public response<TStatusCode extends HttpStatusCode>(
		statusCode: TStatusCode
	): Endpoint<{
		path: TEndpointDefinition['path'];
		method: TEndpointDefinition['method'];
		query: TEndpointDefinition['query'];
		request: TEndpointDefinition['request'];
		response: TEndpointDefinition['response'] | [TStatusCode];
	}>;
	public response<TStatusCode extends HttpStatusCode, TResponseSchema extends zod.ZodTypeAny>(
		statusCode: TStatusCode,
		responseSchema: TResponseSchema
	): Endpoint<{
		path: TEndpointDefinition['path'];
		method: TEndpointDefinition['method'];
		query: TEndpointDefinition['query'];
		request: TEndpointDefinition['request'];
		response: TEndpointDefinition['response'] | [TStatusCode, TResponseSchema];
	}>;
	public response(statusCode: HttpStatusCode, responseSchema?: zod.ZodTypeAny | undefined) {
		const response = (
			responseSchema !== undefined ? [statusCode, responseSchema] : [statusCode]
		) as [HttpStatusCode, zod.ZodTypeAny] | [HttpStatusCode];
		this._endpoint.response.push(response);
		return this as unknown;
	}

	public query<
		TQuery extends {
			[key: string]: Zod.ZodOptional<Zod.ZodString | Zod.ZodNumber> | Zod.ZodString | Zod.ZodNumber;
		}
	>(query: TQuery) {
		this._endpoint.query = query;
		return this as unknown as Endpoint<{
			path: TEndpointDefinition['path'];
			method: TEndpointDefinition['method'];
			query: TQuery;
			request: TEndpointDefinition['request'];
			response: TEndpointDefinition['response'];
		}>;
	}

	public handler(
		handler: (
			request: RequestValue<TEndpointDefinition>
		) => ResponseValue<TEndpointDefinition['response']>
	) {
		this._endpoint.handler = handler;
	}

	public summary(summary: string) {
		this._endpoint.summary = summary;
		return this;
	}

	public description(description: string) {
		this._endpoint.description = description;
		return this;
	}

	public tag(tag: string) {
		this._endpoint.tags.push(tag);
		return this;
	}

	public body<TBody extends zod.ZodTypeAny>(schema: TBody) {
		this._endpoint.request.body = schema;
		return this as unknown as Endpoint<{
			path: TEndpointDefinition['path'];
			method: TEndpointDefinition['method'];
			query: TEndpointDefinition['query'];
			request: { body: TBody };
			response: TEndpointDefinition['response'];
		}>;
	}

	protected build(): InternalEndpointDefinition[] {
		return [this._endpoint];
	}
}
