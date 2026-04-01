# TypeScript 学习笔记

## Day 1 — 类型系统基础

### 概念
- **基本类型**：
- **可选属性 `?`**：
- **联合类型 `|`**：
- **type 别名**：

### 对照项目代码
> 文件：`src/common/dto/api-response.ts`
> ```typescript
> export interface ApiResponse<T = unknown> {
>   code: number;
>   message: string;
>   data: T;
> }
> ```
> 我的理解：

> 文件：`src/modules/data-asset/data-asset.service.ts`
> ```typescript
> type GetDataAssetListQuery = {
>   siteId?: string;
>   sceneId?: string;
>   page?: string;
> };
> ```
> 我的理解：

### 容易搞混的点
-

### 不理解的地方
-

### Q&A 记录

#### 目录

**基础类型与语法**
1. 为什么 delete/新增属性会报错
2. C++ → TS 类型名对照
3. let / var / const 区别
4. 模板字符串
5. 箭头函数
6. 包装对象 + new 关键字

**特殊类型**
7. unknown 类型（赋值 + 收窄）
8. never 类型（用途 + 赋值）
9. bigint / symbol / object

**编译与运行**
10. TS vs JS 区别 + 编译流程 + tsx

**异常处理**
11. throw 异常 + 异常接收

---

**Q：为什么 `delete y.foo` 和 `y.bar = 2` 会报错？**
```typescript
let y = { foo: 1 };
delete y.foo; // 报错
y.bar = 2;    // 报错
```
**A：** TS 自动推断 `y` 的类型为 `{ foo: number }`，意思是必须有 `foo`、不能有其他属性。
- `delete y.foo` → foo 是必须存在的，删了就不符合类型
- `y.bar = 2` → 类型里没定义 bar，不能随便加

**类比 C++：** 和 struct 一样，不能给 struct 实例突然加/删成员。

**如果想允许加删：**
```typescript
// 方法1：可选属性
let y: { foo?: number; bar?: number } = { foo: 1 };

// 方法2：索引签名（允许任意属性）
let y: { [key: string]: number } = { foo: 1 };
```

---

**Q：TS 和 JS 的区别？编译流程？tsx/ts-node 会生成 .js 吗？**

**A：**
- **JS 是动态类型**：运行时才发现类型错误
- **TS 是静态类型**：写代码时（编译期）就报错

**编译流程：**
```
.ts 文件  →  tsc 编译器  →  .js 文件  →  Node.js 运行
```
TS 不能直接运行，必须先编译成 JS，类型信息编译后全部丢掉。

**类比 C++：**
```
C++:   .cpp  →  g++ 编译  →  二进制可执行文件
TS:    .ts   →  tsc 编译  →  .js 文件
```

