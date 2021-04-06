const state = {
  urlGlobal: "http://190.77.145.229:5000/api/public/api",
  routes: [
    {
      name: "login",
      link: "/login"
    },
    {
      name: "orders",
      link: "/pedidos/{localId}"
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
      name: "coupons",
      link: "/cupones/{localId}"
    },
    {
      name: "services.prices",
      link: "/services/prices"
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
