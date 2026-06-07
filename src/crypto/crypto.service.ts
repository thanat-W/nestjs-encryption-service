import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
    private readonly publicKey: string;
    private readonly privateKey: string;

    constructor() {
        this.publicKey = fs.readFileSync(
            path.join(process.cwd(), 'keys', 'public.pem'),
            'utf8',
        );

        this.privateKey = fs.readFileSync(
            path.join(process.cwd(), 'keys', 'private.pem'),
            'utf8',
        );
    }
    encrypt(payload: string) {
        try {
            const aesKey = crypto
                .randomBytes(32)
                .toString('hex');

            const encryptedPayload =
                this.encryptAES(payload, aesKey);

            const encryptedKey =
                crypto.privateEncrypt(
                    this.privateKey,
                    Buffer.from(aesKey),
                );

            return {
                successful: true,
                error_code: '',
                data: {
                    data1: encryptedKey.toString('base64'),
                    data2: encryptedPayload,
                },
            };
        } catch (error) {
            const err = error as NodeJS.ErrnoException;

            return {
                successful: false,
                error_code: err.code ?? 'ENCRYPT_ERROR',
                data: null,
            };
        }

    }

    decrypt(
        data1: string,
        data2: string,
    ) {
        try {
            const aesKey =
                crypto.publicDecrypt(
                    this.publicKey,
                    Buffer.from(data1, 'base64'),
                );

            const payload =
                this.decryptAES(
                    data2,
                    aesKey.toString(),
                );

            return {
                successful: true,
                error_code: '',
                data: {
                    payload,
                },
            };
        } catch (error) {
            const err = error as NodeJS.ErrnoException;

            return {
                successful: false,
                error_code: err.code ?? 'DECRYPT_ERROR',
                data: null,
            };
        }
    }

    private encryptAES(
        payload: string,
        key: string,
    ): string {
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(
            'aes-256-cbc',
            crypto
                .createHash('sha256')
                .update(key)
                .digest(),
            iv,
        );

        let encrypted = cipher.update(
            payload,
            'utf8',
            'base64',
        );

        encrypted += cipher.final('base64');

        return `${iv.toString('base64')}:${encrypted}`;
    }

    private decryptAES(
        encryptedData: string,
        key: string,
    ): string {
        const [ivBase64, encrypted] =
            encryptedData.split(':');

        const iv = Buffer.from(
            ivBase64,
            'base64',
        );

        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            crypto
                .createHash('sha256')
                .update(key)
                .digest(),
            iv,
        );

        let decrypted = decipher.update(
            encrypted,
            'base64',
            'utf8',
        );

        decrypted += decipher.final('utf8');

        return decrypted;
    }
}