<script lang="ts" setup>
import { onMounted } from 'vue'
import { Animater } from '../../../../packages/core/src'

defineOptions({
  name: 'UPlayground',
})

onMounted(() => {
  const animater = new Animater('.u-playground__block', {
    translateX: '100px',
    backgroundColor: 'red',
  }, {
    duration: 2000,
    delay: 1000,
  })
  console.warn(animater)
})
</script>

<template>
  <div class="u-playground">
    <div class="u-playground__block" />
  </div>
</template>

<style lang="scss">
.u-playground {
  &__block {
    margin-top: 24px;
    width: 80px;
    height: 80px;
    background: blue;
  }
}
</style>
