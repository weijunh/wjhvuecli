<template>
  <div id="test">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
}
</script>

<style scope lang="less">
#test {
  width: 50vw;
  height: 50vh;
  background-color: red;
  overflow: hidden;
  .one {
    margin-top: 10px;
    width: 20vw;
    height: 20vh;
    background-color: green;
  }
  .two {
    margin-top: 10px;
    width: 10vw;
    height: 10vh;
    background-color: pink;
  }
}
</style>