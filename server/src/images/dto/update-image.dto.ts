import { IsString, IsOptional } from "class-validator";

export class UpdateImageDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  is_private?: boolean;
}
