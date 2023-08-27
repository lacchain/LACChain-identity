# Changelog

## 0.0.1

### Additions and Improvements
* Create dids according to "lac1" did method
  * Add did registry version "1". This contract handles versions as a contract state variable.
* Allows adding attributes to did registry for the following algorithms:
  * esecp256k1rm
  * jwk
* Add the following relationships in regards to the attributes associated with a did.
  * assertion
  * delegation
  * key agreement
  * authentication
* Integrates with LACChain-key-manager to save cryptographic material.
