<template>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div
          class="login100-form-title"
          v-bind:style="{
            'background-image': 'url(' + require('../../assets/images/bg-01.jpg') + ')',
          }"
        >
          <span class="login100-form-title-1">Bienvenido</span>
        </div>

        <form class="login100-form">
          <div
            class="wrap-input100 validate-input m-b-26"
            data-validate="Username is required"
          >
            <span class="label-input100">Usuario</span>
            <input
              class="input100"
              type="text"
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
            <input
              class="input100"
              type="password"
              name="pass"
              v-model="usuario.password"
              placeholder="Ingrese su contraseña"
            />
            <span class="focus-input100"></span>
          </div>

          <div class="flex-sb-m w-full p-b-30">
            <div class="contact100-form-checkbox">
              <input
                class="input-checkbox100"
                id="ckb1"
                type="checkbox"
                name="remember-me"
              />
              <label class="label-checkbox100" for="ckb1"> Remember me </label>
            </div>

            <div>
              <a href="#" class="txt1"> Forgot Password? </a>
            </div>
          </div>

          <div class="container-login100-form-btn">
            <a-button type="primary" @click="login"> Login </a-button>
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
    };
  },
  methods: {
    login() {
      // this.usuario.username = this.usuario.username.toUpperCase();
      loginServices
        .login(this.usuario)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response.data;
        })
        .then((data) => {
          this.$store.dispatch("guardarToken", data.access_token);
          this.$router.push({
            name: "home",
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
