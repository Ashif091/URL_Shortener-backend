import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://fhyvhh091:U5b9IaU1tJm1yHNM@cluster0.10pfn.mongodb.net/url_shortener?retryWrites=true&w=majority&appName=Cluster0'), 
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
