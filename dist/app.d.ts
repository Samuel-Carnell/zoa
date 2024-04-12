/// <reference types="koa" />
import { Router } from './router';
import { InternalEndpointDefinition } from './types';
import { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
type InitialRoute = {
    path: {
        value: '/';
        parameters: {};
    };
    tag: string;
};
export declare class App extends Router<InitialRoute> {
    private _endpointsCache?;
    constructor();
    get endpoints(): InternalEndpointDefinition[];
    middleware(): compose.Middleware<import("koa").ParameterizedContext<StateT, ContextT, ResponseBodyT>>;
    openApiDocument(info: {
        title: string;
        description?: string;
        termsOfService?: string;
        contact?: {
            name?: string;
            url?: string;
            email?: string;
        };
        license?: {
            name: string;
            identifier?: string;
            url?: string;
        };
        version: string;
    }): OpenAPIComponentObject;
}
export {};
