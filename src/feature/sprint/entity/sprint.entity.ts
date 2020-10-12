import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { SprintStatus } from '../../../graphql.schema';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity({
  name: 'sprint',
})
export class SprintEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @Column({  type: 'timestamp', name: 'start_time' })
  startTime: Date;

  @Expose()
  @Column({  type: 'timestamp', name: 'finish_time' })
  finishTime: Date;

  @Expose()
  @Column({ name: 'total_story_point' })
  totalStoryPoint: number;

  @Expose()
  @Column({ name: 'project_id' })
  projectId: number;

  @Expose()
  @ManyToOne(() => ProjectEntity, p => p.sprints)
  @JoinColumn({
    name: 'project_id',
  })
  project: ProjectEntity;

  @Expose()
  @Column()
  status: SprintStatus;

  @Expose()
  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: typeof SprintEntityType;

  @Expose()
  @OneToMany(() => IssueEntity, i => i.sprint)
  issues: IssueEntity[];

  constructor(sprint: Partial<SprintEntity>) {
    super();
    if (sprint) {
      Object.assign(
        this,
        plainToClass(SprintEntity, sprint, {
          excludeExtraneousValues: true,
        }));
      this.entityType = 1;
      this.totalStoryPoint = 0;
      this.status = SprintStatus.Pending;
    }
  }
}

export const SprintEntityType = 1;
