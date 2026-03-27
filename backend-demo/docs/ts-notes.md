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

// 2. 穷举检查
type Shape = "circle" | "square";
function area(s: Shape) {
  if (s === "circle") { ... }
  else if (s === "square") { ... }
  else { const check: never = s; } // 漏了情况就编译报错
}
```

**赋值规则：** `never` 可以赋给任何类型，但没有任何值能赋给 `never`。

**注意：** `let n: never; y = n;` 报错的是"变量未赋值就使用"，不是类型不兼容。
因为 never 类型的变量根本没法赋值，`let n: never` 这种写法没有实际意义。
never 只出现在函数返回值和类型运算结果中。

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

字符串拼接语法糖，反引号包裹，`${}` 里放变量或表达式。
```typescript
const name = "Hannah";
const msg = `我叫 ${name}，今年 ${10 + 15} 岁`;
```
类比 Qt：`QString("我叫 %1").arg(name)`
项目中：`` `${source.dataName} 点云生成任务` ``
注意：反引号 `` ` `` 在键盘 ESC 下面，不是单引号 `'`。

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
