import { CacheConfig, DatabaseConfig, KnexConfig, LoggerConfig, MailerConfig, MulterConfig, AppConfig, AuthConfig } from 'src/config';
import { createUploadsDir, execDotenv } from 'src/utils';
import { ServicesFactory } from 'src/factories';
import { AppModule } from 'src/core/app.module';

execDotenv();
createUploadsDir();

export const logger = new LoggerConfig().logger;
export const knexfile = new KnexConfig();
export const multer = new MulterConfig();
const mailer = new MailerConfig();

const databaseConfig = new DatabaseConfig(knexfile);
const cacheConfig = new CacheConfig();

const services = new ServicesFactory(databaseConfig.connection, cacheConfig.connection, mailer);
const auth = new AuthConfig(services.userService);

const express = new AppConfig(logger, auth, services, multer.upload).express;

export const app = new AppModule(express, databaseConfig, cacheConfig);
