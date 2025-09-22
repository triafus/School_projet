import { IsArray, IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateCollectionImagesDto {
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  addImageIds?: number[];

  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @IsOptional()
  removeImageIds?: number[];
}
