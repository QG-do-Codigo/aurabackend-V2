import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../auth/common/auth.constants";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request[REQUEST_TOKEN_PAYLOAD_NAME];
  }
);
