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
  INVALID_VM_RELATION_TYPE = 'Invalid verification method relation type',
  INVALID_X509_SERIAL_NUMBER = 'Invalid x509 serial number',
  INVALID_X509_SUBJECT = 'Invalid x509 subject',
  X509_KEY_USAGE_LENGTH_ERROR = 'Invalid key usage length array',
  // eslint-disable-next-line max-len
  X509_KEY_USAGE_SIGNATURE_DIRECTIVE_REQUIRED = '`digital signature` is required inside key usage array',
  X509_EXPIRED_CERTIFICATE = 'Certificate has expired'
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
