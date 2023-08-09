import { randomUUID } from 'crypto';
import {
  DEFAULT_DID_REGISTRY,
  DEFAULT_DOMAIN_NAME,
  DID_CODE,
  DOMAIN_NAMES,
  SUPPORTED_DID_TYPES
} from '../constants/did-web/lac/didRegistryAddresses';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { LogLevel } from 'typescript-logging';
import { Log4TSProvider } from 'typescript-logging-log4ts-style';
import { DidRegistryParams } from 'src/interfaces/did/did.generics';

config({ path: `.env.${process.env.ENV || 'dev'}` });

export const log4TSProvider = Log4TSProvider.createProvider(
  'Log4IdentityProvider' + randomUUID(),
  {
    level: LogLevel.Debug,
    groups: [
      {
        expression: new RegExp('.+')
      }
    ]
  }
);

const log = log4TSProvider.getLogger('config');

// If .env wasn't provided then exit
if (!process.env.PORT) {
  console.error('==> Please check your .env');
  process.exit(1);
}

export const getChainId = (): string => {
  if (!process.env.CHAIN_ID) {
    console.error('==> Please set CHAIN_ID in your .env');
    process.exit(1);
  }
  return process.env.CHAIN_ID;
};

export const getRpcUrl = (): string => {
  if (!process.env.NODE_RPC_URL) {
    console.error('==> Please set RPC_URL in your .env');
    process.exit(1);
  }
  return process.env.NODE_RPC_URL;
};

export const getNodeAddress = (): string => {
  if (!process.env.NODE_ADDRESS) {
    console.error('==> Please set NODE_ADDRESS in your .env');
    process.exit(1);
  }
  return process.env.NODE_ADDRESS;
};

export const CHAIN_ID = getChainId();

export const PRODUCTION_ENV = process.env.ENV === 'prod';
export const DEV_ENV = process.env.ENV === 'dev';
export const TESTING_ENV = process.env.ENV === 'test';
export const CI_ENV = process.env.ENV === 'ci';
export const JWT_SECRET_DEFAULT = 'some-secret-string-default';

export const resolveChainRegistry = (): DidRegistryParams => {
  const supportedChainId = getChainId();
  const customDidRegEnv = process.env.CUSTOM_DID_REG;
  // 'didRegistryAddress,didType,didVersion,chainId'
  if (!customDidRegEnv) {
    // return default did registry
    const defaultDidRegistry = DEFAULT_DID_REGISTRY.get(supportedChainId);
    if (!defaultDidRegistry) {
      log.error(
        'There is no default did registry for chainId ' + supportedChainId
      );
      process.exit(1);
    }
    return {
      ...defaultDidRegistry,
      chainId: supportedChainId
    };
  }
  const customDidRegParam = customDidRegEnv.split(',');
  if (customDidRegParam.length !== 4) {
    log.error(
      'Invalid number of param when reading CUSTOM_DID_REG environemt variable, read:',
      customDidRegEnv
    );
    process.exit(1);
  }
  const [didRegistryAddress, didMethod, didVersion, chainId] =
    customDidRegParam;
  const didType = DID_CODE.get(didMethod);
  if (!didType) {
    log.error('did type not supported, read did method:', didMethod);
    process.exit(1);
  }
  // validate type, version tuple is supported
  const isSupportedDidType = SUPPORTED_DID_TYPES.get(didType);
  if (
    !isSupportedDidType ||
    (isSupportedDidType && !isSupportedDidType.get(didVersion))
  ) {
    log.error(
      'Unsupported did type/didVersion, read didType:',
      didType,
      'read didVersion:',
      didVersion
    );
    process.exit(1);
  }
  // validate chainId is supported
  if (chainId !== supportedChainId) {
    log.error(
      'Unsupported chainId passed alongside custom did registry, read chainId:',
      chainId,
      'supported version:',
      supportedChainId
    );
    process.exit(1);
  }
  // add registry
  if (!ethers.utils.isAddress(didRegistryAddress)) {
    log.error(
      'Specified did registry address: ',
      didRegistryAddress,
      ', is not a valid address ... exiting'
    );
    process.exit(1); // exiting since this is a critical error
  }
  log.info(
    'Returning custom did registry address',
    didRegistryAddress,
    'chainId:',
    chainId,
    'didMethod:',
    didMethod
  );
  return {
    didRegistryAddress,
    didMethod,
    didType,
    didVersion,
    chainId: supportedChainId
  };
};

export const resolveDidDomainName = (): string => {
  const domainName = process.env.DOMAIN_NAME;
  if (domainName) {
    const resolvedHostnames = DOMAIN_NAMES;
    if (!resolvedHostnames?.find(name => name === domainName)) {
      log.error(
        'Specified domain ',
        domainName,
        ' does not match any well known domain for chain Id',
        CHAIN_ID
      );
      process.exit(1);
    }
    log.info('Returning domain name', domainName);
    return domainName;
  }
  const defaultDomainName = DEFAULT_DOMAIN_NAME;
  if (!defaultDomainName) {
    log.error('Could not find default domain name for chain', CHAIN_ID);
    process.exit(1); // exiting since this is a critical error
  }
  log.info('Returning default domain name', defaultDomainName);
  return defaultDomainName;
};

export const DOMAIN_NAME = resolveDidDomainName();

export const {
  ENV,
  PORT,
  TYPEORM_PORT,
  TYPEORM_HOST,
  TYPEORM_TYPE,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_MIGRATIONS_RUN,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  JWT_SECRET,
  ACCESS_TOKEN_LIFE,
  RATE_LIMIT_WINDOW,
  RATE_LIMIT_MAX_REQUESTS,
  AWS_ID,
  AWS_SECRET,
  AWS_REGION,
  AWS_S3_BUCKETNAME,
  AWS_SES_API_VERSION,
  DOCS_ENABLED,
  SENDGRID_API_USER,
  SENDGRID_API_KEY,
  KEY_MANAGER_BASE_URL,
  SECP256K1_KEY,
  LACPASS_IDENTITY_IS_DEPENDENT_SERVICE,
  SECP256K1_SIGN_ETHEREUM_TRANSACTION,
  SECP256K1_SIGN_LACCHAIN_TRANSACTION,
  ED25519_CREATE_KEY
} = process.env;
