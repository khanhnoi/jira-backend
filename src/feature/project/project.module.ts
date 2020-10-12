import { Module } from '@nestjs/common';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { RoleEntity } from '../user/entity/role.entity';
import { ProjectEntity } from './entity/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, ProjectEntity])],
  providers: [ProjectResolver, ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
