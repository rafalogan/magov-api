import { Knex } from 'knex';

const rulesProfiles: { profileCode: string; rules: string[] }[] = [
	{
		profileCode: 'ROOT',
		rules: ['ROOT'],
	},
	{
		profileCode: 'DV',
		rules: ['ROOT'],
	},
	{
		profileCode: 'MADMIN',
		rules: ['MASTERADMIN'],
	},
	{
		profileCode: 'USRUS',
		rules: ['SALESACCESS'],
	},
	{
		profileCode: 'MTENANCY',
		rules: [
			'TASKSTENANCY',
			'DEMANDSTENANCY',
			'PROPOSTENANCY',
			'EDITALLPROPOST',
			'CHECKLISTKANBANTENANCY',
			'CONTACTSACESS',
			'REPORTPRODTENANCY',
			'REPORTDEMANDS',
			'MANDATEDATA',
			'BUDGETCONTROL',
			'CREATEUNITUSERTENANCY',
			'EDITUNITUSERTENANCY',
			'PROJECTRADAR',
			'GEOMAP',
			'FINANCEUNIT',
			'DOCUMENTMANAGEMENT',
			'REPORTOBSERVATORY',
			'REPORTTREASURY',
			'BIDDINGSTEPBYSTEP',
			'CREATEGOALS',
			'REPORTELECTIONRESULT',
			'PUBLICOPINION',
			'REPORTGOALS',
			'REPORTVOTERPROFILE',
			'DROPDOWNIBGE',
			'LEGALPROCESSES',
		],
	},
	{
		profileCode: 'CHEFGAB',
		rules: [
			'TASKSTENANCY',
			'DEMANDSTENANCY',
			'PROPOSTENANCY',
			'EDITALLPROPOST',
			'CHECKLISTKANBANTENANCY',
			'CONTACTSACESS',
			'REPORTPRODTENANCY',
			'REPORTDEMANDS',
			'MANDATEDATA',
			'BUDGETCONTROL',
			'CREATEUNITUSERTENANCY',
			'EDITUNITUSERTENANCY',
			'PROJECTRADAR',
			'GEOMAP',
			'FINANCEUNIT',
			'DOCUMENTMANAGEMENT',
			'REPORTOBSERVATORY',
			'REPORTTREASURY',
			'BIDDINGSTEPBYSTEP',
			'CREATEGOALS',
			'REPORTELECTIONRESULT',
			'PUBLICOPINION',
			'REPORTGOALS',
			'REPORTVOTERPROFILE',
			'DROPDOWNIBGE',
			'LEGALPROCESSES',
		],
	},
	{
		profileCode: 'CHEFSET',
		rules: [
			'TASKSUNIT',
			'DEMANDSUNIT',
			'PROPOSTENANCY',
			'EDITALLPROPOST',
			'CHECKLISTKANBANUNIT',
			'CONTACTSACESS',
			'REPORTPRODUNIT',
			'REPORTDEMANDS',
			'MANDATEDATA',
			'BUDGETCONTROL',
			'CREATEUNITUSER',
			'PROJECTRADAR',
			'GEOMAP',
			'DOCUMENTMANAGEMENT',
			'PUBLICOPINION',
			'REPORTGOALS',
			'REPORTELECTIONRESULT',
			'REPORTVOTERPROFILE',
			'DROPDOWNIBGE',
			'LEGALPROCESSES',
		],
	},
	{
		profileCode: 'COM',
		rules: [
			'DEMANDSUNIT',
			'PROPOSTENANCYBASIC',
			'CHECKLISTKANBANUNIT',
			'CONTACTSACESS',
			'REPORTDEMANDS',
			'MANDATEDATA',
			'PROJECTRADAR',
			'GEOMAP',
			'DOCUMENTMANAGEMENT',
			'REPORTOBSERVATORY',
			'REPORTTREASURY',
			'BIDDINGSTEPBYSTEP',
			'CREATEGOALS',
			'PUBLICOPINION',
			'REPORTGOALS',
			'REPORTELECTIONRESULT',
			'REPORTVOTERPROFILE',
			'DROPDOWNIBGE',
		],
	},
	{
		profileCode: 'JUR',
		rules: [
			'PROPOSTENANCY',
			'EDITALLPROPOST',
			'REPORTDEMANDS',
			'MANDATEDATA',
			'PROJECTRADAR',
			'FINANCEUNIT',
			'DOCUMENTMANAGEMENT',
			'BIDDINGSTEPBYSTEP',
			'LEGALPROCESSES',
		],
	},
	{
		profileCode: 'FIN',
		rules: [
			'PROPOSTENANCYBASIC',
			'EDITALLPROPOST',
			'MANDATEDATA',
			'BUDGETCONTROL',
			'PROJECTRADAR',
			'FINANCEUNIT',
			'DOCUMENTMANAGEMENT',
			'REPORTOBSERVATORY',
			'REPORTTREASURY',
			'BIDDINGSTEPBYSTEP',
			'LEGALPROCESSES',
		],
	},
	{
		profileCode: 'RH',
		rules: ['PROPOSTENANCYBASIC', 'CREATEUNITUSERTENANCY'],
	},
	{
		profileCode: 'ASSCOM',
		rules: ['DEMANDSUNIT', 'EDITYOURPROPOST', 'REPORTDEMANDS', 'DROPDOWNIBGE'],
	},
	{
		profileCode: 'ASSIST',
		rules: ['PROPOSTENANCYCRAFT'],
	},
];

export async function up(knex: Knex): Promise<void> {
	for (const ruleProfile of rulesProfiles) {
		const profile = await knex('profiles').select('id').where('code', ruleProfile.profileCode).first();

		if (profile) {
			const rules = await knex('rules').select('id').whereIn('code', ruleProfile.rules);

			const rulesProfiles = rules.map(rule => {
				return {
					rule_id: rule.id,
					profile_id: profile.id,
				};
			});

			await knex.batchInsert('profiles_rules', rulesProfiles);
		}
	}
}

export async function down(knex: Knex): Promise<void> {
	return knex('profiles_rules').del();
}
