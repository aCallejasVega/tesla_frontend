<template>
  <div>
    <a-form>
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Nombres :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input placeholder="Nombres" v-model="form.nombres">
              <a-icon slot="suffix" type="user" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Ap. Paterno :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input placeholder="Apellido Paterno" v-model="form.paterno">
              <a-icon slot="suffix" type="user" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Ap. Materno :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input placeholder="Apellido Materno" v-model="form.materno">
              <a-icon slot="suffix" type="user" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Nro. Documento :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input-group compact>
              <a-input
                placeholder="Nro. de Documento."
                style="width: 60%"
                v-model="form.nroDocumento"
              >
                <a-icon slot="suffix" type="idcard" />
              </a-input>
              <a-select
                default-value="Extensión"
                style="width: 40%"
                v-model="form.extensionDocumentoId"
              >
                <a-select-option
                  v-for="(extension, index) in extensionDocumentoList"
                  :key="index"
                  v-bind:value="extension.dominioId"
                >
                  {{ extension.abreviatura }}
                </a-select-option>
              </a-select>
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <a-form-item
            label="Dirección :"
            :label-col="formItemOneLayout.labelCol"
            :wrapper-col="formItemOneLayout.wrapperCol"
          >
            <a-textarea
              placeholder="Dirección domiciliaria"
              auto-size
              v-model="form.direccion"
            >
              <a-icon slot="suffix" type="environment" />
            </a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Email :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input
              placeholder="Correo Electronico"
              v-model="form.correoElectronico"
            >
              <a-icon slot="suffix" type="global" />
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-form-item
            label="Teléfono :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input placeholder="Teléfono" v-model="form.telefono">
              <a-icon slot="suffix" type="phone" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="top" :gutter="16">
        <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <a-button
            type="dashed"
            block
            :style="{
              fontSize: '19px',
              height: '40px',
            }"
          >
            Cancelar
          </a-button>
        </a-col>
        <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
          <a-button
            type="primary"
            block
            :style="{
              fontSize: '19px',
              height: '40px',
            }"
            @click="savePersona"
          >
            <a-icon type="save" />
            Registrar
          </a-button>
        </a-col>
      </a-row>
    </a-form>
   
  </div>
</template>
<script>
import AdminUsuarios from "../../service/Administraciones/AdminUsuarios.services";

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
const formItemOneLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
  },
};

export default {
  data() {
    return {
      formItemTowLayout,
      formItemOneLayout,
      form: {
        nombres: null,
        paterno: null,
        materno: null,
        direccion: null,
        correoElectronico: null,
        telefono: null,
        nroDocumento: null,
        ciudadId: null,
        ciudad: null,
        tipoDocumentoId: null,
        tipoDocumento: null,
        extensionDocumento: null,
        extensionDocumentoId: null,
      },
      estado: null,
      extensionDocumentoList: [],
    };
  },
  computed: {},
  created() {
    this.getDominioExtensionDocumento();
  },
  methods: {
    getDominioExtensionDocumento() {
      AdminUsuarios.getDominioExtensionDocumento()
        .then((response) => {
          this.extensionDocumentoList = response.data.result;
        })
        .catch((error) => {});
    },
    savePersona() {
      console.log(JSON.stringify(this.form));
      console.log("------------------save");
      AdminUsuarios.savePersona(this.form)
        .then((response) => {
          console.log("------------------ingreso a si");
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log("------------------ingreso a no");
        });
    },
  },
};
</script>
<style scoped>
.card-head {
  border: 2px solid #08632d;
  border-radius: 8px;
  height: 45px;
  width: 100%;
  color: #08632d;
  font-size: 15px;
}
</style>