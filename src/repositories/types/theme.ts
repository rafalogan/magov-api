import { IID } from './shared';

export interface ITheme extends IID {
	name: string;
	description?: string | Blob;
	active: boolean;
}
