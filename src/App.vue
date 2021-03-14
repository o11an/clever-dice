<template>
  <div id="app">
    <div class="discarded">
      <Die 
        v-for="die in discardedDice" 
        :key="die.color"
        :color="die.color" 
        :dot-color="die.dotColor"
        :static-value="die.value" 
        :roll="die.roll" 
        @clicked="returnDiscardedDice(die)" />
    </div>
    <div class="table">
      <Die 
        v-for="die in dice" 
        :key="die.color" 
        :color="die.color" 
        :dot-color="die.dotColor"
        :roll="die.roll" 
        @clicked="chooseDice(die)" 
        @changed="die.value = $event" />
    </div>
    <div class="chosen">
      <Die 
        v-for="die in chosenDice" 
        :key="die.color" 
        :color="die.color"
        :dot-color="die.dotColor"
        :static-value="die.value" 
        :roll="die.roll" 
        @clicked="returnChosenDice(die)" />
    </div>
    <div class="controls">
      <button class="button" @click="roll">Roll Dice</button>
      <button class="button" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script>
import Die from './components/Die.vue';
import {cleverHochDrei} from './settings.js';
export default {
  name: 'App',
  components: {
    Die
  },
   data: () => ({
    dice: [...cleverHochDrei],
    discardedDice: [],
    chosenDice: [],
    diceRollSound: new Audio(require('./assets/dice-roll.mp3'))
  }),
  mounted() {
  },
  methods: {
    chooseDice(die) {
      this.chosenDice.push(die);
      if (this.chosenDice.length === 3) {
        this.discardedDice = this.discardedDice.concat(this.dice.filter(item => item.color != die.color));
        this.dice = [];
      } else {
        this.discardedDice = this.discardedDice.concat(this.dice.filter(item => item.value < die.value));
        this.dice = this.dice.filter(item => item.value >= die.value && item.color != die.color);
      }
    },
    returnDiscardedDice(die) {
      this.dice.push(die);
      this.discardedDice = this.discardedDice.filter(item => item.color != die.color);
    },
    returnChosenDice(die) {
      this.dice.push(die);
      this.chosenDice = this.chosenDice.filter(item => item.color != die.color);
    },
    roll() {
      this.dice.map(i => {
        i.roll++
        return i;
      });
      this.diceRollSound.play();
    },
    reset() {
      this.dice = [...cleverHochDrei];
      this.discardedDice = [];
      this.chosenDice = [];
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  display:flex;
  justify-content: center;
  flex-wrap:wrap;
}
.discarded {
  width:60%;
  background: #ccc;
  height: 25vh;
  border-radius:50%;
  display:flex;
  justify-content: center;
  align-items: center;
  margin-bottom:3vh;
}
.table {
  width:60%;
  height: 50vh;
  background: #d4b992;
  display:flex;
  justify-content: center;
  align-items: center;
  border-radius: 40px;
}
.chosen {
  width: 15%;
  margin-left:5%;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
  border-radius: 40px;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 35px 0 0;
}
.controls {
  width:100%;
  position: fixed;
  left:0;
  bottom:0;
  display:flex;
  justify-content: center;
  align-items: center;
  height:15vh;
  background: #333;
}
.button {
    background: #fc0;
    font-size:25px;
    border:none;
    border-radius: 5px;
    padding: 10px 20px;
    text-transform: uppercase;
    font-weight: bold;
    margin: 0 20px;
}
</style>
