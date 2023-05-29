import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Did } from '../../entities/did.entity';
import { KeyManagerService } from '../external/key-manager.service';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import {
  CHAIN_ID,
  getChainId,
  log4TSProvider,
  resolveDidRegistryAddress,
  getRpcUrl,
  getNodeAddress
} from '../../config';
import { Interface, keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import DIDRegistryContractInterface from './did-registry';
import { BadRequestError } from 'routing-controllers';
import { DidLacService, didLacAttributes } from './interfaces/did-lac.service';
import { ErrorsMessages } from '../../constants/errorMessages';
import {
  IJwkAttribute,
  IJwkAttribute1,
  IJwkEcAttribute,
  IJwkRsaAttribute,
  IX509Attribute
} from 'src/interfaces/did-web-lac/did-web-lac.interface';
import { ITransaction } from 'src/interfaces/ethereum/transaction';
import { ethers } from 'ethers';
import { LacchainLib } from './lacchain/lacchain-ethers';
import { encode } from 'cbor';
import { VM_RELATIONS } from '../../constants/did-web/lac/didVerificationMethodParams';
import { X509Certificate } from 'crypto';

@Service()
export abstract class DidService implements DidLacService {
  private readonly didRepository = getRepository<Did>(Did);
  private readonly base58 = require('base-x')(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  );
  private readonly hex = require('base-x')('0123456789abcdef');

  private readonly didEncodingVersion = '0001'; // constant for encoding
  // eslint-disable-next-line max-len
  private readonly didType = '0001'; // constant

  private readonly chainId: string;
  private readonly didRegistryAddress: string;
  private readonly rpcUrl: string;
  private readonly nodeAddress: string;

  private readonly didIdentifier: string;

  private didRegistryContractInterface: DIDRegistryContractInterface;

  private readonly lacchainLib: LacchainLib;

  log = log4TSProvider.getLogger('didService');
  private keyManagerService: KeyManagerService;
  constructor(didIdentifier: string) {
    this.keyManagerService = new KeyManagerService();
    this.chainId = getChainId();
    this.didRegistryAddress = resolveDidRegistryAddress();
    this.didIdentifier = didIdentifier;
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
  async addRsaJwkAttribute(jwkRsaAttribute: IJwkRsaAttribute): Promise<any> {
    // TODO: validate RSA params
    const { kty } = jwkRsaAttribute.rsaJwk;
    if (kty !== 'RSA') {
      const message = ErrorsMessages.INVALID_JWK_TYPE;
      this.log.info(message);
      throw new BadRequestError(message);
      // TODO: validate x5c if exists
      // validate expiration dates according to policies
    }
    const jwkAttribute: IJwkAttribute = {
      did: jwkRsaAttribute.did,
      jwk: jwkRsaAttribute.rsaJwk,
      validDays: jwkRsaAttribute.validDays,
      relation: jwkRsaAttribute.relation
    };
    return this._addJwkAttributeWithDays(jwkAttribute);
  }

  async addEcJwkAttribute(ecJwkAttribute: IJwkEcAttribute): Promise<any> {
    // TODO: validate RSA params
    const { kty } = ecJwkAttribute.ecJwk;
    if (kty !== 'EC') {
      const message = ErrorsMessages.INVALID_JWK_TYPE;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const jwkAttribute: IJwkAttribute = {
      did: ecJwkAttribute.did,
      jwk: ecJwkAttribute.ecJwk,
      validDays: ecJwkAttribute.validDays,
      relation: ecJwkAttribute.relation
    };
    return this._addJwkAttributeWithDays(jwkAttribute);
  }

  async addJwkFromPem(x509Attribute: IX509Attribute): Promise<any> {
    const { x509, did, relation } = x509Attribute;
    // if (x509.keyUsage.length <= 0) {
    //   throw new BadRequestError(ErrorsMessages.X509_KEY_USAGE_LENGTH_ERROR);
    // }
    // if (!x509.keyUsage.find(el => el === 'digital signature')) {
    //   throw new BadRequestError(
    //     ErrorsMessages.X509_KEY_USAGE_SIGNATURE_DIRECTIVE_REQUIRED
    //   );
    // }
    const serialNumber = x509.serialNumber;
    if (serialNumber.length <= 0) {
      throw new BadRequestError(ErrorsMessages.INVALID_X509_SERIAL_NUMBER);
    }
    const subject = x509.subject;
    if (subject.length <= 0) {
      throw new BadRequestError(ErrorsMessages.INVALID_X509_SUBJECT);
    }
    // TODO: validate subject required params
    // console.log('subject', subject);
    // const regex = /[^\w\s]/g;
    // subject.search(regex);
    // TODO: validate dates, at least that the certificate is not expired
    const validTo = x509.validTo;
    console.log('validTo', validTo);
    const futureTime = Math.floor(new Date(validTo).getTime() / 1000);
    const delta = futureTime - Math.floor(Date.now() / 1000);
    if (delta < 0) {
      throw new BadRequestError(ErrorsMessages.X509_EXPIRED_CERTIFICATE);
    }
    if (delta > 86400 * 365) {
      this.log.info(
        'Incoming certificate is greater than one year, expires in',
        Math.floor(delta / 86400),
        'days'
      );
    }
    const pubKey = x509.publicKey;
    const jwk = pubKey.export({ format: 'jwk' });
    const extendedJwk = { ...jwk, x5c: [x509.raw.toString('base64')] };
    const jwkAttr: IJwkAttribute1 = {
      did,
      jwk: extendedJwk,
      exp: futureTime,
      relation
    };
    return this._addJwkAttribute(jwkAttr);
  }

  async rawAddAttributeFromX509Certificate(
    formData: any,
    x509Cert: Express.Multer.File
  ) {
    const { did, relation } = this.validateAndExtractDidFromObject(formData);
    const x509 = new X509Certificate(x509Cert.buffer);
    return this.addJwkFromPem({
      x509,
      did,
      relation
    } as IX509Attribute);
  }

  private async _addJwkAttributeWithDays(
    jwkAttribute: IJwkAttribute
  ): Promise<any> {
    const validDays = jwkAttribute.validDays;
    const validity = Math.floor(Date.now() / 1000) + 86400 * validDays;
    const { did, jwk, relation } = jwkAttribute;
    const mappedJwkAttribute: IJwkAttribute1 = {
      did,
      jwk,
      exp: validity,
      relation
    };
    return this._addJwkAttribute(mappedJwkAttribute);
  }

  private async _addJwkAttribute(jwkAttribute: IJwkAttribute1): Promise<any> {
    const { address, didRegistryAddress, chainId } = this.decodeDid(
      jwkAttribute.did
    );
    if (chainId.toLowerCase() !== CHAIN_ID.toLowerCase()) {
      const message = ErrorsMessages.UNSUPPORTED_CHAIN_ID;
      this.log.info(message);
      throw new BadRequestError(message);
    }

    const { relation } = jwkAttribute;
    if (!VM_RELATIONS.get(relation)) {
      const message = ErrorsMessages.INVALID_VM_RELATION_TYPE;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const { jwk } = jwkAttribute;
    const algorithm = 'JsonWebKey2020';
    const didPrimaryAddress = address; // found 'controller' in lacchain specs
    const encodingMethod = 'cbor';

    // TODO: check if 'controller' (didPrimaryAddress) is really needed
    // asse/did/JsonWebKey2020/cbor
    const name = `${relation}/${didPrimaryAddress}/${algorithm}/${encodingMethod}`;
    const value = encode(jwk);
    const methodName = 'setAttribute';
    const validity = jwkAttribute.exp;
    const setAttributeMethodSignature = [
      `function ${methodName}(address,bytes,bytes,uint256) public`
    ];
    const setAttributeInterface = new Interface(setAttributeMethodSignature);
    const encodedData = setAttributeInterface.encodeFunctionData(methodName, [
      address,
      toUtf8Bytes(name),
      value,
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
      this.didIdentifier +
      this.encode(
        this.didType,
        this.chainId,
        key.address,
        this.didRegistryAddress
      );
    await this.didRepository.insert(did);
    return { did: did.did };
  }

  decodeDid(did: string): didLacAttributes {
    const trimmed = did.replace(this.didIdentifier, '');
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

  private validateAndExtractDidFromObject(formData: any): {
    did: string;
    relation: string;
  } {
    if (!formData?.data) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    if (Object.keys(formData?.data).length === 0) {
      throw new BadRequestError(ErrorsMessages.BAD_REQUEST_ERROR);
    }
    return JSON.parse(formData.data) as { did: string; relation: string };
  }
}
