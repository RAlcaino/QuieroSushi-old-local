const state = {
  authenticated: false,
  token: "",
  user: {
    id: null,
    email: "",
    role: "",
    localName: "",
    localId: null
  },
  allMenuOptions: [
    {
      label: "Home",
      link: "/home",
      icon: "home",
      role: ["Cajero", "Gerente", "Administrador", "Super Admin"]
    },
    {
      label: "Pedidos",
      link: "/pedidos",
      icon: "delivery_dining",
      role: ["Cajero", "Gerente", "Administrador", "Super Admin"]
    }
  ],
  availableMenuOptions: []
};
const mutations = {
  setAvailableMenuOptions(state, payload) {
    state.availableMenuOptions = payload;
  },
  setDataUserSesion(state, payload) {
    state.user.id = payload.id;
    state.user.email = payload.email;
    state.user.role = payload.role.name;
    state.user.localId = payload.localId;
    state.user.localName = payload.localName;

    state.token = payload.token;
    console.log()
    state.availableMenuOptions = state.allMenuOptions.filter(item =>
        item.role.some(item2 => item2 === payload.role.name.trim())
    );
    state.authenticated = true;
  },
  resetDataUserSesion(state) {
    state.user.id = null;
    state.user.email = "";
    state.user.role = "";
    state.user.localId = null;
    state.user.localName = "";

    state.token = "";
    state.availableMenuOptions = [];
    state.authenticated = false;
  }
};
const actions = {};
const getters = {
  getAllMenuOptions: state => {
    return state.allMenuOptions;
  },
  getAvailableMenuOptions: state => {
    return state.availableMenuOptions;
  },
  getDataUser(state) {
    return state.user;
  },
  getAuthenticated(state) {
    return state.authenticated;
  },
  getDataLocal(state) {
    return {
      id: state.user.localId,
      name: state.user.localName
    };
  },
  getToken(state) {
    return state.token;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
