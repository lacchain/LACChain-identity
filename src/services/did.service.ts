import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Did } from '@entities/did.entity';
import { KeyManagerService } from './external/key-manager.service';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import {
  CHAIN_ID,
  DID_REGISTRY_ADDRESS,
  DOMAIN_NAME,
  log4TSProvider
} from '@config';

@Service()
export class DidService {
  private readonly didRepository = getRepository<Did>(Did);
  private readonly base58 = require('base-x')(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  );
  private readonly hex = require('base-x')('0123456789abcdef');

  private readonly didEncodingVersion = '0001'; // constant for encoding
  // eslint-disable-next-line max-len
  private readonly didType = '0001'; // constant
  private readonly domainName: string;

  private readonly chainId: string;
  private readonly didRegistryAddress: string;

  private readonly didLacWebIdentifier: string;

  log = log4TSProvider.getLogger('didService');
  constructor(private keyManagerService: KeyManagerService) {
    this.chainId = CHAIN_ID;
    this.didRegistryAddress = DID_REGISTRY_ADDRESS;
    this.domainName = DOMAIN_NAME;
    this.didLacWebIdentifier = `did:web:${this.domainName}:`;
  }

  show(id: string) {
    return this.didRepository.findOne(id);
  }

  async createDidWebLac() {
    const key = await this.keyManagerService.createSecp256k1Key();
    const did = EntityMapper.mapTo(Did, {});
    did.keyId = key.keyId;
    did.did =
      this.didLacWebIdentifier +
      this.encode(
        this.didType,
        this.chainId,
        key.address,
        this.didRegistryAddress
      );
    await this.didRepository.insert(did);
    return { did: did.did };
  }
  // todo: validate parameters
  encode(
    didType: string,
    chainId: string,
    primaryAddress: string,
    didRegistry: string
  ): string {
    const payload = [
      Buffer.from(this.didEncodingVersion, 'hex'),
      Buffer.from(didType, 'hex'),
      this.getLacchainDataBuffer(chainId, primaryAddress, didRegistry)
    ];
    return this.base58.encode(Buffer.concat(payload));
  }

  getLacchainDataBuffer(
    chainId: string,
    address: string,
    didRegistry: string
  ): Buffer {
    const dataArr = [
      this.hex.decode(chainId.slice(2), 'hex'),
      Buffer.from(address.slice(2), 'hex'),
      Buffer.from(didRegistry.slice(2), 'hex')
    ];
    return Buffer.concat(dataArr);
  }
}
