import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';

export interface JwtPayload {
  sub: number;
  email: string;
  rol?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      //Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //Valida ademas la fecha de expiracion
      ignoreExpiration: false,
      //Valida la firma del token contra el mismo secret con el que se firmo
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  //Corre en cada request protegido. Lo que se retorne aqui es req.user
  async validate(payload: JwtPayload): Promise<UsuarioEntity> {
    //Busca el usuario por el sub del payload
    const usuario = await this.usuariosService.findById(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Token invalido: el usuario no existe');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('La cuenta no se encuentra activa');
    }

    return usuario;
  }
}
