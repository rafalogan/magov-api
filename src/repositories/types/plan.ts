export interface IPlan {
	id: number;
	name: string;
	description?: Blob;
	usersLimit?: number;
	unitaryValue: number;
}
