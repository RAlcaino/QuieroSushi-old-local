<template>
  <base-page
    title=""
    icon=""
    :sync="false"
    :toolbar="false"
    :bgColor="`#eff4f7`"
    style="padding: 30px;"
  >
    <div class="splash">
      <img
        src="~/assets/brand/logo-qs-284x54-black.png"
        alt="QuieroSushi.cl Panel"
      />
      <img
        src="~/assets/maki-roll.gif"
        alt="sad"
        width="130"
        style="border-radius:100%"
      />
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
export default {
  components: {
    BasePage
  }
};
</script>

<style lang="scss" scoped>
.splash {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  justify-items: center;
  margin-bottom: 25px;
  width: 100%;
  height: 80vh;
}
</style>
