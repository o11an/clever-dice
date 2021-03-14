<template>
  <div id="app">
    <div class="discarded">
      <Die
        v-for="die in discardedDice"
        :key="die.color"
        :color="die.color"
        :dot-color="die.dotColor"
        :value="die.value"
        @clicked="returnDiscardedDice(die)"
      />
    </div>
    <div class="table">
      <Die
        v-for="die in dice"
        :key="die.color"
        :color="die.color"
        :dot-color="die.dotColor"
        :value="die.value"
        @clicked="chooseDice(die)"
      />
    </div>
    <div class="chosen">
      <div class="chosen-bg"></div>
      <Die
        v-for="die in chosenDice"
        :key="die.color"
        :color="die.color"
        :dot-color="die.dotColor"
        :value="die.value"
        @clicked="returnChosenDice(die)"
      />
    </div>
    <div class="controls">
      <button class="button" @click="rollDice">Roll Dice</button>
      <button class="button" @click="reset">Reset</button>
    </div>
  </div>
</template>

<script>
import Die from './components/Die.vue';
import { cleverHochDrei } from './settings.js';
export default {
  name: 'App',
  components: {
    Die,
  },
  data: () => ({
    dice: [...cleverHochDrei],
    discardedDice: [],
    chosenDice: [],
    diceRollSound: new Audio(require('./assets/dice-roll.mp3')),
    connection: null,
  }),
  mounted() {
    var url = new URL(window.location.href);

    url.protocol = url.protocol.replace('http', 'ws');

    url.href;

    this.connection = new WebSocket(url);

    this.connection.onmessage = (event) => {
      let eventData = JSON.parse(event.data);
      this.syncDice(eventData);
    };

    this.connection.onopen = (event) => {
      console.log('Successfully connected to the echo websocket server...');
    };
  },
  methods: {
    rollDice() {
      this.dice.forEach(
        (die) => (die.value = Math.floor(Math.random() * 6) + 1)
      );
      this.diceRollSound.load();
      this.diceRollSound.play();

      this.sendMessage();
    },
    chooseDice(die) {
      this.chosenDice.push(die);
      if (this.chosenDice.length === 3) {
        this.discardedDice = this.discardedDice.concat(
          this.dice.filter((item) => item.color != die.color)
        );
        this.dice = [];
      } else {
        this.discardedDice = this.discardedDice.concat(
          this.dice.filter((item) => item.value < die.value)
        );
        this.dice = this.dice.filter(
          (item) => item.value >= die.value && item.color != die.color
        );
      }
      this.sendMessage();
    },
    returnDiscardedDice(die) {
      this.dice.push(die);
      this.discardedDice = this.discardedDice.filter(
        (item) => item.color != die.color
      );
      this.sendMessage();
    },
    returnChosenDice(die) {
      this.dice.push(die);
      this.chosenDice = this.chosenDice.filter(
        (item) => item.color != die.color
      );
      this.sendMessage();
    },
    reset() {
      this.dice = [...cleverHochDrei];
      this.dice.forEach((die) => (die.value = 0));
      this.discardedDice = [];
      this.chosenDice = [];
      this.sendMessage();
    },
    sendMessage() {
      this.$nextTick(() => {
        this.connection.send(
          JSON.stringify({
            dice: this.dice,
            discardedDice: this.discardedDice,
            chosenDice: this.chosenDice,
          })
        );
      });
    },
    syncDice(eventData) {
      this.dice = eventData.dice;
      this.discardedDice = eventData.discardedDice;
      this.chosenDice = eventData.chosenDice;
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: url('./assets/bg.jpg');
  background-size: 500px;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 20px 0 0 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-width: 870px;
}
.discarded {
  width: 80%;
  max-width: 870px;
  background: #9a6b0038;
  background-size: cover;
  height: 25vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
}
.table {
  width: 60%;
  max-width: 650px;
  padding: 50px 90px;
  height: 50vh;
  background: url('./assets/wood.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  border-radius: 10px;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
}
.chosen {
  width: 18%;
  max-width: calc(870px - 670px);
  background: url('./assets/velvet.jpg');
  background-size: cover;
  margin-left: 2%;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1% 0 0;
}

.chosen-bg {
}

.controls {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
  background: #333;
}
.button {
  background: #fc0;
  font-size: 25px;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  text-transform: uppercase;
  font-weight: bold;
  margin: 0 20px;
}
</style>
