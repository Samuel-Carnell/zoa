import { HttpMethod, InternalEndpointDefinition, InternalRouteDefinition, JoinPath, Params, RouteDefinition } from './types';
import * as zod from 'zod';
import * as koa from 'koa';
import { Endpoint } from './endpoint';
export declare class Router<TRouteDefinition extends RouteDefinition> {
    private _route;
    private readonly _endpointBuilders;
    protected constructor(_route: InternalRouteDefinition<TRouteDefinition>);
    use(middleware: koa.Middleware<koa.DefaultState, koa.DefaultContext, unknown>): this;
    path<TPath extends string, TParameters extends {
        [P in Params<TPath>]: zod.ZodString;
    }>(path: TPath, parameters?: TParameters): Router<{
        path: {
            value: JoinPath<TRouteDefinition['path']['value'], TPath>;
            parameters: TRouteDefinition['path']['parameters'] & TParameters;
        };
    }>;
    tag(tag: string): this;
    endpoint<TMethod extends HttpMethod>(method: TMethod): Endpoint<{
        path: {
            value: TRouteDefinition['path']['value'];
            parameters: TRouteDefinition['path']['parameters'];
        };
        method: TMethod;
        query: {};
        request: {
            body: undefined;
        };
        response: never;
        description: string;
        summary: string;
        tag: string;
    }>;
    protected build(): InternalEndpointDefinition[];
}
