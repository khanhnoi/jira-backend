import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintEntity } from './entity/sprint.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';
import { InputCreateSprint, InputUpdateEpic, InputUpdateSprint, SprintStatus } from '../../graphql.schema';

@Injectable()
export class SprintService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    @InjectRepository(SprintEntity)
    private readonly sprintRepo: Repository<SprintEntity>,
  ) {
  }

  async getSprintByIdOrFail(sprintId: number) {
    try {
      return this.sprintRepo.findOneOrFail({ id: sprintId });
    } catch (e) {
      throw new NotFoundException('Sprint not found');
    }
  }

  async getSprints(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get sprints of this project');
    }
    return this.sprintRepo.find({ project });
  }

  async getSprint(sprinttId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprinttId);
    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get sprints of this project');
    }
    return this.sprintRepo.find({ project });
  }

  async createSprint(sprintData: InputCreateSprint, userId: number) {
    const { name, description, projectId } = sprintData;
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create sprint for this project');
    }
    const sprint = new SprintEntity({name, description, projectId});
    return this.sprintRepo.save(sprint);
  }

  async updateSprint(sprintData: InputUpdateSprint, userId: number) {
    const { name, description, sprintId } = sprintData;
    const sprint = await this.getSprintByIdOrFail(sprintId);
    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);
    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot edit sprint for this project');
    }

    if (name !== undefined) {
      sprint.name = name;
    }

    if (description !== undefined) {
      sprint.description = description;
    }

    return this.sprintRepo.save(sprint);
  }

  async deleteSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);

    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this sprint');
    }

    return this.sprintRepo.remove(sprint);
  }

  async startSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);
    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this sprint');
    }

    if (sprint.status !== SprintStatus.Pending) {
      throw new BadRequestException('This sprint is started');
    }

    const otherSprints = await this.sprintRepo.find({ projectId: sprint.projectId });
    if (otherSprints.map(s => s.status).includes(SprintStatus.Progress)) {
      throw new BadRequestException('Each project only has one sprint in progress');
    }
    sprint.startTime = new Date();
    sprint.status = SprintStatus.Progress;

    return this.sprintRepo.save(sprint);
  }

  async finishSprint(sprintId: number, userId: number) {
    const sprint = await this.getSprintByIdOrFail(sprintId);

    const project = await this.projectService.getProjectByIdOrFail(sprint.projectId);
    if (!this.projectService.isLeaderOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this sprint');
    }

    if (sprint.status !== SprintStatus.Progress) {
      throw new BadRequestException('This sprint is not in progress');
    }

    sprint.finishTime = new Date();
    sprint.status = SprintStatus.Finished;

    return this.sprintRepo.save(sprint);
  }
}
