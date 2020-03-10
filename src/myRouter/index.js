class HistoryRoute {
  constructor() {
    this.current = null;
  }
}

class vueRouter {
  constructor (options) {//options 表示route传过来的路由数组
    this.mode = options.mode || 'hash'
    this.routes = options.routes || []
    this.history = new HistoryRoute;
    this.routesMap = this.createMap(this.routes);
    this.init();
  }
  init () {
    // 监视current变量
    if(this.mode=='hash') {
      location.hash?'':location.hash='/';
      window.addEventListener("load", ()=>{
        this.history.current = location.hash.slice(1); //去掉 # 号
      })
      window.addEventListener("hashchange",()=> {
        this.history.current = location.hash.slice(1);
      })
    } else {
      location.pathname ? '' : location.pathname = '/';
      window.addEventListener("load", () => {
        this.history.current = location.pathname
      })
      window.addEventListener("onpopstate", () => {
        this.history.current = location.pathname
      })
    }
  }
  createMap(routes) {
    // 将path: '/',变成 '/'：path 方便查找
    return routes.reduce((memo,current)=>{
      memo[current.path] = current.component
      return memo;
    },{});

  }
}
vueRouter.install = function(Vue){
  Vue.mixin({
    beforeCreate(){
      if(this.$options&&this.$options.router){
        this._root = this;
        this._router = this.$options.router;
        Vue.util.defineReactive(this, 'current', this._router.history)
      } else {
        this._root = this.$parent._root;
      }
      // 设置this.$router只允许取值，不允许修改（只读不可写入）
      Object.defineProperty(this, '$router', {
        get () {
          return this._root._router;
        }
      })
     
    }
  })
  // 注册一个router-view组件
  Vue.component('router-view',{
    render(h){
      let current = this._self._root._router.history.current;
      console.log(current);
      let routesMap = this._self._root._router.routesMap;
      console.log(routesMap);
      return h(routesMap[current])
    }
  })
}
export default vueRouter