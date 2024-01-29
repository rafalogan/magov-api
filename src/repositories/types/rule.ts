import { IID } from './shared';

export interface IRule extends IID {
	name: string;
	code: string;
	description?: Blob | string;
}
