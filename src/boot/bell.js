import Vue from "vue";
import { Howl, Howler } from "howler";

Vue.prototype.bell = new Howl({
    src: ["audios/bell_ring.mp3"],
    volume: 0.5
});
