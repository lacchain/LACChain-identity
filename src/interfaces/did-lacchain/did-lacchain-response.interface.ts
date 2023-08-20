import { EcJwk, RsaJwk } from './did-lacchain.interface';

export interface INewDelegateResponse {
  delegateDid: string;
  delegateAddress: string;
  txHash: string;
}

export interface INewECAttributeCreationResponse {
  publicKey: string;
  txHash: string;
}

export interface INewECJwkAttributeCreationResponse {
  txHash: string;
  jwk: EcJwk | RsaJwk;
}
