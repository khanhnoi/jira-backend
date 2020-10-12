import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { RoleEntity } from './entity/role.entity';
import { PermissionEntity } from './entity/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
