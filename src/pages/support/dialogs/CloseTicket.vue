<template>
  <q-dialog v-model="card" persistent>
    <q-card
      style="border-radius:10px;width: 400px; max-width: 80vw; overflow:hidden"
    >
      <q-card-section
        class="row items-center q-pb-none"
        style="background:#333; padding: 10px 20px !important;"
      >
        <div class="text-h6" style="color: white">
          <q-icon
            style="margin-right:3px;padding-bottom:4px;"
            size="24px"
            name="delete"
          />
          Cerrar Ticket
        </div>
        <q-space />
        <q-btn icon="close" color="white" flat round dense @click="reset()" />
      </q-card-section>
      <q-card-section
        class="row items-center justify-center"
        style="height:50px; margin-bottom:25px"
      >
        <div
          class="fit row no-wrap justify-center items-center content-center"
          style="margin-top:25px"
        >
          <p style="font-size:16px">¿Estas seguro de cerrar este ticket?</p>
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="closeTicket()"
          size="sm"
          style="font-size:12px;padding: 0px 15px !important; margin-bottom:20px"
          rounded
          color="primary"
          >Cerrar</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling"],
  created() {
    this.prod = this.$store.getters["mode/getMode"];

    this.bus.$on("close-ticket", data => {
      this.card = true;
      this.ticket = data;
    });
  },
  mounted() {},
  data() {
    return {
      card: false,
      prod: null,
      ticket: null
    };
  },
  methods: {
    reset() {
      this.card = false;
      this.ticket = null;
    },
    closeTicket() {
      this.showLoading();
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("tickets.resources", {
          id: this.ticket.id_ticket
        });
        this.$axios
          .put(url, {
              estado: "cerrado"
          },{
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            this.card = false;
            this.bus.$emit("sync-tickets");
            this.hideLoading();
          })
          .catch(error => {
            this.hideLoading();
            this.errorHandling(error);
          });
      }
    }
  }
};
</script>

<style lang="scss"></style>
