module.exports = {
	apps: [
		{
			name: 'Ma-Governance',
			script: './dist/index.js',
			watch: false,
			autorestart: true,
			instances: 0,
			exec_mode: 'cluster',
			env: {
				NODE_ENV: process.env.NODE_ENV,
				PORT: process.env.PORT,
				HOST: process.env.HOST,
				TIMEZONE: process.env.TIMEZONE,
				DB_CLIENT: process.env.DB_CLIENT,
				DB_HOST: process.env.DB_HOST,
				DB_NAME: process.env.DB_NAME,
				DB_USER: process.env.DB_USER,
				DB_PASSWORD: process.env.DB_PASSWORD,
				DB_PORT: process.env.DB_PORT,
				DB_MIGRATION_DIRECTORY: process.env.DB_MIGRATION_DIRECTORY,
				DB_MIGRATION_EXTENSION: process.env.DB_MIGRATION_EXTENSION,
				DB_POOL_MIN: process.env.DB_POOL_MIN,
				DB_POOL_MAX: process.env.DB_POOL_MAX,
				DB_USE_NULL_DEFAULT: process.env.DB_USE_NULL_DEFAULT,
				CORS_ORIGIN: process.env.CORS_ORIGIN,
				CORS_METHODS: process.env.CORS_METHODS,
				CORS_PREFLIGHT_CONTIME: process.env.CORS_PREFLIGHT_CONTIME,
				CORS_OPTIONS_SUCCESS_STATUS: process.env.CORS_OPTIONS_SUCCESS_STATUS,
				ENABLE_CACHE: process.env.ENABLE_CACHE,
				CACHE_TIME: process.env.CACHE_TIME,
				REDIS_HOST: process.env.REDIS_HOST,
				REDIS_PORT: process.env.REDIS_PORT,
				STORAGE_TYPE: process.env.STORAGE_TYPE,
				AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
				AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
				AWS_REGION: process.env.AWS_REGION,
				AWS_BUCKET: process.env.AWS_BUCKET,
				ENABLE_HTTPS: process.env.ENABLE_HTTPS,
				HTTPS_CERT_FILE: process.env.HTTPS_CERT_FILE,
				HTTPS_KEY_FILE: process.env.HTTPS_KEY_FILE,
				SALT_ROUNDS: process.env.SALT_ROUNDS,
				AUTHSECRET: process.env.AUTHSECRET,
				MAILER_HOST: process.env.MAILER_HOST,
				MAILER_PORT: process.env.MAILER_PORT,
				MAILER_SERVICE: process.env.MAILER_SERVICE,
				MAILER_USER: process.env.MAILER_USER,
				MAILER_PASSWORD: process.env.MAILER_PASSWORD,
				EMAIL_DEFAULT: process.env.EMAIL_DEFAULT,
				MAIL_TO_REDIRECT: process.env.MAIL_TO_REDIRECT,
			},
		},
	],
};
