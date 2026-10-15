import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from './teams/teams.module';
import { CharactersModule } from './characters/characters.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      // la base ya viene creada, no se deben tocar las tablas
      synchronize: false,
    }),
    TeamsModule,
    CharactersModule,
  ],
})
export class AppModule {}
