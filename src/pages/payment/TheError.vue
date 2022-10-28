<template>
  <div
    class="bg-image"
    style="width: 100%;height:100vh;display:flex; flex-direction:column; justify-content:center;align-items:center;"
  >
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <!--<card-error
        style="border-radius: 20px; margin-bottom:20px"
        class="q-mt-lg"
        :background_image="background_img1"
      ></card-error>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPayment",
  components: {
    CardError: () => import("components/cards/CardError")
  },
  mounted() {
    this.Swal.fire({
      title: "¡Ha ocurrido un error con su pago!",
      icon: "error",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true
    }).then(result => {
      /* Read more about isConfirmed, isDenied below */
      this.redirectTo();
    });
  },
  data() {
    return {
      background_img1: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
      background_img2:
        "linear-gradient(87deg, rgb(45, 206, 137), rgb(45, 206, 204)) !important"
    };
  },
  methods: {
    redirectTo() {
      if (this.$route.params.type == 1) {
        this.$router.push("/cupones");
      } else if (this.$route.params.type == 2) {
        this.$router.push("/historico-cobro-semanal");
      } else {
        this.$router.push("/pedidos");
      }
    }
  }
};
</script>

<style lang="scss">
.bg-image {
  background-image: url("../../../src/assets/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  /*background-position-x: -50px;*/
}
.my-card {
  width: 100%;
  max-width: 500px;
}
</style>
