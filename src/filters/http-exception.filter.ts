import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const logger = new Logger()
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : '';
    const errors = exceptionResponse['errors'] ? exceptionResponse['errors'] : exceptionResponse['message']
    const isError = status === HttpStatus.INTERNAL_SERVER_ERROR;
    // 只要不是服务器错误，都返回200状态码
    const resStatus = isError ? status : 200;
    // 服务器错误，统一返回
    const resErrors = isError ? '服务器错误，请稍后重试~' : errors;

    response.status(resStatus).json({
      ok: 1,
      msg: resErrors,
      data: []
    })

    logger[isError ? 'error' : 'warn']({
      status,
      errors,
      timestamp: new Date().toISOString(),
      ip: request.ip || '',
      info: `${request.method} ${request.url} query:${JSON.stringify(request.query)}, params:${JSON.stringify(
        request.params
      )}, body:${JSON.stringify(request.body)}`
    });
  }
}
