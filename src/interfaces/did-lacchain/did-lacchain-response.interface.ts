export interface INewDelegateResponse {
  delegateDid: string;
  delegateAddress: string;
  txHash: string;
}

export interface INewSecp256k1AttributeResponse {
  publicKey: string;
  txHash: string;
}
