import {
  JsonController,
  Post,
  BadRequestError,
  Get,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';
import { DidLac1Service } from '@services/did-lac/didLac1.service';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/did-lac1')
@Service()
export class DidLac1Controller {
  constructor(private readonly didService: DidLac1Service) {}

  @Post()
  async createDidLac1(): Promise<any> {
    try {
      return this.didService.createDid();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Get('/controller/:did')
  async getDidController(@Param('did') did: string): Promise<any> {
    return this.didService.getController(did);
  }
  @Get('/decode/:did')
  async getDidParams(@Param('did') did: string): Promise<any> {
    return this.didService.decodeDid(did);
  }
}
