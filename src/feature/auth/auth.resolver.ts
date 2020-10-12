import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { InputLogin } from '../../graphql.schema';
import { UserService } from '../user/user.service';
import { InputRegister } from './inputs/register.input';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query()
  async getPermissionByUserId(@Args('userId') userId: number) {
    return this.authService.getPermissionsByUserId(userId);
  }

  @Mutation()
  async register(@Args('userData') userData: InputRegister) {
    return this.userService.createUser(userData, {
      age: userData.age,
      email: userData.email,
      gender: userData.gender,
      fullname: userData.fullname,
    });
  }

  @Mutation()
  async login(@Args('userData') userData: InputLogin) {
    return this.authService.createToken(userData);
  }
}
