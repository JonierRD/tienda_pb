import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

        const newUser = await this.usuariosService.create({
            ...registerDto,
            password: hashedPassword,
        })

        return {
            message: 'Usuario registrado exitosamente',
            user: newUser,
        }
    }

    async login(loginDto: LoginDto) {
        //1. Buscar el usuario por email
        const usuario = await this.usuariosService.findByEmail(loginDto.email, true)

        if (!usuario) {
            throw new UnauthorizedException(`El correo no existe`)
        }

        //2. Validar que la cuenta este activa
        if (!usuario.activo) {
            throw new UnauthorizedException(`La cuenta no se encuentra activa`)
        }

        //3. Comparar la contraseña enviada desde el dto con el hash de la BD
        const passwordValido = await bcrypt.compare(
            loginDto.password, //Este es el atributo del DTO
            usuario.password //Este es el hash de la BD
        )

        if (!passwordValido) {
            throw new UnauthorizedException(`Credenciales invalidas`)
        }

        //4. Crear el Payload del JWT
        const payload = {
            sub: usuario.id,
            email: usuario.email,
            rol: usuario.rol?.nombre
        }

        //5. Firmar el token
        const token = await this.jwtService.signAsync(payload);

        return {
            message: "Inicio de Sesion exitoso",
            access_token: token,
        }
    }
}
