import { X509Certificate } from 'crypto';
export interface IOnchainDelegate {
  did: string;
  exp: number;
  type: string;
  delegateAddress: string;
}

export interface INewOnchainDelegate {
  did: string;
  validDays: number;
  type: string;
}

export interface INewAccountIdAttribute {
  did: string;
  validDays: number;
  relation: string;
}

export interface IAccountIdAttribute {
  did: string;
  exp: number;
  relation: string;
  blockchainAccountId: string;
}

export interface IGenericAttributeFields {
  did: string;
  exp: number;
  relation: string;
  algorithm: string;
  encodingMethod: string;
  value: any;
}

export interface IAddAccountIdAttribute {
  did: string;
  validDays: number;
  relation: string;
  address: string;
}

export interface IJwkAttribute {
  did: string;
  jwk: any;
  validDays: number;
  relation: string;
}

export interface IJwkAttribute1 {
  did: string;
  jwk: any;
  exp: number;
  relation: string;
}
export interface IJwkRsaAttribute {
  did: string;
  rsaJwk: RsaJwk;
  validDays: number;
  relation: string;
}

export interface RsaJwk {
  kty: string;
  e: string;
  n: string;
  x5c: string[];
}

export interface EcJwk {
  kty: string;
  x: string;
  y: string;
  crv: string;
}
export interface IJwkEcAttribute {
  did: string;
  ecJwk: EcJwk;
  validDays: number;
  relation: string;
}

export interface IX509Attribute {
  did: string;
  x509: X509Certificate;
  validDays: number;
  relation: string;
}
