import {
  DEFAULT_DOMAIN_NAME,
  DEFAULT_REGISTRY,
  DOMAIN_NAMES,
  REGISTRY
} from '../constants/did-web/lac/didRegistryAddresses';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { LogLevel } from 'typescript-logging';
import { Log4TSProvider } from 'typescript-logging-log4ts-style';

config({ path: `.env.${process.env.ENV || 'dev'}` });

export const log4TSProvider = Log4TSProvider.createProvider(
  'IdentityLog4Provider',
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

export const resolveDidRegistryAddress = (
  didRegistryAddress = process.env.DID_REGISTRY_ADDRESS
): string => {
  // const didRegistryAddress = process.env.DID_REGISTRY_ADDRESS;
  if (didRegistryAddress) {
    if (!ethers.utils.isAddress(didRegistryAddress)) {
      log.error(
        'Specified DID_REGISTRY_ADDRESS',
        DID_REGISTRY_ADDRESS,
        'is not a valid address ... exiting'
      );
      process.exit(1); // exiting since this is a critical error
    }
    if (
      didRegistryAddress &&
      !REGISTRY.get(CHAIN_ID)?.find(el => el === didRegistryAddress)
    ) {
      log.info('Unknown specified did registry address ', didRegistryAddress);
    }
    log.info('Returning custom did registry address', didRegistryAddress);
    return didRegistryAddress;
  }
  const wellKnownRegistryAddress = DEFAULT_REGISTRY.get(CHAIN_ID);
  if (!wellKnownRegistryAddress) {
    log.error('Could not find well-known registry address for chain', CHAIN_ID);
    process.exit(1); // exiting since this is a critical error
  }
  log.info('Returning default registry address', wellKnownRegistryAddress);
  return wellKnownRegistryAddress;
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

export const DID_REGISTRY_ADDRESS = resolveDidRegistryAddress();
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
  SECP256K1_SIGN_LACCHAIN_TRANSACTION
} = process.env;
