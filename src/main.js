import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

// vue.use 的作用：
// 他就是把你给他的东西调用一遍
// 如果你给他的是一个方法，那么他会直接执行这个方法
// 如果你给他的东西里面有一个install属性，那么他会执行这个install


var test = {
  test_a:1
}
setTimeout(function(){
  test.test_a = 333;
},2000)

function a () {
  console.log(1);
}
a.install = function (vue) {
  // vue插件开发的一些api
  console.log(vue.util)
  // vue.util.extend 与 vue.extend的区别？
  // vue.util.extend 拷贝的作用




  // vue.util.warn 抛出vue内部的警告
  // 通过util.defineReactive来监听第三方对象的变量
  // defineReactive可以监听到test的改变（独立于vue外的）
  vue.util.defineReactive(test, "test_a");

  // mixin的核心功能在于生命周期的注入
  vue.mixin({
    methods:{},

    // 为什么在beforeCreate中注入？？？
    // 因为created阶段data已经生成,在未生成前注入才有效
    beforeCreate: function() {
      this.test = test;
    },
    created:function () {
      // console.log(this) //对应的组件的this
    }
  })

}
Vue.use(a);

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
