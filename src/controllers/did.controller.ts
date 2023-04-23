import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { DidService } from '@services/did.service';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/did')
@Service()
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Post('/web-lac')
  async createDidWebLac(): Promise<any> {
    try {
      return this.didService.createDidWebLac();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
