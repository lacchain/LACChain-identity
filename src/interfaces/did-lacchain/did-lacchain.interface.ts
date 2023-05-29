import { X509Certificate } from 'crypto';

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
