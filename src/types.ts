import * as zod from 'zod';
import * as koa from 'koa';
import { HttpStatusCode } from './httpStatusCodes';

export type JoinPath<
	TSegmentA extends string,
	TSegmentB extends string
> = `${TSegmentA extends `${infer BeforeSlash}/`
	? BeforeSlash
	: TSegmentA}/${TSegmentB extends `/${infer AfterSlash}` ? AfterSlash : TSegmentB}`;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH';

export type ResponseValue<TResponse extends [HttpStatusCode, zod.ZodTypeAny] | [HttpStatusCode]> =
	TResponse extends [HttpStatusCode, zod.ZodTypeAny]
		? [statusCode: TResponse[0], body: zod.TypeOf<NonNullable<TResponse[1]>>]
		: [statusCode: TResponse[0]];

export type RequestValue<TEndpointDefinition extends EndpointDefinition> = Modify<
	koa.Request,
	{
		path: {
			[P in keyof TEndpointDefinition['path']['parameters']]: zod.infer<
				TEndpointDefinition['path']['parameters'][P]
			>;
		};
		query: {
			[P in keyof TEndpointDefinition['query']]: zod.infer<TEndpointDefinition['query'][P]>;
		};
		body: TEndpointDefinition['request']['body'] extends undefined
			? undefined
			: zod.infer<NonNullable<TEndpointDefinition['request']['body']>>;
		endpoint: TEndpointDefinition;
	}
>;

export type SplitAsUnion<S extends string, D extends string> = string extends S
	? never
	: S extends ''
	? never
	: S extends `${infer T}${D}${infer U}`
	? T | SplitAsUnion<U, D>
	: S;

export type Params<
	TPath extends string,
	TPathSegments = SplitAsUnion<TPath, '/'>
> = TPathSegments extends `:${infer Param}` ? Param : never;

export type Modify<T, R> = Omit<T, keyof R> & R;

export type EndpointDefinition = RouteDefinition & {
	method: HttpMethod;
	query: {
		[key: string]: Zod.ZodOptional<Zod.ZodString | Zod.ZodNumber> | Zod.ZodString | Zod.ZodNumber;
	};
	request: {
		body?: zod.ZodTypeAny;
	};
	response: [HttpStatusCode, zod.ZodTypeAny] | [HttpStatusCode];
};

export type InternalEndpointDefinition<T extends EndpointDefinition = EndpointDefinition> = {
	path: {
		value: T['path']['value'];
		parameters: T['path']['parameters'];
	};
	method: T['method'];
	query: T['query'];
	request: {
		body?: T['request']['body'];
	};
	response: Array<T['response']>;
	handler?: (request: RequestValue<T>) => ResponseValue<T['response']>;
	tags: Array<string>;
	summary?: string;
	description?: string;
	middleware: Array<koa.Middleware>;
};

export type RouteDefinition = {
	path: {
		value: string;
		parameters: { [key: string]: zod.ZodString };
	};
};

export type InternalRouteDefinition<T extends RouteDefinition = RouteDefinition> = {
	path: {
		value: T['path']['value'];
		parameters: T['path']['parameters'];
	};
	middleware: Array<koa.Middleware>;
	tags: Array<string>;
};

export interface EndpointBuilder {
	build(): Array<InternalEndpointDefinition>;
}
