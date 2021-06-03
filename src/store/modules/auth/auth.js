const state = {
  authenticated: false,
  godMode: false,
  token: "",
  user: {
    id: 0,
    email: "",
    role: "",
    locals: [],
    debt: false
  },
  availableMenuOptions: [],
  currentLocal: {
    id: null,
    name: null,
    image: null,
    commune: null,
    cartStatus: null
  },
  installPromptEvent: null,
  comunas: [],
  regiones: [],
  ciudades: [],
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

    if (payload.locals.length === 0) {
      state.user.debt = true;
    } else {
      if (payload.locals.length > 1) {
        state.currentLocal.id = -1;
        state.currentLocal.name = "Todos";
        if (state.user.id === -1) {
          state.currentLocal.image = "icons/favicon-128.png";
        } else {
          state.currentLocal.image = payload.locals[0].image;
        }
        state.currentLocal.commune = null;
      } else {
        state.currentLocal = payload.locals[0];
      }
    }

    if (payload.role.name.trim() === "God") {
      state.godMode = true;
    }

    state.token = payload.token;
    state.availableMenuOptions = payload.availableMenuOptions;
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
    state.user.debt = false;

    state.token = "";
    state.availableMenuOptions = [];
    state.authenticated = false;
    this.currentLocal = {
      id: null,
      name: null,
      image: null,
      commune: null,
      cartStatus: null
    };
  },
  setCurrentLocal(state, payload) {
    state.currentLocal = payload;
  },
  setInstallPromptEvent(state, payload) {
    state.installPromptEvent = payload;
  },
  setLocals(state, payload) {
    state.user.locals = payload;
  },
  setToken(state, payload) {
    state.token = payload;
  },
  setZones(state, payload) {
    state.comunas = [];
    state.ciudades = [];
    state.regiones = [];

    var eachComunes = payload.comunas.map(function(item) {
      let row = {
        value: item.id,
        label: item.nombre,
        id_ciudad: item.id_ciudad,
        id_region: item.id_region
      };
      state.comunas.push(row);
    });


    var eachCities = payload.ciudades.map(function(item) {
      let row = {
        value: item.id,
        label: item.nombre,
        id_region: item.id_region
      };
      state.ciudades.push(row);
    });

    var eachRegions = payload.region.map(function(item) {
      let row = {
        value: item.id,
        label: item.nombre
      };
      state.regiones.push(row);
    });
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
      id: state.currentLocal.id,
      name: state.currentLocal.name,
      image: state.currentLocal.image,
      commune: state.currentLocal.commune,
      cartStatus: state.currentLocal.cartStatus
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
  },
  getInstallPromptEvent(state) {
    return state.installPromptEvent;
  },
  getCartsStatus(state) {
    let contON = 0;
    let contOFF = 0;
    let cartsLength = state.user.locals.length;

    for (let index = 0; index < state.user.locals.length; index++) {
      const element = state.user.locals[index];
      if (element.cartStatus === 1) {
        contON++;
      } else {
        contOFF++;
      }
    }
    if (cartsLength === contON) {
      return 1;
    } else if (cartsLength === contOFF) {
      return 0;
    } else {
      return null;
    }
  },
  getZones(state) {
    return {
      cities: state.ciudades,
      comunes: state.comunas,
      regions: state.regiones
    };
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
