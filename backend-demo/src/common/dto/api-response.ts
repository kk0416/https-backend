// ApiResponse 定义了整个项目统一返回给前端的 JSON 结构。
// 统一结构的好处是：
// 1. 前端不用猜每个接口返回格式
// 2. 联调时更稳定
// 3. 错误处理和成功处理都更容易规范化
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// ok() 是成功响应的统一包装函数。
// controller 只需要把真正业务数据传进来即可。
export function ok<T>(data: T, message = 'ok'): ApiResponse<T> {
  return {
    code: 0,
    message,
    data,
  };
}
