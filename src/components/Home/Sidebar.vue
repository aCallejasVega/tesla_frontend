<template>
    <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">

          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" /><span>ADMINISTRACIÒN</span></span>
            <a-menu-item key="3"> Tom </a-menu-item>
            <a-menu-item key="4"> Bill </a-menu-item>
            <a-menu-item key="5"> Alex </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="team" /><span>ENTIDADES</span></span>
            <a-menu-item key="6"> Team 1 </a-menu-item>
            <a-menu-item key="8"> Team 2 </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="team" /><span>RECAUDACIÒN</span></span>
            <a-menu-item key="6"> Team 1 </a-menu-item>
            <a-menu-item key="8"> Team 2 </a-menu-item>
          </a-sub-menu>

        </a-menu>
      </a-layout-sider>

</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
    };
  },
};
</script>
