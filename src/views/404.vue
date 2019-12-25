<template>
  <div id="logo"></div>
</template>
<script>
export default {
  name: "404",
  created(){
    document.title = "页面发生错误！";
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  border: 0;
}
#logo {
  background: url("../assets/404.gif");
  background-size: 100% 100%;
  height: 100%;
  position: fixed;
  width: 100%;
}
</style>
