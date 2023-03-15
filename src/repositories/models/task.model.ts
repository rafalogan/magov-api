import { ITaskComment, ITaskModel, IUnitExpense } from '../types';
import { Comment, UnitExpense } from 'src/repositories/entities';
import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { PlaintiffModel } from './plaintiff.model';

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
	plaintiffId?: number;
	plaintiff?: PlaintiffModel;
	users: number[];
	comments?: Comment[];
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
		this.userId = Number(data.userId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.propositionId = setInstanceId(data.propositionId);
		this.demandId = setInstanceId(data.demandId);
		this.plaintiffId = setInstanceId(data.plaintiffId);
		this.plaintiff = data?.plaintiff?.name
			? new PlaintiffModel({ ...data.plaintiff, tenancyId: data?.plaintiff?.tenancyId || this.tenancyId })
			: undefined;
		this.users = data.users;
		this.comments = this.setComents(data.comments);
		this.unitExpense =
			data.setUnitExpense && this.cost ? this.setUnitExpense() : data.unitExpense ? this.setUnitExpense(data.unitExpense) : undefined;
	}

	private setUnitExpense(value?: IUnitExpense) {
		if (value) return new UnitExpense(value);
		return new UnitExpense({
			expense: this.title,
			description: this.description,
			dueDate: this.end,
			amount: 1,
			installments: 1,
			value: Number(this.cost),
			taskId: this.id,
			unitId: this.unitId,
			tenancyId: this.tenancyId,
		});
	}

	private setComents(value?: ITaskComment[]) {
		if (!value) return undefined;
		return value.map(item => new Comment({ ...item }));
	}
}
