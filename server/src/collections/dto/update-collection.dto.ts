import {
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateCollectionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  imageIds?: number[];
}
