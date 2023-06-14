/**一、Key是什么
 * 当我们在使用 v-for 时，需要给单元加上 key
 * <ul>
 *     <li v-for="item in items" :key="item.id">...</li>
 * </ul>
 * 用 +new Date() 生成的时间戳作为 key，手动强制触发重新渲染。
 * <Comp :key="+new Date()" />
 *
 * 那么这背后的逻辑是什么，key的作用又是什么？
 * key 是给每一个 vnode 的唯一id，也是 diff 的一种优化策略，可以根据 key，更准确， 更快的找到对应的 vnode 节点。
 *
 * 场景背后的逻辑
 * 当我们在使用 v-for 时，需要给单元加上 key
 *      1.如果不用 key，Vue 会采用就地复地原则：最小化 element 的移动，
 *      并且会尝试尽最大程度在同适当的地方对相同类型的 element ，做 patch 或者 reuse。
 *      2.如果使用了 key，Vue 会根据 keys 的顺序记录 element，
 *      曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed。
 *
 * 用 +new Date() 生成的时间戳作为 key，手动强制触发重新渲染
 *      1.当拥有新值的 rerender 作为 key 时，拥有了新 key 的 Comp 出现了，
 *      那么旧 key Comp 会被移除，新 key Comp 触发渲染。
 * */

/**二、设置 key 与不设置 key 区别
 * 举个例子：
 * 创建一个实例，2秒后往 items 数组插入数据
 * <body>
 *   <div id="demo">
 *     <p v-for="item in items" :key="item">{{item}}</p>
 *   </div>
 *   <script src="../../dist/vue.js"></script>
 *   <script>
 *     // 创建实例
 *     const app = new Vue({
 *       el: '#demo',
 *       data: { items: ['a', 'b', 'c', 'd', 'e'] },
 *       mounted () {
 *         setTimeout(() => {
 *           this.items.splice(2, 0, 'f')  //
 *        }, 2000);
 *      },
 *    });
 *   </script>
 * </body>
 * 在不使用 key 的情况，vue 会进行这样的操作：
 * 分析下整体流程：
 * 比较A，A，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较B，B，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较C，F，相同类型的节点，进行patch，数据不同，发生dom操作
 * 比较D，C，相同类型的节点，进行patch，数据不同，发生dom操作
 * 比较E，D，相同类型的节点，进行patch，数据不同，发生dom操作
 * 循环结束，将E插入到DOM中
 * 一共发生了3次更新，1次插入操作
 *
 * 在使用 key 的情况：vue 会进行这样的操作：
 * 比较A，A，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较B，B，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较C，F，不相同类型的节点
 * 比较E、E，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较D、D，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 比较C、C，相同类型的节点，进行patch，但数据相同，不发生dom操作
 * 循环结束，将F插入到C之前
 * 一共发生了0次更新，1次插入操作
 * 通过上面两个小例子，可见设置 key 能够大大减少对页面的 DOM 操作，提高了 diff 效率
 *
 * 设置key值一定能提高diff效率吗？
 * 其实不然，文档中也明确表示
 * 当 Vue.js 用 v-for 正在更新已渲染过的元素列表时，它默认用“就地复用”策略。
 * 如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，
 * 而是简单复用此处每个元素，并且确保它在特定索引下显示已被渲染过的每个元素
 *
 * 这个默认的模式是高效的，但是只适用于不依赖子组件状态或临时 DOM 状态 (例如：表单输入值) 的列表渲染输出
 * 建议尽可能在使用 v-for 时提供 key，除非遍历输出的 DOM 内容非常简单，或者是刻意依赖默认行为以获取性能上的提升
 * */