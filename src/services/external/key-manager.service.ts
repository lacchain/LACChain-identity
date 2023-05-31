import { Service } from 'typedi';
import fetch from 'node-fetch';
import {
  LACPASS_IDENTITY_IS_DEPENDENT_SERVICE,
  KEY_MANAGER_BASE_URL,
  SECP256K1_KEY,
  SECP256K1_SIGN_ETHEREUM_TRANSACTION,
  SECP256K1_SIGN_LACCHAIN_TRANSACTION,
  log4TSProvider
} from '@config';
import {
  IEthereumTransaction,
  Secp256k1Service,
  Secp256k1SignTransactionService,
  Secp256k1SignLacchainTransactionService,
  ISignedTransaction,
  ILacchainTransaction
} from 'lacpass-key-manager';
import { InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '@constants/errorMessages';
import { ISecp256k1 } from 'src/interfaces/key/key.interface';
@Service()
export class KeyManagerService {
  public createSecp256k1Key: () => Promise<ISecp256k1>;
  public signEthereumTransaction: (
    ethereumTransaction: IEthereumTransaction
  ) => Promise<ISignedTransaction>;
  public signLacchainTransaction: (
    lacchainTransaction: ILacchainTransaction
  ) => Promise<ISignedTransaction>;
  private secp256k1Service: Secp256k1Service | null;
  private secp256k1SignTransactionService: Secp256k1SignTransactionService | null;
  // eslint-disable-next-line max-len
  private secp256k1SignLacchainTransactionService: Secp256k1SignLacchainTransactionService | null;
  log = log4TSProvider.getLogger('KeyManagerService');
  constructor() {
    if (LACPASS_IDENTITY_IS_DEPENDENT_SERVICE !== 'true') {
      this.log.info('Configuring key-manager library usage');
      this.createSecp256k1Key = this.createSecp256k1KeyByLib;
      const S = require('lacpass-key-manager').Secp256k1DbService;
      this.secp256k1Service = new S();

      this.signEthereumTransaction = this.signEthereumTransactionByLib;
      const T =
        require('lacpass-key-manager').Secp256k1SignTransactionServiceDb;
      this.secp256k1SignTransactionService = new T();

      this.signLacchainTransaction = this.signLacchainTransactionByLib;
      const R =
        require('lacpass-key-manager').Secp256k1SignLacchainTransactionServiceDb;
      this.secp256k1SignLacchainTransactionService = new R();
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
