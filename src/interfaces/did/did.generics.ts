export interface DidSpec {
  didMethod: string;
  didType: string;
  didVersion: string;
  didRegistryAddress: string;
}

export interface DidRegistryParams {
  didMethod: string;
  didType: string;
  didVersion: string;
  didRegistryAddress: string;
  chainId: string;
}
