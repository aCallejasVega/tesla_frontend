<template>
  <a-row type="flex" justify="space-around" align="middle">
    <a-col :span="12">
      <p class="height-100">
        <a-card hoverable style="width: 500px">
          <a-row type="flex">
            <a-col :span="12"> Usuario : </a-col>
            <a-col :span="12">
              <a-input
                placeholder="Ingrese su nombre de usuario"
                allow-clear
                v-model="usuario.username"
              />
            </a-col>
          </a-row>

          <a-row type="flex">
            <a-col :span="12"> Contraseña : </a-col>
            <a-col :span="12">
              <a-input-password
                placeholder="Ingrese su password"
                v-model="usuario.password"
              />
            </a-col>
          </a-row>

          <template slot="actions" class="ant-card-actions">
            <a-button type="primary" ghost @click="login"> INGRESAR </a-button>
          </template>
        </a-card>
      </p>
    </a-col>
  </a-row>
</template>

<script>
import loginServices from '../../service/Home/Login.service';

export default {
  data() {
    return {
      response: undefined,
      show: false,
      usuario: {
        username: '',
        password: '',
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
          this.$store.dispatch('guardarToken', data.access_token);
          this.$router.push({
            name: 'home',
          });
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
