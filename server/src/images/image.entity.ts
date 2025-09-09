import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Expose } from "class-transformer";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column({ default: false })
  is_approved: boolean;

  @Column({ default: false })
  is_private: boolean;

  @ManyToOne(() => User, (user) => user.images)
  @Expose({ groups: ["admin"] })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
