import { Args, Context, Query, Resolver, Mutation } from '@nestjs/graphql';
import { SprintService } from './sprint.service';
import { PermissionScopes } from '../user/entity/permission.entity';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { InputCreateSprint, InputUpdateSprint } from '../../graphql.schema';

@Resolver('Sprint')
export class SprintResolver {
  constructor(private readonly sprintService: SprintService) {
  }

  @Query()
  @Scopes(PermissionScopes.ReadSprint)
  async getSprints(@Args('projectId') projectId: number, @Context('user') user: any) {
    return this.sprintService.getSprints(projectId, user.userId);
  }

  @Query()
  @Scopes(PermissionScopes.ReadSprint)
  async getSprint(@Args('sprintId') sprintId: number, @Context('user') user: any) {
    return this.sprintService.getSprint(sprintId, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteSprint)
  async createSprint(@Args('sprintData') sprintData: InputCreateSprint, @Context('user') user: any) {
    return this.sprintService.createSprint(sprintData, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteSprint)
  async updateSprint(@Args('sprintData') sprintData: InputUpdateSprint, @Context('user') user: any) {
    return this.sprintService.updateSprint(sprintData, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteSprint)
  async deleteSprint(@Args('sprintId') sprintId: number, @Context('user') user: any) {
    return this.sprintService.deleteSprint(sprintId, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteSprint)
  async startSprint(@Args('sprintId') sprintId: number, @Context('user') user: any) {
    return this.sprintService.startSprint(sprintId, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteSprint)
  async finishSprint(@Args('sprintId') sprintId: number, @Context('user') user: any) {
    return this.sprintService.finishSprint(sprintId, user.userId);
  }

}
