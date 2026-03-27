import { Module } from '@nestjs/common';

import { ProcessTaskController } from './process-task.controller';
import { ProcessTaskService } from './process-task.service';

@Module({
  controllers: [ProcessTaskController],
  providers: [ProcessTaskService],
  exports: [ProcessTaskService],
})
export class ProcessTaskModule {}
