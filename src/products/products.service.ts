import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Product, ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(searchTerm: string) {
    let product: Product;

    if (isUUID(searchTerm)) {
      product = await this.productRepository.findOneBy({ id: searchTerm });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();

      product = await queryBuilder
        .where('UPPER(title) =:title OR slug=:slug', {
          title: searchTerm.toUpperCase(),
          slug: searchTerm.toLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      images: [],
    });
    if (!product)
      throw new BadRequestException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
    } catch (error) {
      this.handleExceptions(error);
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleExceptions(error: any) {
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Something went wrong');
  }
}
