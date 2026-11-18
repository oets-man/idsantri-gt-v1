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
const request = async () => {
  try {
    const response = await Api.requestOtp('oets.man@gmail.com')
    console.log('response', response)
  } catch (error) {
    console.log('error', error)
  }
}
const verify = async () => {
  try {
    const response = await Api.verifyOtp('oets.man@gmail.com', '249219')
    console.log('response', response)
  } catch (error) {
    console.log('error', error)
  }
}

const profile = async () => {
  try {
    const response = await Api.getProfile()
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
    <button @click="register">register</button>
    <button @click="request">request</button>
    <button @click="verify">verify</button>
    <button @click="profile">profile</button>
  </p>
</template>

<style scoped></style>
