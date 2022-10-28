<template>
  <q-dialog v-model="open" persistent>
    <q-card
      class="my-card"
      :style="`width: ${width}px; border-radius:10px; overflow:hidden`"
    >
      <q-card-section class="row items-center q-pb-none header__modal">
        <div class="text-h6" style="color: white">
          <q-icon size="24px" :name="icon" class="header__title__icon" />
          {{ title }}
        </div>
        <q-space />
        <q-btn
          icon="close"
          color="white"
          flat
          round
          dense
          @click="closeModal()"
        />
      </q-card-section>
      <slot></slot
    ></q-card>
  </q-dialog>
</template>

<script>
export default {
  props: ["open", "width", "closeModal", "title", "icon"]
};
</script>

<style lang="scss">
.header__modal {
  background: #333;
  padding: 10px 20px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.header__title__icon {
  margin-right: 3px;
  padding-bottom: 4px;
}
</style>
