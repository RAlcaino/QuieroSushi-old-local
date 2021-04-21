const state = {
  authenticated: false,
  godMode: false,
  token: "",
  user: {
    id: 0,
    email: "",
    role: "",
    locals: []
  },
  availableMenuOptions: [],
  currentLocal:{
    id:null,
    name:null,
    image:null
  }
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

    if(payload.locals.length>1){
      state.currentLocal.id=-1,
      state.currentLocal.name="Todos",
      state.currentLocal.image=null
    }else{
      state.currentLocal=payload.locals[0];
    }
    console.log()

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
    this.currentLocal={
      id:null,
      name:null,
      image:null
    }
  },
  setCurrentLocal(state, payload) {
    state.currentLocal=payload;
  },
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
      id: state.currentLocal.id,
      name: state.currentLocal.name,
      image: state.currentLocal.image
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
