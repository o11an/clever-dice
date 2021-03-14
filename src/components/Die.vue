<template>
  <button
    v-if="value > 0"
    class="die"
    :class="'die--' + value"
    :style="'background-color:' + color + ';color:' + dotColor"
    @click="$emit('clicked')"
  >
    <div
      v-for="n in value"
      :key="n"
      class="dot"
      :style="'background-color:' + dotColor"
    />
  </button>
</template>

<script>
export default {
  name: 'Die',
  props: {
    color: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
    dotColor: {
      type: String,
      required: true,
    },
  },
  computed: {},
  watch: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.die {
  width: 100px;
  height: 100px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  font-size: 50px;
  box-shadow: 0 0 18px -7px rgba(0, 0, 0, 0.7);
  transition: box-shadow 200ms ease;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  position: relative;
  cursor: pointer;
}
.die:hover {
  box-shadow: 0 0 22px -7px rgba(0, 0, 0, 0.9);
}
.die--1 {
  align-items: center;
  justify-content: center;
}
.die--2 .dot:last-child,
.die--3 .dot:last-child {
  align-self: flex-end;
}
.die--3 .dot:nth-of-type(2) {
  align-self: center;
}
.die--4 .dot:nth-of-type(2),
.die--5 .dot:nth-of-type(2),
.die--6 .dot:nth-of-type(2) {
  align-self: flex-end;
  margin-left: -70%;
}
.die--4 .dot:nth-of-type(3),
.die--5 .dot:nth-of-type(3),
.die--6 .dot:nth-of-type(3) {
  align-self: flex-end;
  margin-right: -70%;
}
.die--5 .dot:nth-of-type(5) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;
}
.die--6 .dot:nth-of-type(5),
.die--6 .dot:nth-of-type(6) {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  width: 20%;
  height: 20%;
}
.die--6 .dot:nth-of-type(6) {
  left: auto;
  right: 10%;
}
.dot {
  width: 25%;
  height: 25%;
  border-radius: 50%;
}
</style>
