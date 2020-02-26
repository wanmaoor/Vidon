import Vidon from '../packages/Vidon.js';
import './style.css'

let vm = new Vidon({
  el: "#app",
  data: {
    name: "小马🐴",
    age: 12,
    gender: "男"
  },
  methods: {
    sayHi() {
      alert(`你好, ${this.name}`);
    }
  }
});

// setInterval(function () {
//   vm.$data.age++
// }, 1000)

setTimeout(() => {
  vm.$data.age = 20
}, 3000)