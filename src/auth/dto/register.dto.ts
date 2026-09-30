import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class RegisterDto {
    @IsNotEmpty({message: 'El nombre es obligatorio'})
    @IsString({message: 'El nombre debe ser un texto'})
    nombre!: string;

    @IsNotEmpty({message: 'El email es obligatorio'})
    @IsEmail({},{message: 'El email debe ser un correo electrónico válido'})
    email!: string;

    @IsNotEmpty({message: 'La contraseña es obligatoria'})
    @MinLength(6, {message: 'La contraseña debe tener al menos 6 caracteres'})
    @IsString({message: 'La contraseña debe ser un texto'})
    password!: string;

    @IsNumber({}, {message: 'El rolId debe ser un número'})
    rolId!: number;

}