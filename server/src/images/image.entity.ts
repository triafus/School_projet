import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
import { User } from "../users/user.entity";
import { Collection } from "../collections/collection.entity";

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

  // Owner of the image
  @ManyToOne(() => User, (user) => user.images)
  user: User;

  @Column()
  userId: number;

  // Many-to-many relation with collections via join table
  @ManyToMany(() => Collection, (collection) => collection.images)
  collections: Collection[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
