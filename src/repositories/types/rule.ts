import { IID } from './shared';

export interface IRule extends IID {
	name: string;
	description?: Blob | string;
}
