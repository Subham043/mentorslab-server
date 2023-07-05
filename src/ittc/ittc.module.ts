import { Module } from '@nestjs/common';
import { UniqueUrlRule } from 'src/common/validator/unique_url.validator';

@Module({
  providers: [UniqueUrlRule],
})
export class IttcModule {}
