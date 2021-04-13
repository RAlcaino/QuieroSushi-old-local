const state = {
    prod:true,             //TRUE if you wanna test with backend or in a production environment 
                            //otherwise FALSE
}
const mutations = {

}
const actions = {

}
const getters = {
    getMode: (state) => {
        return state.prod;
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}