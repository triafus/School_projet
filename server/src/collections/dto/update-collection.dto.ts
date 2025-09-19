import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

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
}
