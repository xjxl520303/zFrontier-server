import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { PUBLIC_ENDPOINT } from "../../../constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const decoratorSkip =
      this.reflector.get(PUBLIC_ENDPOINT, context.getClass()) ||
      this.reflector.get(PUBLIC_ENDPOINT, context.getHandler());

    if (decoratorSkip) return true;
    return super.canActivate(context);
  }
}
