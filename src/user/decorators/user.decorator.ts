import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserDecorator = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();      //внутри request получим все данные запроса

  if (!request.user){
    return null;
  }

  if(data){
    return request.user[data];
  }
  return request.user;
});