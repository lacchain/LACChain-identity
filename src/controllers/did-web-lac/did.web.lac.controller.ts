import {
  JsonController,
  Post,
  BadRequestError,
  Get,
  Param
} from 'routing-controllers';
import { Service } from 'typedi';
import { DidServiceWebLac } from '@services/did-lac/didWebLac.service';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/did-web-lac')
@Service()
export class DidWebLacController {
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
  @Get('/controller/:did')
  async getDidController(@Param('did') did: string): Promise<any> {
    return this.didServiceWebLac.getController(did);
  }
  @Get('/decode/:did')
  async getDidParams(@Param('did') did: string): Promise<any> {
    return this.didServiceWebLac.decodeDid(did);
  }
}
