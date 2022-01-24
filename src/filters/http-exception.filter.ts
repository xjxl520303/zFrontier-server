import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : '';

    response.status(status).json({
      statusCode: status,
      errors: exceptionResponse['errors'] ? exceptionResponse['errors'] : exceptionResponse['message'],
      timestamp: new Date().toISOString(),
      info: `${request.method} ${request.url} query:${JSON.stringify(request.query)}, params:${JSON.stringify(
        request.params
      )}, body:${JSON.stringify(request.body)}`
    });
  }
}
