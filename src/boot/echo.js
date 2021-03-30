import Vue from "vue";
import Echo from 'laravel-echo';
import Pusher from "pusher-js";

Pusher.logToConsole = false;
Vue.prototype.Echo = new Echo({
    broadcaster: 'pusher',
    key: "d17ab2517021eb4a4c7a",
    cluster: "us2",
    forceTLS: true,
});