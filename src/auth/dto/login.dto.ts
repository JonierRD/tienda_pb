import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {

    @IsEmail({}, {message: "El email debe tener un formato valido"})
    @IsNotEmpty({message: "El email es obligatorio"})
    email!: string;

    @IsString({message: "La contraseña debe ser una cadena de texto"})
    @IsNotEmpty({message: "La contraseña es obligatoria"})
    password!: string;
    
}