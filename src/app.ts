import { Router } from './router';
import { InternalEndpointDefinition, InternalRouteDefinition } from './types';
import KoaRouter from '@koa/router';
import { registerEndpointWithKoaRouter } from 'KoaRegister';
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerEndpointWithOpenApi } from 'OpenApiRegister';
import { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';

const initialRoute = (): InternalRouteDefinition<InitialRoute> => ({
	path: { value: '/', parameters: {} },
	middleware: [],
	tags: [],
});
type InitialRoute = { path: { value: '/'; parameters: {} }; tag: string };

export class App extends Router<InitialRoute> {
	private _endpointsCache?: InternalEndpointDefinition[];

	public constructor() {
		super(initialRoute());
	}

	public get endpoints() {
		if (this._endpointsCache !== undefined) {
			return this._endpointsCache;
		}

		this._endpointsCache = this.build();
		return this._endpointsCache;
	}

	public middleware() {
		const router = new KoaRouter();
		for (const endpoint of this.endpoints) {
			registerEndpointWithKoaRouter(endpoint, router);
		}
		return router.middleware();
	}

	public openApiDocument(info: {
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
	}): OpenAPIComponentObject {
		const registry = new OpenAPIRegistry();
		for (const endpoint of this.endpoints) {
			registerEndpointWithOpenApi(endpoint, registry);
		}
		return new OpenApiGeneratorV3(registry.definitions).generateDocument({
			openapi: '3.0.0',
			info,
		});
	}
}
