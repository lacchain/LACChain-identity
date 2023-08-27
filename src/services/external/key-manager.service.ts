import { Service } from 'typedi';
import fetch from 'node-fetch';
import {
  LACCHAIN_IDENTITY_IS_DEPENDENT_SERVICE,
  KEY_MANAGER_BASE_URL,
  SECP256K1_KEY,
  SECP256K1_SIGN_ETHEREUM_TRANSACTION,
  SECP256K1_SIGN_LACCHAIN_TRANSACTION,
  log4TSProvider,
  ED25519_CREATE_KEY
} from '../../config';
import {
  IEthereumTransaction,
  ECService,
  Secp256k1SignTransactionService,
  Secp256k1SignLacchainTransactionService,
  ISignedTransaction,
  ILacchainTransaction
} from 'lacchain-key-manager';
import { InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '@constants/errorMessages';
import { IECKey } from 'src/interfaces/key/key.interface';
@Service()
export class KeyManagerService {
  public createSecp256k1Key: () => Promise<IECKey>;
  public createEd25519Key: () => Promise<IECKey>;
  public signEthereumTransaction: (
    ethereumTransaction: IEthereumTransaction
  ) => Promise<ISignedTransaction>;
  public signLacchainTransaction: (
    lacchainTransaction: ILacchainTransaction
  ) => Promise<ISignedTransaction>;
  private secp256k1Service: ECService | null;
  private secp256k1SignTransactionService: Secp256k1SignTransactionService | null;
  // eslint-disable-next-line max-len
  private secp256k1SignLacchainTransactionService: Secp256k1SignLacchainTransactionService | null;
  private generic25519Service: ECService | null;
  log = log4TSProvider.getLogger('KeyManagerService');
  constructor() {
    if (LACCHAIN_IDENTITY_IS_DEPENDENT_SERVICE !== 'true') {
      this.log.info('Configuring key-manager library usage');
      this.createSecp256k1Key = this.createSecp256k1KeyByLib;
      const S = require('lacchain-key-manager').Secp256k1DbService;
      this.secp256k1Service = new S();

      this.signEthereumTransaction = this.signEthereumTransactionByLib;
      const T =
        require('lacchain-key-manager').Secp256k1SignTransactionServiceDb;
      this.secp256k1SignTransactionService = new T();

      this.signLacchainTransaction = this.signLacchainTransactionByLib;
      const R =
        require('lacchain-key-manager').Secp256k1SignLacchainTransactionServiceDb;
      this.secp256k1SignLacchainTransactionService = new R();

      this.createEd25519Key = this.createEd25519KeyByLib;
      const SS = require('lacchain-key-manager').Generic25519DbService;
      this.generic25519Service = new SS('ed25519');
    } else {
      this.log.info('Configuring key-manager external service connection');
      this.secp256k1Service = null;
      this.createSecp256k1Key = this.createKeyByExternalService;

      this.secp256k1SignTransactionService = null;
      this.signEthereumTransaction =
        this.secp256k1SignTransactionByExternalService;

      this.secp256k1SignLacchainTransactionService = null;
      this.signLacchainTransaction =
        this.signLacchainTransactionByExternalService;

      this.generic25519Service = null;
      this.createEd25519Key = this.createEd25519KeyByExternalService;
    }
  }
  async createSecp256k1KeyByLib(): Promise<IECKey> {
    return (await this.secp256k1Service?.createKey()) as IECKey;
  }
  async createKeyByExternalService(): Promise<IECKey> {
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
    return (await result.json()) as IECKey;
  }

  async createEd25519KeyByLib(): Promise<IECKey> {
    return (await this.generic25519Service?.createKey()) as IECKey;
  }

  async createEd25519KeyByExternalService(): Promise<IECKey> {
    const result = await fetch(`${KEY_MANAGER_BASE_URL}${ED25519_CREATE_KEY}`, {
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
    return (await result.json()) as IECKey;
  }

  async signEthereumTransactionByLib(
    ethereumTransaction: IEthereumTransaction
  ): Promise<ISignedTransaction> {
    return this.secp256k1SignTransactionService?.signEthereumBasedTransaction(
      ethereumTransaction
    );
  }
  async secp256k1SignTransactionByExternalService(
    ethereumTransaction: IEthereumTransaction
  ): Promise<ISignedTransaction> {
    const result = await fetch(
      `${KEY_MANAGER_BASE_URL}${SECP256K1_SIGN_ETHEREUM_TRANSACTION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ethereumTransaction)
      }
    );
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(ErrorsMessages.SIGN_TRANSACTION_ERROR);
    }
    return (await result.json()) as ISignedTransaction; // todo: check type in this return
  }

  async signLacchainTransactionByLib(
    lacchainTransaction: ILacchainTransaction
  ): Promise<ISignedTransaction> {
    return this.secp256k1SignLacchainTransactionService?.signEthereumBasedTransaction(
      lacchainTransaction
    );
  }

  async signLacchainTransactionByExternalService(
    lacchainTransaction: ILacchainTransaction
  ): Promise<ISignedTransaction> {
    const result = await fetch(
      `${KEY_MANAGER_BASE_URL}${SECP256K1_SIGN_LACCHAIN_TRANSACTION}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lacchainTransaction)
      }
    );
    console.log('status', result.status);
    if (result.status !== 200) {
      console.log(await result.text());
      throw new InternalServerError(ErrorsMessages.SIGN_TRANSACTION_ERROR);
    }
    return (await result.json()) as ISignedTransaction; // todo: check type in this return
  }
}
