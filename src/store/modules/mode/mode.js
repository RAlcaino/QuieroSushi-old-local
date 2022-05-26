const state = {
  prod: true, //TRUE if you wanna test with backend or in a production environment
  //otherwise FALSE
  version: null
};
const mutations = {
  setVersion(state) {
    state.version = "1.14";
  }
};
const actions = {};
const getters = {
  getMode: state => {
    return state.prod;
  },
  getVersion: state => {
    return state.version;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
