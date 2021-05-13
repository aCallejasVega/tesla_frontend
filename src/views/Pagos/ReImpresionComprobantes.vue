<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632d"> REIMPRESIÓN DE COMPROBANTES DE PAGO </b>
          </h2>
        </a-col>
      </div>

      <a-divider orientation="left">BUSQUEDA</a-divider>

      <a-form>
        <a-row :gutter="1">
          <a-col :span="4"> </a-col>
          <a-col :span="8">
            <a-form-item
              label="Fecha Inicio :"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              class="a-item-form"
            >
              <a-date-picker
                format="DD/MM/YYYY "
                v-model="formBusqueda.fechaInicio"
                :locale="locale"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="Fecha Fin :"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              class="a-item-form"
            >
              <a-date-picker
                size="default"
                format="DD/MM/YYYY"
                v-model="formBusqueda.fechaFin"
                :locale="locale"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4"> </a-col>
        </a-row>
        <a-row type="flex" justify="start">
          <a-col :span="4"> </a-col>
          <a-col :span="8">
            <a-form-item
              label="Tipo de Pago :"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
              class="a-item-form"
            >
              <a-select
                style="width: 100%"
                v-model="formBusqueda.servicioProductoId"
              >
                <a-select-opt-group
                  v-for="(servicios, index) in servicioProductosList"
                  :key="index"
                >
                  <span slot="label">{{ servicios.descripcion }}</span>
                  <a-select-option
                    v-for="producto in servicios.servicioProductoEntityList"
                    :key="producto.servicioProductoId"
                    :value="producto.servicioProductoId"
                  >
                    {{ producto.descripcion }}
                  </a-select-option>
                </a-select-opt-group>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="Buscar por :"
              :label-col="{ span: 7 }"
              :wrapper-col="{ span: 17 }"
            >
              <a-input
                v-model="formBusqueda.parameter"
                placeholder="input placeholder"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="4"> </a-col>
        </a-row>
      </a-form>

      <a-row type="flex" justify="center" align="top" :gutter="16">
        <a-col :span="12">
          <a-button
            type="dashed"
            @click="limpiar()"
            block
            :style="{
              fontSize: '19px',
              height: '50px',
            }"
          >
            <span> <a-icon type="undo" /> Limpiar </span>
          </a-button>
        </a-col>
        <a-col :span="12">
          <a-button
            type="primary"
            @click="findLisGrid(1)"
            block
            :style="{
              fontSize: '19px',
              height: '50px',
            }"
          >
            <span> <a-icon type="search" /> Buscar </span>
          </a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="width: 100%">
      <a-divider orientation="left">PAGOS REALIZADOS</a-divider>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        align="center"
        :loading="loadingTable"
      >
        <template slot="accion" slot-scope="text, record">
          <a-button
            type="primary"
            ghost
            icon="printer"
            @click="viewPagos(record)"
          />
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="visibleModalReporte"
      title="Reporte Generado"
      width="800px"
      :dialog-style="{ top: '20px' }"
      @ok="visibleModalReporte = false"
    >
      <a-row type="flex" justify="center">
        <a-spin
          size="large"
          tip="El reporte se esta cargando...."
          v-if="viewCargando"
        >
        </a-spin>
        <a-alert
          message="ADVERTENCIA"
          :description="mensajeReporte"
          type="warning"
          show-icon
          v-if="mensajeVisible"
        />
        <iframe width="800px" height="350px" :src="this.link"> </iframe>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="visibleModalReporte = false">
          Cerrar
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import ReImpresionComprobante from "@/service/Pagos/ReImpresionComprobante.service.js";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";

const columns = [
  {
    title: "CÓDIGO",
    dataIndex: "codigoCliente",
    key: "codigoCliente",
    width: "10%",
    scopedSlots: { customRender: "codigoCliente" },
  },
  {
    title: "BENEFICIARIO",
    dataIndex: "nombreCliente",
    key: "nombreCliente",
    width: "15%",
  },
  {
    title: "NRO. DOCUMENTO.",
    dataIndex: "nroDocumentoCliente",
    key: "nroDocumentoCliente",
    width: "15%",
  },
  {
    title: "EXTENCIÓN",
    dataIndex: "extencionDocumento",
    key: "extencionDocumento",
    width: "10%",
  },

  {
    title: "FECHA PAGO",
    dataIndex: "fechaModificacion",
    key: "fechaModificacion",
    width: "15%",
  },
  {
    title: "TOTAL (Bs)",
    dataIndex: "totalPagar",
    key: "totalPagar",
    width: "10%",
    align: "center",
  },
  {
    title: "ACCIÓN",
    dataIndex: "accion",
    key: "accion",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "accion" },
  },
];
export default {
  data() {
    return {
      locale,
      formBusqueda: {
        fechaInicio: null,
        fechaFin: null,
        servicioProductoId: null,
        paginacion: 1,
      },
      columns,
      data: [],
      pagination: {},
      page: 1,
      total: 0,
      recaudadoresList: [],
      visibleModalReporte: false,
      link: null,
      viewCargando: false,
      mensajeReporte:
        "NO SE PUDO CARGAR EL REPORTE, VERIFIQUE LOS PARÁMETROS SELECCIONADOS EN EL ÁREA DE BÚSQUEDA. ",
      mensajeVisible: false,
      loadingTable: false,
      servicioProductosList: [],
    };
  },
  created() {
    this.getServiciosProductos();

    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findLisGrid(page);
      },
    };
  },
  methods: {
    getServiciosProductos() {
      ReImpresionComprobante.getServiciosProductos()
        .then((response) => {
          this.servicioProductosList = response.data.data;
        })
        .catch((error) => {
          this.servicioProductosList = [];
        });
    },
    findLisGrid(page) {
      this.loadingTable = true;
      this.formBusqueda.paginacion = page;
      ReImpresionComprobante.reImpresionGrid(this.formBusqueda)
        .then((response) => {
          this.data = response.data.data.content;
          this.pagination.pageSize = response.data.data.numberOfElements;
          this.pagination.total = response.data.data.totalElements;
          this.loadingTable = false;
        })
        .catch((error) => {
          this.data = [];
          this.loadingTable = false;
        });
    },
    viewPagos(record) {
      this.mensajeVisible = false;
      this.link = null;
      this.viewCargando = true;
      this.visibleModalReporte = true;
      ReImpresionComprobante.imprimirComprobantePago(record.codigoTransaccion)
        .then((response) => {
          this.viewCargando = false;
          if (response.status == 200) {
            this.viewFileDownload(response);
          } else {
            this.mensajeVisible = true;
          }
        })
        .catch((error) => {
          this.visibleModalReporte = false;
        });
    },
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/pdf",
      });
      this.link = URL.createObjectURL(file);
      this.viewCargando = false;
    },
    limpiar(){
      this.data = [];
      this.formBusqueda.fechaInicio=null;
      this.formBusqueda.fechaFin=null;
      this.formBusqueda.servicioProductoId=null;
      this.formBusqueda.parameter=null;
      this.formBusqueda.paginacion=1;
    }
  },
};
</script>
<style scoped>

</style>