import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface";

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
