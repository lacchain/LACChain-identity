import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Did } from '../../entities/did.entity';
import { KeyManagerService } from '../external/key-manager.service';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import {
  CHAIN_ID,
  getChainId,
  log4TSProvider,
  resolveDidDomainName,
  resolveDidRegistryAddress,
  getRpcUrl,
  getNodeAddress
} from '../../config';
import { Interface, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import DIDRegistryContractInterface from './did-registry';
import { BadRequestError } from 'routing-controllers';
import { DidLacService } from './interfaces/did-lac.service';
import { ErrorsMessages } from '../../constants/errorMessages';
import { IRsaAttribute } from 'src/interfaces/did-web-lac/did-web-lac.interface';
import { ITransaction } from 'src/interfaces/ethereum/transaction';
import { ethers } from 'ethers';
import { LacchainLib } from './lacchain/lacchain-ethers';

export type didWelLacAttributes = {
  address: string;
  didRegistryAddress: string;
  chainId: string;
};

@Service()
export class DidServiceWebLac implements DidLacService {
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
  private readonly rpcUrl: string;
  private readonly nodeAddress: string;

  private readonly didLacWebIdentifier: string;

  private didRegistryContractInterface: DIDRegistryContractInterface;

  private readonly lacchainLib: LacchainLib;

  log = log4TSProvider.getLogger('didService');
  private keyManagerService: KeyManagerService;
  constructor() {
    this.keyManagerService = new KeyManagerService();
    this.chainId = getChainId();
    this.didRegistryAddress = resolveDidRegistryAddress();
    this.domainName = resolveDidDomainName();
    this.didLacWebIdentifier = `did:web:${this.domainName}:`;
    this.rpcUrl = getRpcUrl();
    this.nodeAddress = getNodeAddress();
    this.didRegistryContractInterface = new DIDRegistryContractInterface(
      this.didRegistryAddress, // base did registry
      this.rpcUrl,
      undefined,
      this.nodeAddress
    );
    // TODO: factor providers in such way that did service is independent
    this.lacchainLib = new LacchainLib(this.nodeAddress, this.rpcUrl);
  }
  async addJwkRSAAttribute(jwkRsaAttribute: IRsaAttribute): Promise<any> {
    const { address, didRegistryAddress, chainId } = this.decodeDid(
      jwkRsaAttribute.did
    );
    if (chainId.toLowerCase() !== CHAIN_ID.toLowerCase()) {
      const message = ErrorsMessages.UNSUPPORTED_CHAIN_ID;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const jwk = jwkRsaAttribute.rsaJwk;
    const name = `${jwk.kty}/${jwk.e}`; // TODO: encode properly - write specs
    const value = jwk.n;
    const methodName = 'setAttribute';
    const validity = Math.floor(Date.now() / 1000) + 86400 * 365;
    const setAttributeMethodSignature = [
      `function ${methodName}(address,bytes,bytes,uint256) public`
    ];
    const setAttributeInterface = new Interface(setAttributeMethodSignature);
    const encodedData = setAttributeInterface.encodeFunctionData(methodName, [
      address,
      toUtf8Bytes(name),
      toUtf8Bytes(value),
      validity
    ]);
    const didControllerAddress =
      await this.didRegistryContractInterface.lookupController(address);
    const tx: ITransaction = {
      from: didControllerAddress,
      to: didRegistryAddress,
      data: encodedData
    };
    return this.lacchainLib.signAndSend(tx);
  }

  addAttribute(_did: string, _rsaPublicKey: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async getController(did: string): Promise<any> {
    const { address, chainId } = this.decodeDid(did);
    console.log(address, chainId);
    console.log(CHAIN_ID);
    if (chainId.toLowerCase() !== CHAIN_ID.toLowerCase()) {
      const message = ErrorsMessages.UNSUPPORTED_CHAIN_ID;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const didController =
      await this.didRegistryContractInterface.lookupController(address);
    return { controller: didController };
  }

  show(id: string) {
    return this.didRepository.findOne(id);
  }

  async createDid() {
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

  decodeDid(did: string): didWelLacAttributes {
    const trimmed = did.replace(this.didLacWebIdentifier, '');
    const data = Buffer.from(this.base58.decode(trimmed));
    const len = data.length;
    const encodedPayload = data.subarray(0, len - 4);
    const computedChecksum = this.checksum([encodedPayload]);
    const checksum = data.subarray(len - 4, len);
    if (!computedChecksum.equals(checksum)) {
      const message = 'Checksum mismatch';
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const version = data.subarray(0, 2);
    const didType = data.subarray(2, 4);
    if (version.toString('hex') !== this.didEncodingVersion) {
      // TODO handle better versioning
      const message = 'Unsupported encoding version';
      this.log.info(message);
      throw new BadRequestError(message);
    }

    if (didType.toString('hex') !== this.didType) {
      // TODO handle better versioning
      const message = 'Unsupported did type';
      this.log.info(message);
      throw new BadRequestError(message);
    }
    // TODO: improve code organization: according to didType and version
    const address = ethers.utils.getAddress(
      '0x' + data.subarray(4, 24).toString('hex')
    );
    const didRegistryAddress = ethers.utils.getAddress(
      '0x' + data.subarray(24, 44).toString('hex')
    );
    let c = data.subarray(44, len - 4).toString('hex');
    if (c[0] === '0') {
      c = c.substring(1);
    }
    const chainId = '0x' + c;
    return { address, didRegistryAddress, chainId };
  }

  // todo: validate parameters
  private encode(
    didType: string,
    chainId: string,
    address: string,
    didRegistry: string
  ): string {
    const payload = [
      Buffer.from(this.didEncodingVersion, 'hex'),
      Buffer.from(didType, 'hex'),
      this.getLacchainDataBuffer(chainId, address, didRegistry)
    ];
    payload.push(this.checksum(payload));
    return this.base58.encode(Buffer.concat(payload));
  }

  private getLacchainDataBuffer(
    chainId: string,
    address: string,
    didRegistry: string
  ): Buffer {
    const dataArr = [
      Buffer.from(address.slice(2), 'hex'),
      Buffer.from(didRegistry.slice(2), 'hex'),
      this.hex.decode(chainId.slice(2), 'hex')
    ];
    return Buffer.concat(dataArr);
  }

  private checksum(payload: Buffer[]): Buffer {
    return Buffer.from(
      keccak256(Buffer.concat(payload)).replace('0x', ''),
      'hex'
    ).subarray(0, 4);
  }
}
