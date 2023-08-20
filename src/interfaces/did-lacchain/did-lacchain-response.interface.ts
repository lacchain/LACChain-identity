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

export interface INewJwkAttributeCreationResponse {
  txHash: string;
  jwk: EcJwk | RsaJwk;
}
