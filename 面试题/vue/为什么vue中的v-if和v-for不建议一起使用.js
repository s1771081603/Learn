/**一、作用
 * v-if 指令用于条件性地渲染一块内容。这块内容只会在指令的表达式返回 true 值的时候被渲染。
 * v-for 指令基于一个数组来渲染一个列表，v-for 指令需要使用 item in items 形式的特殊语法，其中 items 是源数据数组
 * 或者对象，而 item 则是被迭代的数组元素的别名。
 * 在 v-for 的时候，建议设置 key 值，并且保证每个 key 值是独一无二的，这便于 diff 算法进行优化。
 *
 * 而两者在用法上
 *  <Model v-if="isShow" />
 *  <li v-for="item in items" :key="item.id">
 *      {{ item.label }}
 *  </li>
 * */

/**二、优先级
 * v-if 与 v-for 都是 vue 模板系统中的指令。
 * 在 vue 模板编译的时候，会将指令系统转换成可执行的 render 函数。
 * 在进行 if 判断的时候，v-for 是比 v-if 先进行判断。
 * 得出结论：v-for 优先级比 v-if 高。
 * */
// 错误案例
// <div id="app">
//     <p v-if="isShow" v-for="item in items">
//         {{ item.title }}
//     </p>
// </div>
// 正确做法
// <div id="app">
//     <template v-if="isShow">
//         <p v-for="item in items">{{item.title}}</p>
//     </template>
// </div>

/**三、注意事项
 * 1.永远不要把 v-if 和 v-for同时用在一个元素上，带来的性能方面的浪费（每次渲染都会先循环再进行条件判断）。
 * 2.如果避免出现这种情况，则在外层嵌套 template（页面渲染不生成 dom 节点），在这一层进行 v-if 判断，然后在内部进行 v-for 循环。
 * <template v-if="isShow">
 *     <p v-for="item in items">
 * </template>
 * 3.如果条件出现在循环内部，可通过计算属性computed提前过滤掉那些不需要显示的项。
 * computed: {
 *     items: function() {
 *       return this.list.filter(function (item) {
 *         return item.isShow
 *       })
 *     }
 * }
 * */