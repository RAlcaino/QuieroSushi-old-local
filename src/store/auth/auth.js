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
                {label: 'Home', link: '/home', icon:'home'},
                {label: 'Pedidos', link: '/pedidos', icon:'delivery_dining'}
            ]

        },
        {
            role:'Gerente',
            options:[
                {label: 'Home', link: '/home', icon:'home'},
                {label: 'Pedidos', link: '/pedidos', icon:'delivery_dining'}
            ]
        },
        {
            role:'Administrador',
            options:[
                {label: 'Home', link: '/home', icon:'home'},
                {label: 'Pedidos', link: '/pedidos', icon:'delivery_dining'}
            ]
        },
        {
            role:'Super Admin',
            options:[
                {label: 'Home', link: '/home', icon:'home'},
                {label: 'Pedidos', link: '/pedidos', icon:'delivery_dining'}

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