import { ethers } from 'ethers';
import { GasModelProvider, GasModelSigner } from '@lacchain/gas-model-provider';
// eslint-disable-next-line max-len
import { LAC_DIDREGISTRY_RECOVERABLE_ABI } from '../../constants/did-web/lac/lacDidRegistryAbi';
import { log4TSProvider } from '../../config';

export default class DIDRegistryContractInterface {
  private registry: ethers.Contract;
  log = log4TSProvider.getLogger('didRegistryService');
  constructor(
    didRegistryAddress: string,
    rpcUrl: string,
    privateKey: string | undefined,
    nodeAddress: string
  ) {
    if (!privateKey) {
      // just for reading
      privateKey =
        '0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63';
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
    expiration = 1736394529
  ): GasModelSigner {
    const provider = new GasModelProvider(rpcUrl);
    return new GasModelSigner(privateKey, provider, nodeAddress, expiration);
  }

  async lookupController(address: string) {
    return this.registry.identityController(address);
  }
}
