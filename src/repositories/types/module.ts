import { Application } from 'express';
import { AuthConfig } from 'src/config';
import { RouteOptions } from './route';

export interface ModuleOptions<T> extends RouteOptions {
	service: T;
}
