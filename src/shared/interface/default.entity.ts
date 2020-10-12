import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export abstract class DefaultEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn({ select: false, name: 'created_at' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ select: false, name: 'updated_at' })
  updatedAt: Date;
}
