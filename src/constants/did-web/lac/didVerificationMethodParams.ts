export const VM_RELATIONS: Map<string, boolean> = new Map<string, boolean>();
VM_RELATIONS.set('asse', true);
VM_RELATIONS.set('dele', true);
VM_RELATIONS.set('auth', true);
VM_RELATIONS.set('keya', true);
export const DELEGATE_TYPES: Map<string, boolean> = new Map<string, boolean>();
DELEGATE_TYPES.set('sigAuth', true);
export const ATTRIBUTE_ENCODING_METHODS: Map<string, boolean> = new Map<
  string,
  boolean
>();
ATTRIBUTE_ENCODING_METHODS.set('hex', true);
ATTRIBUTE_ENCODING_METHODS.set('base64', true);
ATTRIBUTE_ENCODING_METHODS.set('base58', true);
ATTRIBUTE_ENCODING_METHODS.set('pem', true);
ATTRIBUTE_ENCODING_METHODS.set('json', true);
ATTRIBUTE_ENCODING_METHODS.set('blockchain', true);

export const ATTRIBUTE_ALGORITHMS: Map<string, boolean> = new Map<
  string,
  boolean
>();
ATTRIBUTE_ALGORITHMS.set('esecp256k1rm', true);
ATTRIBUTE_ALGORITHMS.set('jwk', true);
