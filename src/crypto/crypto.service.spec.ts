import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [CryptoService],
      }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should encrypt and decrypt', () => {
    const payload = 'Hello Primo';

    const encrypted = service.encrypt(payload);

    const decrypted = service.decrypt(
      encrypted.data!.data1,
      encrypted.data!.data2,
    );

    expect(
      decrypted.data!.payload,
    ).toEqual(payload);
  });
});