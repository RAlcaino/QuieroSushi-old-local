import Vue from "vue";
import Pusher from "pusher-js";

Pusher.logToConsole = false;
Vue.prototype.Pusher = new Pusher("d17ab2517021eb4a4c7a", {
  cluster: "us2",
  forceTLS: true
});
