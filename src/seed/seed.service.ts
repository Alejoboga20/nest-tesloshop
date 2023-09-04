import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    this.insertNewProducts();
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    return 'Seed executed successfully!';
  }
}
