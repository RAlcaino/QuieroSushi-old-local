<template>
  <div v-if="flag">
    <q-icon
      name="hourglass_top"
      style="font-size:22px; padding-bottom:5px"
      class="i-icon"
      color="primary"
    />
    <strong style="color: #ff2d2d ">Debe confirmar o será anulada en: {{ timerString }}</strong>
  </div>
</template>

<script>
export default {
  props: ["timestamp_inicio"],
  mounted() {
    let date1 = new Date(this.timestamp_inicio);
    let date2 = new Date(this.timestamp_inicio);
    this.startTimer = date1.setMinutes(date1.getMinutes() + 15);
    this.finalTimer = date2.setMinutes(date2.getMinutes() + 20);

    setInterval(() => {
      let santiagoTime = new Date().toLocaleString("en-US", {
        timeZone: "America/Santiago"
      });
      santiagoTime = new Date(santiagoTime).getTime();
      if (santiagoTime >= this.startTimer) {
        this.flag = true;
        let diff = this.finalTimer - santiagoTime;
        let minutes = Math.floor(diff / (1000 * 60));
        let seconds = Math.floor((diff / 1000) % 60);
        this.timerString = `0${minutes}:${
          seconds > 9 ? seconds : `0${seconds}`
        }`;
        if (seconds < 0 || minutes < 0) {
          this.flag = false;
        }
      }
    }, 1000);
  },
  data() {
    return {
      timer: null,
      startTimer: null,
      finalTimer: null,
      flag: false,
      timerString: ""
    };
  }
};
</script>

<style></style>
