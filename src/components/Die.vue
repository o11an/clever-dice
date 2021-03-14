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
    ></div>
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
    },
    dotColor: {
      type: String,
      required: true,
    },
  },
  watch: {},
  computed: {},
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
  box-shadow: 0 0 15px -7px rgba(0, 0, 0, 0.5);
  margin: 10px;
  padding: 1%;
  display: flex;
}
.die--1 {
  align-items: center;
  justify-content: center;
}
.die--2,
.die--3 {
  display: flex;
  justify-content: space-between;
}
.die--2 .dot:last-child,
.die--3 .dot:last-child {
  align-self: flex-end;
}
.die--3 .dot:nth-of-type(2) {
  align-self: center;
}
.die--4 {
}
.die--2 {
}
.dot {
  width: 25%;
  height: 25%;
  border-radius: 50%;
}
</style>
