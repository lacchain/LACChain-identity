import {
  BadRequestError,
  HttpError,
  InternalServerError,
  UnauthorizedError
} from 'routing-controllers';

export enum ErrorsMessages {
  MISSING_PARAMS = 'Missing params on body',
  INVALID_CREDENTIALS = 'Invalid credentials',
  EMAIL_NOT_SENT = 'Error at sending email',
  REDIS_ERROR = 'Error in redis database',
  REDIS_ERROR_SET_TOKEN = "Error setting user's token in blacklist",
  UNKNOWN = 'Unknown error',
  BODY_ERRORS = "You have errors in your request's body." +
    "Check 'errors' field for more details.",
  PASSWORD_ERROR = 'Property password must be longer than or equal to 6 characters',
  // HTTP STANDARD MESSAGES
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  BAD_REQUEST_ERROR = 'Bad request error',
  USER_ALREADY_EXISTS = 'A user with this email is already registered',
  CREATE_KEY_ERROR = 'An internal server error occurred while trying to create a new key',
  // eslint-disable-next-line max-len
  SIGN_TRANSACTION_ERROR = 'An error occurred while trying to sign transaction against external service',
  UNSUPPORTED_CHAIN_ID = 'Unsupported chain Id',
  INVALID_EXPIRATION_DAYS = 'Valid days must be greater than zero',
  INVALID_JWK_TYPE = 'Invalid Jwk type',
  // eslint-disable-next-line max-len
  UNSUPPORTED_JWK_CREATION_FOR_TYPE = 'The type of jwk for creation is not supported yet, valid type: "secp256k1" or "secp256r1"',
  INVALID_VM_RELATION_TYPE = 'Invalid verification method relation type',
  UNSUPPORTED_ATTRIBUTE_ENCODING_METHOD = 'Unsupported attribute encoding',
  INVALID_DELEGATE_TYPE = 'Invalid delegate type',
  INVALID_X509_SERIAL_NUMBER = 'Invalid x509 serial number',
  INVALID_X509_SUBJECT = 'Invalid x509 subject',
  X509_KEY_USAGE_LENGTH_ERROR = 'Invalid key usage length array',
  // eslint-disable-next-line max-len
  X509_KEY_USAGE_SIGNATURE_DIRECTIVE_REQUIRED = '`digital signature` is required inside key usage array',
  X509_EXPIRED_CERTIFICATE = 'Certificate has expired',
  X509_INVALID_ORGANIZATION_SUBJECT = 'Invalid or organization subject',
  X509_INVALID_COUNTRY = 'Invalid or certificate country',
  X509_INVALID_COMMON_NAME = 'Invalid x509 CN name',
  ATTRIBUTE_VALUE_ERROR = 'Attribute value is not an address',
  // eslint-disable-next-line max-len
  LACCHAIN_CONTRACT_TRANSACTION_ERROR = 'There was an error, there may be an issue with the params you are sending',
  // eslint-disable-next-line max-len
  UNEXPECTED_RESPONSE_IN_SUCCESSFUL_TRANSACTION_ERROR = 'Transaction was successfully completed but received an unexpected response',
  UNSUPPORTED_CHAIN_ID_IN_DID = 'Unsupported chainId was found in DID',
  UNSUPPORTED_DID_TYPE = 'Unsupported DID type',
  UNSUPPORTED_DID_VERSION = 'Unsupported DID version',
  // eslint-disable-next-line max-len
  PUBLIC_KEY_COMPRESSED_FORMAT_ERROR = 'Unexpected public key format, expected compressed format',
  // eslint-disable-next-line max-len
  PUBLIC_KEY_UNCOMPRESSED_FORMAT_ERROR = 'Unexpected public key format, expected uncompressed format'
}

export const Errors = {
  [ErrorsMessages.MISSING_PARAMS]: new BadRequestError(
    ErrorsMessages.MISSING_PARAMS
  ),
  [ErrorsMessages.INVALID_CREDENTIALS]: new UnauthorizedError(
    ErrorsMessages.INVALID_CREDENTIALS
  ),
  // Throw a BadGateway error
  [ErrorsMessages.EMAIL_NOT_SENT]: new HttpError(
    502,
    ErrorsMessages.EMAIL_NOT_SENT
  ),
  [ErrorsMessages.BAD_REQUEST_ERROR]: new InternalServerError(
    ErrorsMessages.BAD_REQUEST_ERROR
  )
};
