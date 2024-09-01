<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
<router-link :to="{ name: 'project'}" class="text-style">
  <h1 id="pageTitle">Keep your Bach on Tracks</h1>
</router-link>
  <RouterView/>

</template>

<style scoped lang="scss">
.text-style {
  text-decoration: none;
}
</style>
