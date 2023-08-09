export interface INewDelegateResponse {
  delegateDid: string;
  delegateAddress: string;
  txHash: string;
}

export interface INewECAttributeCreationResponse {
  publicKey: string;
  txHash: string;
}
