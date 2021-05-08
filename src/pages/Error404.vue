<template>
  <div class="fixed-center text-center">
    <img src="~assets/icons8-sad.gif" style="width:200px;" />
    <p class="text-faded" style="font-size:16px">
      Lo sentimos, no se encontro la página que esta buscando...<strong
        >(404)</strong
      >
    </p>
    <q-btn rounded color="primary" style="width:200px;" to="/" label="Volver" />
  </div>
</template>

<script>
export default {
  name: "Error404"
};
</script>
