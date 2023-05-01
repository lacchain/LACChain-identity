import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { DidServiceWebLac } from '../../services/did-lac/did.service';
import { ErrorsMessages } from '../../constants/errorMessages';
import {
  EcJwkAttributeDTO,
  RsaJwkAttributeDTO
} from '../../dto/did-web-lac/addAttributeDTO';

@JsonController('/did-web-lac/attribute')
@Service()
export class DidWebLacAttributeController {
  constructor(private readonly didServiceWebLac: DidServiceWebLac) {}

  @Post('/add/jwk/rsa')
  async addRsaJwkAttribute(
    @Body({ validate: true }) attribute: RsaJwkAttributeDTO
  ): Promise<any> {
    try {
      return this.didServiceWebLac.addRsaJwkAttribute(attribute);
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
      return this.didServiceWebLac.addEcJwkAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
