import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../../constants/errorMessages';
import {
  EcJwkAttributeDTO,
  RsaJwkAttributeDTO
} from '../../dto/did-web-lac/addAttributeDTO';
import { DidLac1Service } from '@services/did-lac/didLac1.service';

@JsonController('/did-lac1/attribute')
@Service()
export class DidLac1AttributeController {
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
