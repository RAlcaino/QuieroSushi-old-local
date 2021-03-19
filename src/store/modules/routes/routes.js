const state = {
  urlGlobal: "http://201.210.254.212:5000/api",
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
      link: "/confirm"
    }
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
