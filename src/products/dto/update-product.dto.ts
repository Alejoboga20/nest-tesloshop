import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @MinLength(3)
  @IsOptional() // Make title optional for updates
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional() // Make price optional for updates
  price?: number;

  @IsInt()
  @IsPositive()
  @IsOptional() // Make stock optional for updates
  stock?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional() // Make sizes optional for updates
  sizes?: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  @IsOptional() // Make gender optional for updates
  gender?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
