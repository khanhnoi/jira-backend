import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createQueryBuilder } from 'typeorm';
import { UserEntity, UserStatus } from './entity/user.entity';
import { UserSession } from 'src/shared/interface/session.interface';
import { verify } from 'jsonwebtoken';
import { RoleEntity, Roles } from './entity/role.entity';
import { PermissionEntity } from './entity/permission.entity';
import { jwtConstants } from '../auth/constansts/jwt.constanst';
import { genSalt, hash } from 'bcrypt';
import { InputRegister } from '../auth/inputs/register.input';
import { UsersResolver } from './user.resolver';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async findOne(id: number) {
    return this.userRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .where('u.id = :userId', {
        userId: id,
      })
      .getOne();
  }

  async getUserByIdOrFail(userId: number) {
    try {
      return await this.userRepo.findOneOrFail({ id: userId});
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }

  async findOneByName(username: string) {
    return this.userRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .where('u.username = :username', { username })
      .getOne();
  }

  async getUsers(page: number = 1, limit: number = 10) {
    return this.userRepo
      .createQueryBuilder('u')
      .innerJoinAndSelect('u.roles', 'r')
      .where('u.username != :admin', {
        admin: 'admin',
      })
      .andWhere('u.status = :activeStatus', {
        activeStatus: UserStatus.Activated,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async decodeToken(token: string): Promise<any> {
    const decoded = verify(token, jwtConstants.secret);
    const { userId } = decoded as UserSession;
    return { userId };
  }

  async createUser(userData: InputRegister, otherInfo?: Pick<UserEntity, 'age' | 'email' | 'fullname' | 'gender'>, isAdmin?: boolean) {
    const existedUser = await this.userRepo.findOne({ username: userData.username });
    if (existedUser) {
      throw new BadRequestException('username already existed');
    }
    if (userData.password !== userData.passwordCheck) {
      throw new BadRequestException(
        'Password and password check must be identical',
      );
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(userData.password, salt);
    let userRoles = [];
    if (isAdmin) {
      const adminRole = await this.roleRepo.findOne({ name: Roles.Admin });
      userRoles = adminRole ? [adminRole] : [];
    } else {
      const guestRole = await this.roleRepo.findOne({ name: Roles.Guest });
      userRoles = guestRole ? [guestRole] : [];
    }
    const user = new UserEntity({
      username: userData.username,
      password: hashedPassword,
      fullname: otherInfo?.fullname,
      status: isAdmin ? UserStatus.Activated : UserStatus.Unactivated,
      email: otherInfo?.email,
      age: otherInfo?.age,
      gender: otherInfo?.gender,
      roles: userRoles,
    });

    return this.userRepo.save(user);
  }

  async updateUser(id: string, userInfo: Pick<UserEntity, 'status' | 'skill' | 'level'>) {
    const user = await this.userRepo.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found!');
    }
    user.status = userInfo.status;
    user.skill  = userInfo.skill;
    user.level = userInfo.level;

    return this.userRepo.save(user);
  }
}
