import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@prisma/client";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'mobile',
      passwordField: 'password'
    })
  }

  async validate(mobile: string, password: string): Promise<User> {
    return this.authService.validateUser(mobile, password);
  }
}
