import { Module } from '@nestjs/common';
import { IssueResolver } from './issue.resolver';
import { IssueService } from './issue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssueEntity } from './entity/issue.entity';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([IssueEntity]), ProjectModule],
  providers: [IssueResolver, IssueService],
})
export class IssueModule {}
