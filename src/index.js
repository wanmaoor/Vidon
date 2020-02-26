// @ts-nocheck
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
    },
    auto() { 
      alert('我自己执行的')
    }
  }
});

// setInterval(function () {
//   vm.$data.age++
// }, 1000)

setTimeout(() => {
  vm.age = 20
  vm.auto()
  setTimeout(() => {
    vm.auto = () => { alert('2秒后我又弹出来了') }
    vm.auto()
  }, 2000)
  
}, 3000)