import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class TransferDto {

    @IsString()
    @IsNotEmpty()
    to_username: string;

  @IsNumber()
  @IsNotEmpty()
  @Max(10000000)
  @Min(1)
  amount: number;
}