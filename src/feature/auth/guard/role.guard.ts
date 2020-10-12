import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/feature/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scopes = this.reflector.get<string[]>('scopes', context.getHandler());
    if (!scopes || scopes.length === 0) {
      return true;
    }
    try {
      const gqlCtx = GqlExecutionContext.create(context);
      const { authorization } = gqlCtx.getContext().req.headers;
      if (!authorization) return false;
      const res = await this.userService.decodeToken(authorization);
      const userScopes = (await this.authService.getPermissionsByUserId(
        res.userId,
      ))?.map(p => p.scope);
      gqlCtx.getContext().user = { userId: res.userId };
      return scopes.every(scope => userScopes?.includes(scope));
    } catch (err) {
      return false;
    }
  }
}
