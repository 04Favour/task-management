import { Module } from "@nestjs/common";
import { TaskModule } from "src/task/task.module";
import { GeminiProvider } from "./gemini.provider";
import { TaskBotService } from "./taskbot.service";
import { TaskBotController } from "./taskbot.controller";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [TaskModule, AuthModule],
    providers: [GeminiProvider, TaskBotService],
    controllers: [TaskBotController]
})
export class TaskBotModule{}