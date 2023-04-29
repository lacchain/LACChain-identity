import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { DidServiceWebLac } from '../../services/did-lac/did.service';
import { ErrorsMessages } from '../../constants/errorMessages';
import { RsaJwkAttributeDTO } from '../../dto/did-web-lac/addAttributeDTO';

@JsonController('/did-web-lac/delegate')
@Service()
export class DidWebLacDelegateController {
  constructor(private readonly didServiceWebLac: DidServiceWebLac) {}

  @Post()
  async addJWKRSAAttribute(
    @Body({ validate: true }) attribute: RsaJwkAttributeDTO
  ): Promise<any> {
    try {
      return this.didServiceWebLac.addJwkRSAAttribute(attribute);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
