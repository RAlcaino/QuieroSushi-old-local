<template>
  <q-card style="background-color: #fff; width: 400px;">
    <q-card-section>
      <q-avatar size="103px" class="absolute-center">
        <img  src="~assets/error.png"/>
      </q-avatar>
    </q-card-section>
    <q-card-section style="margin-top: 50px">
      <div class="text-h6 text-weight-bolder text-center">
        ¡Ha ocurrido un error con su pago!
      </div>
    </q-card-section>
    <q-card-actions vertical align="center" style="margin-bottom:25px">
      <q-btn
        rounded
        color="primary"
        style="width:150px;"
        to="/cupones"
        label="Ir a cupones"
      />
    </q-card-actions>
    <q-separator />
  </q-card>
</template>

<script>
export default {
  name: "CardCompany",
  props: ["background_image"]
};
</script>

<style scoped></style>
