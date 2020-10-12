import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EpicEntity } from './entity/epic.entity';
import { Repository } from 'typeorm';
import { InputCreateEpic, InputUpdateEpic } from '../../graphql.schema';
import { ProjectService } from '../project/project.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EpicService {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    @InjectRepository(EpicEntity)
    private readonly  epicRepo: Repository<EpicEntity>,
  ) {}

  async getEpicByIdOrFail(epicId: number) {
    try {
      return this.epicRepo.findOneOrFail({ id: epicId });
    } catch (e) {
      throw new NotFoundException('Epic not found');
    }
  }

  async getEpics(projectId: number, userId: number) {
    const project = await this.projectService.getProjectByIdOrFail(projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get epics of this project');
    }
    return this.epicRepo.find({ project });
  }

  async getEpic(epicId: number, userId: number) {
    const epic = await this.getEpicByIdOrFail(epicId);
    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isMemberOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot get this epic');
    }
    return epic;
  }

  async createEpic(epicData: InputCreateEpic, userId: number) {
    const  {name, description, startDate, endDate, projectId } = epicData;
    const [project, pm] = await Promise.all([
      this.projectService.getProjectByIdOrFail(projectId),
      this.userService.getUserByIdOrFail(userId),
    ]);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot create epic');
    }
    const epic = new EpicEntity({name, description, startDate, endDate, projectId});
    return this.epicRepo.save(epic);
  }

  async updateEpic(epicData: InputUpdateEpic, userId: number) {
    const  {epicId, name, description, startDate, endDate } = epicData;
    const [epic, pm] = await Promise.all([
      this.getEpicByIdOrFail(epicId),
      this.userService.getUserByIdOrFail(userId),
    ]);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update epic');
    }
    let isEpicUpdated = false;

    if (name !== undefined) {
      isEpicUpdated = true;
      epic.name = name;
    }

    if (description !== undefined) {
      isEpicUpdated = true;
      epic.description = description;
    }

    if (startDate !== undefined) {
      isEpicUpdated = true;
      epic.startDate = startDate;
    }

    if (endDate !== undefined) {
      isEpicUpdated = true;
      epic.endDate = endDate;
    }
    return this.epicRepo.save(epic);
  }

  async deleteEpic(epicId: number, userId: number) {
    const [epic, pm] = await Promise.all([
      this.getEpicByIdOrFail(epicId),
      this.userService.getUserByIdOrFail(userId),
    ]);

    const project = await this.projectService.getProjectByIdOrFail(epic.projectId);

    if (!this.projectService.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot update epic');
    }

    return this.epicRepo.remove(epic);
  }

}
