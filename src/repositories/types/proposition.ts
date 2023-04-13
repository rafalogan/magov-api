import { IKeyword } from './keyword';
import { IID, IReadOptions } from './shared';
import { ITheme } from './theme';

export interface IProposition extends IID {
	title: string;
	menu: string;
	deadline: Date | string;
	active: boolean;
	favorite?: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	typeId: number;
	tenancyId: number;
}

export interface IPropositionModel extends IProposition {
	budgets?: number[];
	keywords: string[];
	themes: string[];
	demands?: number[];
	tasks: ITaskProposition[];
}

export interface IPropositionViewModel extends IProposition {
	budgets?: IBudgetProposition[];
	keywords: IKeyword[];
	themes: ITheme[];
	demands?: IDemandPoprosition[];
	propositions?: ISubProposition[];
	tasks?: ITaskProposition[];
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
