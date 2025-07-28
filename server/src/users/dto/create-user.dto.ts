import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsIn,
} from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Email invalide" })
  email: string;

  @IsString()
  @MinLength(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères",
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Le prénom est requis" })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: "Le nom est requis" })
  lastName: string;

  @IsOptional()
  @IsIn(["user", "admin"], { message: "Le rôle doit être 'user' ou 'admin'" })
  role?: string;
}
