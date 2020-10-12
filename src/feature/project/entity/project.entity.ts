import { Entity, Column, ManyToMany, JoinTable, JoinColumn, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { UserEntity } from '../../user/entity/user.entity';
import { ProjectStatus } from '../../../graphql.schema';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { SprintEntity } from '../../sprint/entity/sprint.entity';
import { IssueEntity } from '../../issue/entity/issue.entity';
import { LabelEntity } from '../../issue/entity/label.entity';

@Entity({
  name: 'project',
})
export class ProjectEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  description: string;
  @Expose()
  @Column()
  status: ProjectStatus;

  @Expose()
  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: typeof ProjectEntityType;

  @Expose()
  @Column({ name: 'leader_id' })
  leaderId: number;

  @Expose()
  @ManyToOne(() => UserEntity, u => u.leadProject)
  @JoinColumn({
    name: 'leader_id',
  })
  leader: UserEntity;

  @Expose()
  @Column({ name: 'pm_id' })
  pmId: number;

  @Expose()
  @ManyToOne(() => UserEntity, u => u.manageProject)
  @JoinColumn({
    name: 'pm_id',
  })
  pm: UserEntity;

  @Expose()
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'project_member',
    joinColumn: { name: 'project_id' },
    inverseJoinColumn: { name: 'member_id' },
  })
  members: UserEntity[];

  @Expose()
  @RelationId((project: ProjectEntity) => project.members)
  memberIds: number[];

  @Expose()
  @OneToMany(() => EpicEntity, e => e.project)
  epics: EpicEntity[];

  @Expose()
  @OneToMany(() => SprintEntity, s => s.project)
  sprints: SprintEntity[];

  @Expose()
  @OneToMany(() => IssueEntity, i => i.project)
  issues: IssueEntity[];

  @Expose()
  @OneToMany(() => LabelEntity, l => l.project)
  labels: LabelEntity[];

  constructor(project: Partial<ProjectEntity>) {
    super();
    if (project) {
      Object.assign(
        this,
        plainToClass(ProjectEntity, project, {
          excludeExtraneousValues: true,
        }));
      this.entityType = 0;
      this.status = ProjectStatus.Pending;
    }
  }
}

export const ProjectEntityType = 0;
