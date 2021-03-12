const state = {
    authenticated:false,
    user:{
        id: null,
        email:'',
        role:'',
        token:''
    },
    allMenuOptions: [
        {
            role:'Cajero',
            options:[
                {label: 'opcion-cajero 1', link: '/opcion-cajero-1', icon:'home'},
                {label: 'opcion-cajero 2', link: '/opcion-cajero-2', icon:'home'}
            ]

        },
        {
            role:'Gerente',
            options:[
                {label: 'opcion-gerente 1', link: '/opcion-gerente-1', icon:'home'},
                {label: 'opcion-gerente 2', link: '/opcion-gerente-2', icon:'home'}
            ]
        },
        {
            role:'Administrador',
            options:[
                {label: 'opcion-admin 1', link: '/opcion-admin-1', icon:'home'},
                {label: 'opcion-admin 2', link: '/opcion-admin-2', icon:'home'}
            ]
        },
        {
            role:'Super Admin',
            options:[
                {label: 'opcion-sudo 1', link: '/opcion-sudo-1', icon:'home'},
                {label: 'opcion-sudo 2', link: '/opcion-sudo-2', icon:'home'}
            ]
        },
    ],
    availableMenuOptions:[]

}
const mutations = {
    setAvailableMenuOptions(state,payload){
        state.availableMenuOptions=payload;
    },
    setDataUserSesion(state, payload){
        state.user.id=payload.id;
        state.user.email=payload.email;
        state.user.role=payload.role.name;
        state.user.token=payload.token;

        state.availableMenuOptions=state.allMenuOptions.find(item => item.role===payload.role.name.trim()).options;
        state.authenticated=true;
    },
    resetDataUserSesion(state){
        state.user.id=null;
        state.user.email='';
        state.user.role='';
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