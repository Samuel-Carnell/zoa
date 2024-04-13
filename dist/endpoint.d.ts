import { HttpStatusCode } from './httpStatusCodes';
import { EndpointDefinition, InternalEndpointDefinition, RequestValue, ResponseValue } from './types';
import * as zod from 'zod';
export declare class Endpoint<TEndpointDefinition extends EndpointDefinition> {
    private _endpoint;
    constructor(_endpoint: InternalEndpointDefinition<TEndpointDefinition>);
    response<TStatusCode extends HttpStatusCode>(statusCode: TStatusCode): Endpoint<{
        path: TEndpointDefinition['path'];
        method: TEndpointDefinition['method'];
        query: TEndpointDefinition['query'];
        request: TEndpointDefinition['request'];
        response: TEndpointDefinition['response'] | [TStatusCode];
    }>;
    response<TStatusCode extends HttpStatusCode, TResponseSchema extends zod.ZodTypeAny>(statusCode: TStatusCode, responseSchema: TResponseSchema): Endpoint<{
        path: TEndpointDefinition['path'];
        method: TEndpointDefinition['method'];
        query: TEndpointDefinition['query'];
        request: TEndpointDefinition['request'];
        response: TEndpointDefinition['response'] | [TStatusCode, TResponseSchema];
    }>;
    query<TQuery extends {
        [key: string]: Zod.ZodOptional<Zod.ZodString | Zod.ZodNumber> | Zod.ZodString | Zod.ZodNumber;
    }>(query: TQuery): Endpoint<{
        path: TEndpointDefinition['path'];
        method: TEndpointDefinition['method'];
        query: TQuery;
        request: TEndpointDefinition['request'];
        response: TEndpointDefinition['response'];
    }>;
    handler(handler: (request: RequestValue<TEndpointDefinition>) => ResponseValue<TEndpointDefinition['response']>): void;
    summary(summary: string): this;
    description(description: string): this;
    tag(tag: string): this;
    body<TBody extends zod.ZodTypeAny>(schema: TBody): Endpoint<{
        path: TEndpointDefinition['path'];
        method: TEndpointDefinition['method'];
        query: TEndpointDefinition['query'];
        request: {
            body: TBody;
        };
        response: TEndpointDefinition['response'];
    }>;
    protected build(): InternalEndpointDefinition[];
}
