import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TopTransactionDto {

    @IsString()
    username: string;

    @IsString()
    @IsNotEmpty()
    amount_filter: string

    // @IsNumber()
    @IsNotEmpty()
    limit: number

    // @IsNumber()
    @IsNotEmpty()
    offset: number
}