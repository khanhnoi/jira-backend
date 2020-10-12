import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { RoleEntity } from './role.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity({
  name: 'user',
})
export class UserEntity extends DefaultEntity {
  @Expose()
  @Column()
  username: string;

  @Expose()
  @Column()
  fullname?: string;

  @Expose()
  @Column()
  password: string;

  @Expose()
  @Column({
    type: 'tinyint',
  })
  status: UserStatus;

  @Expose()
  @Column({ nullable: true })
  email?: string;

  @Expose()
  @Column({ nullable: true })
  skill?: string;

  @Expose()
  @Column({ nullable: true })
  level?: string;

  @Expose()
  @Column({ nullable: true })
  age?: number;

  @Expose()
  @Column({ type: 'tinyint', nullable: true })
  gender?: UserGender;

  @Expose()
  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: RoleEntity[];

  @Expose()
  @OneToMany(() => ProjectEntity, p => p.leader)
  leadProject: number;

  @Expose()
  @OneToMany(() => ProjectEntity, p => p.pm)
  manageProject: number;

  @Expose()
  @OneToMany(() => IssueEntity, i => i.assignee)
  assignedIssue: IssueEntity;

  @Expose()
  @OneToMany(() => IssueEntity, i => i.reporter)
  reportedIssue: IssueEntity;

  constructor(user: Partial<UserEntity>) {
    super();
    if (user) {
      Object.assign(
        this,
        plainToClass(UserEntity, user, {
          excludeExtraneousValues: true,
        }));
    }
  }
}

export enum UserStatus {
  Unactivated,
  Activated,
  Blocked,
}

export enum UserGender {
  Male,
  Female,
  Others,
}
