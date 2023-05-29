# Cert Generation examples

This guide shows how to generate generate certificates that can later be used to interact with the identity API.

## create a directory and enter the directory

```sh
mkdir certs && cd certs
```

## Openssl cnf file example
Execute the following command to create a configuration file that will be used later
```sh
cat > "openssl.cnf" << EOF
[req]
default_bits = 2048
encrypt_key  = no # Change to encrypt the private key using des3 or similar
default_md   = sha256
prompt       = no
utf8         = yes
# Speify the DN here so we aren't prompted (along with prompt = no above).
distinguished_name = req_distinguished_name
# Extensions for SAN IP and SAN DNS
req_extensions = v3_req
# Be sure to update the subject to match your organization.
[req_distinguished_name]
C  = US
ST = California
L  = The Cloud
O  = Demo
CN = My Certificate
# Allow client and server auth. You may want to only allow server auth.
# Link to SAN names.
[v3_req]
basicConstraints     = CA:FALSE
subjectKeyIdentifier = hash
keyUsage             = digitalSignature
# extendedKeyUsage     = clientAuth, serverAuth
subjectAltName       = @alt_names
# Alternative names are specified as IP.# and DNS.# for IP addresses and
# DNS accordingly. 
[alt_names]
IP.1  = 1.2.3.4
DNS.1 = my.dns.name
EOF
```

## RSA Certificate example

### SCA

In this section you will create a SCA (Signing Certificate Authority) which will be self signed and whose purpose is to sign x509 DSC certificates used to sign health related data.

```sh
mkdir SCA
```

- Private Key Certificate
```sh
openssl genrsa -out "SCA/SCA.key" 4096
```

- Public Key Certificate

```sh
openssl req -x509 -new -nodes -key "SCA/SCA.key" -subj "/C=US/ST=CA/O=Ministry Of Health/CN=CA-MoH" -sha512 -days 1024 -out "SCA/SCA.crt"
```

### DSC

This section will create the DSC (Digital Signing Certificate) whose intention is to sign health related data (e.g. DDCC vaccine certificates)


```sh
mkdir DSC
```


- Private Key Certificate

```sh
openssl genrsa -out "DSC/DSC.key" 2048
```

- Certificate Signing Request

```sh
openssl req -new -sha512 -key "DSC/DSC.key" -subj "/C=US/ST=CA/O=DSC - Ministry of Health/CN=DSC-MoH" -out "DSC/DSC.csr"
```

- Signing the DSC.csr certificate with SCA private key

```sh
openssl x509 -req -in "DSC/DSC.csr" -CA "SCA/SCA.crt" \
-CAkey "SCA/SCA.key" -CAcreateserial -extensions v3_req \
-extfile "openssl.cnf" \
-out "DSC/DSC.crt" -days 500 -sha512
```