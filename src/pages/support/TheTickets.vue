<template>
  <base-page title="Mis Tickets" icon="confirmation_number" :sync="sync">
    <the-chat :sync="syncComments"></the-chat>
    <new-ticket :locals="locals" :sync="sync"></new-ticket>
    <close-ticket></close-ticket>
    <div
      class="text-h6"
      :class="[
        godAccess
          ? 'tickets__container__select'
          : 'tickets__container__select__alt'
      ]"
    >
      <div v-if="godAccess">
        <q-btn
          rounded
          color="green"
          icon="add_circle"
          size="sm"
          label="crear"
          @click="newTicket()"
        />
      </div>
      <div style="display: flex;">
        <q-select
          outlined
          rounded
          dense
          v-model="statusSelected"
          :options="['Abierto', 'Cerrado']"
          label="Estado"
          style="margin-right: 10px;"
          @input="changeStatus"
        />
        <q-select
          v-if="locals.length > 1"
          outlined
          rounded
          dense
          v-model="localSelected"
          :options="locals"
          label="Locales"
          @input="change"
        />
      </div>
    </div>
    <div
      style="padding-top:10px; margin:0 auto;"
      class="fit row wrap justify-center items-start content-start container-q-select"
    >
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="getData.length === 0 && searching === false"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron tickets
        </p>
      </div>
      <div
        style="margin-top:100px;border-radius:100%; overflow:hidden"
        class="fit column wrap justify-center items-center content-center"
        v-if="flag === true"
      >
        <img
          src="~/assets/maki-roll.gif"
          alt="sad"
          width="130"
          style="border-radius:100%"
        />
      </div>
      <q-list
        bordered
        v-if="getData.length !== 0 && searching === false"
        class="rounded-borders"
        style="width: 90%; justify-content: center; border-radius: 10px;"
      >
        <q-expansion-item
          switch-toggle-side
          expand-icon-toggle
          expand-separator
          v-for="ticket in getData"
          :key="ticket.id_ticket"
        >
          <template v-slot:header>
            <div class="header__item">
              <div class="header__item__left">
                <p class="title">{{ ticket.title }}</p>
                <p class="subtitle">
                  Creado el
                  {{ ticket.created_at.split(" ")[0].replaceAll("-", "/") }} -
                  Local: {{ ticket.local }} - Estado:
                  <span
                    :style="
                      `color: ${statusColor(ticket.status)}; font-weight:bold;`
                    "
                    >{{ ticket.status }}</span
                  >
                </p>
              </div>
              <div
                class="header__item__right"
                v-if="ticket.status === 'abierto'"
              >
                <q-btn
                  rounded
                  color="green"
                  size="sm"
                  label="responder"
                  style="margin-right: 5px;"
                  @click="showChat(ticket, true)"
                />
                <q-btn
                  rounded
                  color="primary"
                  size="sm"
                  label="cerrar"
                  @click="showCloseTicket(ticket)"
                />
              </div>
              <div class="header__item__right" v-else>
                <q-btn
                  rounded
                  color="green"
                  size="sm"
                  label="chat"
                  @click="showChat(ticket, false)"
                />
              </div>
            </div>
          </template>

          <q-card style="margin-left: 55px">
            <q-card-section>
              <span class="text-weight-bold">
                <q-btn flat round dense icon="support_agent"
              /></span>
              {{ ticket.description }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <template v-if="getData.length === perPage">
        <q-pagination
          v-if="searching === false"
          v-model="page"
          :max="maxPage"
          style="padding-top:25px"
          color="primary"
          input
          @click="sync(false)"
        />
      </template>
      <template v-else>
        <q-pagination
          v-if="page === maxPage && page !== 1 && searching === false"
          v-model="page"
          :max="maxPage"
          style="padding-top:25px"
          color="primary"
          input
          @click="sync(false)"
        />
      </template>
    </div>
  </base-page>
</template>

<script>
import BasePage from "src/components/bases/BasePage.vue";
import TheChat from "./dialogs/TheChat.vue";
import NewTicket from "./dialogs/NewTicket.vue";
import CloseTicket from "./dialogs/CloseTicket.vue";
export default {
  components: { BasePage, TheChat, NewTicket, CloseTicket },
  inject: [
    "showNotification",
    "showLoading",
    "hideLoading",
    "errorHandling",
    "getStoreLocals",
    "scrollTop"
  ],
  created() {
    this.init();
    this.sync(false);
    this.godAccess = this.$store.getters["auth/getDataUser"].role === "God";
    this.bus.$on("sync-tickets", local => {
      console.log(local);
      if (local !== undefined) {
        this.localSelected = local;
      }
      this.page = 1;
      this.statusSelected = "Abierto";
      this.sync(false);
    });
  },

  computed: {
    getData() {
      let dataFiltered = [...this.data];
      return dataFiltered;
    }
  },
  data() {
    return {
      data: [],
      godAccess: "",
      localSelected: {},
      local: [],
      statusSelected: "Abierto",
      flag: false,
      searching: false,
      page: 1,
      perPage: 15,
      maxPage: 0
    };
  },
  methods: {
    statusColor(status) {
      if (status.toLowerCase() === "abierto") {
        return "green";
      } else {
        return "red";
      }
    },
    init() {
      this.formatLocals();
    },
    formatLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      this.localSelected = this.locals[0];
    },
    change(val) {
      if (val !== null) {
        this.localSelected = val;
        this.page = 1;
        this.statusSelected = "Abierto";
        this.sync(false);
      }
    },
    changeStatus(val) {
      if (val !== null) {
        this.statusSelected = val;
        this.page = 1;
        this.sync(false);
      }
    },
    showChat(item, flag) {
      this.bus.$emit("modal-chat-support", { ...item, flag: flag });
    },
    newTicket() {
      this.bus.$emit("modal-new-ticket");
    },
    showCloseTicket(ticket) {
      this.bus.$emit("close-ticket", ticket);
    },
    sync(flag, data) {
      if (!flag) {
        this.flag = true;
        this.searching = true;
      }
      var url =
        this.$store.getters["routes/getRoute"]("tickets.resources", {
          id: this.localSelected.value
        }) + `?estado=${this.statusSelected.toLowerCase()}&page=${this.page}`;

      this.$axios
        .get(url, {
          headers: {
            Authorization: this.$store.getters["auth/getToken"]
          }
        })
        .then(response => {
          if (response.data.status === "success") {
            this.data = [...this.mapper(response.data.result.data)];
            this.maxPage = response.data.result.meta.total_pages;
            if (flag) {
              let newData = this.data.find(
                item => item.id_ticket === data.id_ticket
              );
              this.bus.$emit("modal-chat-update", {
                ...newData,
                flag: data.flag
              });
            }
            this.scrollTop();
          }

          this.flag = false;
          this.searching = false;
        })
        .catch(error => {
          this.errorHandling(error);
        });
    },
    mapper(items) {
      let mapper = [];
      items.map(item => {
        mapper.push({
          id_ticket: item.ticket_id,
          title: item.titulo,
          status: item.estado,
          id_local: item.id_local,
          local: this.$store.getters["auth/getDataLocals"].find(
            i => i.id === item.id_local
          ).name,
          created_at: "2021-10-08 11:22:00",
          description: item.descripcion,
          comments: item.comentarios
        });
      });
      return mapper;
    },
    syncComments(data) {
      this.sync(true, data);
    }
  }
};
</script>

<style lang="scss" scoped>
.header__item {
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  width: 100%;
}

.header__item__left {
  p {
    margin: 0;
  }
  .title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
  }
}

.header__item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    margin: 0;
  }
}

.tickets__container__select {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px auto;
}

.tickets__container__select__alt {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 20px auto;
}
</style>
