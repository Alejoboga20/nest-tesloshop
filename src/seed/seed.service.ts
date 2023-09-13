import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from '../products/products.service';
import { initialData } from 'src/data/seed-data';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly productsService: ProductsService,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insterUsers();

    await this.insertNewProducts(adminUser);
    return 'Seed completed';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insterUsers() {
    const users: User[] = [];
    const seedUsers = initialData.users;

    seedUsers.forEach((user) => {
      users.push(this.userRepository.create(user));
    });
    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    const insertPromises = [];
    const seedProducts = initialData.products;

    seedProducts.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await this.productsService.deleteAllProducts();
    await Promise.all(insertPromises);
  }
}
