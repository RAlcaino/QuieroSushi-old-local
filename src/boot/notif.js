import Vue from "vue";
import { Howl, Howler } from "howler";

Vue.prototype.notif = new Howl({
    src: ["audios/notif.mp3"],
    volume: 0.5
});
