/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUser = createParamDecorator((data, ctx: ExecutionContext)=> {
    const req = ctx.switchToHttp().getRequest()
    const user = req.user
    if(!user) return null;
    if(data){
        return user[data as string]
    }
    return user
})