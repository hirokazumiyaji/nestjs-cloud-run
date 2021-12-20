import { Controller, Get } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly logger: Logger) {}

  @Get()
  getHello(): string {
    this.logger.log({ message: 'hello' });
    return this.appService.getHello();
  }
}
