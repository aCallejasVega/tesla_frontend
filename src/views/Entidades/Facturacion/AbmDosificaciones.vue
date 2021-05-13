
<template>
  <div>
    <a-card v-if="!displayForm" style="width: 100%">
    <div
      v-if="!displayForm"
      style="
        border: 2px solid #21618c;
        border-radius: 5px;
        height: 100%;
        width: 100%;
        padding: 1%;
        color: #21618c;
      "
    >
      <a-row type="flex" justify="space-around" align="middle"
        ><a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <h2>
            <b style="color: #21618c"> Administración de Dosificación </b>
          </h2></a-col
        >
        <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
          <a-row type="flex" justify="end">
            <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20" align="right">
              <a-input-search
                v-model="search"
                placeholder="Buscar por Código Actividad Económica..."
                @search="filterTable"
                enter-button=" Buscar "
                :maxLength="50"
              />
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
      <template slot="actions" class="ant-card-actions">
        <b>{{ filter }}</b>
       
         <a-button-group>
          <a-button
            v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
            type="primary"
          >
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE DOSIFICACIONES-->
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstFilter"
        rowKey="dosificacionId"
        :pagination="pagination"
        :loading="loading"
        :scroll="{ x: 1000 }"
      >
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'CERRADO'" align="center">
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
          <div v-if="record.estado == 'ANULADO'" align="center">
            <a-tag color="orange">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'HISTORICO'" align="center">
            <a-tag color="gray">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
        </template>
        <template slot="caracteristicas" slot-scope="text, record">
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Tipo Documento Fiscal
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.tipoDocumentoFiscalDescripcion }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Características Especiales
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.caracteristicasEspecialesDescripcion }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Moneda
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.monedaDescripcion }}
            </a-col>
          </a-row>
        </template>
        <template slot="dosificacion" slot-scope="text, record">
           <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="24"
              class="labelValue"
            >
           {{record.llaveDosificacion}}
            </a-col>
           </a-row>
        </template>
        <template slot="datos" slot-scope="text, record">
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Actividad Económica
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValueMain"
            >
            <a-tag color="blue">
               {{ record.codigoActividadEconomica }} - {{ record.actividadEconomica }}
            </a-tag>
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              N° Autorización
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.numeroAutorizacion }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Fecha vigencia Emision
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ $dates.formaDateWithoutTime(record.fechaVigencia) }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Fecha Límite Emision
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ $dates.formaDateWithoutTime(record.fechaLimiteEmision) }}
            </a-col>
          </a-row>
        </template>
         
      </a-table>
    </a-card>
    
    <a-card v-if="displayForm" style="width: 100%">
      <br/>
      <div
      v-if="displayForm"
      style="
        border: 2px solid #21618c;
        border-radius: 5px;
        height: 100%;
        width: 100%;
        padding: 1%;
        color: #21618c;
      "
    >
      <a-row type="flex" justify="space-around" align="middle"
        ><a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #21618c"
              ><a-icon type="arrow-left" @click="volverListado" /> Administración de Dosificación:
              {{ subTitle }}
            </b>
          </h2>
        </a-col>
      </a-row>
    </div>
    <br/>
      <a-form-model
        ref="ruleForm"
        :model="dosificacionObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
        disabled="true"
      >
      <a-form-model-item label="Sucursal Emite Factura" >
          <a-input
            v-model="sucursalEntidadObj.nombreSucursal"
            :disabled="true"
          />
        </a-form-model-item>
        <a-form-model-item label="Tipo Documento Fiscal" prop="tipoDocumentoFiscalId">
          <a-select
            v-model="dosificacionObj.tipoDocumentoFiscalId"
            placeholder="Seleccione Tipo Documento Fiscal"
          >
            <a-select-option
              v-for="(item, i) in lstTipoDocumentoFiscal"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Características Especiales" prop="caracteristicasEspecialesId">
          <a-select
            v-model="dosificacionObj.caracteristicasEspecialesId"
            placeholder="Seleccione Tipo Documento Fiscal"
          >
            <a-select-option
              v-for="(item, i) in lstCaracEspeciales"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Moneda" prop="monedaId">
          <a-select
            v-model="dosificacionObj.monedaId"
            placeholder="Seleccione Moneda"
          >
            <a-select-option
              v-for="(item, i) in lstMonedas"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Por Terceros" prop="porTerceros">
          <a-switch v-model="dosificacionObj.porTerceros"/>
        </a-form-model-item>
        <a-form-model-item ref="codigoActividadEconomica" label="Código Actividad Economica" prop="codigoActividadEconomica">
          <a-input
            v-model="dosificacionObj.codigoActividadEconomica"
            @blur="
              () => {
                $refs.codigoActividadEconomica.onFieldBlur();
              }
            "
            :maxLength="20"
          />
        </a-form-model-item>
        <a-form-model-item ref="actividadEconomica" label="Actividad Economica" prop="actividadEconomica">
          <a-input
            v-model="dosificacionObj.actividadEconomica"
            @blur="
              () => {
                $refs.actividadEconomica.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
       
         <a-form-model-item ref="numeroAutorizacion" label="N° Autorización" prop="numeroAutorizacion">
          <a-input
            v-model="dosificacionObj.numeroAutorizacion"
            @blur="
              () => {
                $refs.numeroAutorizacion.onFieldBlur();
              }
            "
            :maxLength="20"
          />
        </a-form-model-item>
        <a-form-model-item ref="fechaVigencia" label="Fecha Vigencia Emisión" prop="fechaVigencia">
          <a-date-picker
                format="DD/MM/YYYY"
                :locale="locale"
                v-model="dosificacionObj.fechaVigencia"
                @blur="
                  () => {
                    $refs.fechaVigencia.onFieldBlur();
                  }
                "
              />
        </a-form-model-item>
        <a-form-model-item ref="fechaLimiteEmision" label="Fecha Límite Emisión" prop="fechaLimiteEmision">
          <a-date-picker
                format="DD/MM/YYYY"
                :locale="locale"
                v-model="dosificacionObj.fechaLimiteEmision"
                @blur="
                  () => {
                    $refs.fechaLimiteEmision.onFieldBlur();
                  }
                "
              />
        </a-form-model-item>
        <a-form-model-item ref="llaveDosificacion" label="Llave de Dosificación" prop="llaveDosificacion">
          <a-textarea
            v-model="dosificacionObj.llaveDosificacion"
            @blur="
              () => {
                $refs.llaveDosificacion.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
        <a-button
          type="link"
          @click="onSubmit"
          style="color: white; background-color: #339966; border: 0px"
        >
          <a-icon type="form" />
          Registrar
        </a-button>
        <a-button type="primary" ghost @click="resetForm"
          ><a-icon type="reload" /> Limpiar
        </a-button>
      </template>
    </a-card>
  </div>
</template>
<script>
import Dominios from "../../../service/Facturacion/DominiosFacturas.service";
import Dosificaciones from "../../../service/Facturacion/Dosages.service";
import SucursalesEntidades from "../../../service/Administraciones/SucursalEntidad.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import Sidebar from "../../../service/Home/Sidebar.service";


const sorter = (data) => {
  return data.slice().sort((a, b) => b.dosificacionId - a.dosificacionId);
};

const columns = [
  {
    title: "Características",
    dataIndex: "moneda_id",
    scopedSlots: { customRender: "caracteristicas" },
    width: "25%",
  },
  {
    title: "Datos",
    dataIndex: "actividadEconomica",
    scopedSlots: { customRender: "datos" },
    width: "30%",
  }, 
  {
    title: "LLave Dosificacion",
    dataIndex: "llaveDosificacion",
    //fixed: "right",
    scopedSlots: { customRender: "dosificacion" },
    width: "30%",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    //fixed: "right",
    scopedSlots: { customRender: "estado" },
    width: "15%",
  },
  
  
];

export default {
  data() {
    return {
      locale,
      /*******LISTADO********* */
      /*Datos*/
      lstDosificaciones: [],
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      loading: false,
      /*menu*/
      lstOpciones: [],
      /**Otros */
      current: null,
      displayModal: true,

      /*******FORMULARIO********* */
      /*Datos*/
      dosificacionObj: {},
      /*Formulario*/
      subTitle: "",
      displayForm: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        codigoActividadEconomica: [
          {
            required: true,
            message: "Debe registrar el Código de Actividad Económica",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "Debe registrar solo números.",
            pattern:  /^[0-9,$]*$/ 
          },
        ],
        actividadEconomica: [
          {
            required: true,
            message: "Debe registrar la Actividad Económica",
            trigger: "blur",
          },
          
        ],
        numeroAutorizacion: [
          {
            required: true,
            message: "Debe registrar el N° de Autorización",
            trigger: "blur",
          },
          {
            trigger: "blur",
            message: "Debe registrar solo números.",
            pattern:  /^[0-9,$]*$/ 
          },
        ],
        fechaVigencia: [
          {
            required: true,
            message: "Debe registrar la Fecha de Vigencia de la Dosificación.",
            trigger: "blur",
          },
          
        ],
        fechaLimiteEmision: [
          {
            required: true,
            message: "Debe registrar la Fecha Límite Emisión",
            trigger: "blur",
          },
          
        ],
        llaveDosificacion: [
          {
            required: true,
            message: "Debe registrar el N° de Autorización",
            trigger: "blur",
          },
        ],
        monedaId: [
          {
            required: true,
            message: "Debe seleccionar una Moneda",
            trigger: "change",
          },
        ],
        tipoDocumentoFiscalId: [
          {
            required: true,
            message: "Debe seleccionar un Tipo de Documento Fiscal",
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
            message: "Debe registrar el teléfono",
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
        llaveDosificacion: [
          {
            required: true,
            message: "Debe registrar la Llave de Dosificación",
            trigger: "blur",
          },
        ],
      },

      /*Dominios*/
      lstMonedas: [],
      lstTipoDocumentoFiscal: [],
      lstCaracEspeciales: [],

      sucursalEntidadObj: {},

      /**Filter */
      search: "",
      lstFilter: [],
      filter: "Registros: 0/0",
    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        type: "radio",
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;

          //Opciones
          const mismoEstado = [...new Set(selectedRows.map((i) => i.estado))];
          if (mismoEstado.length > 1) {
            this.$notification.warning(
              "Debe seleccionar registros del mismo ESTADO para realizar operaciones múltiples."
            );
            this.cargarOpcionesByEstado("INICIAL");
            this.cargarOpciones();
          } else {
            if (selectedRows.length > 0)
              this.cargarOpcionesByEstado(selectedRows[0].estado);
            else this.cargarOpcionesByEstado(null);
          }
        },
      };
    },
  },
  mounted() {
    this.cargarDosificaciones();
    this.cargarSucursalEmiteFactura();
    this.cargarMoneda();
    this.cargarTipoDocumentoFiscal();
    this.cargarCaracEspeciales();

    this.cargarOpcionesByEstado(null);
    //this.cargarOpciones();
  },
  methods: {
    /*****LISTADO DE SUCURSALES*** */
    cargarSucursalEmiteFactura(){
      SucursalesEntidades.getSucursalEmtidadEmiteFacturaTesla().then((r) => {
        this.sucursalEntidadObj = r.data.result;
      }).catch((error) => {
        this.sucursalEntidadObj = {};
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
      });
    },
    /**Menú */
    cargarOpcionesByEstado(estadoInicial) {
      Sidebar.getOperacionesFacturacionLst("DOSIFICACIONES", estadoInicial).then((r) => {
        this.lstOpciones = r.data.result;
        console.log('********************')
        console.log(JSON.stringify(this.lstOpciones));
      });
    },
    /*cargarOpciones() {
      this.lstOpciones = [ "REGISTRAR","MODIFICAR","ACTIVAR","CERRAR","ANULAR" ];
    },*/
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case "CREAR": //CREAR
          this.dosificacionObj = {};
          this.displayForm = true;
          this.subTitle = "Registro Nuevo";
          break;
        case "MODIFICAR": //Modiicar
          if (this.selectedRowKeys.length === 1) {
            this.cargarDosificacion(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Modificación de Registro";

            //this.selectedRowKeys = [];
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
                "¿Está seguro de ELIMINAR el registro seleccionado?",
              content:
                "Considere que el registro ya no podrá ser visualizado.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizarTransaccion(
                  this.selectedRowKeys,
                  "ELIMINAR"
                );
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
                "¿Está seguro de DAR ALTA el registro seleccionado?",
              content:
                "Considere que el registro ingresará en transacciones en el Sistema.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizarTransaccion(
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
        case "CERRAR": 
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de CERRAR el registro seleccionado?",
              content:
                "Considere que solo se pueden cerrar los registros activos.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizarTransaccion(
                  this.selectedRowKeys,
                  "CERRAR"
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
          case "ANULAR": 
          if (this.selectedRowKeys.length > 0) {
            this.$confirm({
              title:
                "¿Está seguro de ANULAR el registro seleccionado?",
              content:
                "Considere que puede anular si el registro esta activo.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log("ok");
                this.actualizarTransaccion(
                  this.selectedRowKeys,
                  "ANULAR"
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
    /**Opeaciones */
    cargarDosificaciones() {
      this.loading = true;
      Dosificaciones.getDosificacionesLst()
        .then((r) => {
          if (r.status === 204) {
            this.lstDosificaciones = [];
            this.lstFilter = [];
            this.$notification.warning(
              "No se ha encontrado ninguna Dosificacion registrada."
            );
            this.loading = false;
            return;
          }
          this.lstDosificaciones = sorter(r.data.result);
          this.lstFilter = this.lstDosificaciones;
          this.loading = false;
          this.countRows();

          //Para opciones
          this.selectedRowKeys = [];
          //this.cargarOpcionesByEstado(null);
          //this.cargarOpciones();

        })
        .catch((error) => {
          this.lstDosificaciones = [];
          this.lstFilter = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.loading = false;
        });
    },
    actualizarTransaccion(dosificacionId, transaccion) {
      Dosificaciones.putTransaccion(dosificacionId, transaccion)
        .then((r) => {
          this.$Progress.start();
          this.cargarDosificaciones();

          this.selectedRowKeys = [];

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

    /****FORMULARIO**** */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.dosificacionObj = {};
      this.selectedRowKeys = [];
    },

    /*Lista de Dominio*/
    cargarMoneda() {
      Dominios.getDominiosLst("moneda_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstMonedas = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstMonedas = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstMonedas = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    cargarTipoDocumentoFiscal() {
      Dominios.getDominiosLst("tipo_documento_fiscal_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstTipoDocumentoFiscal = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstTipoDocumentoFiscal = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstTipoDocumentoFiscal = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    cargarCaracEspeciales() {
      Dominios.getDominiosLst("caracteristicas_especiales_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstCaracEspeciales = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstCaracEspeciales = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstCaracEspeciales = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    
    /*Operaciones*/
    cargarDosificacion(dosificacionId) {
      Dosificaciones.getDosificacionById(dosificacionId).then((r) => {
        this.dosificacionObj = r.data.result;
        this.cargarDosificaciones();
      });
    },
    guardarDosificacion() {
      this.$Progress.start();
      Dosificaciones.postDosificacion(this.dosificacionObj)
        .then((r) => {
          console.log(r);
          this.displayForm = false;
          this.cargarDosificaciones();
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
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarDosificacion(this.dosificacionObj);
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

    /**Filtrado */
    filterTable() {
      console.log(JSON.stringify(this.lstDosificaciones));
      this.lstFilter = this.lstDosificaciones.filter((s) => {
        if (this.search != null || this.search != "") {
          console.log(s.codigoActividadEconomica);
          return s.codigoActividadEconomica.includes(this.search);
        }
      });
      this.countRows();
    },
    countRows() {
      let rowFilter = this.lstFilter.length;
      let rowTotal = this.lstDosificaciones.length;
      this.filter = "Registros: " + rowFilter + "/" + rowTotal;
    },
  },
};
</script>
<style scoped>
.labelTittle {
  background-color: #fafafa;
  font-weight: bold;
  padding-right: 5px;
  height: 100%;
}
.labelValue {
  border-width: 0.1px;
  border-color: #fafafa;
  border-style: solid;
}
.labelValueMain {
  border-width: 0.1px;
  border-color: #fafafa;
  border-style: solid;
  color: #839dff;
  background-color: #fafafa;
}
</style>
