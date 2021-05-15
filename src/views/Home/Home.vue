<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout>
      <Sidebar />
      <a-layout>
        <Header />
        <a-layout-content style="margin: 0 16px; background-color: #fcfafa">
          <router-view> </router-view>
        </a-layout-content>
        <Footer />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import Footer from "@/components/Home/Footer.vue";
import Header from "@/components/Home/Header.vue";
import Sidebar from "@/components/Home/Sidebar.vue";

export default {
  components: {
    Footer,
    Header,
    Sidebar,
  },

};
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
