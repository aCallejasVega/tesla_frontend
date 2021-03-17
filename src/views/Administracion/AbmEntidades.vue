<template>
  <div>
    <a-card v-if="!displayForm" style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224, 206, 206)"
        title="Administración de Registro de Entidades"
      />
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group>
          <a-button
            v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
          >
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE ENTIDADES------------------------------------------>
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstEntidades"
        rowKey="entidadId"
        :pagination="pagination"
        :scroll="{ x: 1500 }"
      >
        <template slot="comprobante" slot-scope="text, record">
          <a-checkbox :checked="record.comprobanteEnUno"> </a-checkbox>
        </template>
        <template slot="logo" slot-scope="text, record">
         <img
            :src="record.pathLogo"
            :alt="record.pathLogo"
            width="64px"
            height="64px"
          />
          <a-button type="link" @click="openModalLogo(record.entidadId, record.nombre)" icon="upload" size="small" v-if="record.estado != 'DESACTIVO'">
            Subir
          </a-button>
        </template>
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'DESACTIVO'" align="center">
            <a-tag color="red">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'CREADO'" align="center">
            <a-tag color="blue">
              {{ record.estado }}
            </a-tag>
          </div>
        </template>
        <template
          slot="opciones"
          slot-scope="text, record"
          v-if="record.estado == 'ACTIVO' || record.estado == 'CREADO'"
        >
        {{record.entidadId}}
          <a href="javascript:;" @click="openModalComision(record.entidadId)">
            Comisión </a
          ><br />
          <a href="javascript:;" @click="mostrarSucursal(record.entidadId)">
            Sucursales
          </a>
          <br />
          <!--
          <a-badge :count="record.recaudadorIdLst !== null ? 7 : 0" :number-style="{
            backgroundColor: '#fff',
            color: '#999',
            boxShadow: '0 0 0 1px #d9d9d9 inset',
          }">
            <a href="javascript:;" @click="openModal(record.entidadId)" class="head-example"> Recaudadoras </a>
          </a-badge>-->
          <a
            href="javascript:;"
            @click="openModalRecaudadora(record.entidadId)"
            class="head-example"
          >
            Recaudadoras
          </a>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="displayForm">
      <a-page-header
        style="border: 1px solid rgb(224, 206, 206)"
        title="Administración de Empresas, Universidades y otros"
        :sub-title="subTitle"
        @back="() => volverListado()"
      />
      <br />
      <!--FORMULARIO DE ENTIDADES---------------------------------------->
      <a-form-model
        ref="ruleForm"
        :model="entidadObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-divider orientation="left">Información General</a-divider>
        <a-form-model-item ref="nombre" label="Nombre Empresa" prop="nombre">
          <a-input
            v-model="entidadObj.nombre"
            :maxLength="200"
            @blur="
              () => {
                $refs.nombre.onFieldBlur();
              }
            "
          />
        </a-form-model-item>
        <a-form-model-item label="Tipo Entidad" prop="tipoEntidadId">
          <a-select
            v-model="entidadObj.tipoEntidadId"
            placeholder="Seleccione Tipo Entidad"
            @change="habilitarNombreComercial"
          >
            <a-select-option
              v-for="(item, i) in lstTiposEntidades"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          ref="nombreComercial"
          label="Nombre Comercial"
          prop="nombreComercial"
        >
          <a-input
            v-model="entidadObj.nombreComercial"
            :disabled="disabledNombreComercial"
            :maxLength="200"
          />
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="entidadObj.direccion"
            @blur="
              () => {
                $refs.direccion.onFieldBlur();
              }
            "
            :maxLength="200"
          />
        </a-form-model-item>
        <a-form-model-item ref="telefono" label="Teléfono" prop="telefono">
          <a-input
            v-model="entidadObj.telefono"
            @blur="
              () => {
                $refs.telefono.onFieldBlur();
              }
            "
            :maxLength="10"
          />
        </a-form-model-item>
        <!--
        <a-form-model-item ref="pathLogo" label="Logo" prop="pathLogo">
          <a-input v-model="entidadObj.pathLogo" />
          <img :src="entidadObj.pathLogo" alt="" width="128px" height="128px" />
        </a-form-model-item>
        <a-form-model-item ref="pathLogo" label="Logo" prop="pathLogo">
          
       
