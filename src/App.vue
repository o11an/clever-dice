<template>
  <div id="app">
    <button class="settings-button" @click="toggleSettings">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -256 1792 1792">
        <path
          d="M1145.49153 645.4237q0-106-75-181t-181-75q-106 0-181 75t-75 181q0 106 75 181t181 75q106 0 181-75t75-181zm512-109v222q0 12-8 23t-20 13l-185 28q-19 54-39 91 35 50 107 138 10 12 10 25t-9 23q-27 37-99 108t-94 71q-12 0-26-9l-138-108q-44 23-91 38-16 136-29 186-7 28-36 28h-222q-14 0-24.5-8.5t-11.5-21.5l-28-184q-49-16-90-37l-141 107q-10 9-25 9-14 0-25-11-126-114-165-168-7-10-7-23 0-12 8-23 15-21 51-66.5t54-70.5q-27-50-41-99l-183-27q-13-2-21-12.5t-8-23.5v-222q0-12 8-23t19-13l186-28q14-46 39-92-40-57-107-138-10-12-10-24 0-10 9-23 26-36 98.5-107.5t94.5-71.5q13 0 26 10l138 107q44-23 91-38 16-136 29-186 7-28 36-28h222q14 0 24.5 8.5t11.5 21.5l28 184q49 16 90 37l142-107q9-9 24-9 13 0 25 10 129 119 165 170 7 8 7 22 0 12-8 23-15 21-51 66.5t-54 70.5q26 50 41 98l183 28q13 2 21 12.5t8 23.5z"
          fill="#FFF"
        />
      </svg>
    </button>
    <div class="logo">clever dice</div>
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
      <div class="chosen-bg" />
      <div class="chosen-inner">
        <Die
          v-for="die in chosenDice"
          :key="die.color"
          :color="die.color"
          :dot-color="die.dotColor"
          :value="die.value"
          @clicked="returnChosenDice(die)"
        />
      </div>
    </div>
    <div class="controls">
      <button class="button button--roll" @click="roll">Roll</button>
      <button class="button button--reset" @click="reset">Reset</button>
    </div>
    <transition name="fade">
      <div v-if="settingsVisible" class="settings">
        <div class="settings-inner">
          <button class="settings-close" @click="toggleSettings">x</button>
          <h3>Choose game</h3>
          <button
            v-for="(game, index) in games"
            :key="index"
            class="settings-choice"
            :class="{ 'current-choice': game.name === currentGame.name }"
            @click="setGame(game)"
          >
            {{ game.name }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Die from './components/Die.vue';
import {
  ganzSchonClever,
  doppeltSoClever,
  cleverHochDrei,
} from './settings.js';
export default {
  name: 'App',
  components: {
    Die,
  },
  data: () => ({
    dice: [],
    discardedDice: [],
    chosenDice: [],
    currentGame: null,
    diceRollSound: new Audio(require('./assets/dice-roll.mp3')),
    connection: null,
    games: [
      {
        name: 'Ganz Schön Clever',
        dice: ganzSchonClever,
      },
      {
        name: 'Doppelt So Clever',
        dice: doppeltSoClever,
      },
      {
        name: 'Clever Hoch Drei',
        dice: cleverHochDrei,
      },
    ],
    settingsVisible: false,
  }),
  created() {
    this.setGame(this.games[0]);
  },
  mounted() {
    let url = new URL(window.location.href);

    url.protocol = url.protocol.replace('http', 'ws');

    url.href;

    this.connection = new WebSocket(url);

    this.connection.onmessage = (event) => {
      let eventData = JSON.parse(event.data);
      this.syncDice(eventData);
    };

    this.connection.onopen = () => {
      console.log('Successfully connected to the echo websocket server...');
    };
  },
  methods: {
    roll() {
      this.diceRollSound.load();
      this.diceRollSound.play();
      this.dice.forEach(
        (die) => (die.value = Math.floor(Math.random() * 6) + 1)
      );
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
      this.dice = [...this.currentGame.dice];
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
    setGame(game) {
      if (this.currentGame) {
        this.reset();
      }
      this.currentGame = game;
      this.dice = [...this.currentGame.dice];
    },
    toggleSettings() {
      this.settingsVisible = !this.settingsVisible;
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
  background: url('./assets/bg-pattern.jpg');
  background-size: 50px;
  height: 100vh;
}
button {
  outline: none;
  font-family: inherit;
  cursor: pointer;
}
#app {
  font-family: 'Ravi Prakash', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #111;
  padding: 20px 0 0 30px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  max-width: calc(850px + 20vw);
  margin: 0 auto;
  padding-right: calc(20vw + 30px);
}
.logo {
  width: 100%;
  text-align: center;
  font-size: 62px;
  transform: rotate(-5deg);
}
.discarded {
  width: 100%;
  max-width: 870px;
  background: #9a6b0038;
  background-size: cover;
  height: 23vh;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3vh;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
}
.table {
  width: 71%;
  max-width: 650px;
  padding: 50px;
  height: 53vh;
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
  width: 26%;
  max-width: calc(870px - 670px);
  overflow: hidden;
  margin-left: 3%;
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chosen-inner {
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.chosen-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background: url('./assets/velvet.jpg');
  background-size: cover;
  filter: hue-rotate(63deg) brightness(4);
  mix-blend-mode: screen;
}

.controls {
  width: 20vw;
  height: 100vh;
  position: fixed;
  right: 20px;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.button {
  background: #fc0;
  font-size: 25px;
  border: none;
  border-radius: 5px;
  padding: 10px 20px 5px;
  text-transform: uppercase;
  font-weight: bold;
  margin: 0 20px;
  position: relative;
}
.button::before {
  content: '';
  width: 105%;
  height: 105%;
  background: #222;
  position: absolute;
  z-index: -2;
  top: 6px;
  left: 3px;
  border-radius: 5px;
}
.button--roll {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  font-size: 50px;
  padding: 15px 20px 0px;
}
.button--roll::before {
  border-radius: 50%;
}
.button--reset {
  background: #2c3e50;
  color: #fff;
  margin-top: 50px;
}

.settings-button {
  position: fixed;
  top: 30px;
  right: 30px;
  width: 45px;
  height: 45px;
  border: none;
  background: #333;
  border-radius: 10px;
  padding: 5px;
  z-index: 5;
}

.settings {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings h3 {
  font-size: 30px;
}

.settings-inner {
  width: 320px;
  padding: 20px;
  border-radius: 10px;
  background: #fff;
  position: relative;
}

.settings-close {
  border-radius: 50%;
  background: #fc0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  width: 40px;
  height: 40px;
  font-size: 20px;
  right: -15px;
  top: -15px;
  padding-bottom: 4px;
  border: none;
}

.settings-choice {
  display: block;
  width: 100%;
  margin: 10px 0;
  font-size: 20px;
  border: none;
  background: #2c3e50;
  color: #fff;
  border-radius: 6px;
  position: relative;
}

.current-choice {
  background: green;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter,
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
