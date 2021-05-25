<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632D"> REPORTE POR ARCHIVOS CARGADOS. </b>
          </h2>
        </a-col>
      </div>
      <a-divider orientation="left">Busqueda</a-divider>
      <a-row type="flex" justify="center">
        <a-form layout="inline" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="Fecha Inicio :">
            <a-date-picker
              format="DD/MM/YYYY "
              v-model="formBusqueda.fechaInicio"
              :locale="locale"
            />
          </a-form-item>
          <a-form-item label="Fecha Fin :">
            <a-date-picker
              format="DD/MM/YYYY"
              v-model="formBusqueda.fechaFin"
              :locale="locale"
            />
          </a-form-item>
        </a-form>
      </a-row>
      <a-row type="flex" justify="center">
        <a-form layout="inline">
          <a-form-item label="Estado :">
            <a-radio-group
              default-value="ACTIVO"
              button-style="solid"
              v-model="formBusqueda.estado"
            >
              <a-radio-button value="All"> Todos </a-radio-button>
              <a-radio-button value="ACTIVO"> Activo </a-radio-button>
              <a-radio-button value="DESACTIVO"> Inactivo </a-radio-button>
              <a-radio-button value="FALLIDO"> Fallidos </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-row>
      <br />
      <a-row type="flex" justify="center" align="top" :gutter="16">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-button
            type="dashed"
            block
            @click="limpiar()"
            :style="{
              fontSize: '19px',
              height: '50px',
            }"
          >
            <span> <a-icon type="undo" /> Limpiar </span>
          </a-button>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-button
            type="primary"
            @click="findArchivos(1)"
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
      <a-divider orientation="left">Datos de los Archivos</a-divider>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        align="center"
        :loading="loadingTable"
      >
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'ACTIVO'">
            <a-tag color="green">
              <a-icon type="file-protect" :style="{ fontSize: '20px' }" />
              <a @click="showModal(record.archivoId)">ACTIVO</a>
            </a-tag>
          </div>
          <div v-if="record.estado == 'DESACTIVO'">
            <a-tag color="blue">
              <a-icon type="inbox" :style="{ fontSize: '20px' }" />
              <a @click="showModal(record.archivoId)">INACTIVO</a>
            </a-tag>
          </div>
          <div v-if="record.estado == 'FALLIDO'">
            <a-tag color="red">
              <a-icon type="exception" :style="{ fontSize: '20px' }" />
              <a @click="showModal(record.archivoId)">FALLIDO</a>
            </a-tag>
          </div>
        </template>
        <template slot="reporte" slot-scope="text, record">
          <a-button
            type="link"
            icon="printer"
            :style="{ fontSize: '20px' }"
            @click="showModalReportes(record.archivoId)"
          />
        </template>
      </a-table>
    </a-card>
    <a-modal
      v-model="visibleModal"
      title="Ver detalle del archivo"
      @ok="closeModal"
    >
      <a-row>
        <a-col :span="6"
          ><a-icon
            type="question-circle"
            :style="{ fontSize: '105px', color: '#8EBDF5' }"
        /></a-col>
        <a-col :span="18">
          <a-alert
            message="Ver detalle del archivo."
            description="¿Quiere ingresar al detalle do los registros de las deudas enviadas en este archivo?"
            type="info"
          />
        </a-col>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="closeModal()"> Cancelar </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="ingresarDetalleArchivo()"
        >
          Aceptar
        </a-button>
      </template>
    </a-modal>
    <a-modal
      v-model="visibleModalForm"
      title="Imprimir tipo de reporte"
      @ok="closeModal"
    >
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-col>Seleccione un tipo de Reporte a generar.</a-col>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-radio-group button-style="solid" v-model="formBusqueda.export">
            <a-radio-button value="pdf"> PDF </a-radio-button>
            <a-radio-button value="msword"> WORD </a-radio-button>
            <a-radio-button value="msexcel"> EXCEL </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <template slot="footer">
        <a-button key="back" @click="closeModal()"> Cancelar </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="openReportesPorArchivo()"
        >
          Aceptar
        </a-button>
      </template>
    </a-modal>

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
        <iframe width="100%" height="400px" :src="this.link" frameborder="0">
        </iframe>
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
import ReportesEntidad from "../../../service/Entidades/ReportesEntidad.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";