**tsx / ts-node 会生成 .js 吗？** 不会。内存编译，直接运行，不落盘。只有 `tsc` 才生成 `dist/*.js`。
- 开发时 `npm run start:dev`（tsx watch）→ 不生成文件，快
- 部署时 `npm run build`（tsc）→ 生成 dist/*.js，再 `node dist/main.js` 运行

---

**Q：let / var / const 的区别？**

- `var` — 函数级作用域（变量会泄漏出 `{}`，别用）
- `let` — 块级作用域（和 C++ 局部变量一样，出了 `{}` 就没了）
- `const` — 块级作用域，且不能重新赋值

```typescript
if (true) {
  var a = 1;   // 泄漏到整个函数
  let b = 2;   // 只在 {} 里有效
  const c = 3; // 只在 {} 里有效，且不能改
}
console.log(a); // ✅ 1
console.log(b); // ❌ 报错
console.log(c); // ❌ 报错
```

**const 对对象：** 变量本身不能改，但属性可以改（类似 C++ 的 `int* const p`）

**结论：** 现代 TS/JS 只用 `let` 和 `const`，不用 `var`。

---

**Q：C++ → TS 类型名对照**

```
C++        →  TypeScript
int/float  →  number（不区分整数和浮点）
bool       →  boolean
char*      →  string
void*      →  any（尽量别用）
```

---

**Q：unknown 类型（赋值规则 + 类型收窄）**

| C++ | TypeScript | 含义 |
|-----|-----------|------|
| `std::variant<int,string>` | `number \| string` | 已知的几种类型之一 |
| `void*`（不安全） | `any` | 啥都行，不检查 |
| `void*`（强制 cast） | `unknown` | 啥都行，但必须检查后才能用 |

**赋值规则：**
```typescript
let a: unknown = 123;     // ✅ 任何值都能赋给 unknown
let b: number = a;        // ❌ unknown 不能赋给其他类型
let c: unknown = a;       // ✅ unknown → unknown 可以
let d: any = a;           // ✅ unknown → any 可以
```

**使用前必须类型收窄（type narrowing）：**
```typescript
let x: unknown = "hello";
x.toUpperCase();           // ❌ 不能直接用
if (typeof x === "string") {
  x.toUpperCase();         // ✅ 收窄后 TS 知道 x 是 string
}
```

**any / unknown / never 对比：**

| 类型 | 能赋什么值给它 | 它能赋给谁 | 能直接用吗 | 用途 |
|------|--------------|----------|----------|------|
| `any` | 任何值 | 任何类型 | ✅ 能 | 关闭类型检查（尽量别用） |
| `unknown` | 任何值 | 只能赋给 `unknown`/`any` | ❌ 必须收窄 | 安全的"不知道类型" |
| `never` | 没有值能赋给它 | 任何类型 | ❌ 不可能有值 | 不可能发生 / 穷举检查 |

---

**Q：never 类型（用途 + 赋值规则）**

| C++ | TypeScript | 含义 |
|-----|-----------|------|
| `nullptr` / `NULL` | `null` | 空值 |
| `[[noreturn]]` | `never` | 永远不会返回 / 不可能发生 |

**用在哪：**
```typescript
// 1. 函数永远不会正常返回
function throwError(msg: string): never {
  throw new Error(msg);
}

// 2. 穷举检查（编译时确保处理了所有分支）
type Status = "pending" | "success" | "failed";
function handleStatus(s: Status) {
  if (s === "pending") { ... }
  else if (s === "success") { ... }
  else if (s === "failed") { ... }
  else {
    const check: never = s; // ✅ 所有情况都处理了，s 是 never
  }
}
```

**赋值规则：** `never` 可以赋给任何类型，但没有任何值能赋给 `never`。

**注意：** `let n: never; y = n;` 报错的是"变量未赋值就使用"，不是类型不兼容。
因为 never 类型的变量根本没法赋值，`let n: never` 这种写法没有实际意义。
never 只出现在函数返回值和类型运算结果中。

**穷举检查的三种场景：**

1. **所有分支都要处理** → 用 `never` 检查
```typescript
type Status = "pending" | "success" | "failed";
function handle(s: Status) {
  if (s === "pending") { ... }
  else if (s === "success") { ... }
  else if (s === "failed") { ... }
  else { const check: never = s; } // 确保没漏
}
```

2. **某些分支不需要处理** → 明确标注
```typescript
type Status = "pending" | "success" | "failed" | "cancelled";
function handle(s: Status) {
  if (s === "pending") { ... }
  else if (s === "success") { ... }
  else {
    // "failed" 和 "cancelled" 不处理，明确写出来
    const _exhaustive: "failed" | "cancelled" = s;
    // 以后加新状态时，这里会编译报错提醒
  }
}
```

3. **只处理部分，其他忽略** → 不用检查
```typescript
function handle(s: Status) {
  if (s === "pending") { ... }
  // 其他状态不管
}
```

**什么时候用 never 检查？**
- **用：** 必须处理所有情况时（状态机、路由分发、消息处理）
- **不用：** 只关心部分情况时（只处理错误状态，成功状态不管）

**类比 C++：** 类似 `switch` 加 `-Wswitch` 警告，但 TS 的 `never` 检查更严格，直接编译报错。

---

**Q：throw 异常 + 异常在哪里接收？**

**什么时候用：** 参数校验失败、找不到数据、不应该走到的分支。

**项目用法**（`data-asset.service.ts`）：
```typescript
if (!source) throw new NotFoundException('data asset not found');
if (source.dataType !== 'RAW') throw new BadRequestException('only raw data can generate point cloud');
```

**异常流转：**
```
Service 抛异常 → NestJS 拦截 → AllExceptionsFilter 格式化 → JSON 返回前端
```
1. `main.ts` 注册：`app.useGlobalFilters(new AllExceptionsFilter())`
2. `all-exceptions.filter.ts` 统一处理，返回 `{ code, message, data }`
3. Service 里只管 throw，不用自己 try/catch

---

**Q：模板字符串 `` `${x} world` ``**

字符串拼接语法糖，**反引号** `` ` `` 包裹（键盘 ESC 下面），`${}` 里放变量或表达式。
```typescript
const name = "Hannah";
const msg = `我叫 ${name}，今年 ${10 + 15} 岁`; // 输出：我叫 Hannah，今年 25 岁
```

**注意：反引号 ≠ 单引号**
```typescript
const msg = `我叫 ${name}`;  // ✅ 反引号，会解析变量
const msg = '我叫 ${name}';  // ❌ 单引号，输出字面量 '我叫 ${name}'
```

类比 Qt：`QString("我叫 %1").arg(name)`
项目中：`` `${source.dataName} 点云生成任务` ``

---

**Q：bigint / symbol / object 类型**

| 类型 | 含义 | 项目里用到 | C++ 类比 |
|------|------|-----------|---------|
| `bigint` | 任意精度整数（数字后加 `n`） | ❌ | `__int128` / 大数类 |
| `symbol` | 全局唯一标识符 | ❌ | `QUuid` |
| `object` | 非原始类型 | 很少直接用 | `QObject*` |

```typescript
const x: bigint = 123n;
const s = Symbol("id");
let obj: object = { name: "test" };
```

**这三个了解就行，项目里几乎不用。**

---

**Q：箭头函数 `(n: number) => n + 1`**

匿名函数的简写语法，等价于 C++ lambda。

```typescript
// 箭头函数
(n: number) => n + 1

// 等价于传统函数
function(n: number): number {
  return n + 1;
}
```

**类比 C++：**
```cpp
[](int n) { return n + 1; }  // C++ lambda
(n: number) => n + 1         // TS 箭头函数
```

**项目用法**（`data-asset.service.ts`）：
```typescript
list.map((item) => ({
  id: item.id,
  dataName: item.dataName,
  // ...
}))
```

**数组 map 方法：** 遍历数组，对每个元素执行函数，返回新数组。
```typescript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];
const names = users.map((user) => user.name); // ["Alice", "Bob"]
```

---

**Q：包装对象 + `new` 关键字**

**`new` 是什么？** 和 C++ 一样，创建类的实例：
```typescript
// TS/JS
const obj = new Error("boom");
const date = new Date();

// C++
auto obj = new std::runtime_error("boom");
auto date = new QDateTime();
```

**区别：** TS/JS 的 `new` 不需要手动 delete，有垃圾回收（GC）自动释放。

**包装对象：** JS 历史包袱，原始类型和包装对象是两个东西：
```typescript
const s1: string = "hello";         // ✅ 原始类型（用这个）
const s2: String = new String("hello"); // ❌ 包装对象（别用）
typeof s1;  // "string"
typeof s2;  // "object"
```

**结论：永远用小写原始类型，别用大写包装对象。**
```
✅ string / number / boolean
❌ String / Number / Boolean
```

**项目中的 new：**
```typescript
// main.ts
new FastifyAdapter({ ... })    // 创建 HTTP 适配器
new AllExceptionsFilter()       // 创建异常过滤器
// service 里
new NotFoundException("...")    // 创建异常对象
```

---

## 复习记录

### 2026-03-30 复习

**复习题 1-3：**
- ✅ unknown 类型收窄
- ✅ 对象属性删除/新增报错原因
- ❌ never 穷举检查（混淆了运行时 vs 编译时）

**复习题 4-6：**
- ✅ any vs unknown 使用区别
- ⚠️ 模板字符串符号（记成单引号，应该是反引号）
- ❌ 数组 map 方法不熟悉

**薄弱点：**
1. never 穷举检查的工作原理（已补充详细说明）
2. 模板字符串反引号 vs 单引号
3. 数组 map 方法（遍历 + 变换 + 返回新数组）

**复习题 7-9：**
- ✅ 联合类型需要收窄才能调用特定方法
- ✅ any 可以赋给任何类型，unknown 只能赋给 unknown/any
- ⚠️ 对象属性删除/新增的解决方案（理解对了，但改法用了 any，应优先用可选属性或索引签名）

**新发现的薄弱点：**
1. 可选属性 `?` 的用法（属性可以有也可以没有）
2. 索引签名 `[key: string]: any` 的用法（允许任意属性）
3. 三种方案的选择优先级：可选属性 > 索引签名 > any

**复习题 10-12（可选属性 & 索引签名）：**
- ❌ 可选属性可以赋值 `undefined`（以为会报错）
- ❌ 索引签名限制了值的类型（以为 boolean 可以）
- ✅ 索引签名的基本用法

**关键点补充：**
1. 可选属性 `age?: number` 等价于 `age: number | undefined`
2. 索引签名 `[key: string]: T` 会限制所有属性（包括明确定义的）的值类型必须符合 `T`
3. 索引签名类型要包含所有明确定义的属性类型

**复习题 13-15（联合类型 & type vs interface & 字面量类型）：**
- ✅ 联合类型只允许声明的值（`"cancelled"` 不在 `Status` 里，报错）
- ⚠️ type vs interface 区别（方向对但太笼统，需记住具体差异）
- ✅ 字面量类型只能赋同一个值（`"hello"` 不能改成 `"world"`）

**type vs interface 核心区别：**

| | `type` | `interface` |
|---|---|---|
| 能定义什么 | 任何类型：联合、交叉、基本类型别名、元组 | 只能定义对象形状和函数签名 |
| 扩展方式 | `&` 交叉类型 | `extends` 继承 |
| 声明合并 | ❌ 不支持（同名报错） | ✅ 同名自动合并 |
| 冲突处理 | `&` 会合并为 `never` | `extends` 直接编译报错 |

**经验法则：**
- 描述对象/类的结构 → `interface`（DTO、Service 接口）
- 联合类型、工具类型、非对象类型 → `type`

```typescript
// 适合用 type
type TaskStatus = "pending" | "running" | "done";

// 适合用 interface
interface CreateTaskDto {
  name: string;
  config: Record<string, unknown>;
}
```

---

## Day 4 — 项目架构走读（2026-03-31）

### 项目整体结构

```
Qt 项目                    NestJS 项目
─────────                 ──────────
main.cpp                  main.ts          ← 启动入口
QApplication              NestFactory      ← 创建应用
*.pro / CMakeLists        package.json     ← 构建配置 + 依赖管理
MOC 编译                  tsc 编译         ← 元信息处理
信号槽机制                依赖注入(DI)     ← 组件间通信
```

```
src/
├── main.ts                          ← 启动入口（创建应用、配置 HTTPS、监听端口）
├── app.module.ts                    ← 根模块（注册所有子模块）
├── common/
│   ├── dto/api-response.ts          ← 统一返回格式 { code, message, data }
│   ├── filters/all-exceptions.filter.ts ← 全局异常捕获
│   └── utils/api-format.ts          ← 工具函数（枚举转换、参数解析）
├── modules/
│   ├── data-asset/                  ← 数据资产（核心业务）
│   │   ├── data-asset.module.ts
│   │   ├── data-asset.controller.ts
│   │   └── data-asset.service.ts
│   ├── process-task/                ← 处理任务
│   └── dashboard/                   ← 总览
└── prisma/
    ├── prisma.module.ts             ← 数据库模块（@Global 全局可用）
    ├── prisma.service.ts            ← 数据库服务（继承 PrismaClient）
    └── prisma-client-options.ts     ← 数据库连接配置
```

### main.ts 入口（类比 main.cpp）

```
Qt main.cpp:                        NestJS main.ts:
1. QApplication app(argc, argv)     1. 读环境变量 + HTTPS 证书
2. MainWindow w                     2. NestFactory.create(AppModule)
3. w.show()                         3. 注册全局规则（路由前缀、异常过滤器）
4. app.exec()                       4. app.listen(port)
```

关键代码：
```typescript
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,              // 根模块，定义整个应用的模块组成
  new FastifyAdapter()    // HTTP 引擎（类比 Qt 选 QWidget 还是 QML）
);
app.setGlobalPrefix('api/v1');                    // 所有接口加前缀
app.useGlobalFilters(new AllExceptionsFilter());  // 全局异常捕获
await app.listen(8443, '0.0.0.0');                // 开始监听
```

### NestJS 三件套：Module → Controller → Service

每个业务模块由三个文件组成：

```
文件                   角色                 Qt 类比
────                  ────                 ──────
*.module.ts           模块注册              qmldir / 组件注册
*.controller.ts       路由处理（接收请求）    信号槽绑定
*.service.ts          业务逻辑              业务处理函数
```

### 请求完整链路

```
浏览器 GET /api/v1/data-assets?siteId=1&page=2
  │
  ▼ Fastify HTTPS 服务器收到请求
  │ 剥掉 /api/v1 前缀 → /data-assets
  ▼
  │ @Controller('data-assets') + @Get() 匹配
  │ @Query 提取参数：siteId="1", page="2"
  ▼
  │ Controller 调用 Service.getList()
  │  → 参数转换 string → number
  │  → 构造 where 条件
  │  → Prisma 查数据库（findMany + count 并行）
  │  → map 格式化输出
  ▼
  │ ok(data) 包装 → { code: 0, message: "ok", data: {...} }
  ▼
  JSON 返回浏览器

异常时：Service throw → AllExceptionsFilter 捕获 → 统一错误格式返回
```

### 装饰器 @ — 类比 Qt 的 Q_OBJECT 宏

```typescript
@Controller('data-asset')     // "这个类处理 /data-asset 路由"
@Get()                        // "这个方法处理 GET 请求"
@Query('siteId')              // "从 URL 参数取 siteId"
@Param('id')                  // "从路径参数取 id"
@Post(':id/generate')         // "这个方法处理 POST /data-asset/:id/generate"
@Injectable()                 // "这个类可以被依赖注入"
@Module({...})                // "这是一个模块，包含这些 controller 和 service"
@Global()                     // "这个模块全局可用"
```

### 依赖注入（DI）

**核心思想：** 你声明"我需要什么"（constructor 参数），框架负责"给你什么"（自动创建和传入）。永远不 new 别人的服务。

```typescript
// ❌ 手动创建
class Controller {
  constructor() {
    const prisma = new PrismaService();
    this.service = new DataAssetService(prisma);
  }
}

// ✅ 依赖注入
class Controller {
  constructor(private readonly service: DataAssetService) {}
  // 框架自动创建 DataAssetService 并传入
}
```

**装配过程（NestFactory.create 时）：**
```
1. 扫描 AppModule 的 imports
2. PrismaModule → new PrismaService()（单例，全局共享）
3. DataAssetModule → new DataAssetService(prismaService) ← 自动注入
4. DataAssetController → new DataAssetController(service) ← 自动注入
```

**三个好处：**
- **解耦**：Controller 不关心 Service 怎么创建
- **单例共享**：一个 PrismaService 全项目复用
- **易替换**：测试时可以换成 Mock

**Qt 类比：**
```
@Injectable()              →  Q_OBJECT
@Module({ providers })     →  qmlRegisterType
constructor(service)       →  parent->findChild<T>()
```

### Prisma 数据库层

**角色：** ORM（对象关系映射），类比 Qt 的 QSqlTableModel，但自动生成类型安全的查询代码。

**工作流程：**
```
1. schema.prisma 定义表结构（类比手写 CREATE TABLE）
2. prisma migrate 生成 SQL 并建表
3. Prisma 自动生成 TypeScript 客户端代码
4. Service 里调用，有完整类型提示
```

**Schema 语法对照 C++：**
```
Prisma                    C++ 类比
─────                    ──────
model Site { }           struct Site { }
Int                      int
String                   std::string
String?                  std::optional<string>
@id                      PRIMARY KEY
@default(autoincrement)  AUTOINCREMENT
@unique                  UNIQUE
@relation                外键 JOIN
@@index                  CREATE INDEX
```

**表关系：**
```
Site (工地)
 └── 1:N ── Scene (场景)
              ├── 1:N ── DataAsset (数据资产，自引用：源→衍生）
              ├── 1:N ── ProcessTask (处理任务)
              └── 1:N ── OperationLog (操作日志)
```

**查询对照 Qt SQL：**
```typescript
// Prisma（类型安全，自动补全）
const list = await this.prisma.dataAsset.findMany({
  where: { siteId: 1 },
  include: { site: true, scene: true },  // 自动 JOIN
  orderBy: { createdAt: 'desc' },
  skip: 20, take: 20,
});
list[0].site.siteName  // 直接访问关联数据

// Qt SQL（手写字符串，运行时才知道错没错）
QSqlQuery q("SELECT da.*, s.siteName FROM DataAsset da "
            "JOIN Site s ON da.siteId = s.id WHERE da.siteId = ?");
q.bindValue(0, 1);
```

**常用方法速查：**
```
findMany   → SELECT ... WHERE    （查列表）
findUnique → SELECT ... WHERE id=（查单条）
create     → INSERT INTO         （新建）
update     → UPDATE ... SET      （更新）
count      → SELECT COUNT(*)     （统计）
$transaction → BEGIN/COMMIT/ROLLBACK（事务）
```

### 事务（$transaction）

**作用：** 多个数据库操作要么全部成功，要么全部回滚。

**项目实例 generatePointCloud —— 5 步必须原子执行：**
```
$transaction 开始
  1. create ProcessTask         → task.id
  2. create DataAsset(点云)     → target.id（用了步骤1的结果）
  3. update ProcessTask         → 补上 targetDataId
  4. update DataAsset(源)       → 标记 currentTaskId
  5. create OperationLog        → 写操作记录
全部成功 → COMMIT    任一失败 → ROLLBACK
```

**语法：**
```typescript
const result = await this.prisma.$transaction(async (tx) => {
  // tx 是事务专用客户端，事务内必须用 tx 不能用 this.prisma
  const task = await tx.processTask.create({ data: {...} });
  const target = await tx.dataAsset.create({ data: { currentTaskId: task.id } });
  // ...
  return { taskId: task.id, targetDataId: target.id };
});
// 正常返回 → 自动 commit
// 抛异常 → 自动 rollback
```

**设计原则：** 参数校验放事务外面，能提前报错就不进事务。

**Qt 类比：**
```cpp
db.transaction();
bool ok = query1.exec() && query2.exec() && query3.exec();
ok ? db.commit() : db.rollback();
// Prisma 不用手动 commit/rollback，更简洁
```

**`??` 空值合并运算符：**
```typescript
source.operatorId ?? 'system'
// 等价于 C++: value.value_or("system")
// 如果左边是 null/undefined，用右边的默认值
```
