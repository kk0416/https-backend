"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
// ok() 是成功响应的统一包装函数。
// controller 只需要把真正业务数据传进来即可。
function ok(data, message = 'ok') {
    return {
        code: 0,
        message,
        data,
    };
}
