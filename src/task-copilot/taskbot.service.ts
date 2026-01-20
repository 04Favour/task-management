import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { GeminiProvider } from "./gemini.provider";
import { TaskService } from "src/task/task.service";
import { Users } from "src/auth/users.entity";
import { ACTIONS } from "./action";

@Injectable()
export class TaskBotService {
    constructor(private gemini: GeminiProvider, private taskService: TaskService){}

    async handle(user: Users, userMessage: string){
        const raw = await this.gemini.generate(userMessage)
        const cleanJson = raw.replace(/```json|```/g, "").trim();
        try {
            const response = JSON.parse(cleanJson);

        switch(response.action) {
            case 'createTask': 
                try {
                    return await this.taskService.createTask(response.data, user)
                } catch(error){
                    if(error.code === '23505') {
                             return { message: "That task already exists in your list!" };
                        }
                    throw new InternalServerErrorException()
                }  
            case 'updateStatus':
                return this.taskService.updateStatus(response.data.id, response.data.status, user)
            case 'getTasks':
                return this.taskService.getTasks(response.data, user)
            case 'summarize':
                return this.summarize(user)
            default: 
                return {message: response.message}
        }
    } catch(error) {
        console.error("AI returned invalid JSON. Raw output:", raw);
        return { message: "I'm sorry, I had trouble processing that. Can you try again?" };
    }
        }
    private async summarize(user: Users){
        const allTask = await this.taskService.getTasksForBot(user)
        return {
            total: allTask.length,
            completed: allTask.filter(t => t.status === 'done').length,
            pending: allTask.filter(t => t.status === 'in_progress' || t.status === 'open').length    
        }
    }
}