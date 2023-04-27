import { DidService } from '../../interfaces/did.service';

export interface DidLacService extends DidService {
  addAttribute(did: string, rsaPublicKey: string): Promise<any>;
}
