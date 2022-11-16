"use strict";
// 布尔值：
let bool = false;
// 字符串：
let name01 = "bob";
// 还可以使用模版字符串，它可以定义多行文本和内嵌表达式。 这种字符串是被反引号包围（ `），并且以${ expr }这种形式嵌入表达式
let name02 = `Gene`;
let age = 37;
let sentence = `Hello, my name is ${name02}.I'll be ${age + 1} years old next month.`;
// 数组：
// 有两种方式可以定义数组
// 第一种：可以在元素类型后面接上[]
let list01 = [1, 2, 3];
// 第二种：使用数组泛型，Array<元素类型>
let list02 = [1, 2, 3];
// 元组：
// 元组类型允许表示一个一直元素数量和类型的数组，个元素的类型不必相同
let x;
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly：初始化不正确
// x = [10, 'hello']; // Error
// 当访问一个已知索引的元素，会得到正确的类型：
console.log(x[0].substr(1)); // OK
// console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
// 当访问一个越界的元素，会使用联合类型替代：
// x[3] = 'world'; // OK, 字符串可以赋值给(string | number)类型
// console.log(x[5].toString()); // OK, 'string' 和 'number' 都有 toString
// x[6] = true; // Error, 布尔不是(string | number)类型*
// 枚举（enum）
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
let c = Color.Green;
// any
// 为那些在编程阶段还不清楚类型的变量指定一个类型
let notSure = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
// Object类型的变量只是允许你给它赋任意值 - 但是却不能够在它上面调用任意的方法，即便它真的有这些方法
let notSure02 = 4;
notSure02.ifItExists(); // okay, ifItExists might exist at runtime
notSure02.toFixed(); // okay, toFixed exists (but the   compiler doesn't check)
let prettySure = 4;
//  prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
// 只知道一部分数据的类型时，any类型也是有用的
let list = [1, true, "free"];
list[1] = 100;
// null 和undefined
// let u: undefined = undefined;
// let n: null = null;
// 可以把 null和undefined赋值给number类型的变量，当你指定了–strictNullChecks标记，null和undefined只能赋值给void和它们各自。 这能避免 很多常见的问题。 也许在某处你想传入一个 string或null或undefined，你可以使用联合类型string | null | undefined
// void
// 与any类型相反，表示没有类型
// 当一个函数没有返回值时，你通常会见到其返回值类型是 void
function warnUser() {
    console.log("This is my warning message");
}
create({ prop: 0 }); // OK
create(null); // OK 
//  create(42); // Error
//  create("string"); // Error
//  create(false); // Error
//  create(undefined); // Error
let fun01 = (n1, n2) => n1 * n2;
fun01(1, 3);
