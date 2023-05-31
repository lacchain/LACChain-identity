import {
  IJwkEcAttribute,
  IJwkRsaAttribute,
  INewAccountIdAttribute,
  INewOnchainDelegate
} from 'src/interfaces/did-lacchain/did-lacchain.interface';
import { DidService } from '../../interfaces/did.service';
// eslint-disable-next-line max-len
import { INewDelegateResponse } from 'src/interfaces/did-lacchain/did-lacchain-response.interface';

export type didLacAttributes = {
  address: string;
  didRegistryAddress: string;
  chainId: string;
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
    newAccountIdAttribute: INewAccountIdAttribute
  ): Promise<INewDelegateResponse>;
}
