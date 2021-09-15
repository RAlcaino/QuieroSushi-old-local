<template>
  <q-page class="q-pa-sm" style="background:white; padding-bottom:125px">
    <new-user-dialog></new-user-dialog>
    <edit-user-dialog></edit-user-dialog>
    <delete-user-dialog></delete-user-dialog>
    <change-password></change-password>
    <q-toolbar class="bg-primary text-white" style="border-radius:50px;">
      <q-btn flat round dense icon="group" />
      <q-toolbar-title :style="FontSize"> Administrar usuarios</q-toolbar-title>
      <q-btn
        flat
        round
        dense
        icon="sync"
        class="q-mr-xs"
        @click="sync(false)"
      />
    </q-toolbar>

    <div
      class="fit row wrap justify-end items-center content-center mobile-styles-o"
      style="margin: 20px 0"
    >
      <div v-if="getStoreLocals('ACTIVE').length > 1">
        <q-select
          ref="select"
          rounded
          outlined
          dense
          :options="localsFilter"
          :options-dense="true"
          hide-hint
          label="Locales"
          v-model="localSelected"
          @input="change"
          @popup-hide="allLocals()"
          style="margin-right:46px;"
          :virtual-scroll-sticky-size-start="80"
          class="q-select-responsive"
        >
          <template v-slot:prepend>
            <q-icon name="store" />
          </template>
          <template v-slot:before-options>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item dense clickable @click="allOrders()">
              <q-item-section>Todos</q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                <input
                  v-model="localFilter"
                  @input="filterFn(localFilter)"
                  type="text"
                  placeholder="Buscar"
                  style="padding: 7px; margin-top:10px; border-radius: 20px;border: 1px solid #333; outline:none;"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-grey">
                Sin Resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div
      class="fit column no-wrap justify-center items-center content-center"
      style="margin-top:20px"
    >
      <div
        style="margin-top:100px"
        class="fit column wrap justify-center items-center content-center"
        v-if="data.length === 0 && searching === false"
      >
        <img src="~/assets/icons8-sad.gif" alt="sad" width="130" />
        <p style="font-size:16px; font-weight:bold;text-align:center">
          No se encontraron usuarios
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
      <q-table
        v-if="usersFiltered.length !== 0 && searching === false"
        :data="usersFiltered"
        :columns="columns"
        :filter="filter"
        :pagination-label="getPaginationLabel"
        :pagination.sync="pagination"
        no-results-label="No se encontraron usuarios"
        rows-per-page-label="Usuarios por página"
        row-key="name"
        style="width:90%;border-radius:15px"
      >
        <template v-slot:top-right>
          <form autocomplete="off">
            <q-input
              dense
              rounded
              outlined
              debounce="300"
              v-model="filter"
              type="text"
              placeholder="Buscar"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </form>
        </template>
        <template v-slot:top-left>
          <q-btn color="green" rounded size="sm" @click="dialogNew()">
            <q-icon style="margin-right:5px" size="20px" name="add_circle" />
            <div style="font-size:12px">Nuevo</div>
          </q-btn>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>Acciones</q-th>
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <div style="width:100%; display:flex; justify-content:center">
                <q-btn
                  color="primary"
                  round
                  size="sm"
                  style="margin-right: 20px"
                  @click="dialogDelete(props.row)"
                >
                  <q-icon size="20px" name="delete" />
                </q-btn>
                <q-btn
                  color="blue"
                  round
                  size="sm"
                  style="margin-right: 20px"
                  @click="dialogEdit(props.row)"
                >
                  <q-icon size="20px" name="edit" />
                </q-btn>
                <q-btn
                  color="orange"
                  round
                  size="sm"
                  style="margin-right: 20px"
                  @click="dialogPassword(props.row)"
                >
                  <q-icon size="20px" name="vpn_key" />
                </q-btn>
              </div>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <template v-if="col.name === 'status'">
                <status-component
                  :value="col.value"
                  :userId="props.row.id"
                ></status-component>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import StatusComponent from "../../../components/bases/StatusComponent.vue";

import NewUserDialog from "./dialogs/NewUserDialog.vue";
import DeleteUserDialog from "./dialogs/DeleteUserDialog.vue";
import EditUserDialog from "./dialogs/EditUserDialog.vue";
import ChangePassword from "./dialogs/ChangePassword.vue";

