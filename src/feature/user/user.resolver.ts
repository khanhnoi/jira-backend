import { Args, Query, Resolver, Context, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Scopes } from 'src/shared/decorator/scopes.decorator';
import { PermissionScopes } from './entity/permission.entity';
import { InputUpdateUser, User } from '../../graphql.schema';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Query()
  @Scopes(PermissionScopes.ReadUser)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Mutation()
  @Scopes(PermissionScopes.WriteUser)
  async updateUser(@Args('updateInfo') updateInfo: InputUpdateUser, @Context('user') user: User) {
    return this.userService.updateUser(user.id, updateInfo);
  }

}
