import { Service } from 'typedi';
import { DidService } from './did.service';

@Service()
export class DidLac1Service extends DidService {
  constructor() {
    super('lac1:');
  }
}