export default {
  inject: ["showNotification", "showLoading", "hideLoading", "errorHandling","getStoreLocals"],
  components: {
    StatusComponent,
    NewUserDialog,
    DeleteUserDialog,
    EditUserDialog,
    ChangePassword
  },
  created() {
    this.prod = this.$store.getters["mode/getMode"];
    this.bus.$on("sync-users", () => {
      this.getUsers();
    });
  },
  mounted() {
    this.flag = true;
    this.searching = true;
    this.initLocals();
    this.localsFilter = this.locals;
    this.getUsers();
  },
  computed: {
    FontSize() {
      if (this.responsiveMobile) {
        return { fontSize: "15px" };
      } else {
        return { fontSize: "18px" };
      }
    },
    usersFiltered() {
      var vue = this;
      if (this.localSelected.value === -1) {
        return this.data;
      }
      let filtered = this.data.filter(item => {
        let id = vue.localSelected.value.toString();
        if (item.locals_string) {
          if (item.locals_string.includes(id)) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
      return filtered;
    }
  },
  data() {
    return {
      filter: "",
      searching: false,
      flag: false,
      responsiveMobile: false,
      data: [],
      pagination: {
        rowsPerPage: 10,
        current_page: 1
      },
      columns: [
        {
          name: "status",
          required: true,
          label: "Estado",
          align: "center",
          field: "status"
        },
        {
          name: "email",
          align: "center",
          label: "Correo",
          field: "email",
          sortable: true
        },
        {
          name: "role",
          align: "center",
          label: "Rol",
          field: "role",
          sortable: true
        }
      ],
      response: [
        {
          id: 1,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 2,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 3,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 4,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 5,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 6,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 7,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        },
        {
          id: 8,
          status: 1,
          email: "gabrielcch99@gmail.com",
          role: "administrador"
        }
      ],
      local: {
        value: null,
        label: ""
      },
      localFilter: "",
      selectedLocal: "Seleccionar",
      locals: [],
      localsFilter: [],
      localSelected: {
        label: null,
        value: null,
        image: null,
        commune: null,
        name: null,
        cartStatus: null
      }
    };
  },
  methods: {
    getPaginationLabel(firstRowIndex, endRowIndex, totalRowsNumber) {
      return "Total filas: " + totalRowsNumber;
    },
    dialogEdit(row) {
      this.bus.$emit("open-edit-user", row);
    },
    dialogDelete(row) {
      this.bus.$emit("open-delete-user", row);
    },
    dialogNew() {
      this.bus.$emit("open-new-user");
    },
    getUsers() {
      if (!this.prod) {
        setTimeout(() => {
          this.hideLoading();
        }, 3000);
      } else {
        var url = this.$store.getters["routes/getRoute"]("gp.users");
        this.$axios
          .get(url, {
            headers: {
              Authorization: this.$store.getters["auth/getToken"]
            }
          })
          .then(response => {
            if (response.data.status === "success") {
              this.flag = false;
              this.searching = false;
              this.mapResponse(response.data.result);
            } else {
              this.showNotification(response.data.message, "negative", "error");
            }
          })
          .catch(error => {
            this.errorHandling(error);
          });
      }
    },
    mapResponse(response) {
      var vue = this;
      vue.data = [];
      var each = response.map(function(item) {
        let row = {
          id: item.id,
          email: item.email,
          role: item.role.name,
          roleObject: item.role,
          status: item.estado,
          locals: item.locales,
          locals_string: item.locales_string
        };
        vue.data.push(row);
        vue.data.sort(function(a, b) {
          if (a.email > b.email) {
            return 1;
          }
          if (a.email < b.email) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
      });
    },
    sync() {
      this.showLoading();
      this.flag = true;
      this.searching = true;
      this.getUsers();
      this.hideLoading();
    },
    dialogPassword(row) {
      this.bus.$emit("open-new-password", row);
    },
    filterFn(val) {
      if (val === "") {
        this.localsFilter = this.locals;
        return;
      }

      const needle = val.toLowerCase();
      this.localsFilter = this.locals.filter(
        v => v.label.toLowerCase().indexOf(needle) > -1
      );
    },
    change(val) {
      var vue = this;
      if (val !== null) {
        this.local = val;
      }
    },
    allLocals() {
      this.localsFilter = this.locals;
      this.localFilter = "";
    },
    allOrders() {
      if (this.$refs.select !== undefined) {
        this.$refs.select.hidePopup();
      }
      this.localSelected = {
        value: -1,
        label: "Todos",
        name: "Todos",
        image:
          this.$store.getters["auth/getDataUser"].id === -1
            ? "icons/favicon-128.png"
            : getStoreLocals("ACTIVE")[0].image,
        commune: null,
        cartStatus: null
      };
      this.local = this.localSelected;
    },
    initLocals() {
      this.locals = [];
      this.locals = [...this.getStoreLocals("ACTIVE")];

      this.localSelected.value = this.$store.getters["auth/getDataLocal"].id;
      this.localSelected.image = this.$store.getters["auth/getDataLocal"].image;
      this.localSelected.commune = this.$store.getters[
        "auth/getDataLocal"
      ].commune;
      this.localSelected.name = this.$store.getters["auth/getDataLocal"].name;
      this.localSelected.cartStatus = this.$store.getters[
        "auth/getDataLocal"
      ].cartStatus;

      if (this.localSelected.value !== -1) {
        this.localSelected.label =
          this.localSelected.name + ", " + this.localSelected.commune;
      } else {
        this.localSelected.label = this.localSelected.name;
      }
      this.local.value = this.localSelected.value;
      this.local.label = this.localSelected.label;
    }
  }
};
</script>

<style lang="scss"></style>
