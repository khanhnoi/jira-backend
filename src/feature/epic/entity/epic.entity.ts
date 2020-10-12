import { Entity, Column, ManyToMany, JoinTable, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { IssueEntity } from '../../issue/entity/issue.entity';

@Entity({
  name: 'epic',
})
export class EpicEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @Column({  type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Expose()
  @Column({  type: 'timestamp', name: 'end_date' })
  endDate: Date;

  @Expose()
  @Column({ name: 'project_id' })
  projectId: number;

  @Expose()
  @ManyToOne(() => ProjectEntity, p => p.epics)
  @JoinColumn({
    name: 'project_id',
  })
  project: ProjectEntity;

  @Expose()
  @OneToMany(() => IssueEntity, i => i.epic)
  issues: IssueEntity[];

  @Expose()
  @Column({ name: 'entity_type', type: 'tinyint' })
  entityType: typeof EpicEntityType;

  constructor(epic: Partial<EpicEntity>) {
    super();
    if (epic) {
      Object.assign(
        this,
        plainToClass(EpicEntity, epic, {
          excludeExtraneousValues: true,
        }));
      this.entityType = 1;
    }
  }
}

export const EpicEntityType = 1;
