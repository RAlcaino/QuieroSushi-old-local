import Vue from 'vue'
import Echo from 'laravel-echo'

Vue.prototype.pusher=require('pusher-js');
Vue.prototype.echo = new Echo({
    broadcaster: 'pusher',
    key: 'd17ab2517021eb4a4c7a',
    cluster: 'us2',
    forceTLS: true
});