import { Test, TestingModule } from '@nestjs/testing';

import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

describe('CryptoController', () => {
  let controller: CryptoController;

  const mockCryptoService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CryptoController],
        providers: [
          {
            provide: CryptoService,
            useValue: mockCryptoService,
          },
        ],
      }).compile();

    controller =
      module.get<CryptoController>(
        CryptoController,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should encrypt payload', () => {
    const expectedResult = {
      successful: true,
      error_code: '',
      data: {
        data1: 'encrypted-key',
        data2: 'encrypted-payload',
      },
    };

    mockCryptoService.encrypt.mockReturnValue(
      expectedResult,
    );

    const result = controller.encrypt({
      payload: 'Hello Primo',
    });

    expect(
      mockCryptoService.encrypt,
    ).toHaveBeenCalledWith(
      'Hello Primo',
    );

    expect(result).toEqual(
      expectedResult,
    );
  });

  it('should decrypt data', () => {
    const expectedResult = {
      successful: true,
      error_code: '',
      data: {
        payload: 'Hello Primo',
      },
    };

    mockCryptoService.decrypt.mockReturnValue(
      expectedResult,
    );

    const result = controller.decrypt({
      data1: 'abc',
      data2: 'xyz',
    });

    expect(
      mockCryptoService.decrypt,
    ).toHaveBeenCalledWith(
      'abc',
      'xyz',
    );

    expect(result).toEqual(
      expectedResult,
    );
  });
});