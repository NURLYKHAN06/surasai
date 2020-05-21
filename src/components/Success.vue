<template>
  <transition name="fadeHeight">
    <div
      v-show="successStateData"
      class="uk-alert-success uk-margin-small-bottom"
      uk-alert
      id="alert-success"
    >
      <button type="button" id="close-btn" @click="$emit('closeAlert', false)" uk-close></button>
      <p class="uk-margin-remove-top">{{ successText }}</p>
    </div>
  </transition>
</template>
<script>
export default {
  props: ["successState", "successText"],
  data() {
    return {};
  },
  computed: {
    successStateData() {
      return this.successState;
    }
  },
  created() {}
};
</script>
<style scoped>
#alert-success {
  max-width: 400px;
  margin: 0 auto;
}
#close-btn {
  position: absolute;
  right: 15px;
  top: 20px;
}
</style>


