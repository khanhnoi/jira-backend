import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';
import { InputLogin, AccessToken } from 'src/graphql.schema';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { RoleEntity } from '../user/entity/role.entity';
import { PermissionEntity } from '../user/entity/permission.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async getPermissionsByUserId(userId: number) {
    const user = await this.userRepo.createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .innerJoinAndSelect('r.permissions', 'p')
      .where('u.id = :userId', { userId })
      .getOne();
    const permissions = user?.roles.map(x => x.permissions).pop();
    return permissions;
  }

  async createToken(userData: InputLogin): Promise<AccessToken> {
    const user = await this.userService.findOneByName(userData.username);
    if (!user) throw new UnauthorizedException('Invalid username or password');
    const isPasswordValid = await compare(userData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      // role: user.role,
    });
    return { token };
  }
}
