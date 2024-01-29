import { RouteOptions } from './route';

export interface ModuleOptions<T> extends RouteOptions {
	service: T;
}
