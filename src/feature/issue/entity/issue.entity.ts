import { Entity, Column, ManyToMany, JoinTable, RelationId } from 'typeorm';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { ManyToOne } from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import { UserEntity } from '../../user/entity/user.entity';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { SprintEntity } from '../../sprint/entity/sprint.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { ProjectStatus } from '../../../graphql.schema';
import { RoleEntity } from '../../user/entity/role.entity';
import { LabelEntity } from './label.entity';

@Entity({
  name: 'issue',
})
export class IssueEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  description: string;

  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: typeof IssueEntityType;

  @Column({ name: 'story_point' })
  storyPoint: number;

  @Expose()
  @Column()
  status: IssueStatus;

  @Expose()
  @Column()
  priority: IssuePriority;

  @Expose()
  @Column()
  type: IssueType;

  @Expose()
  @Column({ name: 'assignee_id'})
  asigneeId: number;

  @Expose()
  @ManyToOne(() => UserEntity, u => u.assignedIssue)
  assignee?: UserEntity;

  @Expose()
  @Column({ name: 'reporter_id'})
  reporterId: number;

  @Expose()
  @ManyToOne(() => UserEntity, u => u.reportedIssue)
  reporter?: UserEntity;

  @Expose()
  @Column({ name: 'epic_id'})
  epicId: number;

  @Expose()
  @ManyToOne(() => EpicEntity,  e => e.issues, { onDelete: 'SET NULL'})
  epic?: EpicEntity | null;

  @Expose()
  @Column({ name: 'sprint_id'})
  sprintId: number;

  @Expose()
  @ManyToOne(() => SprintEntity, s => s.issues, { onDelete: 'SET NULL'})
  sprint?: SprintEntity | null;

  @Expose()
  @Column({ name: 'project_id'})
  projectId: number;

  @Expose()
  @ManyToOne(() => ProjectEntity, p => p.issues, { onDelete: 'SET NULL'})
  project?: ProjectEntity | null;

  @Expose()
  @ManyToMany(() => LabelEntity)
  @JoinTable({
    name: 'issue_label',
    joinColumn: { name: 'issue_id' },
    inverseJoinColumn: { name: 'label_id' },
  })
  labels: LabelEntity[];

  @Expose()
  @RelationId((issue: IssueEntity) => issue.labels)
  labelIds: number[];

  constructor(issue: Partial<IssueEntity>) {
    super();
    if (issue) {
      Object.assign(
        this,
        plainToClass(IssueEntity, issue, {
          excludeExtraneousValues: true,
        }));
      this.entityType = 3;
      this.storyPoint = issue.storyPoint ?? 1;
      this.type = issue.type ?? IssueType.Task;
      this.priority = issue.priority ?? IssuePriority.Low;
      this.status = IssueStatus.Todo;
    }
  }
}

export enum IssueStatus {
  Todo,
  Doing,
  Testing,
  Done,
}

export enum IssuePriority {
  Low,
  Medium,
  High,
}

export enum IssueType {
  Story,
  Task,
  Bug,
}

export const IssueEntityType = 3;
