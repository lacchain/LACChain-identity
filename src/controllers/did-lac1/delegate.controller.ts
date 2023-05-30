import { ErrorsMessages } from '@constants/errorMessages';
import { NewOnchainDelegateDTO } from '@dto/did-lac/delegateDTO';
import { DidLac1Service } from '@services/did-lac/didLac1.service';
import {
  BadRequestError,
  Body,
  JsonController,
  Post
} from 'routing-controllers';
import { Service } from 'typedi';

@JsonController('/did-lac1/delegate')
@Service()
export class DidLac1DelegateController {
  constructor(private readonly didService: DidLac1Service) {}
  @Post('/add/onchain-delegate')
  async addDelegate(@Body({ validate: true }) delegate: NewOnchainDelegateDTO) {
    try {
      return this.didService.createNewOnchainDelegate(delegate);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
