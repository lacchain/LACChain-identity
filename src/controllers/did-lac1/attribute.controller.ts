import {
  JsonController,
  Post,
  BadRequestError,
  Body,
  UploadedFile,
  Delete
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import {
  AccountIdAttributeDTO,
  NewAttributeDTO,
  NewJwkAttributeDTO
} from '../../dto/did-lac/attributeDTO';
import { DidLac1Service } from '@services/did-lac/didLac1.service';

@JsonController('/did/lac1/attribute')
@Service()
export class DidLac1AttributeController {
  constructor(private readonly didService: DidLac1Service) {}

  @Post('/add/jwk-from-x509certificate')
  async addAttributeFromX509Certificate(
    @Body({ validate: true }) formData: any,
    @UploadedFile('x509Cert') x509Cert: Express.Multer.File
  ) {
    try {
      return this.didService.rawAddAttributeFromX509Certificate(
        formData,
        x509Cert
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('/revoke/jwk-from-x509certificate')
  async revokeAttributeFromX509Certificate(
    @Body({ validate: true }) formData: any,
    @UploadedFile('x509Cert') x509Cert: Express.Multer.File
  ) {
    try {
      return this.didService.rawRevokeAttributeFromX509Certificate(
        formData,
        x509Cert
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Adds a new jwk attribute accoding to the passed algorithm: rsa, p256, secp256k1
   * @param {NewJwkAttributeDTO} attribute - Details, validDays and relationships
   * @return {any}
   */
  @Post('/add/jwk/new')
  async addJwkAttribute(
    @Body({ validate: true }) attribute: NewJwkAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addNewJwkAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/add/delegate/address')
  async addEthereumAccountAttribute(
    @Body({ validate: true }) attribute: AccountIdAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addEthereumAccountIdAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/add/delegate/address/new')
  async addNewEthereumAccountAttribute(
    @Body({ validate: true }) attribute: NewAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addNewEthereumAccountIdAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/add/secp256k1/new')
  async addNewSecp256k1Attribute(
    @Body({ validate: true }) attribute: NewAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addNewSecp256k1Attribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/add/ed25519/new')
  async addNewEd25519Attribute(
    @Body({ validate: true }) attribute: NewAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addNewEd25519Attribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
