import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateParam {
    @ApiProperty({ name: 'pageSize', description: 'pageSize', default: 10 })
    @IsOptional()
    pageSize: number;

    @ApiProperty({ name: 'pageIndex', description: 'pageIndex', default: 1 })
    @IsOptional()
    pageIndex: number;

    @ApiProperty({ name: 'keyword', description: 'keyword', required: false })
    @IsOptional()
    keyword?: string;
}
