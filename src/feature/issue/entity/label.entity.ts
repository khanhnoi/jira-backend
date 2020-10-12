import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { IsString, Length, Matches } from 'class-validator';
import { DefaultEntity } from 'src/shared/interface/default.entity';
import { ManyToOne } from 'typeorm';
import { Expose, plainToClass } from 'class-transformer';
import { UserEntity } from '../../user/entity/user.entity';
import { EpicEntity } from '../../epic/entity/epic.entity';
import { SprintEntity } from '../../sprint/entity/sprint.entity';
import { ProjectEntity } from '../../project/entity/project.entity';
import { ProjectStatus } from '../../../graphql.schema';

@Entity({
  name: 'label',
})
export class LabelEntity extends DefaultEntity {
  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({ name: 'project_id'})
  projectId: number;

  @Expose()
  @ManyToOne(() => ProjectEntity, p => p.labels, { onDelete: 'SET NULL'})
  project?: ProjectEntity | null;

  constructor(label: Partial<LabelEntity>) {
    super();
    if (label) {
      Object.assign(
        this,
        plainToClass(ProjectEntity, label, {
          excludeExtraneousValues: true,
        }));
    }
  }
}
