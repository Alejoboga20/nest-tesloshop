import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from 'src/data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed completed';
  }

  private async insertNewProducts() {
    const insertPromises = [];
    const seedProducts = initialData.products;

    seedProducts.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await this.productsService.deleteAllProducts();
    await Promise.all(insertPromises);
  }
}
