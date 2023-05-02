import { IFile } from './file';
import { IID } from './shared';

export interface IPropositionsType extends IID {
	name: string;
	description: Blob | string;
	document?: IFile;
	active?: boolean;
	subTypes?: IPropositionsType[];
}
