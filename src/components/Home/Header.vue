<template>
  <a-layout-header style="padding-left: 0px; padding-right: 5px">
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
              <span>Notificaciones</span>
            </template>
            <a-badge
              :count="countNotifications"
              :number-style="{ color: '#fff', borderColor: '#d9d9d9' }"
            >
              <a-button shape="circle" @click="displayNotifications = true">
                <a-icon type="bell" :style="{ fontSize: '20px' }" />
              </a-button>
            </a-badge>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>CAMBIAR CONTRASEÑA</span>
            </template>
            <a-button shape="circle" @click="mostrarModalPassword()">
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
    <Notificaciones @updatingNotif="updateNotif" v-show="false" />
    <a-modal
      v-model="displayNotifications"
      title="Notificaciones"
      ok-text="Cobrar"
      cancel-text="Cancelar"
      width="600px"
      :centered="false"
      :closable="true"
      :maskClosable="false"
      :footer="null"
    >
      <Notificaciones @updatingNotif="updateNotif" />
    </a-modal>

    <a-modal
      v-model="showModalPassword"
      title="Cambio de contraseña"
      @ok="showModalPassword = false"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" size="small">
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-model-item
              ref="passwordActual"
              prop="passwordActual"
              label="Password Actual :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input-password
                placeholder="Password Actual"
                v-model="form.passwordActual"
                @blur="
                  () => {
                    $refs.passwordActual.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="global" />
              </a-input-password>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-model-item
              ref="passwordNew1"
              prop="passwordNew1"
              label="Nuevo Password :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input-password
                placeholder="Nuevo Password"
                v-model="form.passwordNew1"
                @blur="
                  () => {
                    $refs.passwordNew1.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="global" />
              </a-input-password>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-model-item
              ref="passwordNew2"
              prop="passwordNew2"
              label="Confirmación password :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input-password
                placeholder="Confirmar Password"
                v-model="form.passwordNew2"
                @blur="
                  () => {
                    $refs.passwordNew2.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="global" />
              </a-input-password>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
      <template slot="footer">
        <a-button @click="cerrarModalPassword()"> Cancelar </a-button>
        <a-button type="primary" @click="cambiarPassord()"> Aceptar </a-button>
      </template>
    </a-modal>
  </a-layout-header>
</template>

<script>
import store from "../../store/index";
import Sidebar from "@/service/Home/Sidebar.service";
import Notificaciones from "./Notificaciones.vue";

const formItemTowLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 8 },
    xl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
  },
};
export default {
  components: {
    Notificaciones,
  },
  data() {
    return {
      formItemTowLayout,
      iconConfig: "lock",
      datos: {
        nombreUsuario: null,
        correo: null,
        nombreEntidad: null,
        path: null,
      },
      displayNotifications: false,
      countNotifications: 0,
      showModalPassword: false,
      form: {},
      rules: {
        passwordActual: [
          {
            required: true,
            message: "Debe introducir su Password Actual",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mínimante el password debe tener 6 caracteres",
            trigger: "blur",
          },
        ],

        passwordNew1: [
          {
            required: true,
            message: "Debe introducir su Password Nuevo",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mínimante el password debe tener 6 caracteres",
            trigger: "blur",
          },
        ],
        passwordNew2: [
          {
            required: true,
            message: "Debe introducir su Password Nuevo",
            trigger: "blur",
          },
          {
            min: 6,
            message: "Mínimante el password debe tener 6 caracteres",
            trigger: "blur",
          },
        ],
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
    updateNotif(value) {
      this.countNotifications = value;
    },
    mostrarModalPassword() {
      this.showModalPassword = true;
      this.form = {};
    },
    cerrarModalPassword() {
      this.showModalPassword = false;
      this.form = {};
    },
    cambiarPassord() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          Sidebar.cambiarPassord(this.form)
            .then((response) => {
              this.$notification.success(response.data.message);
              this.showModalPassword = false;
            })
            .catch((error) => {
              this.$notification.error(error.response.data.message);
            });
        }
      });
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