import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "../users/user.entity";
import { Image } from "../images/image.entity";

@Entity("collections")
export class Collection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  is_private: boolean;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  // Many-to-many relation with images via explicit join table
  @ManyToMany(() => Image, (image) => image.collections)
  @JoinTable({
    name: "collection_images",
    joinColumn: {
      name: "collection_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
