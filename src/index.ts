export { DidServiceWebLac } from './services/did-lac/didWebLac.service';
export { DidLac1Service } from './services/did-lac/didLac1.service';
export {
  didLacAttributes,
  DidLacService
} from './services/did-lac/interfaces/did-lac.service';
export { DidService, did as DidType } from './services/interfaces/did.service';
export { Did as DidEntity } from './entities/did.entity';
export { Secp256k1 as Secp256k1Entity } from 'lacpass-key-manager';
export * from './dto/did-lac/attributeDTO';
export * from './dto/did-lac/delegateDTO';
export * from './interfaces/did-lacchain/did-lacchain.interface';
export * from './interfaces/did-lacchain/did-lacchain-response.interface';
export * from './services/did-lac/lacchain/lacchain-ethers';
export * from './interfaces/ethereum/transaction';
