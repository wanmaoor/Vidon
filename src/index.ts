import Vidon from '../packages/Vidon.js';
import './style.css'

let vm = new Vidon({
  el: '#app',
  data: {
    name: 'wanmao',
    age: 12,
    gender: '男'
  }
})

// setInterval(function () {
//   vm.$data.age++
// }, 1000)

setTimeout(() => {
  vm.$data.age = 100
}, 3000)