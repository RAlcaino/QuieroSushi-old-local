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
                v-model="username"
                label="Usuario/Correo electronico"
                lazy-rules
                style="width: 80%"
              />

              <q-input
                type="password"
                filled
                v-model="password"
                label="Contraseña"
                style="width: 80%"

              />

              <div>
                <q-btn style="border-radius:20px"  label="Iniciar Sesión" to="/" type="button" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
    export default {
        data() {
            return {
                username: 'Pratik',
                password: '12345'
            }
        },
    }
</script>

<style>

  .bg-image {
   background: #ff2d2d;
  }

  .form-login{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

</style>
