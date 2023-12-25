import { IsNotEmpty, IsNumber, IsString, Max, MinLength, min } from 'class-validator';

export class TopupDto {
  @IsNumber()
  @IsNotEmpty()
  @Max(10000000)
  amount: number;
}