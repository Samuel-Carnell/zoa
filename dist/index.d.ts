import './setup';
export * from './app';
export * from './types';
import { ZodOpenAPIMetadata, ZodOpenApiFullMetadata } from '@asteasolutions/zod-to-openapi/dist/zod-extensions';
import * as zod from 'zod';
declare module 'zod' {
    interface ZodTypeDef {
        openapi?: ZodOpenApiFullMetadata;
    }
    interface ZodType<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
        openapi<T extends zod.ZodTypeAny>(this: T, metadata: Partial<ZodOpenAPIMetadata<zod.input<T>>>): T;
        openapi<T extends zod.ZodTypeAny>(this: T, refId: string, metadata?: Partial<ZodOpenAPIMetadata<zod.input<T>>>): T;
    }
}
