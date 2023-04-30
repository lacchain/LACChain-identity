import { IsNumber, IsObject, IsString } from 'class-validator';

export class RsaJwk {
  @IsString()
  kty!: string;
  @IsString()
  e!: string;
  @IsString()
  n!: string;
}

export class EcJwk {
  @IsString()
  kty!: string;
  @IsString()
  x!: string;
  @IsString()
  y!: string;
  @IsString()
  crv!: string;
}

export class RsaJwkAttributeDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  relation!: string;
  @IsObject()
  rsaJwk!: RsaJwk;
}

export class EcJwkAttributeDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  relation!: string;
  @IsObject()
  ecJwk!: EcJwk;
}
