import { IsObject, IsString } from 'class-validator';

export class RsaJwk {
  @IsString()
  kty!: string;
  @IsString()
  e!: string;
  @IsString()
  n!: string;
}

export class RsaJwkAttributeDTO {
  @IsString()
  did!: string;
  @IsObject()
  rsaJwk!: RsaJwk;
}
