import { log4TSProvider } from '../../../config';
import { GasModelProvider } from '@lacchain/gas-model-provider';
import { KeyManagerService } from '../../external/key-manager.service';
import { BigNumber, ethers } from 'ethers';
import {
  IEthereumTransactionResponse,
  ITransaction
} from 'src/interfaces/ethereum/transaction';
import { BadRequestError } from 'routing-controllers';
import { ErrorsMessages } from '../../../constants/errorMessages';

export class LacchainLib {
  log = log4TSProvider.getLogger('lacchainUtils');
  private nodeAddress: string;
  private readonly provider: ethers.providers.Provider;
  private rpcUrl: string;
  private keyManagerService: KeyManagerService;
  constructor(nodeAddress: string, rpcUrl: string) {
    this.keyManagerService = new KeyManagerService();
    this.nodeAddress = nodeAddress;
    this.rpcUrl = rpcUrl;
    this.provider = new GasModelProvider(this.rpcUrl);
  }
  async signAndSend(tx: ITransaction): Promise<IEthereumTransactionResponse> {
    const voidSigner = new ethers.VoidSigner(tx.from, this.provider);
    // Gas Limit is set to avoid failures
    const fullyPopulatedTransactionRequest =
      await voidSigner.populateTransaction({ ...tx, gasLimit: 4700000 });
    const f = fullyPopulatedTransactionRequest.gasPrice;
    const s = BigNumber.from(f);
    fullyPopulatedTransactionRequest.gasPrice = s.toHexString();
    const signedTx = await this.keyManagerService.signLacchainTransaction({
      fullyPopulatedTransactionRequest,
      signerAddress: tx.from,
      nodeAddress: this.nodeAddress,
      expiration: Math.floor(Date.now() / 1000) + 86400 * 4 // 4 days
    });
    const txResponse = await this.provider.sendTransaction(
      signedTx.signedTransaction
    );
    this.log.info('waiting for transaction response...');
    try {
      await txResponse.wait();
    } catch (err: any) {
      throw new BadRequestError(
        ErrorsMessages.LACCHAIN_CONTRACT_TRANSACTION_ERROR
      );
    }
    this.log.info('Transaction successfully sent, txHash', txResponse.hash);
    return { txHash: txResponse.hash };
  }
}
