import { App } from './index';
import zod from 'zod';

it('Smoke test', () => {
	const app = new App();
	app
		.path('/root')
		.path('/sub-path/:param', { param: zod.string() })
		.endpoint('GET')
		.query({ from: zod.string().datetime() })
		.summary('summary')
		.description('description')
		.body(zod.object({ foo: zod.literal('bar') }))
		.response('200')
		.response('500', zod.string())
		.handler(() => {
			return ['200'];
		});

	console.log(app.endpoints);
});
