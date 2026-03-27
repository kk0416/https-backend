import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

// @Catch() 没带参数时，表示捕获所有异常。
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    // host 里保存了这次请求的上下文。
    // 这里切换到 HTTP 场景，取出 request/response 对象。
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // HttpException 是 Nest 已知的业务异常；
    // 其他异常统一按 500 内部错误处理。
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 统一把异常内容收敛成一个 message 字符串，方便前端直接展示。
    const message = exception instanceof HttpException
      ? this.normalizeHttpExceptionMessage(exception)
      : 'internal server error';

    // 如果不是标准 HttpException，说明很可能是代码 bug 或未预料错误。
    // 这里单独打日志，方便排查。
    if (!(exception instanceof HttpException)) {
      this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception));
    }

    // 最终无论发生什么，返回给前端的结构都保持统一。
    response.status(status).send({
      code: status,
      message,
      data: {
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // 某些 HttpException 的响应体可能是字符串、对象或字符串数组。
  // 这里统一整理成 string。
  private normalizeHttpExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const maybeMessage = (response as { message?: string | string[] }).message;
      if (Array.isArray(maybeMessage)) {
        return maybeMessage.join('; ');
      }
      if (typeof maybeMessage === 'string') {
        return maybeMessage;
      }
    }

    return exception.message;
  }
}
