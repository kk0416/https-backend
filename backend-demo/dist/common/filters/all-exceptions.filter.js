"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
// @Catch() 没带参数时，表示捕获所有异常。
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    logger = new common_1.Logger(AllExceptionsFilter_1.name);
    catch(exception, host) {
        // host 里保存了这次请求的上下文。
        // 这里切换到 HTTP 场景，取出 request/response 对象。
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        // HttpException 是 Nest 已知的业务异常；
        // 其他异常统一按 500 内部错误处理。
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        // 统一把异常内容收敛成一个 message 字符串，方便前端直接展示。
        const message = exception instanceof common_1.HttpException
            ? this.normalizeHttpExceptionMessage(exception)
            : 'internal server error';
        // 如果不是标准 HttpException，说明很可能是代码 bug 或未预料错误。
        // 这里单独打日志，方便排查。
        if (!(exception instanceof common_1.HttpException)) {
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
    normalizeHttpExceptionMessage(exception) {
        const response = exception.getResponse();
        if (typeof response === 'string') {
            return response;
        }
        if (typeof response === 'object' && response !== null) {
            const maybeMessage = response.message;
            if (Array.isArray(maybeMessage)) {
                return maybeMessage.join('; ');
            }
            if (typeof maybeMessage === 'string') {
                return maybeMessage;
            }
        }
        return exception.message;
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
