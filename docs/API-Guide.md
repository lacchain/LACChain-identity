# Identity API - Steps for LACPass

## Requisites before continuing
* You should have configured/access to the LACPass API
* You should have the public x509 certificate whose purpose is to sign health data.
    * For demo purposes you can set these certificates from [certificate generation example](./cert.generation.examples.md). After following those steps you will have the certificate in the path: certs/DSC/DSC.crt
* You should have a terminal to execute the commands listed below.

## Interacting

In this section you will have a did (Decentralized Indetifier) and you will have it associated with the X509 certificate you use to sign Health data.

1. Set API url to interact with

```sh
api_url=http://localhost:3001 # Set LACPass API url
```

2. Create a did

```sh
create_did_url="$api_url"/api/v1/did-lac1
r=`curl -s -X 'POST' \
  ${create_did_url} \
  -H 'accept: application/json' \
  -d ''`
did=`echo $r | sed 's/^{"did":"//' | sed 's/"}$//'`
echo "Did was created: $did"
```


3. Adding x509 Certificate to a did

```sh
## input variables
path_to_crt=../certs/DSC/DSC.crt # you should point to the public pem certificate that represents the signing certificate used to sign health related data
did="did:lac1:1iT5mqjxfSLyV24tHNgPwg5KMixYdP2FUHRCkir8Sr1RBepGA2da6peZgyB48tFUAdPy" # replace with the did previously created


# process
add_pem_certificate_url="$api_url"/api/v1/did-lac1/attribute/add/jwk-from-x509certificate
relation=asse
data='{"did":'"\"$did\""', "relation":'"\"$relation\""'}'
curl -X 'POST' ${add_pem_certificate_url} -H 'accept: application/json' -F x509Cert=@$path_to_crt -F data=$data
```