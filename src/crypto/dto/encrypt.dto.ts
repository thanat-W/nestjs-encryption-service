import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EncryptDto {
  @ApiProperty({
    example: 'Hello Primo',
    maxLength: 2000,
  })
  @IsString()
  @Length(1, 2000)
  payload!: string;
}