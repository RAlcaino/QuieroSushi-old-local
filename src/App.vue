<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import SecureLS from "secure-ls";

export default {
  name: 'App',
  mounted(){
    console.log('app mounted');
    this.init();
  },
  methods:{
    init(){
      this.bus.$on('login',(data)=>{
        this.login(data);
      });
      this.bus.$on('logout',()=>{
        this.logout();
      });
    },
    login(data){
        var ls = new SecureLS({ isCompression: false });
        var token=ls.get('token');
        if(token!==''){
          let user=jwt_decode(token);
          user.token=token;
          user.locals=data;
          this.$store.commit('auth/setDataUserSesion',user);
        }
    },
    logout(){
      this.$store.commit('auth/resetDataUserSesion');
      localStorage.clear();
      this.$router.push({path:'/login'});
    }
  }
}
</script>
