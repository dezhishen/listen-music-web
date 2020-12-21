<template>
  <div>
    <audio :src='url' ref="theAudio" controls="controls">
    </audio>
  </div>
</template>
<script>
export default {
  name: 'my-audio',
  data () {
    return {
      url: null
    }
  }
}
</script>
