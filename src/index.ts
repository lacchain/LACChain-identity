export { DidServiceWebLac } from './services/did-lac/didWebLac.service';
export { DidLac1Service } from './services/did-lac/didLac1.service';
export {
  didLacAttributes,
  DidLacService
} from './services/did-lac/interfaces/did-lac.service';
export { DidService, did as DidType } from './services/interfaces/did.service';
export { Did as DidEntity } from './entities/did.entity';
export { EC as ECEntity } from 'lacchain-key-manager';
export * from './dto/did-lac/attributeDTO';
export * from './dto/did-lac/delegateDTO';
export * from './interfaces/did-lacchain/did-lacchain.interface';
export * from './interfaces/did-lacchain/did-lacchain-response.interface';
export * from './services/did-lac/lacchain/lacchain-ethers';
export * from './interfaces/ethereum/transaction';
