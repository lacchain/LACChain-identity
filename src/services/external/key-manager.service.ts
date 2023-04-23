import { Service } from 'typedi';
import fetch from 'node-fetch';
import {
  IS_DEPENDENT_SERVICE,
  KEY_MANAGER_BASE_URL,
  SECP256K1_KEY
} from '@config';
import { Secp256k1Service } from 'lacpass-key-manager';
import { InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '@constants/errorMessages';
import { ISecp256k1 } from 'src/interfaces/key/key.interface';
import { log4TSProvider } from 'src/config/LogConfig';
@Service()
export class KeyManagerService {
  public createSecp256k1Key: () => Promise<ISecp256k1>;
  private secp256k1Service: Secp256k1Service | null;
  log = log4TSProvider.getLogger('KeyManagerService');
  constructor() {
    if (IS_DEPENDENT_SERVICE !== 'true') {
      this.log.info('Configuring key-manager library usage');
      this.createSecp256k1Key = this.createSecp256k1KeyByLib;
      const S = require('lacpass-key-manager').Secp256k1DbService;
      this.secp256k1Service = new S();
    } else {
      this.log.info('Configuring key-manager external service connection');
      this.secp256k1Service = null;
      this.createSecp256k1Key = this.createKeyByExternalService;
    }
  }
  async createSecp256k1KeyByLib(): Promise<ISecp256k1> {
    return (await this.secp256k1Service?.createKey()) as ISecp256k1;
  }
  async createKeyByExternalService(): Promise<ISecp256k1> {
    const result = await fetch(`${KEY_MANAGER_BASE_URL}${SECP256K1_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(ErrorsMessages.CREATE_KEY_ERROR);
    }
    return (await result.json()) as ISecp256k1;
  }
}
