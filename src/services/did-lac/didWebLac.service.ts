import { Service } from 'typedi';
import { log4TSProvider, resolveDidDomainName } from '../../config';
import { DidService } from './did.service';

@Service()
export class DidServiceWebLac extends DidService {
  log = log4TSProvider.getLogger('didService');
  constructor() {
    super(`did:web:${resolveDidDomainName()}:`);
  }
}
