<template>
  <a-layout-header style="background: #fff">
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="20">TESLA</a-col>
      <a-col :span="4" justify="space-around">
        <a-row type="flex" justify="space-around" align="top">
          <a-col :span="20">
            <div
              style="
                line-height: 100%;
                padding-top: 10%;
                float: right;
                padding-right: 10px;
              "
            >
              <b>Adalid Callejas</b>
              <br />
              <b style="font-size: x-small">BANCO FIES</b>
            </div>
          </a-col>
          <a-col :span="4">
            <a-popover
              placement="bottomRight"
              title="Configuración de datos de usuario."
              trigger="click"
            >
              <template slot="content">
                <a-row type="flex" justify="end" align="top" block>
                  <a-col :xs="24" :sm="24" :md="6" :lg="4" :xl="4" flex="auto" style="text-align:center" >
                    <a-avatar :size="80" icon="user" />
                  </a-col>
                  <a-col  :xs="24" :sm="24" :md="11" :lg="13" :xl="13"  >
                    <a-row type="flex" justify="space-around" align="top">
                      <a-col :span="8">Usuario:</a-col>
                      <a-col :span="16">Adalid Callejas Vega</a-col>
                      <a-col :span="8">Entidad:</a-col>
                      <a-col :span="16">Banco Fies</a-col>
                      <a-col :span="8">Sucursal:</a-col>
                      <a-col :span="16">6 de Agoto</a-col>
                    </a-row>
                  </a-col>
                  <a-col :xs="24" :sm="24" :md="7" :lg="7" :xl="7"  >
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
              <a-button type="link">
                <a-avatar :size="50" icon="user" />
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
  methods: {
    logout() {
      this.$store.dispatch("salir");
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
</style>
