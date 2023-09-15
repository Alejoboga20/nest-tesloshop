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
  @ApiProperty({
    description: 'Product id',
    uniqueItems: true,
    example: 'cd0b0c3e-0b1a-4b4a-9f3a-2b1d6b5c2f1e',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product Title',
    uniqueItems: true,
    example: 'Teslo T-Shirt',
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    description: 'Product Price',
    example: 99.99,
  })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    description: 'Product Description',
    example: 'This is a description of the product',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    description: 'Product Title',
    uniqueItems: true,
    example: 'teslo_t_shirt',
  })
  @Column('text', { unique: true })
  slug: string;

  @ApiProperty({
    description: 'Product Stock',
    example: 99,
  })
  @Column('int', { default: 0 })
  stock: number;

  @ApiProperty({
    description: 'Product Sizes',
    example: '["S", "M", "L", "XL"]',
  })
  @Column('text', { array: true })
  sizes: string[];

  @ApiProperty({
    description: 'Product Gender',
    example: 'Man',
  })
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
