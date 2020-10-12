import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueEntity } from './entity/issue.entity';
import { Repository } from 'typeorm/index';
import { ProjectService } from '../project/project.service';

@Injectable()
export class IssueService {
  constructor(
    private readonly projectService: ProjectService,
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    ) {
  }

  async getIssueByIdOrFail(issueId: number) {
    try {
      return this.issueRepo.findOneOrFail({ id: issueId });
    } catch (e) {
      throw new NotFoundException('Issue not found');
    }
  }

  async getEpics(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get issues of this project');
    }
    return this.issueRepo.find({ project });
  }

  async getIssue(issueId: number, userId: number) {
    const issue = await this.getIssueByIdOrFail(issueId);
    const project = await this.projectService.getProjectByIdOrFail(issue.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get this issue');
    }
    return issue;
  }
}