const columns = [
  {
    title: "Nombre Archivo",
    dataIndex: "nombre",
    width: "25%",
    scopedSlots: { customRender: "nombre" },
  },
  {
    title: "Usuario",
    dataIndex: "usuarioCreacion",
    width: "25%",
  },
  {
    title: "Fecha de Envió.",
    dataIndex: "fechaCreacion",
    width: "15%",
  },
  {
    title: "Nro. Registro",
    dataIndex: "nroRegistros",
    width: "15%",
    align: "center",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    width: "10%",
    scopedSlots: { customRender: "estado" },
  },
  {
    title: "Reporte",
    dataIndex: "reporte",
    width: "10%",
    scopedSlots: { customRender: "reporte" },
  },
];
export default {
  data() {
    return {
      locale,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },

      data: [],
      pagination: {},
      page: 1,
      total: 0,
      loading: false,
      columns,
      moment,
      visibleModal: false,
      archivoId: null,
      visibleModalForm: false,
      tipoReporteList: [],
      estadoList: [],
      formBusqueda: {
        archivoId: null,
        estado: "All",
        recaudadorId: null,
        export: "pdf",
      },
      urlReporte: null,
      visibleModalReporte: false,
      url: null,
      recaudadoresList: [],
      link: null,
      loadingTable: false,
      viewCargando:false,
    };
  },
  created() {
    this.findArchivos(1);
    this.getTipoReporte();
    this.getEstadoHistoricos();
    this.getRecaudadores();
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findArchivos(page);
      },
    };
  },
  methods: {
    findArchivos(page) {
      this.loadingTable = true;
      ReportesEntidad.findArchivos(
        page,
        this.formBusqueda.fechaInicio,
        this.formBusqueda.fechaFin,
        this.formBusqueda.estado
      )
        .then((response) => {
          this.pagination.pageSize = response.data.data.numberOfElements;
          this.pagination.total = response.data.data.totalElements;
          this.data = response.data.data.content;
          this.loadingTable = false;
        })
        .catch((error) => {
          this.data = [];
          this.loadingTable = false;
        });
    },
    showModal(archivoId) {
      this.visibleModal = true;
      this.archivoId = archivoId;
    },
    closeModal() {
      this.visibleModalForm=false;
      this.visibleModal = false;
      this.archivoId = null;
    },
    ingresarDetalleArchivo() {
      this.$router.push({
        path: "/HistoricoDeudasDetalle/" + this.archivoId,
      });
    },
    limpiar() {
      this.formBusqueda.export = "pdf";
      this.formBusqueda.archivoId = null;
      this.formBusqueda.estado = null;
      this.formBusqueda.recaudadorId = null;
      this.formBusqueda.export = "pdf";
      this.findArchivos(1);
    },
    showModalReportes(archivoId) {
      this.visibleModalForm = true;
      this.archivoId = archivoId;
    },
    getTipoReporte() {
      ReportesEntidad.findDominioByDominio()
        .then((response) => {
          this.tipoReporteList = response.data.data;
        })
        .catch((error) => {
          this.tipoReporteList = [];
        });
    },
    getEstadoHistoricos() {
      ReportesEntidad.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
          
        })
        .catch((error) => {
          this.estadoList = [];
        });
    },

    generarReporte() {
      this.visibleModalForm = false;
      this.visibleModalReporte = true;
      this.formBusqueda.archivoId = this.archivoId;
    },

    openReportesPorArchivo() {
      this.visibleModalForm = false;
      this.visibleModalReporte = true;
      this.formBusqueda.archivoId = this.archivoId;

      this.link = null;
      this.viewCargando = true;

      ReportesEntidad.openReportesPorArchivo(this.formBusqueda)
        .then((response) => {
          if (this.formBusqueda.export == "pdf") {
            this.viewFileDownload(response);
          } else {
            this.forceFileDownload(response, "reporte");
          }
        })
        .catch((error) => {
          this.link = null;
        });

      this.visibleModalTipoReporte = false;
      this.visibleModalReporte = true;
    },
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      if (this.formBusqueda.export == "msword") {
        link.setAttribute("download", `${fileName}.doc`);
      } else {
        link.setAttribute("download", `${fileName}.xlsx`);
      }
      document.body.appendChild(link);
      link.click();
      this.visibleModalReporte = false;
      this.viewCargando = false;
    },
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/" + this.formBusqueda.export,
      });
      this.link = URL.createObjectURL(file);
      this.viewCargando = false;
    },
    getRecaudadores() {
      ReportesEntidad.getRecaudadoresByEntidad()
        .then((response) => {
          this.recaudadoresList = response.data.data;
          
        })
        .catch((error) => {
          this.recaudadoresList = [];
        });
    },
  },
};
</script>
<style soped>
@import "../../../../public/plantilla.css";
.card-head {
  border: 2px solid #086346;
  border-radius: 8px;
  height: 55px;
  width: 100%;
  padding: 1%;
  color: #086346;
}
</style>
