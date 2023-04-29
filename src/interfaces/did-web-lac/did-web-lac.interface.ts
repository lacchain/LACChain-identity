export interface IRsaAttribute {
  did: string;
  rsaJwk: RsaJwk;
}

export interface RsaJwk {
  kty: string;
  e: string;
  n: string;
}
