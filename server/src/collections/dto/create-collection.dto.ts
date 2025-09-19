import { IsNotEmpty, IsOptional, IsString, IsBoolean } from "class-validator";

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
}
