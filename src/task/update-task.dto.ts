/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { TaskStatus } from "./task.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateStatusDto extends PartialType(CreateTaskDto){
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus;
}