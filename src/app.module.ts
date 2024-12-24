import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UrlModule } from './modules/url-shortener/url.module';
import { AuthMiddleware } from './modules/auth/auth.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://fhyvhh091:U5b9IaU1tJm1yHNM@cluster0.10pfn.mongodb.net/url_shortener?retryWrites=true&w=majority&appName=Cluster0'), 
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UrlModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('urls');
  }
}
