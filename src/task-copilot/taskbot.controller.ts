import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { TaskBotService } from "./taskbot.service";
import { GetUser } from "src/auth/get-user.decorator";
import { Users } from "src/auth/users.entity";
import { AuthGuard } from "@nestjs/passport";

@Controller('bot')
@UseGuards(AuthGuard())
export class TaskBotController {
    constructor(private taskbotservice: TaskBotService){}

    @Post('chat')
    chat(@Body("message") message: string, @GetUser() user: Users){
        return this.taskbotservice.handle(user, message)
    }
}