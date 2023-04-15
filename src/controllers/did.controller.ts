import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { DidService } from '@services/did.service';
import { Did } from '@entities/did.entity';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/did')
@Service()
export class DidController {
  constructor(private readonly didService: DidService) {}

  @Post('/web-lac')
  async createDidWebLac(): Promise<any> {
    try {
      const did = EntityMapper.mapTo(Did, {});
      return this.didService.createDidWebLac(did);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
