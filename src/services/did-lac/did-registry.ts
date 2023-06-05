import { Wallet, ethers } from 'ethers';
import { GasModelProvider, GasModelSigner } from '@lacchain/gas-model-provider';
// eslint-disable-next-line max-len
import { LAC_DIDREGISTRY_RECOVERABLE_ABI } from '../../constants/did-web/lac/lacDidRegistryAbi';
import { log4TSProvider } from '../../config';
import { IRevokeAttribute } from 'src/interfaces/did-lacchain/did-lacchain.interface';
import {
  IEthereumTransactionResponse,
  ITransaction
} from 'src/interfaces/ethereum/transaction';
import { Interface, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { LacchainLib } from './lacchain/lacchain-ethers';
import { BadRequestError } from 'routing-controllers';
import { ErrorsMessages } from '../../constants/errorMessages';

export default class DIDRegistryContractInterface {
  private registry: ethers.Contract;
  private readonly lacchainLib: LacchainLib;
  log = log4TSProvider.getLogger('didRegistryService');
  constructor(
    didRegistryAddress: string,
    rpcUrl: string,
    privateKey: string | undefined,
    nodeAddress: string
  ) {
    // TODO: factor providers in such way that did service is independent
    this.lacchainLib = new LacchainLib(nodeAddress, rpcUrl);
    if (!privateKey) {
      // just for reading
      privateKey = Wallet.createRandom().privateKey;
    }
    const provider = this.configureProvider(rpcUrl, privateKey, nodeAddress);
    this.registry = new ethers.Contract(
      didRegistryAddress,
      LAC_DIDREGISTRY_RECOVERABLE_ABI,
      provider
    );
  }

  private configureProvider(
    rpcUrl: string,
    privateKey: string,
    nodeAddress: string,
    expiration = Math.floor(Date.now() / 1000) + 86400 * 1080
  ): GasModelSigner {
    const provider = new GasModelProvider(rpcUrl);
    return new GasModelSigner(privateKey, provider, nodeAddress, expiration);
  }

  async lookupController(address: string) {
    return this.registry.identityController(address);
  }

  async expirationAttribute(
    identity: string,
    attributeNameHash: string,
    attributeValueHash: string
  ): Promise<number> {
    const v = await this.registry.expirationAttribute(
      identity,
      attributeNameHash,
      attributeValueHash
    );
    return parseInt(ethers.utils.formatUnits(v, 0));
  }

  async revokeAttribute(
    attribute: IRevokeAttribute
  ): Promise<IEthereumTransactionResponse> {
    const { name, identityAddress, didRegistryAddress } = attribute;
    const expirationTime = await this.expirationAttribute(
      identityAddress,
      keccak256(toUtf8Bytes(name)),
      keccak256(attribute.value)
    );
    if (expirationTime < Math.floor(Date.now() / 1000)) {
      // eslint-disable-next-line max-len
      this.log.info(
        // eslint-disable-next-line max-len
        'The attribute/delegate has already expired or was already revoked ... Revoking again'
      );
    }

    const methodName = 'revokeAttribute';
    const setAttributeMethodSignature = [
      `function ${methodName}(address,bytes,bytes,uint256,bool) external`
    ];
    const setAttributeInterface = new Interface(setAttributeMethodSignature);
    const encodedData = setAttributeInterface.encodeFunctionData(methodName, [
      identityAddress,
      toUtf8Bytes(name),
      attribute.value,
      attribute.revokeDeltaTime,
      attribute.compromised
    ]);
    this.log.info('Performing against did registry: ', didRegistryAddress);
    // TODO: fix pointing to the did reg of the did
    const didControllerAddress = await this.lookupController(identityAddress);
    const tx: ITransaction = {
      from: didControllerAddress,
      to: didRegistryAddress,
      data: encodedData
    };
    const txResponse = await this.lacchainLib.signAndSend(tx);
    const receipt = await this.registry.provider.getTransactionReceipt(
      txResponse.txHash
    );
    const iFace = new ethers.utils.Interface(LAC_DIDREGISTRY_RECOVERABLE_ABI);
    for (const log of receipt.logs) {
      if (log.address == didRegistryAddress) {
        const parsed = iFace.parseLog(log);
        if (parsed.name == 'DIDAttributeChanged') {
          return txResponse;
        }
      }
    }
    throw new BadRequestError(
      ErrorsMessages.UNEXPECTED_RESPONSE_IN_SUCCESSFUL_TRANSACTION_ERROR
    ); // may happen if contract is updated where event structures are changed
  }
}
