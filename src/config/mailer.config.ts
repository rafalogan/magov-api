export class MailerConfig {
	host: string;
	port: number;
	user: string;
	service: string;
	password: string;

	constructor() {
		this.host = process.env.MAILER_HOST || '';
		this.port = Number(process.env.MAILER_PORT);
		this.service = process.env.MAILER_SERVICE || '';
		this.user = process.env.MAILER_USER || '';
		this.password = process.env.MAILER_PASSWORD || '';
	}
}
