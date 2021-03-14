import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
var ls = new SecureLS({ isCompression: false });

// import example from './module-example'

import routes from './main/routes'
import auth from './auth/auth'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      routes,
      auth
    },
    plugins: [
      createPersistedState({
        storage: {
          getItem: (key) => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: (key) => ls.remove(key),
        },
      }),
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
