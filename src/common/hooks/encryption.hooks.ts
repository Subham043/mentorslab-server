import { HttpException, HttpStatus } from '@nestjs/common';
import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

// const iv = randomBytes(16);
// const password = 'Password used to generate key';

const algorithm = 'aes-256-cbc';

// generate 16 bytes of random data
const initVector = randomBytes(16);

// secret key generate 32 bytes of random data
const Securitykey = 'abcdefghijklmnopqrstuvwxyz123456';

export const encrypt = async (value: string): Promise<string> => {
  // the cipher function
  const cipher = createCipheriv(algorithm, Securitykey, initVector);
  let encryptedData = cipher.update(value, 'utf-8', 'hex');

  encryptedData += cipher.final('hex');

  //   console.log('Encrypted message: ' + encryptedData);
  return encryptedData;
};

export const decrypt = async (value: string): Promise<string> => {
  const decipher = createDecipheriv(algorithm, Securitykey, initVector);

  try {
    let decryptedData = decipher.update(value, 'hex', 'utf-8');

    decryptedData += decipher.final('utf8');

    // console.log("Decrypted message: " + decryptedData);
    return decryptedData;
  } catch (error) {
    throw new HttpException('Invalid Id', HttpStatus.BAD_REQUEST);
  }
};
