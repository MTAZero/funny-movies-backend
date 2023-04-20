import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString
} from '@nestjs/class-validator';

export class RegisterInput {
    @ApiProperty({ name: 'username', description: 'username' })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ name: 'password', description: 'password' })
    @IsOptional()
    password: string;
}