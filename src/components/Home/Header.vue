<template>
  <a-layout-header
    style="background: #89136b; height: 100px; padding-left: 0px; padding-right: 0px"
  >
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="20" style="height: 100%"
        ><img src="../../../public/teslapng.png"
      /></a-col>
      <a-col :span="4" justify="space-around" style="height: 100%">
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="20" style="height: 100%"> </a-col>
          <a-col :span="4">
            <a-popover placement="left" trigger="click" style="height: 100px">
              <template slot="content" style="height: 100px">
                <a-row type="flex" justify="end" align="top" block style="height: 70px">
                  <a-col
                    :xs="24"
                    :sm="24"
                    :md="6"
                    :lg="4"
                    :xl="4"
                    flex="auto"
                    style="text-align: center"
                  >
                    <a-avatar :size="60" icon="user" />
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="11" :lg="13" :xl="13">
                    <a-row type="flex" justify="space-around" align="top">
                      <a-col :span="8">Usuario:</a-col>
                      <a-col :span="16">Adalid Callejas Vega</a-col>
                      <a-col :span="8">Entidad:</a-col>
                      <a-col :span="16">Banco Fies</a-col>
                      <a-col :span="8">Sucursal:</a-col>
                      <a-col :span="16">6 de Agoto</a-col>
                    </a-row>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7">
                    <a-row type="flex" justify="start" align="top"
                      ><a-col :span="24"
                        ><a-button type="primary" icon="logout" block @click="logout">
                          Cerrar sesión
                        </a-button></a-col
                      >
                    </a-row>

                    <a-row type="flex" justify="start" align="top"
                      ><a-col :span="24"
                        ><a-button block icon="setting">
                          Cambiar contraseña
                        </a-button></a-col
                      >
                    </a-row>
                  </a-col>
                </a-row>
              </template>
              <a-button
                type="link"
                style="background-color: #ffffff; padding-left: 5px"
                @mouseover="changeUnlock"
                @mouseleave="changeLock"
              >
                <a-icon :type="iconConfig" :style="{ fontSize: '15px' }" />
              </a-button>
            </a-popover>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
import store from "../../store/index";
export default {
  data() {
    return {
      iconConfig: "lock",
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("salir");
    },
    changeUnlock() {
      this.iconConfig = "unlock";
    },
    changeLock() {
      this.iconConfig = "lock";
    },
  },
};
</script>

<style scoped>
/* Style buttons */
.btn {
  background-color: DodgerBlue; /* Blue background */
  border: none; /* Remove borders */
  color: white; /* White text */
  padding: 12px 16px; /* Some padding */
  font-size: 16px; /* Set a font size */
  cursor: pointer; /* Mouse pointer on hover */
  height: 80%;
}

/* Darker background on mouse-over */
.btn:hover {
  background-color: RoyalBlue;
}
img {
  max-width: 100%;
  height: auto;
}
.header {
  background: rgb(249, 251, 251);
  background: -moz-linear-gradient(
    90deg,
    rgba(249, 251, 251, 1) 0%,
    rgba(233, 108, 201, 1) 53%,
    rgba(149, 43, 122, 1) 100%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(249, 251, 251, 1) 0%,
    rgba(233, 108, 201, 1) 53%,
    rgba(149, 43, 122, 1) 100%
  );
  background: linear-gradient(
    90deg,
    rgba(249, 251, 251, 1) 0%,
    rgba(233, 108, 201, 1) 53%,
    rgba(149, 43, 122, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f9fbfb",endColorstr="#952b7a",GradientType=1);
}
</style>
