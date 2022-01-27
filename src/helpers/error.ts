import { HttpException, InternalServerErrorException } from "@nestjs/common";

interface CatchErr {
  status?: number;
  message?: string;
}

export const handleCatchError = (err: CatchErr) => {
  if (err.status) {
    throw new HttpException(err, err.status);
  } else {
    throw new InternalServerErrorException(err)
  }
}
