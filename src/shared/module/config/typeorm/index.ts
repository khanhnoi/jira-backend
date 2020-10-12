import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/feature/user/entity/user.entity';
import { getMetadataArgsStorage } from 'typeorm';
import { ConfigService } from '../config.service';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {

  constructor (
  private configService: ConfigService
  ) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: Number(this.configService.get('DB_PORT')),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
    };
  }
}
