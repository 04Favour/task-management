import { Module } from "@nestjs/common";
import { TaskModule } from "src/task/task.module";
import { GeminiProvider } from "./gemini.provider";
import { TaskBotService } from "./taskbot.service";
import { TaskBotController } from "./taskbot.controller";

@Module({
    imports: [TaskModule],
    providers: [GeminiProvider, TaskBotService],
    controllers: [TaskBotController]
})
export class TaskBotModule{}