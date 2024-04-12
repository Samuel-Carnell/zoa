/// <reference types="koa__router" />
import KoaRouter from '@koa/router';
import { InternalEndpointDefinition } from 'types';
export declare function registerEndpointWithKoaRouter(endpoint: InternalEndpointDefinition, router: KoaRouter): void;
