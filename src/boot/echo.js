import Vue from "vue";
import Echo from 'laravel-echo';
import Pusher from "pusher-js";

Pusher.logToConsole = false;
Vue.prototype.Echo = new Echo({
    broadcaster: 'pusher',
    key: "0022ffcb496aaefec104",
    cluster: "us2",
    forceTLS: true,
});