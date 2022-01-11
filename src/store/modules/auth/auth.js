const state = {
  authenticated: false,
  godMode: false,
  token: "",
  nextUpdateTime: {
    currentHour: null,
    currentMinute: null,
    currentSecond: null
  },
  user: {
    id: 0,
    email: "",
    role: "",
    locals: [],
    debt: false,
    notifications: []
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
  titles: [],
  roles: [],
  serverTime: null
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
    let date = new Date();
    date.setMinutes(date.getMinutes() + 5);
    let currentHour = date.getHours();
    let currentMinute = date.getMinutes();
    let currentSecond = date.getSeconds();

    state.nextUpdateTime.currentHour = currentHour;
    state.nextUpdateTime.currentMinute = currentMinute;
    state.nextUpdateTime.currentSecond = currentSecond;

    let locals = [...payload.locals];

    if (locals.some(item => item.localStatus === "bloqueado")) {
      state.user.debt = true;
    }

    if (payload.locals.length > 1) {
      state.currentLocal.id = -1;
      state.currentLocal.name = "Todos";
      if (state.user.id === -1) {
        state.currentLocal.image = "icons/favicon-128.png";
      } else {
        state.currentLocal.image = sortAndFilter(locals)[0].image;
      }
      state.currentLocal.commune = null;
    } else {
      state.currentLocal = sortAndFilter(locals)[0];
    }

    if (payload.role.name.trim() === "God") {
      state.godMode = true;
    }

    state.token = payload.token;
    state.availableMenuOptions = payload.availableMenuOptions;
    state.authenticated = true;
  },
  resetDataUserSesion(state) {
    state.godMode = false;
    state.user.id = 0;
    state.user.email = "";
    state.user.role = "";
    state.user.locals = [];
    state.user.debt = false;
    state.user.notifications = [];

    state.token = "";
    state.availableMenuOptions = [];
    state.authenticated = false;
    state.currentLocal = {
      id: null,
      name: null,
      image: null,
      commune: null,
      cartStatus: null
    };

    state.installPromptEvent = null;
    state.titles = [];
    state.comunas = [];
    state.regiones = [];
    state.ciudades = [];
    state.roles = [];

    state.nextUpdateTime = {
      currentHour: null,
      currentMinute: null,
      currentSecond: null
    };

    state.serverTime = null;
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
  setLocalName(state, payload) {
    let index = state.user.locals.findIndex(item => item.id === payload.id);
    state.user.locals[index].name = payload.nombre;
    state.user.locals[index].commune = payload.comuna.label;
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
  },
  setTitles(state, payload) {
    state.titles = [];
    var eachTitle = payload.map(function(item) {
      let row = {
        value: item.id,
        label: item.titulo_corto,
        label2: item.titulo_largo
      };
      state.titles.push(row);
    });
  },
  setRoles(state, payload) {
    state.roles = [];
    var eachRoles = payload.map(function(item) {
      let row = {
        value: item.id,
        label: item.name
      };
      state.roles.push(row);
    });
  },
  setNextTimeUpdate(state, payload) {
    state.nextUpdateTime.currentHour = payload.currentHour;
    state.nextUpdateTime.currentMinute = payload.currentMinute;
    state.nextUpdateTime.currentSecond = payload.currentSecond;
  },
  setServerTime(state, payload) {
    state.serverTime = payload;
  },
  setDebt(state, payload) {
    state.user.debt = payload;
  },
  setNotifications(state, payload) {
    if (payload.type === 1) {
      state.user.notifications = payload.items.sort(function(a, b) {
        return new Date(b.fecha) - new Date(a.fecha);
      });
    } else {
      state.user.notifications.unshift(payload.item);
    }
  },
  setNotificationViewed(state, payload) {
    state.user.notifications[payload.index].visto = 1;
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
  },
  getTitles(state) {
    return state.titles;
  },
  getRoles(state) {
    return state.roles;
  },
  getNextUpdateTime(state) {
    return state.nextUpdateTime;
  },
  getServerTime(state) {
    return state.serverTime;
  },
  getUserNotifications(state) {
    return state.user.notifications;
  }
};

const sortAndFilter = locals => {
  locals.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    return 0;
  });

  let result = locals.filter(item => item.localStatus === "normal");

  if (result.length === 0) {
    return locals;
  } else {
    return result;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
