<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}" style="border-radius:20px">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Iniciar Sesión
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md form-login"
            >
              <q-input
                filled
                v-model.lazy="user.email"
                label="Correo electronico"
                lazy-rules
                style="width: 80%"
              />

              <q-input
                type="password"
                filled
                v-model.lazy="user.password"
                label="Contraseña"
                style="width: 80%"

              />

              <div>
                <q-btn style="border-radius:20px"  label="Iniciar Sesión" @click="login()" type="button" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
    import jwt_decode from "jwt-decode";
    export default {
        data() {
            return {
                user:{
                  email: '',
                  password: ''
                }
            }
        },
        methods:{
          login(){
              var url = this.$store.getters['routes/getRoute']('login');
              console.log(this.user);
              this.$axios.post(url, this.user)
              .then(response => {
                  if(response.data.status==='success'){
                    localStorage.setItem('token',response.data.result);
                    this.bus.$emit('reload-login');
                    this.showNotification(response.data.message, 'positive','check_circle');  
                    console.log(this.$store.getters['auth/getDataUser']);
                    console.log(this.$store.getters['auth/getAvailableMenuOptions']);
                    console.log(this.$store.getters['auth/getAllMenuOptions']);
                    console.log(this.$store.getters['auth/getAuthenticated']);
                    this.$router.push({path:'/home'});
                  }else{
                    this.showNotification(response.data.message, 'negative', 'error');
                  }
                })
                .catch(error => {
                  if (error.response) {
                    if (error.response.status == 500) {
                      this.showNotification('Ha ocurrido un error con el servidor', 'negative', 'error');
                    } 
                    else if(error.response.status == 404){
                      this.showNotification('Ha ocurrido un error de rutas', 'negative', 'error');
                    }
                    else if (error.response.status == 400) {
                      this.showNotification(error.response.message, 'negative', 'error');
                    }
                  } 
                  else {
                    this.showNotification(error.message, 'negative', 'error');
                  }
                });

          },
          showNotification: function(message, color,icon) {
            this.$q.notify({
              progress: true,
              position:'top',
              message: message,
              color: color,
              icon: icon,
            });
          },

        }
    }
</script>

<style>

  .bg-image {
   background: #333;
  }

  .form-login{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

</style>
