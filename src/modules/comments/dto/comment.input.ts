import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from '@nestjs/class-validator';

export class CommentInput {
    @ApiProperty({ name: 'content', description: 'content' })
    @IsString()
    content: string;
}
