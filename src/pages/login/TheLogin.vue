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
    import SecureLS from "secure-ls";
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
              if(this.validate(this.user)){
                return;
              }     
              var ls = new SecureLS({ isCompression: false });
              var url = this.$store.getters['routes/getRoute']('login');

              //Without backend
              setTimeout(()=>{
                    ls.set('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImdhYnJpZWxAZ21haWwuY29tIiwicm9sZSI6eyJuYW1lIjoiQ2FqZXJvIn0sImxvY2FsSWQiOjIsImxvY2FsTmFtZSI6IlN1c2hpIFZJUCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjAwMDAwMDAwfQ.TQkqLa4J7pUKcCnz7ZvRPk50liBMucqrS0Jv7KiIn4k');
                    this.showNotification('Inicio de sesión exitoso', 'positive','check_circle');         
                    this.bus.$emit('login');
                    /*console.log(this.$store.getters['auth/getDataUser']);
                    console.log(this.$store.getters['auth/getAvailableMenuOptions']);
                    console.log(this.$store.getters['auth/getAllMenuOptions']);
                    console.log(this.$store.getters['auth/getAuthenticated']);*/
                    this.$router.push({path:'/home'});
              },3000);
              /*var ls = new SecureLS({ isCompression: false });
              var url = this.$store.getters['routes/getRoute']('login');

              this.$axios.post(url, this.user)
              .then(response => {
                  if(response.data.status==='success'){
                    ls.set('token',response.data.result);
                    this.showNotification(response.data.message, 'positive','check_circle');  
                    this.bus.$emit('login');
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
                      if(typeof error.response.data.message ==='object'){
                        for (var field in error.response.data.message) {
                          this.showNotification(error.response.data.message[field], 'negative','error');
                        }
                      }else{
                        this.showNotification(error.response.data.message, 'negative','error');
                      }
                    }
                  } 
                  else {
                    this.showNotification(error.message, 'negative', 'error');
                  }
                });*/

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
          validate(user){
            let flag=false;

            if(user.email==='' && user.password===''){
                this.showNotification('El correo es obligatorio', 'negative', 'error');
                this.showNotification('La contraseña es obligatoria', 'negative', 'error');
                flag=true;
            }
            else if(user.email=='' && user.password!==''){
               this.showNotification('El correo es obligatorio', 'negative', 'error');
               flag=true;
            }
            else if(user.email!=='' && user.password==''){
               this.showNotification('La contraseña es obligatoria', 'negative', 'error');
               flag=true;
            }
            else if(!user.email.includes('@')){
                this.showNotification('Debe ingresar un correo valido', 'negative', 'error');
                flag=true;
            }

            return flag;
          }

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
