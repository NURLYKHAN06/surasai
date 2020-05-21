<template>
  <transition name='fadeHeight'>
        <div v-show="errorState" class="uk-alert-danger" uk-alert>
            <p v-for="error in errors" :key="error">{{ error }}</p>
        </div>
    </transition>
</template>
<script>
export default {
    props:['errors', 'errorState']
}
</script>
<style >
.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.2s;
  max-height: 50px;
}
.fadeHeight-enter,
.fadeHeight-leave-to
{
  margin: 0;
  padding: 0;
  opacity: 0;
  max-height: 0px;
}
</style>

