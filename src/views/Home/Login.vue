<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div
          class="login100-form-title"
          v-bind:style="{
            'background-image':
              'url(' + require('../../assets/images/logo.png') + ')',
          }"
        ></div>

        <form class="login100-form">
          <div
            class="wrap-input100 validate-input m-b-26"
            data-validate="Username is required"
          >
            <span class="label-input100">Usuario</span>
            <a-input
              name="username"
              placeholder="Ingrese su usuario"
              v-model="usuario.username"
            />
            <span class="focus-input100"></span>
          </div>

          <div
            class="wrap-input100 validate-input m-b-18"
            data-validate="Password is required"
          >
            <span class="label-input100">Contraseña</span>
            <a-input-password
              v-model="usuario.password"
              placeholder="Ingrese su contraseña"
            />
          </div>

          <div class="container-login100-form-btn">
            <a-button type="primary" @click="login" style="width: 100%">
              Login
            </a-button>
          </div>
          <div
            wrap-input100
            validate-input
            m-b-18
            style="width: 100%; margin: 5px"
            v-if="showError"
          >
            <a-alert
              message="Hay un problema en el ingreso al sistema."
              description="El usuario o contraseña no son correctos. Si realizo más de 5 intentos fallidos el sistema bloqueara su cuenta."
              type="error"
              show-icon
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/util.css";
import "../../assets/css/main.css";

import loginServices from "../../service/Home/Login.service";

export default {
  data() {
    return {
      response: undefined,
      show: false,
      usuario: {
        username: "",
        password: "",
      },
      errorCredenciales: false,
      showError: false,
    };
  },
  methods: {
    login() {
      // this.usuario.username = this.usuario.username.toUpperCase();
      this.showError = false;
      loginServices
        .login(this.usuario)
        .then((response) => {
          return response.data;
        })
        .then((data) => {
          this.showError = true;
          this.$store.dispatch("guardarToken", data.access_token);
          this.$router.push({
            name: "index",
          });
        })
        .catch((error) => {
          this.showError = true;
        });
    },
  },
};
</script>
<style scoped>
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
  background-color: #89136b;
  color: #ffffff;
  text-align: left;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #89136b;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #89136b;
}
</style>
