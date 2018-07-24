<template>
  <header id="header">
    <router-link class="icon-back"  v-show="prveOpt.backUrl" :to="{path:prveOpt.backUrl,query:prveOpt.query}"></router-link>
    <h1>{{prveOpt.title}}</h1>
  </header>
</template>

<script>
export default {
  props: {
    prveOpt: {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#header{
  position:fixed;
  top:0;
  width:100%;
  min-width: 320px;
  max-width: 640px;
  height:45px;
  border-bottom:1px solid #c9c9c9;
  background-color:#fff;
  z-index: 10;
}

#header .icon-back{
  position: absolute;
  top:0;
  left:0;
  width:45px;
  height:45px;
  background:url(icon-back.png) no-repeat center center/45%;
}

#header h1{
  margin-left:45px;
  margin-right:45px;
  height:45px;
  line-height: 45px;
  font-size:16px;
  color:#515151;
  text-align: center;
}
</style>
