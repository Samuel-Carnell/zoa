import {
	EndpointBuilder,
	HttpMethod,
	InternalEndpointDefinition,
	InternalRouteDefinition,
	JoinPath,
	Params,
	RouteDefinition,
} from './types';
import * as zod from 'zod';
import * as koa from 'koa';
import { Endpoint } from './endpoint';

function joinPath(segmentA: string, segmentB: string) {
	return (
		(segmentA.endsWith('/') ? segmentA.slice(0, -1) : segmentA) +
		'/' +
		(segmentB.startsWith('/') ? segmentB.slice(1) : segmentB)
	);
}

function cloneRoute(route: InternalRouteDefinition): InternalRouteDefinition {
	return {
		path: {
			value: route.path.value,
			parameters: { ...route.path.parameters },
		},
		tags: [...route.tags],
		middleware: [...route.middleware],
	} as InternalRouteDefinition;
}

export class Router<TRouteDefinition extends RouteDefinition> {
	private readonly _endpointBuilders: Array<EndpointBuilder> = [];

	protected constructor(private _route: InternalRouteDefinition<TRouteDefinition>) {}

	public use(middleware: koa.Middleware<koa.DefaultState, koa.DefaultContext, unknown>) {
		this._route.middleware?.push(middleware);
		return this;
	}

	public path<TPath extends string, TParameters extends { [P in Params<TPath>]: zod.ZodString }>(
		path: TPath,
		parameters?: TParameters
	) {
		const newRoute = cloneRoute(this._route);
		newRoute.path.value = joinPath(this._route.path.value, path);
		newRoute.path.parameters = { ...this._route.path.parameters, ...parameters };

		const router = new Router<{
			path: {
				value: JoinPath<TRouteDefinition['path']['value'], TPath>;
				parameters: TRouteDefinition['path']['parameters'] & TParameters;
			};
		}>(newRoute as any);
		this._endpointBuilders.push(router as unknown as EndpointBuilder);
		return router;
	}

	public tag(tag: string) {
		this._route.tags.push(tag);
		return this;
	}

	public endpoint<TMethod extends HttpMethod>(method: TMethod) {
		const endpointDefinition: InternalEndpointDefinition = {
			...cloneRoute(this._route),
			method,
			query: {},
			request: {},
			response: [],
			summary: '',
			description: '',
		};

		const endpoint = new Endpoint(endpointDefinition);
		this._endpointBuilders.push(endpoint as unknown as EndpointBuilder);
		return endpoint as Endpoint<{
			path: {
				value: TRouteDefinition['path']['value'];
				parameters: TRouteDefinition['path']['parameters'];
			};
			method: TMethod;
			query: {};
			request: { body: undefined };
			response: never;
			description: string;
			summary: string;
			tag: string;
		}>;
	}

	protected build(): InternalEndpointDefinition[] {
		return this._endpointBuilders.flatMap((x) => x.build());
	}
}
