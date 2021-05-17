<template>
 <div class="bg-image" style="width: 100%;height:100vh;display:flex; flex-direction:column; justify-content:center;align-items:center;" >
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <card-error
        style="border-radius: 20px; margin-bottom:20px"
        class="q-mt-lg"
        :background_image="background_img1"
      ></card-error>
    </div>
  </div>
</template>

<script>
export default {
  name: "SucessPayment",
  components: {
    CardError: () => import("components/cards/CardError"),
  },
  data() {
    return {
      background_img1: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
      background_img2:
        "linear-gradient(87deg, rgb(45, 206, 137), rgb(45, 206, 204)) !important"
    };
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
