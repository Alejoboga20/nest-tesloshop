import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty()
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty()
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty()
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty()
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty()
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('.', '')
        .replaceAll("'", '');
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll('.', '')
      .replaceAll("'", '');
  }
}
