const state = {
  authenticated: false,
  godMode:false,
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
      role: ["Cajero", "Gerente", "Administrador", "Super Admin","God"]
    },
    {
      label: "Pedidos",
      link: "/pedidos",
      icon: "delivery_dining",
      role: ["Cajero", "Gerente", "Administrador", "Super Admin","God"]
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

    if(payload.role.name.trim()==='God'){
      state.godMode=true;
    }

    state.token = payload.token;
    state.availableMenuOptions = state.allMenuOptions.filter(item =>
        item.role.some(item2 => item2 === payload.role.name.trim())
    );
    state.authenticated = true;
  },
  resetDataUserSesion(state) {

    if(state.user.role==='God'){
      state.godMode=false;
    }
    
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
  getGodMode(state) {
    return state.godMode;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
