import { Module } from '@nestjs/common';
import { EpicResolver } from './epic.resolver';
import { EpicService } from './epic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpicEntity } from './entity/epic.entity';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([EpicEntity]),  ProjectModule, UserModule],
  providers: [EpicResolver, EpicService],
  exports: [EpicService],
})
export class EpicModule {}
