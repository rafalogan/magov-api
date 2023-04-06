import { Knex } from 'knex';

import { isProd } from 'src/utils';

const defaultThemes = [
	{
		name: 'Bean',
		description:
			'Dolor incididunt eiusmod nostrud fugiat ipsum consequat tempor. Laboris duis deserunt nisi nulla magna enim mollit deserunt aliqua esse irure aliquip consectetur. Aliquip consectetur voluptate laboris eiusmod consequat occaecat incididunt eu duis elit ad proident. Tempor culpa nulla ad fugiat ipsum enim eu nisi cupidatat et voluptate irure. Adipisicing cillum id exercitation dolor culpa laborum sunt.',
	},
	{
		name: 'Holder',
		description:
			'Cillum ullamco irure Lorem velit elit. Dolore fugiat dolore sint do consectetur esse consequat. Occaecat minim laborum laborum et amet ut consequat magna est incididunt ipsum sint. Enim duis ex incididunt amet culpa aliqua. Occaecat reprehenderit ipsum velit velit ad dolor enim id qui eu eiusmod quis.',
	},
	{
		name: 'Mcfadden',
		description:
			'Veniam tempor duis non nisi quis. Ex nostrud ad laboris laboris do irure duis minim incididunt. Veniam veniam dolore ea ullamco. Dolore cillum sint ex irure minim mollit eu officia non elit ex do pariatur. Consequat sit esse in deserunt eu irure amet do adipisicing consectetur qui laborum.',
	},
	{
		name: 'York',
		description:
			'Deserunt aute esse consectetur do velit et laboris quis. Tempor commodo laboris nisi elit. Commodo quis laboris sit adipisicing ea esse reprehenderit elit consequat fugiat amet. Ullamco sunt sint officia non. Quis quis sit magna id est.',
	},
	{
		name: 'Cox',
		description:
			'Non fugiat excepteur ad in enim magna anim aute. Proident nostrud do amet nisi aute esse ut ad. Cupidatat aliquip aliquip velit aliqua ipsum ut nostrud laboris aliqua. Culpa velit ullamco aliquip elit esse ad fugiat tempor cupidatat laborum tempor. Aute laboris ullamco mollit fugiat duis laborum exercitation id aute commodo.',
	},
];

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	return knex.batchInsert('themes', defaultThemes);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultThemes.forEach(({ name }) => knex('themes').where({ name }).del());
}
