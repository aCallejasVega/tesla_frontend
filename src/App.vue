<template>
  <div id="app">
    <router-view />
    <notifications
      group="notification"
      position="bottom right"
      :duration="6000"
      :max="10"
    >
      <template slot="body" slot-scope="props">
        <a-alert
          :message="props.item.title"
          :description="props.item.text"
          :type="props.item.type"
          show-icon
        />
      </template>
    </notifications>
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>
<script>
import store from "./store";
export default {
  components: {},
  data() {
    return {};
  },
  created() {    
    this.$store.dispatch("autoLogin");
  },
};
</script>
<style>
</style>
