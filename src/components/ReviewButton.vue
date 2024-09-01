<script setup>
</script>

<template>
  <router-link :to="{ name: 'project'}">
    <button id="review-button">Review Projects</button>
  </router-link>

</template>

<style scoped lang="scss">
$backgroundBlue: #3168eb;
$warmWhite: #faf6ee;
#review-button {
  padding: 1.5rem;
  background: $backgroundBlue;
  border-radius: 45px;
  border: $warmWhite;
  font-size: 25px;
  color: $warmWhite;
  font-weight: bold;
  transition: all ease-in-out 0.3s;

  &:hover {
    color: #ffffff;
    background: rgb(20, 5, 140);
  }
}

</style>