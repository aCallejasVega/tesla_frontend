<template>
  <div>
    <a-card style="width: 100%">
      <div
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
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="$router.back()" v-if="entidadId != null"/> {{title}} </b></h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            
          </a-col>
        </a-row>
      </div>
      <br/>
      <a-form-model
        ref="ruleForm"
        :rules="rules"
        :model="facturaObj"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
       <a-row type="flex" justify="center">
          <a-col span="12">
            <a-form-model-item
              ref="fechaInicioFactura"
              label="Fecha Inicio"
              prop="fechaInicioFactura"
            >
              <a-date-picker :disabledDate ="disabledDate"
                format="DD/MM/YYYY"
                :locale="locale"
                v-model="facturaObj.fechaInicioFactura"
                @blur="
                  () => {
                    $refs.fechaInicioFactura.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              ref="fechaFinFactura"
              label="Fecha Fin"
              prop="fechaFinFactura"
            >
              <a-date-picker :disabledDate ="disabledDate"
                format="DD/MM/YYYY"
                :locale="locale"
                v-model="facturaObj.fechaFinFactura"
                @blur="
                  () => {
                    $refs.fechaFinFactura.onFieldBlur();
                  }
                "
              />
            </a-form-model-item>
          </a-col>
        </a-row>   
        <a-row type="flex" justify="center" v-if="opcion.libro == false">
          <a-col span="12">
            <a-form-model-item
              ref="numeroFactura"
              label="N° Factura"
              prop="numeroFactura"
            >
              <a-input v-model="facturaObj.numeroFactura" :maxLength="200" />
            </a-form-model-item>
          </a-col>
           <a-col span="12">
            <a-form-model-item ref="estado" label="Estado" prop="estado">
              <a-select
                v-model="facturaObj.estado"
                placeholder="Seleccione Tipo Entidad"
                :allowClear="true"
              >
                <a-select-option
                  v-for="(item, i) in lstEstados"
                  :key="i"
                  :value="item.key"
                >
                  {{ item.value }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        
        <a-row type="flex" justify="center" v-if="opcion.libro == false">
          <a-col span="12">
            <a-form-model-item
              ref="numeroDocumento"
              label="NIT/CI Cliente"
              prop="numeroDocumento"
            >
              <a-input v-model="facturaObj.numeroDocumento" :maxLength="200" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
             <a-form-model-item
              ref="nombreRazonSocial"
              label="Nombre/Razón Social"
              prop="nombreRazonSocial"
            > 
              <a-input
                v-model="facturaObj.nombreRazonSocial"
                :maxLength="200"
              />
            </a-form-model-item>
           
          </a-col>
          
        </a-row>
        <a-row type="flex">
          <a-col span="12">
            <a-form-model-item v-if="opcion.libro == false"
              ref="codigoCliente"
              label="Código Cliente"
              prop="codigoCliente"
            >
              <a-input
                  v-model="facturaObj.codigoCliente"
                  :maxLength="200"
                />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item
              ref="codigoActividadEconomica"
              label="Actividad Económica"
              prop="codigoActividadEconomica"
            >
              <a-select
                v-model="facturaObj.codigoActividadEconomica"
                placeholder="Seleccione Actividad Economica"
                :allowClear="true"
              >
                <a-select-option
                  v-for="(item, i) in lstActividadesEconomicas"
                  :key="i"
                  :value="item.codigoActividadEconomica"
                >
                  {{ item.codigoActividadEconomica }} - {{ item.actividadEconomica }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
            
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
        <a-button type="link" @click="cargarFacturasFiltros(1)" block
            style="
              height: 50px;
              background-color: #3399cc;"
              > 
          <span :style="{ fontSize: '14px', color:'white'  }">
              <b> <a-icon type="search" :style="{ fontSize: '22px' }" />
                Buscar</b>
            </span>
        </a-button>
        <a-button type="link" @click="resetForm" block
            style="
              height: 50px; background-color: #99ccff;">  
          <span :style="{ fontSize: '14px', color:'white'  }">
              <b> <a-icon type="reload" :style="{ fontSize: '22px' }" />
                Limpiar</b>
            </span>
        </a-button>
        <a-button type="link" @click="displayModalTypeReport = true" v-if="opcion.libro == true && lstFacturas.length > 0"
        style="
              height: 50px;
              background-color: #33bbbb;"> 
              <span :style="{ fontSize: '14px', color:'white'  }">
              <b> <a-icon type="file-text" :style="{ fontSize: '22px' }" />
                 Generar Impresión </b>
            </span>
          
          </a-button>
        
      </template>
    </a-card>
    <br/>
    <a-card style="width: 100%">
      <!--:row-selection="rowSelection"-->
      <a-table
        
        :columns="columns"
        :data-source="lstFacturas"
        rowKey="facturaId"
        :pagination="pagination"
        :scroll="{ x: 1000 }"
        :loading="loading"
      >
        <template slot="dosificaciones" slot-scope="text, record">
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
              Fecha Límite Emisión
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
              class="labelValue"
            >
              {{record.codigoActividadEconomica}} - {{ record.actividadEconomica }}
            </a-col>
          </a-row>
          <a-row type="flex" v-if="record.codigoActividadEconomicaSecundaria != null">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Actividad Económica Secundaria
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{record.codigoActividadEconomicaSecundaria}} - {{ record.actividadEconomicaSecundaria }}
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
              N° Factura
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.numeroFactura }}
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
              Fecha Factura
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ $dates.formaDateWithoutTime(record.fechaFactura) }}
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
              Código Control
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.codigoControl }}
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
              NIT/CI
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.numeroDocumento }}
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
              Nombre/Razón Social
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.nombreRazonSocial }}
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
              Código Cliente
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.codigoCliente }}
            </a-col>
          </a-row>
        </template>
        <template slot="montos" slot-scope="text, record">
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelTittle"
            >
              Monto Total
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelValue"
            >
              {{ record.montoTotal }}
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelTittle"
            >
              Monto Base Importe Fiscal
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelValue"
            >
              {{ record.montoBaseImporteFiscal }}
            </a-col>
          </a-row>
          <!--
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Monto Descuento
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.montoDescuento }}
            </a-col>
          </a-row>
          -->
        </template>
        <template slot="extras" slot-scope="text, record">
          <a-row type="flex">
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="10"
              class="labelTittle"
            >
              Domicilio Cliente
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.domicilioCliente }}
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
              Nombre Alumno
            </a-col>
            <a-col
              :xs="24"
              :sm="24"
              :md="24"
              :lg="24"
              :xl="14"
              class="labelValue"
            >
              {{ record.nombreAlumno }}
            </a-col>
          </a-row>
        </template>
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'VALIDO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'ANULADO'" align="center">
            <a-tag color="red">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
        </template>
        <template slot="opciones" slot-scope="text, record">
          <a-tooltip placement="left" title="Reimprime la factura generada."> 
            <a-button v-if="opcion.reimprimir == true"
                type="primary"
                block
                size="small"
                @click="reimprimirFactura(record.facturaId)"
                ><a-icon type="printer"/> Reimprimir
            </a-button>
          </a-tooltip>
          <a-tooltip placement="left" title="Anula Factura, recuperando deuda."> 
            <a-button v-if="opcion.anular == true && record.estado != 'ANULADO'"
                block
                size="small"
                @click="abrirModalAnulacion(record.facturaId, false)"
                style="background-color:#E57373; color:white; width: 100%; white-space: nowrap; height: 50px"
                ><a-icon type="stop"/> Anular<br/>(Recupera Deuda)
            </a-button>
          </a-tooltip>
          <a-tooltip placement="left" title="Anula Factura por cargado de dato erróneo."> 
            <a-button v-if="opcion.anularErroneo == true && record.estado != 'ANULADO'"
                block
                size="small"
                @click="abrirModalAnulacion(record.facturaId, true)"
                style="background-color:#DF013A; color:white; width: 100%; white-space: nowrap; height: 50px"
                ><span><a-icon type="disconnect"/> Anular<br/>(Por Dato Erróneo)</span>
            </a-button>
          </a-tooltip>
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="displayModal"
      title="Registro de la Anulación"
      ok-text="Registrar"
      cancel-text="Cancelar"
      @ok="confirmarAnulacion"
      width="40%"
      :centered="true"
      :closable="false"
      :maskClosable="false"
    >
      <a-row type="flex" justify="center">
        <a-spin
          size="large"
          tip="La factura se esta anulando...."
          v-if="viewAnulando"
        >
        </a-spin>
      </a-row>
      Motivo Anulación:
      <a-textarea v-model="motivoAnulacion" :maxLength="500" />
    </a-modal>
    <a-modal
      v-model="displayModalReport"
      title="Impresión"
      width="900px"
      height="400px"
      :dialog-style="{ top: '20px' }"
      @ok="displayModalReport = false"
    >
      <a-row type="flex" justify="center">
        <a-spin
          size="large"
          tip="El reporte se esta cargando...."
          v-if="viewCargando"
        >
        </a-spin>
        <iframe width="100%" height="400px" :src="this.link" frameborder="0">
        </iframe>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="displayModalReport = false">
          Cerrar
        </a-button>
      </template>
    </a-modal>
    <a-modal
      v-model="displayModalTypeReport"
      title="Seleccione tipo de reporte"
      @ok="displayModalTypeReport = false"
    >
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-col>Seleccione un tipo de Reporte a generar.</a-col>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-radio-group button-style="solid" v-model="facturaObj.formatFile">
            <a-radio-button value="pdf"> PDF </a-radio-button>
            <a-radio-button value="msword"> WORD </a-radio-button>
            <a-radio-button value="msexcel"> EXCEL </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button key="back" @click="generarLibroVentas">
          Generar Reporte
        </a-button>
      </template>
    </a-modal>
     <a-alert
          message="ADVERTENCIA"
          :description="mensajeReporte"
          type="warning"
          show-icon
          v-if="mensajeVisible"
        />
  </div>
