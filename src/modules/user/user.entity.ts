import { Exclude } from "class-transformer";

export class UserEntity {
  @Exclude()
  password: string;

  @Exclude()
  mobile: string;

  @Exclude()
  refreshToken: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
