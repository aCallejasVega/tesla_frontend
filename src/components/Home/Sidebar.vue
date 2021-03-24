<template>
  <a-layout-sider
    v-model="collapsed"
    collapsible
    style="width: 256px"
    theme="light"
  >
    <br />
    <a-menu
      theme="light"
      breakpoint="xl"
      :default-selected-keys="['1']"
      mode="inline"
      collapsedWidth="150"
    >
      <a-menu-item v-for="(menu) in menuList" :key="menu.privilegiosId">
        <a-icon :type="menu.icono" />

        <span @click="navegar(menu.link)">
          {{ menu.descripcion }}
        </span>
      </a-menu-item>
      <a-sub-menu v-for="(men) in subMenuList" :key="men.privilegiosId">
        <span slot="title"
          ><a-icon :type="men.icono" /><span> {{ men.descripcion }}</span></span
        >
        <a-menu-item
          v-for="(subMenu) in men.segPrivilegioEntityList" :key="subMenu.privilegiosId"
                 >
          <span @click="navegar(subMenu.link)">
            {{ subMenu.descripcion }}
          </span>
        </a-menu-item>
      </a-sub-menu>
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
      subMenuList: [],
    };
  },
  created() {
    this.getMenu();
    this.getSubMenu();
  },
  methods: {
    getMenu() {
      Sidebar.getMenu()
        .then((response) => {
          this.menuList = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSubMenu() {
      Sidebar.getSubMenu()
        .then((response) => {
          this.subMenuList = response.data.data;
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
