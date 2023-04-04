export interface IPlan {
	id: number;
	name: string;
	plan?: boolean;
	description?: Blob;
	limit?: number;
	value: number;
	active: boolean;
}
