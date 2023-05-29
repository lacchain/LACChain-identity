import {
  JsonController,
  Post,
  BadRequestError,
  Body,
  UploadedFile
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import {
  EcJwkAttributeDTO,
  RsaJwkAttributeDTO
} from '../../dto/did-lac/addAttributeDTO';
import { DidLac1Service } from '@services/did-lac/didLac1.service';
import { log4TSProvider } from '@config';

@JsonController('/did-lac1/attribute')
@Service()
export class DidLac1AttributeController {
  log = log4TSProvider.getLogger('attribute-controller');
  constructor(private readonly didService: DidLac1Service) {}

  @Post('/add/jwk/rsa')
  async addRsaJwkAttribute(
    @Body({ validate: true }) attribute: RsaJwkAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addRsaJwkAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

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

  @Post('/add/jwk/ec')
  async addEcJwkAttribute(
    @Body({ validate: true }) attribute: EcJwkAttributeDTO
  ): Promise<any> {
    try {
      return this.didService.addEcJwkAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
