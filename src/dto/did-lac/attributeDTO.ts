import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator';

export class RsaJwkDTO {
  @IsString()
  kty!: string;
  @IsString()
  e!: string;
  @IsString()
  n!: string;
  @IsArray()
  x5c!: string[];
}

export class EcJwkDTO {
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
  @ValidateNested()
  @IsDefined()
  @Type(() => RsaJwkDTO)
  rsaJwk!: RsaJwkDTO;
}

export class EcJwkAttributeDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  relation!: string;
  @IsObject()
  ecJwk!: EcJwkDTO;
}

export class AccountIdAttributeDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  relation!: string;
  @IsString()
  address!: string;
  // -> thus algorithm is esecp256k1rm -> EcdsaSecp256k1RecoveryMethod2020
}

export class NewAttributeDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  relation!: string;
}

export class RevokeAttributeDTO {
  @IsString()
  did!: string;
  @IsString()
  relation!: string;
  @IsNumber()
  backwardRevocationDays!: number;
  @IsDefined()
  @IsBoolean()
  compromised!: boolean;
}
