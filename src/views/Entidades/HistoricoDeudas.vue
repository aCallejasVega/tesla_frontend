<template>
  <div>
    <a-card style="width: 100%">
   
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632D"> LISTA DE ARCHIVOS CARGADOS. </b>
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
              <a-radio-button value="null"> Todos </a-radio-button>
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
          <a-button type="dashed" @click="limpiar()" block :style="{
              fontSize: '19px',
              height: '50px',
            }">
            <span >
              <a-icon type="undo" /> Limpiar
            </span>
          </a-button>
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <a-button type="primary" block @click="findArchivos(1)" :style="{
              fontSize: '19px',
              height: '50px',
            }">
            <span >
              <a-icon type="search" /> Buscar
            </span>
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
        <template slot="nombre" slot-scope="text, record">
          <a @click="getCsv(record.archivoId, record.nombre)"
            ><a-icon type="download" :style="{ fontSize: '20px' }" /> 一
            {{ record.nombre }}</a
          >
        </template>
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
              <a>FALLIDO</a>
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
      <a-row>
        <a-col :span="24">
          <a-alert
            message="Seleccione el estado y el tipo de tipo de reporte que desea imprimir."
            type="info"
            show-icon
          />
        </a-col>
      </a-row>
      <a-row>
        <a-form :label-col="{ span: 10 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="Imprimir reporte de deudas :">
            <a-select v-model="formBusqueda.estado">
              <a-select-option value="All"> TODS LOS ESTADOS </a-select-option>
              <a-select-option
                v-for="item in estadoList"
                v-bind:value="item.estadoId"
                v-bind:key="item.estadoId"
              >
                {{ item.estado }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Entidad Recaudadora :">
            <a-select v-model="formBusqueda.recaudadorId">
              <a-select-option value="0">
                TODS LAS RECAUDADORAS
              </a-select-option>
              <a-select-option
                v-for="item in recaudadoresList"
                v-bind:value="item.recaudadorId"
                v-bind:key="item.recaudadorId"
                >{{ item.nombre }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="Formato del Reporte :">
            <a-select v-model="formBusqueda.formato">
              <a-select-option
                v-for="item in tipoReporteList"
                v-bind:value="item.abreviatura"
                v-bind:key="item.dominioId"
                >{{ item.descripcion }}</a-select-option
              >
            </a-select>
          </a-form-item>
        </a-form>
      </a-row>
      <template slot="footer">
        <a-button key="back" @click="closeModal()"> Cancelar </a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="generarReporte()"
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
      @ok="closeModal"
    >
      <iframe style="width: 100%; height: 400px" :src="urlReporte"></iframe>
      <template slot="footer">
        <a-button key="back" @click="visibleModalReporte = false">
          Cerrar
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import HistoricoDeudas from "../../service/Entidades/HistoricoDeudas.service";
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
    title: "Fecha de Cargado.",
    dataIndex: "fechaCreacion",
    width: "15%",
  },
  {
    title: "Cantidad Registros",
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
        estado: "ACTIVO",
        recaudadorId: null,
        formato: null,
      },
      urlReporte: null,
      visibleModalReporte: false,
      url: null,
      recaudadoresList: [],
      loadingTable: false,
    };
  },
  created() {
    this.findArchivos(1);

    this.getEstadoHistoricos();

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
      this.data = [];
      HistoricoDeudas.findArchivos(
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
        });
    },
    showModal(archivoId) {
      this.visibleModal = true;
      this.archivoId = archivoId;
    },
    closeModal() {
      this.visibleModal = false;
      this.archivoId = null;
    },
    ingresarDetalleArchivo() {
      this.$router.push({
        path: "/HistoricoDeudasDetalle/" + this.archivoId,
      });
    },
    limpiar() {
      this.formBusqueda.fechaInicio = null;
      this.formBusqueda.fechaFin = null;
      this.formBusqueda.estado = "ACTIVO";
      this.findArchivos(1);
    },
    showModalReportes(archivoId) {
      this.visibleModalForm = true;
      this.archivoId = archivoId;
    },

    getEstadoHistoricos() {
      HistoricoDeudas.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
        })
        .catch((error) => {
          this.estadoList = [];
        });
    },

    getCsv(archivoId, nombre) {
      HistoricoDeudas.getCsv(archivoId)
        .then((response) => {
          this.forceFileDownload(response, nombre);
        })
        .catch((error) => {});
    },
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>
<style>
@import "../../../public/plantilla.css";
.card-head {
  border: 2px solid #086346;
  border-radius: 8px;
  height: 55px;
  width: 100%;
  padding: 1%;
  color: #086346;
}
</style>
