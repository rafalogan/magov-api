import { upperCaseFirstLetter } from 'src/utils/convert-date';

const alreadyExists = 'já existe';
export const isRequired = (field: string) => `${field} is required field.`;
const noSave = `Não foi possivel criar novo registro.`;
const noEdit = `Não foi possivel editar registro.`;
const noRead = `Não foi possivel encontar registro(s).`;
const noDel = `Não foi possivel apagar registro.`;
const successSave = `Novo Registro Criado com sucesso.`;
const successEdit = `Registro Editado com sucesso.`;
const successDel = `Registro Apagado com sucesso.`;
const notFoundRegister = 'Registo Não encontrado';
const notFound = 'Não encontrado.';
const ticketSoldOut = 'Ingressos esgotados!';
const categoryWithChildrenNoDelete = (name: string) =>
	`Não foi possivel apagar a categoria ${name.toUpperCase()}.\n Pois ela tem subcategorias, por favor mova ou apague as subcategorias antes de apagar essa categoria.`;
const saleNoCancel = (id: string | number) => `Venda - ${id} - Não cancelada.`;
const canceledSaleSuccess = `Venda cancelada com sucesso!`;

const user = {
	alreadyExists: (email: string) => `${upperCaseFirstLetter(alreadyExists)} usuário resistrado com eses e-mail: ${email}`,

	error: {
		notFoundById: (id: number) => `Usuário nº:${id} não encontrado!`,
		notFoundByEmail: (email: string) => `Usuário não encontrado para esse e-mail: ${email}`,
		noMatchCredentials: `Falha na autenticação verifique suas credenciais!`,
		noMatchPasswords: `Falha a senha e a confirmação de senha devem ser iguais!`,
		requires: (field: string) => `${field} é um campo obrigatório.`,
		noSave: 'Não foi possivel criar o novo usuário!\nVerifique seus dados e tente novamente!',
		noEdit: 'Desculpe, mas as suas alterações não foram salvas.\nTente novamente mais tarde!',
		notFound: 'Usuário(s) não encontrado(s).',
		noDelete: (id: number) => `Não foi possivel deletar o usuário nº:${id}!`,
	},
};

const profile = {
	success: {
		create: `Novo perfil criado com sucesso.`,
		update: (id: number) => `Perfil nº: ${id} atualizado com sucesso!`,
	},
	error: {
		alreadyExists: `${upperCaseFirstLetter(alreadyExists)} um perfil com esse nome!`,
		notFound: (value: number | string) => {
			return typeof value === 'string' ? `Perfil ${value} não encontrado!` : `Perfil nº:${value} não encontrado!`;
		},
		noSave: (value: string) => `Perfil ${value} não pode ser salvo!`,
		noEdit: (id: number) => `Não foi possivel editar nº:${id}!`,
		notList: 'Não foi possivel encontar Perfil(is) não encontado(os)!',
		noDel: (id: number) => `Não foi possivel apagar o perfil nº:${id}!`,
	},
};

const auth = {
	success: {
		signup: 'Novo usuário cadastrado com sucesso.',
		tokenIsValid: 'Token Valido.',
	},

	error: {
		requires: 'Os campos e-mail e senha são obrigatórios, verifique se ambos estão preenchidos corretamente.',
		Unauthorized: 'Login não autorizado! Verrifique seu e-maul e /ou senha.',
		tokenNoValid: 'Token Invalido.',
		notFoundToken: 'Token não encontrado!',
		notFoundPayload: 'Payload não encontrado!',
	},
};

export const messages = {
	alreadyExists,
	noSave,
	noEdit,
	noRead,
	noDel,
	successSave,
	successEdit,
	successDel,
	user,
	profile,
	auth,
	notFoundRegister,
	notFound,
	categoryWithChildrenNoDelete,
	ticketSoldOut,
	saleNoCancel,
	canceledSaleSuccess,
};
