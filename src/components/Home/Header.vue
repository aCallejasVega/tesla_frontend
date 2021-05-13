<template>
  <a-layout-header  style="padding-left: 0px; padding-right: 5px">
    <a-row type="flex" justify="end" align="top">
      <a-col
        :span="10"
        style="
          font-weight: bold;
          color: white;
          text-align: right;
          padding-right: 10px;
        "
      >
        <div>
          SIN
          <a-badge
            count="."
            :number-style="{ backgroundColor: '#52c41a', color: '#52c41a' }"
          />
          <a-divider type="vertical" />
          {{ datos.nombreUsuario }}
          <a-divider type="vertical" />

          <a-tooltip placement="bottom">
            <template slot="title">
              <span>CAMBIAR CONTRASEÑA</span>
            </template>
            <a-button shape="circle">
              <a-icon type="setting" :style="{ fontSize: '20px' }" />
            </a-button>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="bottom">
            <a-popconfirm
              placement="leftTop"
              ok-text="Si"
              cancel-text="No"
              @confirm="logout"
            >
              <template slot="title">
                <br />
                <p>ESTA SEGURO(A) DE SALIR DEL SISTEMA?</p>
              </template>
              <a-button shape="circle">
                <a-icon type="logout" :style="{ fontSize: '20px' }" />
              </a-button>
            </a-popconfirm>
            <template slot="title">
              <span>SALIR DEL SISTEMA</span>
            </template>
          </a-tooltip>
        </div>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script>
import store from "../../store/index";
import Sidebar from "@/service/Home/Sidebar.service";

export default {
  data() {
    return {
      iconConfig: "lock",
      datos: {
        nombreUsuario: null,
        correo: null,
        nombreEntidad: null,
        path: null,
      },
    };
  },
  created() {
    this.getDatosLogin();
  },
  methods: {
    getDatosLogin() {
      Sidebar.getDatosLogin()
        .then((response) => {
     
          this.datos = response.data.data;
        })
        .catch((error) => {
          console.log("Error");
          this.datos = [];
        });
    },
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
@import url("https://fonts.googleapis.com/css2?family=Cabin+Sketch&family=Cormorant+Unicase:wght@700&family=Great+Vibes&family=Merriweather&display=swap");

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

.text-famili3 {
  font-family: "Cabin Sketch", cursive;
  font-family: "Cormorant Unicase", serif;
  font-family: "Great Vibes", cursive;
  font-family: "Merriweather", serif;
  font-size: 300%;
  color: #ffffff;
  top: 15px;
}
.responsive {
  width: 100%;
  height: auto;
}
</style>