<a-upload 
    name="file"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="this.url"
    :before-upload="beforeUpload"
    @change="handleChange"
    :headers="{ Authorization: 'Bearer ' + this.token }"
    withCredentials
  >
    <img v-if="imageUrl" :src="imageUrl" alt="" width="128px" height="128px" />
    <div v-else>
      <a-icon :type="loading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">
        Upload
      </div>
    </div>
  </a-upload>
  {{entidadObj.pathLogo}}
        </a-form-model-item>-->
        <a-divider orientation="left">Información Tributaria</a-divider>
        <a-form-model-item
          label="Actividad Económica"
          prop="actividadEconomicaId"
        >
          <a-select
            v-model="entidadObj.actividadEconomicaId"
            placeholder="Seleccione Actividad Económica"
          >
            <a-select-option
              v-for="(item, i) in lstActividadesEconomicas"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Municipio" prop="municipioId">
          <a-select
            v-model="entidadObj.municipioId"
            placeholder="Seleccione Municipio"
          >
            <a-select-option
              v-for="(item, i) in lstMunicipios"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="nit" label="Nit" prop="nit">
          <a-input
            v-model="entidadObj.nit"
            @blur="
              () => {
                $refs.nit.onFieldBlur();
              }
            "
            :maxLength="13"
          />
        </a-form-model-item>
        <a-form-model-item label="Comprobante en Uno" prop="comprobanteEnUno">
          <a-switch v-model="entidadObj.comprobanteEnUno" />
        </a-form-model-item>
        <a-divider orientation="left" v-if="entidadObj.entidadId == null"
          >Información Relacional</a-divider
        >
        <a-form-model-item
          label="Recaudadoras Habilitadas"
          v-if="entidadObj.entidadId == null"
        >
          <a-select
            mode="multiple"
            v-model="entidadObj.recaudadorIdLst"
            style="width: 100%"
            placeholder="Seleccione las Recaudadoras"
          >
            <a-select-option
              v-for="item in lstRecaudadores"
              :key="item.recaudadorId"
            >
              {{ item.nombre }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="abrirRecaudador">
            Nuevo Recaudador
          </a-button>
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
        <a-button type="link" @click="onSubmit"> Registrar </a-button>
        <a-button type="link" @click="resetForm"> Limpiar </a-button>
      </template>
    </a-card>

    <!--MODAL RECUDADORAS------------------------------------------------>
    <a-modal
      v-model="displayModal"
      title="Recaudadoras Habilitadas"
      ok-text="Registrar"
      cancel-text="Cancelar"
      @ok="closeModal()"
      width="60%"
      :centered="true"
      :closable="false"
      :maskClosable="false"
    >
      <a-select
        mode="multiple"
        v-model="entidadObj.recaudadorIdLst"
        style="width: 100%"
        placeholder="Seleccione las Recaudadoras"
      >
        <a-select-option
          v-for="item in lstRecaudadores"
          :key="item.recaudadorId"
        >
          {{ item.nombre }}
        </a-select-option>
      </a-select>
      <a-button type="primary" @click="abrirRecaudador">
        Nuevo Recaudador
      </a-button>
    </a-modal>

    <!--MODAL LOGO------------------------------------------------------->
    <a-modal
      v-model="displayModalLogo"
      :title="titleModalLogo"
      ok-text="OK"
      cancel-text="Cancelar"
      width="400px"
      :centered="true"
      :destroyOnClose="true"
      :footer="null"
      :closable="true"
      :confirmLoading="true"
      @cancel="closeModalLogo"
    >
      <LogoUpload :entidadId="entidadId"/>
    </a-modal>

    <!--MODAL COMISION---------------------------------------------------->
    <a-modal
      v-model="displayModalComision"
      title="Comisión Por Entidad"
      ok-text="OK"
      cancel-text="Cancelar"
      @ok="closeModalComision()"
      @cancel="loading = false"
      width="800px"
      :centered="true"
      :destroyOnClose="true"
      :footer="null"
    >
      <EntidadComisiones :entidadId="entidadId" />
    
    </a-modal> 
  </div>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import Entidades from "../../service/Administraciones/Entidad.service";
import Recaudadores from "../../service/Administraciones/Recaudador.service";
import EntidadComisiones from "../../components/Administracion/Comisiones.vue";
import LogoUpload from "../../components/Administracion/LogoUpload.vue";

/**Listado de Entidades */
const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    fixed: "left",
  },
  {
    title: "Tipo Entidad",
    dataIndex: "tipoEntidadDescripcion",
  },
  {
    title: "Nombre Comercial",
    dataIndex: "nombreComercial",
  },
  {
    title: "Dirección",
    dataIndex: "direccion",
  },
  {
    title: "Teléfono",
    dataIndex: "telefono",
  },
  {
    title: "Actividad Económica",
    dataIndex: "actividadEconomicaDescripcion",
  },
  {
    title: "Municipio",
    dataIndex: "municipioDescripcion",
  },
  {
    title: "Nit",
    dataIndex: "nit",
  },
  {
    title: "Comprobante en uno",
    dataIndex: "comprobanteEnUno",
    scopedSlots: { customRender: "comprobante" },
  },
  {
    title: "Logo",
    dataIndex: "pathLogo",
    scopedSlots: { customRender: "logo" },
  },
  {
    title: "Estado",
    dataIndex: "estado",
    fixed: "right",
    scopedSlots: { customRender: "estado" },
  },
  {
    title: "Opciones",
    dataIndex: "",
    scopedSlots: { customRender: "opciones" },
    fixed: "right",
  },
];

