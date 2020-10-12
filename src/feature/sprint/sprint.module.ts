import { Module } from '@nestjs/common';
import { SprintResolver } from './sprint.resolver';
import { SprintService } from './sprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';
import { SprintEntity } from './entity/sprint.entity';
import { ProjectEntity } from '../project/entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SprintEntity]),  ProjectModule, UserModule],
  providers: [SprintResolver, SprintService],
})
export class SprintModule {}
