<template>
  <a-card style="width=100%">
     <a-form-model
        ref="ruleFromCred"
        :model="credencialesFacturacionObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-form-model-item ref="login" label="Login" prop="login">
          <a-input
            v-model="credencialesFacturacionObj.login"
            @blur="
              () => {
                $refs.login.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item ref="password" label="Password" prop="password">
          <a-input
            v-model="credencialesFacturacionObj.password"
            @blur="
              () => {
                $refs.password.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
     </a-form-model>
     <template slot="actions" class="ant-card-actions">
         <a-button type="link" @click="onSubmit" style="color:white; background-color:#339966;border:0px" > 
          <a-icon type="form" />
            Registrar 
          </a-button>
          <a-button type="primary" ghost @click="resetForm"><a-icon type="reload" /> Limpiar </a-button>
      </template>
  </a-card>
</template>
<script>

import SucursalesEntidades from "../../service/Administraciones/SucursalEntidad.service";

export default {
  props: {
    entidadId: null,
    sucursalEntidadId: null,
  },
  data() {
    return {
      credencialesFacturacionObj: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        login: [
          {
            required: true,
            message: "Debe registrar el login.",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Debe registrar el password.",
            trigger: "blur",
          },
        ],
        
      },
    }
  },
  mounted() {
    this.cargarCredencial(this.sucursalEntidadId);
  },
  watch: {
    sucursalEntidadId (newId, oldId) {
      this.cargarCredencial(this.sucursalEntidadId);
    }
  },
  methods: {
    cargarCredencial(sucursalEntidadId) {
      console.log('se=' + sucursalEntidadId)
      SucursalesEntidades.getCredencialFacturacion(sucursalEntidadId).then((r) => {
        if(r.status === 204) {
          this.credencialesFacturacionObj = {};
          return;
        }

        this.credencialesFacturacionObj = r.data.result;
        
        

      }).catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.credencialesFacturacionObj = {};
      });
      
    },
    guardarCredenciales(obj) {
      this.$Progress.start();
      obj.entidadId = this.entidadId;
      obj.sucursalEntidadId = this.sucursalEntidadId;
      SucursalesEntidades.putCredencialesFacturacion(obj).then((r) => {
        this.$emit('closeComponent', false);
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.$Progress.fail();
      });
    },
    onSubmit() {
      this.$refs.ruleFromCred.validate((valid) => {
        console.log(valid);
        if (valid) {
          this.guardarCredenciales(this.credencialesFacturacionObj);
        } else {
          console.log("error submit!!");
          this.$notification.warning("Debe resolver las validaciones del formulario.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleFromCred.resetFields();
    },

  },
}
</script>