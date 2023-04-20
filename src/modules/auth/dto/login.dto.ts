import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString
} from '@nestjs/class-validator';

export class LoginInput {
    @ApiProperty({ name: 'email', description: 'email' })
    @IsString()
    @IsEmail()
    username: string;

    @ApiProperty({ name: 'password', description: 'password' })
    @IsString()
    password: string;
}