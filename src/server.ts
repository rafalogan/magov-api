import { CacheConfig, DatabaseConfig, KnexConfig, LoggerConfig, MailerConfig, MulterConfig, AppConfig, AuthConfig } from './config';
import { createUploadsDir, execDotenv } from './utils';
import { ServicesFactory } from './factories';
import { AppModule } from './core/app.module';

execDotenv();
createUploadsDir();

export const logger = new LoggerConfig().logger;
export const knexfile = new KnexConfig();
export const multer = new MulterConfig();
const mailer = new MailerConfig();

const databaseConfig = new DatabaseConfig(knexfile);
const cacheConfig = new CacheConfig();

const services = new ServicesFactory(databaseConfig.connection, cacheConfig.connection, mailer);
const auth = new AuthConfig();

const express = new AppConfig(logger, auth, services, multer.upload).express;

export const app = new AppModule(express, databaseConfig, cacheConfig);
