import { Type } from 'class-transformer';
import {
  IsArray,
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
