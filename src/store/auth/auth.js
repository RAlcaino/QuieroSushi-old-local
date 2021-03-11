const state = {
    authenticated:false,
    user:{
        id: null,
        email:'',
        role:'',
        local_id: null,
        local_name:'',
        token:''
    },
    allMenuOptions: [{
        label: 'opcion-cajero 1',
        link: '/opcion-cajero-1',
        icon:'home',
        role:'cajero',
    },
    {
        label: 'opcion-cajero 2',
        link: '/opcion-cajero-2',
        icon:'home',
        role:'cajero'
    },
    {
        label: 'opcion-gerente 1',
        link: '/opcion-gerente-1',
        icon:'home',
        role:'gerente'
    },
    {
        label: 'opcion-gerente 2',
        link: '/opcion-gerente-2',
        icon:'home',
        role:'gerente'
    },
    {
        label: 'opcion-admin 1',
        link: '/opcion-admin-1',
        icon:'home',
        role:'admin'
    },
    {
        label: 'opcion-admin 2',
        link: '/opcion-admin-2',
        icon:'home',
        role:'admin'
    }],
    availableMenuOptions:[]

}
const mutations = {
    setAvailableMenuOptions(state,payload){
        state.availableMenuOptions=payload;
    },
    setDataUserSesion(state, payload){
        state.user.id=payload.id;
        state.user.email=payload.email;
        state.user.role=payload.role;
        state.user.local_id=payload.local_id;
        state.user.local_id=payload.local_name;
        state.user.token=payload.token;

        state.availableMenuOptions=state.allMenuOptions.filter(item => item.role===payload.role.trim());
        state.authenticated=true;
    },
    resetDataUserSesion(state){
        state.user.id=null;
        state.user.email='';
        state.user.role='';
        state.user.local_id=null;
        state.user.local_name='';
        state.user.token='';

        state.availableMenuOptions=[];
        state.authenticated=false;
    }

}
const actions = {

}
const getters = {
    getAllMenuOptions: (state) => {
        return state.allMenuOptions;
    },
    getAvailableMenuOptions: (state) => {
        return state.availableMenuOptions;
    },
    getDataUser(state){
        return state.user;
    },
    getAuthenticated(state){
        return state.authenticated;
    }

}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}