</template>
<script>
const columns = [
  {
    title: "Datos Dosificación",
    dataIndex: "numeroFactura",
    scopedSlots: { customRender: "dosificaciones" },
    width: "25%"
  },
  {
    title: "Datos Factura",
    dataIndex: "numeroAutorizacion",
    scopedSlots: { customRender: "datos" },
    width: "25%"
  },
  {
    title: "Montos",
    dataIndex: "fechaFactura",
    scopedSlots: { customRender: "montos" },
    width: "15%"
  },
  /*{
    title: "Datos Extras",
    dataIndex: "numeroDocumento",
    scopedSlots: { customRender: "extras" },
  },*/
  {
    title: "Estado",
    dataIndex: "estado",
    scopedSlots: { customRender: "estado" },
    width: "10%"
  },
  {
    title: "Opciones",
    dataIndex: "",
    scopedSlots: { customRender: "opciones" },
    width: "15%"
  },
];

import Entidades from "../../service/Administraciones/Entidad.service";
import Invoices from "../../service/Facturacion/Invoices.service";
import ActividadesEconomicas from "../../service/Facturacion/ActividadesEconomicasServices";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";

export default {
  props: {
    opcion: {
      anular: null,
      reimprimir: null,
      libro: null,
      anularErroneo: null,
    },
    entidadId: null,
  },
  data() {
    return {
      /**Formulario */
      title: null,
      labelCol: { span: 6 },
      wrapperCol: { span: 15 },
      facturaObj: {},
      lstEstados: [],
      lstActividadesEconomicas: [],
      locale,
      rules: {
        fechaInicioFactura: [
          {
            required: this.opcion.libro,
            message: "Debe seleccionar fecha inicio.",
            trigger: "change",
          },
        ],
        fechaFinFactura: [
          {
            required: this.opcion.libro,
            message: "Debe seleccionar fecha fin.",
            trigger: "change",
          },
        ],
      },
      facturaIdSelect: null,
      /**Tabla */
      lstFacturas: [],
      columns,
      selectedRowKeys: [],
      pagination: {
        //pageSize: 20,
      },
      page: 1,
      total: 0,
      loading: false,
      /**Modal Anulacion */
      motivoAnulacion: null,
      displayModal: false,
      erroneo: false,
      viewAnulando: false,
      /**Modal Reporte */
      displayModalReport: false,
      viewCargando: false,
      link: null,
      displayModalTypeReport: false,
      formatFile: null,
      mensajeVisible: false,
      mensajeReporte:
        "NO SE PUDO CARGAR EL REPORTE, VERIFIQUE LOS PARÁMETROS SELECCIONADOS EN EL ÁREA DE BÚSQUEDA. ",
      
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          /*console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );*/
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  created() {
    this.cargarEstados();
    this.cargarEntidad(this.entidadId);

    this.cargarActividadesEconomicas(this.entidadId);

    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.cargarFacturasFiltros(page);
      },
    };
  },
  methods: {
    /**DATOS INICIALS**/
    cargarEntidad(entidadId) {
      if(entidadId != null) {
        Entidades.getEntidad(entidadId)
          .then((r) => {
            this.entidadObj = r.data.result;
            this.title = this.entidadObj.nombre + ": Facturas";
          })
          .catch((error) => {
            this.$notification.error(
              error.response.data.message,
              error.response.data.code
            );
          });
      } else {
        this.title = "Facturas"
      }
    },
    cargarEstados() {
      this.lstEstados = [
        //{ key: "", value: "Todo..." },
        { key: "VALIDO", value: "VALIDO" },
        { key: "ANULADO", value: "ANULADO" },
      ];
    },
    cargarActividadesEconomicas(entidadId) {
      ActividadesEconomicas.getActividadesEconomicas(entidadId).then((r) => { 
          if (r.status === 204) {
            this.lstActividadesEconomicas = [];
            this.$notification.warning(
              "No existe actvidad registrada con el código."
            );
            return;
          }
          this.lstActividadesEconomicas = r.data.result;
        })
        .catch((error) => {
          this.lstActividadesEconomicas = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    /**OPCIONES */
    cargarFacturasFiltros(page) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          Invoices.postListFacturaFilter(this.facturaObj, this.entidadId, page)
              .then((r) => {
                if (r.status === 204) {
                  this.lstFacturas = [];
                  this.$notification.warning(
                    "No se ha encontrado facturas de acuerdo a los filtros."
                  );
                  this.loading = false;
                  return;
                }

                this.lstFacturas = r.data.result.content;
                this.loading = false;
                this.pagination.pageSize = r.data.result.numberOfElements;
                this.pagination.total = r.data.result.totalElements;
              })
              .catch((error) => {
                this.lstFacturas = [];
                this.$notification.error(
                  error.response.data.message,
                  error.response.data.code
                );
                this.loading = false;
              });

        } else {
          this.$notification.warning(
            "Debe resolver las validaciones del formulario."
          );
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.lstFacturas = [];
    },
    /**Modal Anulacion*/
    abrirModalAnulacion(facturaId, erroneo) {
      this.displayModal = true;
      this.facturaIdSelect = facturaId;
      this.erroneo = erroneo;
    },
    confirmarAnulacion() {
      if(this.motivoAnulacion == null || this.motivoAnulacion == '') {
            this.$notification.warning("Debe registrar el motivo de la Anulación.");
            return;
      }

      this.$confirm({
        title:
          "¿Está seguro de ANULAR la Factura seleccionada?",
        content:
          this.erroneo ? "Considere que la deuda debe volver a cargarse para ser cobrada por anular por cargado de datos erróneos" : "Considere que el registro ya no podrá revertirse",
        okText: "Aceptar",
        okType: "danger",
        cancelText: "Cancelar",
        onOk: () => {
          if(!this.erroneo) {
            this.anularFactura();
          } else {
            this.anularFacturaDatoErroneo();
          }
        },
        onCancel: () => {
          this.selectedRowKeys = [];
          this.motivoAnulacion = null;
          this.displayModal = false;
        },
      });
    },
    /**Anulacion*/
    anularFactura() {
      let facturaIdLst = [];
      facturaIdLst.push(this.facturaIdSelect); 
      let facturaLstObj = {
        motivo: this.motivoAnulacion,
        facturaIdLst: facturaIdLst, //this.selectedRowKeys,
      };
      this.$Progress.start();
      this.viewAnulando = true;
      Invoices.postAnulacionLst(this.entidadId, facturaLstObj)
        .then((r) => {
          this.motivoAnulacion = null;
          this.$notification.success(r.data.message);
          this.cargarFacturasFiltros(0);
          this.displayModal = false;
          this.$Progress.finish();
          this.viewAnulando = false;
          this.motivo = null;
        })
        .catch((error) => {
          this.lstFacturas = [];
          this.cargarFacturasFiltros(0);
          this.displayModal = false;
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.motivo = null;
          this.$Progress.fail();
          this.viewAnulando = false;
        });
    },
    anularFacturaDatoErroneo() {
      let facturaIdLst = [];
      facturaIdLst.push(this.facturaIdSelect); 
      let facturaLstObj = {
        motivo: this.motivoAnulacion,
        facturaIdLst: facturaIdLst, //this.selectedRowKeys,
      };
      this.$Progress.start();
      this.viewAnulando = true;
      Invoices.postListFacturaAnulacionCargadoErroneo(this.entidadId, facturaLstObj)
        .then((r) => {
          this.motivoAnulacion = null;
          this.$notification.success(r.data.message);
          this.cargarFacturasFiltros(0);
          this.displayModal = false;
          this.$Progress.finish();
          this.viewAnulando = false;
          this.motivo = null;
        })
        .catch((error) => {
          this.lstFacturas = [];
          this.cargarFacturasFiltros(0);
          this.displayModal = false;
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.motivo = null;
          this.$Progress.fail();
          this.viewAnulando = false;
        });
    },
    /**Reimprimir */
    reimprimirFactura(facturaId) {
      Invoices.getReportFactura(this.entidadId, facturaId)
        .then((r) => {
          this.facturaObj.formatFile = "pdf";
          this.viewFileDownload(r);
          this.displayModalReport = true;
        })
        .catch((error) => {
          /*this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );*/
          this.$notification.error(this.ab2str(error.response.data));
            
        });
    },
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if (this.facturaObj.formatFile == "msword") {
        link.setAttribute("download", `${fileName}.doc`);
      } else {
        link.setAttribute("download", `${fileName}.xlsx`);
      }
      document.body.appendChild(link);
      link.click();
      this.displayModalReport = false;
      this.viewCargando = false;
    },
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/" + this.facturaObj.formatFile,
      });
      this.link = URL.createObjectURL(file);
      this.viewCargando = false;
    }, 
    generarLibroVentas() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {  
          this.mensajeVisible = false;
          this.link = null;
          this.viewCargando = true;
          Invoices.postLibroVentasReport(this.facturaObj)
            .then((r) => {
              this.viewCargando = false;
              if (r.status == 200) {
                if (this.facturaObj.formatFile == "pdf") {
                  this.viewFileDownload(r);
                } else {
                  this.forceFileDownload(r, "reporte");
                }
              } else {
                this.mensajeVisible = true;
              }
            })
            .catch((error) => {
              this.viewCargando = false;
              this.mensajeVisible = true;
              this.link = null;
              this.$notification.error(this.ab2str(error.response.data));
            
            });
            this.displayModalReport = true;
            this.displayModalTypeReport = false;
        } else {
          this.$notification.warning(
            "Debe resolver las validaciones del formulario."
          );
          return false;
        }
      });
    },
    disabledDate(current) {
      let customDate = new Date();
      return current && current > moment(customDate, "YYYY-MM-DD");
    },
   
    ab2str(buf) {
      var binaryString = '', bytes = new Uint8Array(buf), length = bytes.length;
      for(var i=0; i<length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      return binaryString;
    },

  },
};
</script>

<style scoped>
  .labelTittle {
    background-color:#FAFAFA; 
    font-weight:bold; 
    padding-right:5px;
    height: 100%;
  }
  .labelValue {
    border-width: 0.1px;
    border-color:#FAFAFA;
    border-style: solid;
  }
  
</style>