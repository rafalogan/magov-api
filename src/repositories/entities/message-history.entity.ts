import dayjs from 'dayjs';

import { convertToDate, setInstanceId } from 'src/utils';
import { IMessageHistory } from '../types';

export class MessageHistory {
	id?: number;
	tenancyId: number;
	message: string;
	sendDate: Date;
	expiresAt: Date;

	constructor(data: IMessageHistory, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.tenancyId = Number(data.tenancyId);
		this.message = data.message.toString();
		this.sendDate = convertToDate(data.sendDate);
		this.expiresAt = this.setExpiresAt(data.expiresAt);
	}

	private setExpiresAt(expiresAt?: Date | string) {
		if (expiresAt) return convertToDate(expiresAt);
		return dayjs(this.sendDate).add(1, 'month').toDate();
	}
}
