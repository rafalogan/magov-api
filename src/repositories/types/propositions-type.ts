import { IFile } from './file';
import { IID } from './shared';

export interface IPropositionsType extends IID {
	name: string;
	fileId?: number;
	description?: Blob | string;
	document?: IFile;
	active?: boolean;
	parentId?: number;
}

export interface IPropositionsTypeViewModel extends IPropositionsType {
	subTypes?: IPropositionsTypeViewModel[];
}
