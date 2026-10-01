import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioEntity } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolService } from 'src/rol/rol.service';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuariosRepository: Repository<UsuarioEntity>,
        private readonly rolService: RolService
    ) {}

    async findByEmail(email: string, includePassword = false): Promise<UsuarioEntity | null>{
        if(includePassword) {
            return await this.usuariosRepository.createQueryBuilder('usuario')
            .addSelect('usuario.password')
            .leftJoinAndSelect('usuario.rol', 'rol')
            .where('usuario.email = :email', {email})
            .getOne()
        }
        return await this.usuariosRepository.findOne({
            where: {email}
        });
    }

    //La columna password tiene select:false, asi que nunca se incluye en el resultado
    async findById(id: number): Promise<UsuarioEntity | null> {
        return await this.usuariosRepository.findOne({ where: { id } });
    }

    async create(createUsuarioDto: CreateUsuarioDto) {
        const userExists = await this.usuariosRepository.findOne({ where: { email: createUsuarioDto.email } });
        if (userExists) {
            throw new ConflictException(`El email ${createUsuarioDto.email} ya está registrado`);
        }

        //Asignar rol al usuario
        const rolId = createUsuarioDto.rolId;
        const rol = await this.rolService.findOne(rolId);
        if (!rol) {
            throw new ConflictException(`El rol con ID ${rolId} no existe`);
        }

        //Crear el usuario con el rol asignado
        const newUser = this.usuariosRepository.create({
            ...createUsuarioDto,
            rol: rol
        });

        const userSaved = await this.usuariosRepository.save(newUser);

        //Omitir la contraseña en la respuesta
        const { password, ...userWithoutPassword } = userSaved;

        return {
            mesage: 'Usuario creado exitosamente',
            user: userWithoutPassword
        }

        
    }
}
