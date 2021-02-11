<template>
    <a-layout-sider v-model="collapsed" collapsible>
        <div class="logo" />
        <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">

          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" /><span>ADMINISTRACIÒN</span></span>
            <a-menu-item key="3"><router-link to="/search">Busqueda Deudas</router-link></a-menu-item>
             <a-menu-item key="4"><router-link to="/debts">Deudas</router-link></a-menu-item>
            <a-menu-item key="5"> Alex </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="team" /><span>ENTIDADES</span></span>
            <a-menu-item key="6"><router-link to="/UploadFile">Subir Archivo</router-link></a-menu-item>
           
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="team" /><span>RECAUDACIÒN</span></span>
            <a-menu-item key="6"><router-link to="/search">Cobro Deudas</router-link></a-menu-item>
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
