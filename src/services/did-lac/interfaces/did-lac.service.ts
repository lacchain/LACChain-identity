import {
  IJwkEcAttribute,
  IJwkRsaAttribute,
  INewAttribute,
  INewJwkAttribute,
  INewOnchainDelegate
} from 'src/interfaces/did-lacchain/did-lacchain.interface';
import { DidService } from '../../interfaces/did.service';
// eslint-disable-next-line max-len
import {
  INewDelegateResponse,
  INewECAttributeCreationResponse,
  INewJwkAttributeCreationResponse
} from 'src/interfaces/did-lacchain/did-lacchain-response.interface';
import { IEthereumTransactionResponse } from 'src/interfaces/ethereum/transaction';

export type didLacAttributes = {
  address: string;
  didRegistryAddress: string;
  chainId: string;
  version: string;
  didType: string;
  didMethod: string;
};
export interface DidLacService extends DidService {
  addAttribute(did: string, rsaPublicKey: string): Promise<any>;
  addRsaJwkAttribute(jwkRsaAttribute: IJwkRsaAttribute): Promise<any>;
  addEcJwkAttribute(ecJwkAttribute: IJwkEcAttribute): Promise<any>;
  getController(did: string): Promise<any>;
  decodeDid(did: string): didLacAttributes;
  createNewOnchainDelegate(
    newOnchainDelegate: INewOnchainDelegate
  ): Promise<INewDelegateResponse>;
  addNewEthereumAccountIdAttribute(
    newAccountIdAttribute: INewAttribute
  ): Promise<INewDelegateResponse>;
  addNewSecp256k1Attribute(
    newAttribute: INewAttribute
  ): Promise<INewECAttributeCreationResponse>;
  addNewEd25519Attribute(
    newAttribute: INewAttribute
  ): Promise<INewECAttributeCreationResponse>;
  rawAddAttributeFromX509Certificate(
    formData: any,
    x509Cert: Express.Multer.File
  ): Promise<IEthereumTransactionResponse>;
  rawRevokeAttributeFromX509Certificate(
    formData: any,
    x509Cert: Express.Multer.File
  ): Promise<IEthereumTransactionResponse>;
  addNewJwkAttribute(
    attribute: INewJwkAttribute
  ): Promise<INewJwkAttributeCreationResponse>;
}
