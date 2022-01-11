import Vue from "vue";
import Echo from 'laravel-echo';
import Pusher from "pusher-js";

//Pusher.logToConsole = false;
Vue.prototype.Echo = new Echo({
    broadcaster: 'pusher',
    //key: "d17ab2517021eb4a4c7a",
    key: "0022ffcb496aaefec104",
    cluster: "us2",
    forceTLS: true,
});

Vue.prototype.Echo2 = new Echo({
    broadcaster: 'pusher',
    //key: "d17ab2517021eb4a4c7a",
    key: "d77442b1711e2acf9ec1",
    cluster: "us2",
    forceTLS: true,
});