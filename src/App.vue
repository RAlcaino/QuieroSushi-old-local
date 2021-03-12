<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
export default {
  name: 'App',
  mounted(){
    this.bus.$on('check-session',()=>{
      this.checkSession();
    });
    this.bus.$on('logout',()=>{
      localStorage.removeItem('token');
      this.$router.push({path:'/login'});
    });
  },
  methods:{
    checkSession(){
        var token=localStorage.getItem('token');
        
        if(token!==undefined){
          let user=jwt_decode(token);
          user.token=token;
          this.$store.commit('auth/setDataUserSesion',user);
        }
    }
  }
}
</script>
