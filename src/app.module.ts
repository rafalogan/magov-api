import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MorganProvider } from 'src/config';
import { MorganModule } from 'nest-morgan';
import { ConfigModule } from '@nestjs/config';
import { envOptions } from 'src/utils';

@Module({
	imports: [ConfigModule.forRoot({ envFilePath: envOptions }), MorganModule],
	controllers: [AppController],
	providers: [AppService, MorganProvider],
})
export class AppModule {}
