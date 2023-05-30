import { IsNumber, IsString } from 'class-validator';

export class NewOnchainDelegateDTO {
  @IsString()
  did!: string;
  @IsNumber()
  validDays!: number;
  @IsString()
  type!: string;
}
