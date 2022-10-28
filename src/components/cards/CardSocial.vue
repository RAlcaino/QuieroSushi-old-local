<template>
  <q-card class="bg-transparent no-shadow no-border">
    <q-card-section class="q-pa-none">
      <div class="row q-col-gutter-sm ">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-3 col-sm-12 col-xs-12"
        >
          <q-item
            :style="`background-color: ${item.color1}`"
            class="q-pa-none q-ml-xs"
            style="border-radius: 15px;overflow:hidden;"
          >
            <q-item-section
              v-if="icon_position === 'left'"
              side
              :style="`background-color: ${item.color2}`"
              class=" q-pa-lg q-mr-none text-white"
            >
              <q-icon :name="item.icon" color="white" size="24px"></q-icon>
            </q-item-section>
            <q-item-section class=" q-pa-md q-ml-none  text-white">
              <q-item-label
                v-if="item.visible"
                class="text-white text-h6 text-weight-bolder"
                >{{ item.value }}</q-item-label
              >
              <q-item-label v-else>
                <q-spinner-facebook color="white" size="sm"
              /></q-item-label>
              <q-item-label>{{ item.title }}</q-item-label>
            </q-item-section>
            <q-item-section
              v-if="icon_position === 'right'"
              side
              class="q-mr-md text-white"
            >
              <q-icon :name="item.icon" color="white" size="44px"></q-icon>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "CardSocial",
  props: {
    icon_position: {
      required: false,
      default: "left"
    }
  },
  data() {
    return {
      items: [
        {
          id: 1,
          title: "Ventas del mes",
          icon: "fas fa-dollar-sign",
          value: "0",
          color1: "#546bfa",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 2,
          title: "Ventas Confirmadas",
          icon: "fas fa-check-circle",
          value: "0",
          color1: "#3a9688",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 3,
          title: "Ventas Anuladas",
          icon: "fas fa-times",
          value: "0",
          color1: "#7cb342",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 4,
          title: "Conectividad",
          icon: "fas fa-percentage",
          value: "0",
          color1: "#f88c2b",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 5,
          title: "Demora en Confirmar",
          icon: "fas fa-hourglass-half",
          value: "0",
          color1: "#546bfa",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 6,
          title: "Tiempo de Entrega",
          icon: "fas fa-clock",
          value: "0",
          color1: "#3a9688",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 7,
          title: "Puntaje",
          icon: "fas fa-star",
          value: "0",
          color1: "#7cb342",
          color2: "#3e51b5",
          visible: false
        },
        {
          id: 8,
          title: "Numero de Comentarios",
          icon: "fas fa-comments",
          value: "0",
          color1: "#f88c2b",
          color2: "#3e51b5",
          visible: false
        }
      ]
    };
  },
  mounted() {
    this.bus.$on("sync-dashboard-card-data", data => {
      this.sync(data);
    });
    this.bus.$on("reset-dashboard-card-data", () => {
      this.items.map(item => (item.visible = false));
    });
  },
  methods: {
    sync(data) {
      data.map(item => {
        let index = this.items.findIndex(card => card.id === item.id);
        if (index !== -1) {
          this.items[index].value = this.formats(item);
          this.items[index].visible = true;
        }
      });
    },
    formats(item) {
      let hr = "";
      let min = "";
      switch (item.id) {
        case 1:
          return `${this.formatNumber(item.value)}`;
        case 4:
          return `${item.value}%`;
        case 5:
          hr = item.value.split(":")[0];
          min = item.value.split(":")[1];

          if (parseInt(min) < 10) {
            min = `0${min}`;
          }
          return `${hr}:${min} Hr`;
        case 6:
          hr = item.value.split(":")[0];
          min = item.value.split(":")[1];

          if (parseInt(min) < 10) {
            min = `0${min}`;
          }
          return `${hr}:${min} Hr`;
        case 7:
          return `${item.value} de 5`;

        default:
          return item.value;
      }
    },
    formatNumber(data) {
      data = parseFloat(data);
      return `${data.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 2
      })}`;
    }
  }
};
</script>
