import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { DefaultEntity } from '../../../shared/interface/default.entity';
import { PermissionEntity } from './permission.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'role' })
export class RoleEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @ManyToMany(() => PermissionEntity, { nullable: true })
  @JoinTable({
    name: 'role_permission',
    joinColumn: { name: 'role_id' },
    inverseJoinColumn: { name: 'permission_id' },
  })
  permissions: PermissionEntity[];
}

export enum Roles {
  Guest = 'guest',
  Member = 'member',
  PM = 'pm',
  Leader = 'leader',
  Admin = 'admin',
}
