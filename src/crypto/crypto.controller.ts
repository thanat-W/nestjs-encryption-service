import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { EncryptDto } from './dto/encrypt.dto';
import { DecryptDto } from './dto/decrypt.dto';

@ApiTags('Crypto')
@Controller()
export class CryptoController {
  constructor(
    private readonly cryptoService: CryptoService,
  ) {}

  @Post('get-encrypt-data')
  encrypt(
    @Body() dto: EncryptDto,
  ) {
    return this.cryptoService.encrypt(dto.payload);
  }

  @Post('get-decrypt-data')
  decrypt(
    @Body() dto: DecryptDto,
  ) {
    return this.cryptoService.decrypt(
      dto.data1,
      dto.data2,
    );
  }
}