import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
  ArrayNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  // Optional list of image IDs to associate at creation
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  imageIds?: number[];
}
