export type did = {
  did: string;
};
export interface DidService {
  createDid(): Promise<any>;
}
