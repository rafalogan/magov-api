import { IFile } from './file';
import { IGExpenseBudget } from './government-expenses';
import { IKeyword } from './keyword';
import { IID, IReadOptions } from './shared';
import { ITheme } from './theme';

export interface IProposition extends IID {
	title: string;
	menu: Blob | string;
	deadline: Date | string;
	active: boolean;
	favorite?: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	typeId: number;
	tenancyId: number;
	propositionUrl?: string;
	textEditor?: Blob | string;
}

export interface IPropositionModel extends IProposition {
	userId: number;
	budgets?: IGExpenseBudget[];
	keywords: string[];
	themes: string[];
	demands?: number[];
	tasks: ITaskProposition[];
	file?: IFile;
}

export interface IPropositionViewModel extends IProposition {
	budgets?: IBudgetProposition[];
	keywords: IKeyword[];
	themes: ITheme[];
	demands?: IDemandPoprosition[];
	propositions?: ISubProposition[];
	tasks?: ITaskProposition[];
	file?: IFile;
	typeName: string;
	unitName: string;
}

export interface IBudgetProposition {
	id: number;
	revenue: string;
	value: number;
}

export interface IDemandPoprosition {
	id: number;
	name: string;
}

export interface ISubProposition {
	id: number;
	title: string;
}

export interface ITaskProposition {
	id?: number;
	task: string;
	deadline: Date | string;
	level: number;
	userId: number;
	responsible?: string;
}

export interface IPropositionsReadOptions extends IReadOptions {
	unitId?: number;
}

export interface IPropositonAddURL {
	tenancyId: number;
	propositionUrl: string;
}

export interface IPropositionTextEditor {
	id: number;
	typeId?: number;
	textEditor: Blob | string;
}