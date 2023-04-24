import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { DidServiceWebLac } from '@services/did.service';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/did-web-lac')
@Service()
export class DidController {
  constructor(private readonly didServiceWebLac: DidServiceWebLac) {}

  @Post()
  async createDidWebLac(): Promise<any> {
    try {
      return this.didServiceWebLac.createDid();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
