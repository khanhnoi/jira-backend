import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EpicService } from './epic.service';
import { Scopes } from '../../shared/decorator/scopes.decorator';
import { PermissionScopes } from '../user/entity/permission.entity';
import { InputCreateEpic, InputUpdateEpic } from '../../graphql.schema';

@Resolver('Epic')
export class EpicResolver {
  constructor(private readonly epicService: EpicService) {}

  @Query()
  @Scopes(PermissionScopes.ReadEpic)
  async getEpics(@Args('projectId') projectId: number, @Context('user') user: any) {
    return this.epicService.getEpics(projectId, user.userId);
  }

  @Query()
  @Scopes(PermissionScopes.ReadEpic)
  async getEpic(@Args('epicId') epicId: number, @Context('user') user: any) {
    return this.epicService.getEpic(epicId, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteEpic)
  async createEpic(@Args('epicData')  epicData: InputCreateEpic, @Context('user') user: any) {
    return this.epicService.createEpic(epicData, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteEpic)
  async updateEpic(@Args('epicData')  epicData: InputUpdateEpic, @Context('user') user: any) {
    return this.epicService.updateEpic(epicData, user.userId);
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteEpic)
  async deleteEpic(@Args('epicId')  epicId: number, @Context('user') user: any) {
    return this.epicService.deleteEpic(epicId, user.userId);
  }
}
