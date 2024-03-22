import * as process from "process";

if(!process.env.IS_TS_NODE){  //НУЖНО ЧТО БЫ НЕ ВЫПОЛНЯЛОСЬ ВО ВРЕМЯ РАБОТЫ С ТС
  require('module-alias/register');
}


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //СОЗДАНИЕ ПРИЛОЖЕНИЯ!
  await app.listen(3000);
}
bootstrap();
