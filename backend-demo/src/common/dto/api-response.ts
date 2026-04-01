// ApiResponse 定义了整个项目统一返回给前端的 JSON 结构。
import { Logger } from '@nestjs/common';
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}
const apiResponseLogger = new Logger('ApiResponse');

// ok() 是成功响应的统一包装函数。
// controller 只需要把真正业务数据传进来即可。
export function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  apiResponseLogger.debug(`Success response: ${message}`);
  return {
    code: 0,
    message,
    data,
  };
}
