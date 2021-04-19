const state = {
  authenticated: false,
  godMode: false,
  token: "",
  user: {
    id: null,
    email: "",
    role: "",
    locals: []
  },
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
    state.user.locals = payload.locals;

    if (payload.role.name.trim() === "God") {
      state.godMode = true;
    }

    state.token = payload.token;
    state.availableMenuOptions=payload.availableMenuOptions;
    state.authenticated = true;
  },
  resetDataUserSesion(state) {
    if (state.user.role === "God") {
      state.godMode = false;
    }

    state.user.id = null;
    state.user.email = "";
    state.user.role = "";
    state.user.locals = [];

    state.token = "";
    state.availableMenuOptions = [];
    state.authenticated = false;
  }
};
const actions = {};
const getters = {
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
      id: state.user.locals[0].id,
      name: state.user.locals[0].name,
      image: state.user.locals[0].image
    };
  },
  getToken(state) {
    return state.token;
  },
  getGodMode(state) {
    return state.godMode;
  },
  getDataLocals(state) {
    return state.user.locals;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
