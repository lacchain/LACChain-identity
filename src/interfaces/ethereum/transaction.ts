export interface ITransaction {
  from: string;
  to: string;
  data: string;
}

export interface IEthereumTransactionResponse {
  txHash: string;
}
