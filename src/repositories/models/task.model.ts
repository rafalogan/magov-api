import { IComment, IPlantiffTask, ITaskModel, IUnitExpenseModel } from '../types';
import { Comment, UnitExpense } from 'src/repositories/entities';
import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';

export class TaskModel {
	id?: number;
	title: string;
	description?: string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	status: number;
	userId: number;
	unitId: number;
	tenancyId: number;
	propositionId?: number;
	demandId?: number;
	participants?: IPlantiffTask[];
	users: number[];
	comments?: Comment[];
	themes: string[];
	unitExpense?: UnitExpense;

	constructor(data: ITaskModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.description = convertBlobToString(data.description);
		this.cost = setValueNumberToDadaBase(data.cost);
		this.start = convertToDate(data.start);
		this.end = convertToDate(data.end);
		this.level = Number(data.level);
		this.status = Number(data.status) || 0;
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.propositionId = setInstanceId(data.propositionId);
		this.demandId = setInstanceId(data.demandId);
		this.users = data.users;
		this.userId = Number(data.userId || data.users[0]);
		this.comments = this.setComents(data.comments);
		this.unitExpense =
			data.setUnitExpense && this.cost
				? this.setUnitExpense()
				: data.unitExpense
					? this.setUnitExpense(data.unitExpense as IUnitExpenseModel)
					: undefined;
		this.themes = data.themes;
		this.participants = this.setParticipates(data.participants);
	}

	private setParticipates(data?: IPlantiffTask[]): IPlantiffTask[] {
		if (!data) return [];

		return data.map(i => ({ ...i, id: Number(i.id) }));
	}

	private setUnitExpense(value?: IUnitExpenseModel) {
		if (value) return new UnitExpense(value);
		return new UnitExpense({
			expense: this.title,
			description: this.description,
			dueDate: this.end,
			amount: 1,

			taskId: this.id,
			unitId: this.unitId,
			tenancyId: this.tenancyId,
		} as IUnitExpenseModel);
	}

	private setComents(value?: IComment[]) {
		if (!value) return undefined;
		return value.map(item => new Comment({ ...item }));
	}
}
