import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  is_private?: boolean;
}
