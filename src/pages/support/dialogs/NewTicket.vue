<template>
  <modal-base
    :open="open"
    :width="700"
    :closeModal="closeModal"
    title="Nuevo Ticket"
    icon="confirmation_number"
  >
    <q-card-section class="row items-center justify-center">
      <q-list class="row" style="width: 80%;">
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              color
              outlined
              rounded
              dense
              v-model="ticket.titulo"
              label="Título"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-input
              v-model="ticket.descripcion"
              outlined
              rounded
              label="Descripción"
              dense
              type="textarea"
            />
          </q-item-section>
        </q-item>
        <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <q-item-section>
            <q-select
              outlined
              rounded
              dense
              v-model="ticket.local"
              :options="locals"
              label="Local"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="right" style="height: 20%;">
      <q-btn
        rounded
        color="green"
        :disable="!validation"
        style="font-size: 11px !important"
        @click="createTicket()"
      >
        <p style="margin: 0;" v-if="!flag">Crear</p>
        <q-spinner-hourglass v-if="flag" size="20px" color="white" />
      </q-btn>
    </q-card-actions>
  </modal-base>
</template>

<script>
import ModalBase from "src/components/modals/ModalBase.vue";
export default {
  props: ["locals", "sync"],
  components: { ModalBase },
  data() {
    return {
      open: false,
      flag: false,
      ticket: {
        titulo: null,
        local: null,
        descripcion: null
      }
    };
  },
  computed: {
    validation() {
      if (
        this.ticket.titulo === null ||
        this.ticket.descripcion === null ||
        this.ticket.local === null
      ) {
        return false;
      }
      if (
        this.ticket.descripcion.trim() === "" ||
        this.ticket.titulo.trim() === "" ||
        this.ticket.local === 0
      ) {
        return false;
      }

      return true;
    }
  },
  created() {
    this.bus.$on("modal-new-ticket", () => {
      this.open = true;
      this.flag = false;
      this.ticket = {
        titulo: null,
        local: null,
        descripcion: null
      };
    });
  },
  methods: {
    closeModal() {
      this.open = false;
    },
    createTicket() {
      this.flag = true;
      let data = {
        ...this.ticket,
        id_local: this.ticket.local.value,
        estado: "abierto"
      };
      var url = this.$store.getters["routes/getRoute"]("tickets.all");
      this.$axios
        .post(url, data, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.closeModal();
            this.bus.$emit("sync-tickets", this.ticket.local);
          }

          this.flag = false;
        })
        .catch(error => {
          this.errorHandling(error);
        });
    }
  }
};
</script>

<style></style>
