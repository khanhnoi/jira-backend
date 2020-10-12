import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entity/project.entity';
import { Repository } from 'typeorm';
import { UserEntity, UserStatus } from '../user/entity/user.entity';
import { ProjectStatus } from '../../graphql.schema';
import { Roles } from '../user/entity/role.entity';
import { createLogger } from 'winston';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  isLeaderOfProject(userId: number, project: ProjectEntity) {
    return project.leaderId === userId;
  }

  isPMOfProject(userId: number, project: ProjectEntity) {
    return project.pmId === userId;
  }

  isMemberOfProject(userId: number, project: ProjectEntity) {
    return !(project.pmId !== userId && project.leaderId !== userId && !project.memberIds.includes(userId));
  }

  async getProjects(userId: string,  page = 1, limit = 10) {
    return this.projectRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.leader', 'l')
      .leftJoinAndSelect('p.pm', 'pm')
      .leftJoinAndSelect('p.members', 'm')
      .where('l.id = :userId', { userId })
      .orWhere('pm.id = :userId', { userId })
      .orWhere('m.id = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async getProject(userId: string, projectId: string) {
    return this.projectRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.leader', 'l')
      .leftJoinAndSelect('p.pm', 'pm')
      .leftJoinAndSelect('p.members', 'm')
      .where('l.id = :userId', { userId })
      .orWhere('pm.id = :userId', { userId })
      .orWhere('m.id = :userId', { userId })
      .andWhere('p.id = :projectId', {projectId})
      .getOne();
  }

  async getProjectByIdOrFail(projectId: number) {
    try {
      return this.projectRepo.findOneOrFail({ id: projectId });
    } catch (e) {
      throw new NotFoundException('Project not found');
    }
  }

  async createProject(name: string, leaderId: number, pmId: number, description?: string, memberIds: number[] = []) {
    const [leader, pm, members] = await Promise.all([
      this.userRepo.createQueryBuilder('u')
        .select(['u.id'])
        .innerJoinAndSelect('u.roles', 'r')
        .where('u.id = :leaderId ', { leaderId})
        .andWhere('r.name = :leader', {leader: Roles.Leader})
        .getOne(),
      this.userRepo.createQueryBuilder('u')
        .select(['u.id'])
        .innerJoinAndSelect('u.roles', 'r')
        .where('u.id = :pmId ', { pmId })
        .andWhere('r.name = :pm', {pm: Roles.PM})
        .getOne(),
      this.userRepo.findByIds(memberIds),
    ]);

    if (!leader) {
      throw new BadRequestException('leader not found');
    }

    if (!pm) {
      throw new BadRequestException('pm not found');
    }

    const project = new ProjectEntity({name, description, pm, leader, members} );
    return this.projectRepo.save(project);
  }

  async updateProject(
    projectId: number,
    pmId: number,
    leaderId?: number,
    memberIds?: number[],
    name?: string,
    description?: string,
    status?: ProjectStatus,
  ) {
    const [project, pm] = await Promise.all([
      this.getProjectByIdOrFail(projectId),
      this.userRepo.findOneOrFail({id: pmId}),
    ]);
    const [leader, members] = await Promise.all([
      leaderId !== undefined ? this.userRepo.findOneOrFail(leaderId) : undefined,
      memberIds !== undefined ? this.userRepo.findByIds(memberIds) : undefined,
    ]);
    if (leader) {
      project.leader = leader;
      project.pm = pm;
    }
    if (members) {
      project.members = members;
    }
    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    if (status) {
      project.status = status;
    }
    return this.projectRepo.save(project);
  }

  async deleteProject(projectId: number, userId: number) {
    const project = await this.getProjectByIdOrFail(projectId);
    if (!this.isPMOfProject(userId, project)) {
      throw new UnauthorizedException('You cannot delete this project');
    }
    return this.projectRepo.remove(project);
  }
}
