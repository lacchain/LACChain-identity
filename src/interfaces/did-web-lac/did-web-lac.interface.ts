export interface IJwkAttribute {
  did: string;
  jwk: any;
  validDays: number;
  relation: string;
}
export interface IRsaAttribute {
  did: string;
  rsaJwk: RsaJwk;
  validDays: number;
  relation: string;
}

export interface RsaJwk {
  kty: string;
  e: string;
  n: string;
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
