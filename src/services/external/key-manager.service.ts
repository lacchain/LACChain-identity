import { Service } from 'typedi';
import fetch from 'node-fetch';
import { KEY_MANAGER_BASE_URL, SECP256K1_KEY } from '@config';

@Service()
export class KeyManagerService {
  async createSecp256k1Key() {
    return fetch(`${KEY_MANAGER_BASE_URL}${SECP256K1_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
