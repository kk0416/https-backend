"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrismaClientOptions = createPrismaClientOptions;
require("dotenv/config");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
function createPrismaClientOptions() {
    // 这里从 .env 中读取 SQLite 数据库地址。
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not set');
    }
    // Prisma 7 在运行时不再默认从 schema 里读取 datasource url，
    // 而是要求显式传入 adapter。
    // 这里统一创建 SQLite adapter，供 Nest 服务和 seed 脚本共用。
    return {
        adapter: new adapter_better_sqlite3_1.PrismaBetterSqlite3({
            url: databaseUrl,
        }),
    };
}
