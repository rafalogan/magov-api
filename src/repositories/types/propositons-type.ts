import { IFile } from './file';
import { IID } from './shared';

export interface IPropositonsType extends IID {
	name: string;
	description: Blob | string;
	document: IFile;
	active?: boolean;
}
