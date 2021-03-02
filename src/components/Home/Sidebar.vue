<template>
  <a-layout-sider v-model="collapsed" collapsible style="width: 256px" theme="light">
    <br />
    <a-menu
      theme="light"
      breakpoint="xl"
      :default-selected-keys="['1']"
      mode="inline"
      collapsedWidth="150"
    >
      <a-menu-item v-for="(menu, index) in menuList" :key="index">
        <a-icon :type="menu.icono" />

        <span @click="navegar(menu.link)">
          {{ menu.descripcion }}
        </span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
import Sidebar from "@/service/Home/Sidebar.service";
export default {
  data() {
    return {
      collapsed: true,
      menuList: [],
    };
  },
  created() {
    this.getMenu();
  },
  methods: {
    getMenu() {
      Sidebar.getMenu()
        .then((response) => {
          this.menuList = response.data.data;
          console.log(JSON.stringify(this.menuList));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    navegar(link) {
      this.$router.replace({
        name: link,
      });
    },
  },
};
</script>
<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