export default {
  components: {
    EntidadComisiones,
    LogoUpload,
  },
  data() {
    return {
      /*******LISTADO DE ENTIDADES********* */
      /*Datos*/
      lstEntidades: [],
      entidadId: null,
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      /*menu*/
      lstOpciones: [
        {
          transaccion: "CREAR",
          etiqueta: "CREAR",
          imagen: "imagen.png",
          orden: 1,
        },
        {
          transaccion: "MODIFICAR",
          etiqueta: "MODIFICAR",
          imagen: "imagen.png",
          orden: 2,
        },
        {
          transaccion: "ELIMINAR",
          etiqueta: "ELIMINAR",
          imagen: "imagen.png",
          orden: 3,
        },
        {
          transaccion: "ACTIVAR",
          etiqueta: "DAR ALTA",
          imagen: "imagen.png",
          orden: 4,
        },
        {
          transaccion: "DESACTIVAR",
          etiqueta: "DAR BAJA",
          imagen: "imagen.png",
          orden: 5,
        },
      ],
      /**Otros */
      current: null,
      displayModal: false,

      /*******FORMULARIO ENTIDADES********* */
      /*Datos*/
      entidadObj: {},
      /*Formulario*/
      subTitle: "",
      displayForm: false,
      disabledNombreComercial: true,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        nombre: [
          {
            required: true,
            message: "Debe registrar el nombre",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Mínimante el nombre debe tener 2 caracteres",
            trigger: "blur",
          },
        ],
        tipoEntidadId: [
          {
            required: true,
            message: "Debe seleccionar un Tipo de Entidad",
            trigger: "change",
          },
        ],
        direccion: [
          {
            required: true,
            message: "Debe registrar la dirección",
            trigger: "blur",
          },
          {
            min: 5,
            message: "Mínimante la dirección debe tener 5 caracteres",
            trigger: "blur",
          },
        ],
        telefono: [
          {
            required: true,
            message: "Debe registrar la dirección",
            trigger: "blur",
          },
          {
            min: 7,
            max: 10,
            message:
              "El teléfono debe contener al menos 7 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
        actividadEconomicaId: [
          {
            required: true,
            message: "Debe seleccionar una actividad económica",
            trigger: "change",
          },
        ],
        municipioId: [
          {
            required: true,
            message: "Debe seleccionar un municipo",
            trigger: "change",
          },
        ],
        nit: [
          {
            required: true,
            message: "Debe registrar el nit",
            trigger: "blur",
          },
          {
            min: 10,
            max: 13,
            message:
              "El teléfono debe contener al menos 10 caracteres y máximo 13",
            trigger: "blur",
          },
        ],
      },

      /*Dominios*/
      lstTiposEntidades: [],
      lstActividadesEconomicas: [],
      lstMunicipios: [],

      /**Recaudadora */
      lstRecaudadores: [],
      selectRecaudadores: [],

      /**Modal Comision */
      displayModalComision: false,

      /**Modal Logo */
      displayModalLogo: false,
      titleModalLogo: '',
    }
  },
  computed: {
    /**Listado Entidades*/
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  mounted() {
    this.cargarEntidades();
    this.cargarTipoEntidades();
    this.cargarActividadesEconomicas();
    this.cargarMunicipios();

    this.cargarRecaudadores();
  },
  methods: {
    /**Menú */
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case "CREAR": //CREAR
          this.entidadObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;
        case "MODIFICAR": //Modiicar
          if (this.selectedRowKeys.length === 1) {
            this.cargarEntidad(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Formulario Modificación de Registro";
          } else {
            this.$notification.warning(
              "Debe seleccionar un solo registro para MODIFICAR"
            );
          }
          break;
        case "ELIMINAR": //ELIMINAR
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de ELIMINAR el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el(los) registro(s) ya no podrá(n) ser visualizado(s).",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaEntidadesTransaccion(
                  this.selectedRowKeys,
                  "ELIMINAR"
                );
                this.selectedRowKeys = [];
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para ELIMINAR"
            );
          }
          break;
        case "ACTIVAR": //ALTA
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de DAR ALTA el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el(los) registro(s) ingresará(n) en transacciones en el Sistema.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaEntidadesTransaccion(
                  this.selectedRowKeys,
                  "ACTIVAR"
                );
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para DAR ALTA"
            );
          }
          break;
        case "DESACTIVAR": //BAJAR
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content:
                "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizaListaEntidadesTransaccion(
                  this.selectedRowKeys,
                  "DESACTIVAR"
                );
              },
              onCancel() {
                console.log("Cancel");
              },
              class: "test",
            });
          } else {
            this.$notification.warning(
              "Debe seleccionar al menos un registro para DAR BAJA"
            );
          }
          break;
      }
    },
    

    /**LISTADO DE ENTIDADES************************************/
    /**Opeaciones */
    cargarEntidades() {
      this.$Progress.start();
      Entidades.getLstEntidad()
        .then((r) => {
          if (r.status === 204) {
            (this.lstEntidades = []),
              this.$notification.warning(
                "No se ha encontrado ninguna Empresa registrada"
              );
            this.$Progress.finish();
            return;
          }

          this.lstEntidades = r.data.result;
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstEntidades = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    cargarEntidad(entidadId) {
      Entidades.getEntidad(entidadId).then((r) => {
        this.entidadObj = r.data.result;
      });
    },
    actualizaListaEntidadesTransaccion(entidadIdLst, transaccion) {
      Entidades.putLstEntidadTransaccion(entidadIdLst, transaccion)
        .then((r) => {
          this.$Progress.start();
          this.cargarEntidades();
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    
    /**Visualizaciones */
    mostrarSucursal(entidadId) {
      this.$router.push({
        name: "AbmSucursalesEntidades",
        params: { entidadId: entidadId },
      });
    },

    /**FORMULARIO********************************************* */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.entidadObj = {};
      this.selectedRowKeys = []; //erificar
    },
    habilitarNombreComercial(dominioId) {
      this.disabledNombreComercial = dominioId != 3; //Ctte
      this.entidadObj.nombreComercial = null;
    },
    /*Lista de Dominio*/
    cargarTipoEntidades() {
      Dominios.getListDominos("tipo_entidad_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstTiposEntidades = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstTiposEntidades = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstTiposEntidades = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    cargarActividadesEconomicas() {
      Dominios.getListDominos("actividad_economica_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstActividadesEconomicas = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstActividadesEconomicas = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstActividadesEconomicas = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    cargarMunicipios() {
      Dominios.getListDominos("municipio_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstMunicipios = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstMunicipios = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstMunicipios = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    /*Operaciones*/
    guardarEntidad() {
      this.$Progress.start();
      Entidades.postEntidad(this.entidadObj)
        .then((r) => {
          this.displayForm = false;
          this.cargarEntidades();
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarEntidad(this.entidadObj);
        } else {
          console.log("error submit!!");
          this.$notification.warning(
            "Debe resolver las validaciones del formulario."
          );
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },

    /**RECUADADORAS POR ENTIDAD******************************** */
    /**Operaciones */
    cargarRecaudadores() {
      this.$Progress.start();
      Recaudadores.getLstRecaudadores()
        .then((r) => {
          if (r.status === 204) {
            (this.lstRecaudadores = []),
              this.$notification.warning(
                "No se ha encontrado ninguna Recaudador a la que pueda habilitar."
              );
            this.$Progress.finish();
            return;
          }
          this.lstRecaudadores = r.data.result;
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstRecaudadores = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    guardarRecaudadoras() {
      this.$Progress.start();
      Entidades.postEntidadRecaudador(
        this.entidadObj.recaudadorIdLst,
        this.entidadObj.entidadId
      )
        .then((r) => {
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          (this.lstRecaudadores = []), console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    /**Modal Reacudador*/
    openModalRecaudadora(entidadId) {
      this.cargarEntidad(entidadId);
      this.displayModal = true;
    },
    closeModal() {
      this.guardarRecaudadoras();
      this.displayModal = false;
    },
    abrirRecaudador() {
      this.$confirm({
        title: "¿Está seguro de ingresar a Registro de Recaudadores?",
        content: "Considere que los datos se perderán.",
        okText: "Aceptar",
        cancelText: "Cancelar",
        onOk: () => {
          console.log("ok");
          this.$router.push({
            name: "AbmRecaudadores",
          });
        },
        onCancel() {
          console.log("Cancel");
        },
        class: "test",
      });
    },
    
    /**LOGO******************************************************* */
    /**Modal Logo */
    openModalLogo(entidadId, nombre) {
      //this.url = this.urlOriginal + "/" + entidadId;
      this.entidadId = entidadId;
      this.displayModalLogo = true;
      this.titleModalLogo = "Logo " + nombre;
    },
    closeModalLogo() {
      this.entidadId = null;
      this.displayModalLogo = false;
      this.cargarEntidades();
    },

    /**ENTIDADES COMISIONES***************************************** */  
    /**Modal Comision */
    openModalComision(entidadId) {
      this.entidadId = entidadId;
      this.displayModalComision = true;
    },
    closeModalComision() {
      this.entidadId = null;
      this.displayModalComision = false;
    },
   
  },
};
</script>
<style scoped>
</style>
