<script setup>
import Api from './model/Api'

const register = async () => {
  try {
    const response = await Api.register(null, null, null)
    console.log('response', response)
  } catch (error) {
    console.log('error', error)
  }
}
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <p>
    <button @click="register">count is: {{ count }}</button>
  </p>
</template>

<style scoped></style>
