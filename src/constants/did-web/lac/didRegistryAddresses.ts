import { DidSpec } from 'src/interfaces/did/did.generics';

type didversionType = Map<string, boolean>;
type didType = Map<string, didversionType>;
type didRegistryType = Map<string, didType>;
type chainregistryType = Map<string, didRegistryType>;

export const DID_LAC1_NAME = 'lac1';
export const DID_CODE = new Map<string, string>([[DID_LAC1_NAME, '0001']]);
export const OPEN_PROTESTESNET_CHAIN_ID = '0x9e55c';

export const SUPPORTED_DID_TYPES = new Map<string, didversionType>([
  ['0001', new Map([['0001', true]])]
]);

// setting for open protestnet
export const CHAIN_REGISTRY: chainregistryType = new Map<
  string,
  didRegistryType
>();
const openProtestnetSupportedRegistries: didRegistryType = new Map<
  string,
  didType
>();
openProtestnetSupportedRegistries.set(
  '0x54358D929CCf45C7cCEE8Ca60FCD0C0402489F54',
  new Map([['0001', new Map([['0001', true]])]])
);
CHAIN_REGISTRY.set(
  OPEN_PROTESTESNET_CHAIN_ID,
  openProtestnetSupportedRegistries
);

export const DEFAULT_DID_REGISTRY: Map<string, DidSpec> = new Map<
  string,
  DidSpec
>([
  [
    OPEN_PROTESTESNET_CHAIN_ID,
    {
      didType: '0001',
      didVersion: '0001',
      didRegistryAddress: '0x54358D929CCf45C7cCEE8Ca60FCD0C0402489F54',
      didMethod: 'lac1'
    }
  ]
]);

// WIP: for did:web
export const DOMAIN_NAMES: string[] = ['lacchain.id', 'another.lacchain.id'];
export const DEFAULT_DOMAIN_NAME = 'lacchain.id';
