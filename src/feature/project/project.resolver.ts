import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';
import { ProjectService } from './project.service';
import { InputCreateProject, InputUpdateProject } from '../../graphql.schema';

@Resolver('Project')
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query()
  @Scopes(PermissionScopes.ReadProject)
  async getProjects(@Context('user') user: any ) {
    return this.projectService.getProjects(user.userId);
  }

  @Query()
  @Scopes(PermissionScopes.ReadProject)
  async getProject(@Context('user') user: any, @Args('projectId') projectId: string ) {
    return this.projectService.getProject(user.userId, projectId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteProject)
  async createProject(@Args('projectData') projectData: InputCreateProject) {
    return this.projectService.createProject(projectData.name, projectData.leaderId, projectData.pmId, projectData.description, projectData.memberIds);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteProject)
  async updateProject(@Args('projectData') projectData: InputUpdateProject) {
    return this.projectService.updateProject(projectData.id, projectData.pmId, projectData.leaderId, projectData.memberIds, projectData.name, projectData.description, projectData.status);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteProject)
  async deleteProject(@Args('projectId') projectId: number, @Context('user') user: any) {
    return this.projectService.deleteProject(projectId, user.userId);
  }
}
