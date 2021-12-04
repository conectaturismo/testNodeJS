import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @IsNumber()
  @IsNotEmpty({ message: 'code is required' })
  code: number;

  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @IsNotEmpty({ message: 'date is required' })
  date: Date;
}
