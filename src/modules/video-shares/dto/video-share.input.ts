import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString
} from '@nestjs/class-validator';

export class VideoShareInput {
    @ApiProperty({ name: 'url', description: 'email' })
    @IsString()
    url: string;
}