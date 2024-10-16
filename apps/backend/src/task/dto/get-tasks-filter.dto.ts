import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SortBy, Direction } from '../machine-state';

export class GetTasksFilterDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @IsOptional()
  @IsString()
  @IsEnum(Direction)
  direction?: Direction;
}
