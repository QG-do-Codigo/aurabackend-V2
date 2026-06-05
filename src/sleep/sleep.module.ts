import { Module } from "@nestjs/common";
import { SleepController } from "./sleep.controller";
import { SleepService } from "./sleep.service";
import { SleepLogsController } from "./sleep-logs.controller";
import { SleepLogsService } from "./sleep-logs.service";

@Module({
  controllers: [SleepController, SleepLogsController],
  providers: [SleepService, SleepLogsService],
})
export class SleepModule {}
