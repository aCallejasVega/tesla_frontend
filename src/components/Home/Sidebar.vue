<template>

 <a-layout-sider v-model="collapsed" collapsible >
    <div class="logo" />
    <a-menu theme="dark" breakpoint="xl" :default-selected-keys="['1']" mode="inline" collapsedWidth='150'>
      <a-sub-menu key="sub1" v-for="(menu, index) in menuList" :key="index">
        <span slot="title"
          ><a-icon :type="menu.icono" /><span>{{ menu.descripcion }}</span></span
        >
        <a-menu-item
          v-for="(subMenu, index2) in menu.segPrivilegioEntityList"
          :key="index2"
          style="padding-right: 0px"
        >
          <router-link :to="subMenu.link">
           <span>{{
              subMenu.descripcion
            }}</span>
          </router-link>
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