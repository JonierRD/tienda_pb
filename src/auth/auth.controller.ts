import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }

    @Get('perfil')
    @UseGuards(JwtAuthGuard)
    perfil(@Req() req: Request) {
        return this.authService.perfil(req.user as UsuarioEntity);
    }
}
