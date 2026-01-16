import { Test, TestingModule } from "@nestjs/testing";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service"
import { PassportModule } from "@nestjs/passport";
import { Users } from "src/auth/users.entity";
import { Task } from "./task.entity";
import { Logger, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./create-task.dto";
import { GetTasksFilterDto } from "./filter.dto";
import { TaskStatus } from "./task.enum";

// jest.mock('logger');

describe('TaskController', ()=> {
    let taskService: TaskService;
    let controller: TaskController;


    const mockTaskService = {
        GetTaskById: jest.fn(),
        createTask: jest.fn(),
        deleteTask: jest.fn(),
        updateStatus: jest.fn(),
        getTasks: jest.fn()
    }

    const mockTaskFactory = (overrides: Partial<Task> = {}): Task => ({
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        ...overrides,
      } as Task);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({defaultStrategy: 'jwt'})],
            providers: [{
                provide: TaskService,
                useValue: mockTaskService
            }],
            controllers: [TaskController]
        }).compile();
        taskService = module.get<TaskService>(TaskService);
        controller = module.get<TaskController>(TaskController);
    });

    afterEach(()=> {
        jest.clearAllMocks()
    })

    it('should be defined', ()=> {
        expect(controller).toBeDefined()
    })

    describe('GetTaskById', ()=> {
        it('should call taskService.GetTaskById and return the result', async () => {
            const user= {id:'123', username:'Favour Mfon'} as Users;
            const expectedResult = {id: '1', title: 'Test'} as Task;

            mockTaskService.GetTaskById.mockResolvedValue(expectedResult)

            const result = await controller.GetTaskById('1', user)

            expect(taskService.GetTaskById).toHaveBeenCalledWith('1', user)
            expect(result).toEqual(expectedResult)
        })

        it('throw an error if task is not found', async ()=> {
            const user= {id:'123', username:'Favour Mfon'} as Users;
            mockTaskService.GetTaskById.mockRejectedValue(new NotFoundException())

            await expect(controller.GetTaskById('999', user)).rejects.toThrow(NotFoundException)
        })
    })

    describe('createTask', ()=> {
        it('should create task', async ()=> {
        const dto = {title: 'Test title', description: 'Test Description'} as CreateTaskDto;
        const user= {id:'123', username:'Favour Mfon'} as Users;
        const expectedResult = {title: 'Test title', description: 'Test Description'} as Task

        mockTaskService.createTask.mockResolvedValue(dto)

        const result = await controller.createTask(dto, user)

        expect(result).toEqual(expectedResult)
        expect(mockTaskService.createTask).toHaveBeenCalledWith(dto, user)
        })
    })

    describe('getTasks', ()=> {
        it('should get all tasks or based on filters ', async () => {
            const filter = {status: TaskStatus.OPEN, search: 'Read'} as GetTasksFilterDto
            const user= {id:'123', username:'Favour Mfon'} as Users;
            const task = [
                mockTaskFactory({ title: 'Read NestJS Docs' }),
                mockTaskFactory({ id: '2', title: 'Read Jest Docs' }),
                ];
            mockTaskService.getTasks.mockResolvedValue(task)

            const result = await controller.getTasks(filter, user)

            expect(result).toEqual(task)
            expect(mockTaskService.getTasks).toHaveBeenCalledWith(filter, user)
            expect(result[0].title).toContain('Read');
        })
    })
})