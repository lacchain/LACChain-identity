import {
  IJwkEcAttribute,
  IJwkRsaAttribute
} from 'src/interfaces/did-web-lac/did-web-lac.interface';
import { DidService } from '../../interfaces/did.service';

export type didWelLacAttributes = {
  address: string;
  didRegistryAddress: string;
  chainId: string;
};
export interface DidLacService extends DidService {
  addAttribute(did: string, rsaPublicKey: string): Promise<any>;
  addRsaJwkAttribute(jwkRsaAttribute: IJwkRsaAttribute): Promise<any>;
  addEcJwkAttribute(ecJwkAttribute: IJwkEcAttribute): Promise<any>;
  getController(did: string): Promise<any>;
  decodeDid(did: string): didWelLacAttributes;
}
