const state = {
  //urlGlobal: "https://api.panelnuevo.quierosushi.cl/api", //PRO
  //urlGlobal: "http://127.0.0.1:8000/api",                 //LOCAL
  //urlGlobal: "http://190.77.145.42:5000/api/public/api",  // ANY PUBLIC IP
  urlGlobal: "https://dev.api.panelnuevo.quierosushi.cl/api", // DEV

  routes: [
    {
      name: "login",
      link: "/login"
    },
    {
      name: "orders",
      link: "/pedidos/{userId}"
    },
    {
      name: "order.confirm",
      link: "/pedidos/confirm"
    },
    {
      name: "order.cancel",
      link: "/pedidos/cancel"
    },
    {
      name: "order.done",
      link: "/pedidos/done"
    },
    {
      name: "resource.coupons",
      link: "/cupones/{localId}"
    },
    {
      name: "coupon.change.status",
      link: "/cupones/change"
    },
    {
      name: "services.prices",
      link: "/servicios/prices"
    },
    {
      name: "locals.update",
      link: "/locales/update/{localId}"
    },
    {
      name: "locals.get",
      link: "/locales/get"
    },
    {
      name: "get.url.pay",
      link: "/servicios/pay"
    },
    {
      name: "refresh.token",
      link: "/refresh"
    },
    {
      name: "resource.local",
      link: "/locals/{localId}"
    },
    {
      name: "get.zones",
      link: "/zonas"
    },
    {
      name: "coupon.stand.out",
      link: "/goUpHigh"
    },
    {
      name: "coupon.go.up",
      link: "/goUpCoupon"
    },
    {
      name: "change.password",
      link: "/usuarios/{userId}"
    },
  ]
};
const mutations = {};
const actions = {};
const getters = {
  getRoutes: state => {
    return state.routes;
  },
  getRoute: state => (name, params) => {
    let route = state.routes.find(route => route.name === name);
    if (params != undefined) {
      var routeFormmater = "";
      var count = 0;
      for (var key in params) {
        if (count == 0) {
          routeFormmater = route.link.replace("{" + key + "}", params[key]);
        } else {
          routeFormmater = routeFormmater.replace("{" + key + "}", params[key]);
        }
        count++;
      }

      return state.urlGlobal + routeFormmater;
    }
    return state.urlGlobal + route.link;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
