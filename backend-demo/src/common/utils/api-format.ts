export function toApiEnum(value: string): string {
  // Prisma 里的枚举是大写形式，例如 POINT_CLOUD。
  // API 返回给前端时，统一转成小写下划线形式，例如 point_cloud。
  return value.toLowerCase();
}

export function toPrismaEnum(value?: string): string | undefined {
  // 前端 URL 参数通常传的是小写值，例如 raw / processing。
  // 这里把它们转成 Prisma 使用的大写形式。
  if (!value) {
    return undefined;
  }

  return value.trim().toUpperCase();
}

export function toPositiveInt(value: string | undefined, fallback: number): number {
  // URL 查询参数都是字符串，这里统一做安全转换。
  // 如果值无效，则退回默认值 fallback。
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}
