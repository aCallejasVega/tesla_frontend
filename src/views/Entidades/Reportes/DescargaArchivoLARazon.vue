<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632d"> DESCARGA DE ARCHIVOS. </b>
          </h2>
        </a-col>
      </div>

      <a-divider orientation="left">BUSQUEDA</a-divider>

      <a-form>
        <a-row :gutter="1">
          <a-col :span="2"></a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <a-form-item
              label="Fecha Inicio :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
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
          <a-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <a-form-item
              label="Fecha Fin :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
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
          <a-col :span="2"></a-col>
        </a-row>
      </a-form>
      <a-form>
        <a-row>
          <a-col :span="2"></a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <a-form-item
              label="Recaudadora :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              class="a-item-form"
            >
              <a-select
                mode="tags"
                size="default"
                v-model="checkedListRecaudacion"
                @change="onChangeRecaudacion"
              >
                <a-select-option
                  v-for="item in recaudadoresList"
                  v-bind:value="item.value"
                  v-bind:key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
            <a-form-item
              label="Estado :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              class="a-item-form"
            >
              <a-select mode="tags" size="default" v-model="checkedListEstado">
                <a-select-option
                  v-for="item in estadoList"
                  v-bind:value="item.value"
                  v-bind:key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="2"></a-col>
        </a-row>
      </a-form>

      <br />
      <a-row type="flex" justify="center" align="top" :gutter="16">
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
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
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-button
            type="danger"
            @click="findDeudasByParameterForReport(1)"
            block
            :style="{
              fontSize: '19px',
              height: '50px',
            }"
          >
            <span> <a-icon type="search" /> Buscar </span>
          </a-button>
        </a-col>
        <a-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
          <a-button
            type="primary"
            @click="openModalTipoReporte()"
            block
            :style="{
              fontSize: '19px',
              height: '50px',
            }"
          >
            <span :style="{ fontSize: '20px' }">
              <a-icon type="printer" /> Descargar Archivo
            </span>
          </a-button>
        </a-col>
      </a-row>
    </a-card>
    <a-card style="width: 100%">
      <a-divider orientation="left">DATOS DE LAS DEUDAS</a-divider>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        align="center"
        :loading="loadingTable"
      >
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'COBRADOS'">
            <a-tag color="green">
              <a-icon type="check" :style="{ fontSize: '15px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'POR PAGAR'">
            <a-tag color="blue">
              <a-icon type="exclamation-circle" :style="{ fontSize: '15px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'ANULADO'">
            <a-tag color="red">
              <a-icon type="exclamation-circle" :style="{ fontSize: '15px' }" />
              {{ record.estado }}
            </a-tag>
          </div>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model="visibleModalTipoReporte"
      title="Seleccione tipo de reporte"
      @ok="visibleModalTipoReporte = false"
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
        <a-button key="back" @click="openModalGenerarReporte()">
          Generar Reporte
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
import ReportesEntidad from "../../../service/Entidades/ReportesEntidad.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";

const columns = [
  {
    title: "Tipo Servicio",
    dataIndex: "tipoServicio",
    key: "tipoServicio",
    width: "12%",
  },
  {
    title: "Servicio",
    dataIndex: "servicio",
    key: "servicio",
    width: "10%",
    scopedSlots: { customRender: "servicio" },
  },
  {
    title: "Periodo",
    dataIndex: "periodo",
    key: "periodo",
    width: "8%",
  },
  {
    title: "Cód. Cliente",
    dataIndex: "codigoCliente",
    key: "codigoCliente",
    width: "10%",
    align: "center",
  },

  {
    title: "Nombre Recaudadora",
    dataIndex: "nombreRecaudadora",
    key: "nombreRecaudadora",
    width: "20%",
  },
  {
    title: "Fecha Cobro",
    dataIndex: "fechaCreacion",
    key: "fechaCreacion",
    width: "15%",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    width: "10%",
  },
  /*{
    title: "Comision",
    dataIndex: "comision",
    key: "comision",
    width: "10%",
  },*/
  {
    title: "Estado",
    key: "estado",
    dataIndex: "estado",
    width: "10%",
    scopedSlots: { customRender: "estado" },
  },
];
export default {
  data() {
    return {
      locale,
      formBusqueda: {
        fechaInicio: null,
        fechaFin: null,
        recaudadorArray: [],
        estadoArray: [],
        export: "pdf",
      },
      columns,
      data: [],
      pagination: {},
      page: 1,
      total: 0,
      recaudadoresList: [],
      estadoList: [],
      visibleModalTipoReporte: false,
      visibleModalReporte: false,
      link: null,
      viewCargando: false,
      disableEstado: false,
      mensajeReporte:
        "NO SE PUDO CARGAR EL REPORTE, VERIFIQUE LOS PARÁMETROS SELECCIONADOS EN EL ÁREA DE BÚSQUEDA. ",
      mensajeVisible: false,
      checkedListRecaudacion: [],
      indeterminateRecaudacion: false,
      checkAllRecaudacion: false,

      checkedListEstado: [],
      indeterminateEstado: false,
      checkAllEstado: false,
      loadingTable: false,
    };
  },
  created() {
    this.findDeudasByParameterForReport(1);
    this.getEstadoHistoricos();
    this.getRecaudadores();
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findDeudasByParameterForReport(page);
      },
    };
  },
  methods: {
    findDeudasByParameterForReport(page) {
      if (
        this.checkedListRecaudacion == null ||
        this.checkedListRecaudacion == ""
      ) {
        this.onCheckAllChangeRecaudacion();
      }
      if (this.checkedListEstado == null || this.checkedListEstado == "") {
        this.onCheckAllChangeEstado();
      }
      this.loadingTable = true;
      this.formBusqueda.paginacion = page;
      this.formBusqueda.recaudadorArray = this.checkedListRecaudacion;
      this.formBusqueda.estadoArray = this.checkedListEstado;
      ReportesEntidad.findDeudasByParameterForReport(this.formBusqueda)
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
    getEstadoHistoricos() {
      ReportesEntidad.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
        })
        .catch((error) => {
          this.estadoList = [];
        });
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
    openModalGenerarReporte() {
      if (
        this.checkedListRecaudacion == null ||
        this.checkedListRecaudacion == ""
      ) {
        this.onCheckAllChangeRecaudacion();
      }
      if (this.checkedListEstado == null || this.checkedListEstado == "") {
        this.onCheckAllChangeEstado();
      }
      this.mensajeVisible = false;
      this.link = null;
      this.viewCargando = true;
      this.formBusqueda.recaudadorArray = this.checkedListRecaudacion;
      this.formBusqueda.estadoArray = this.checkedListEstado;
      
      ReportesEntidad.downloaArchivo(this.formBusqueda)
        .then((response) => {
          console.log('ingreso por si');
            this.forceFileDownload(response);
            this.viewCargando = false;
            this.mensajeVisible=false;
            this.visibleModalReporte=false;
        })
        .catch((error) => {
          console.log('ingreso por no');
          this.viewCargando = false;
          this.mensajeVisible = true;
          this.link = null;
        });

      this.visibleModalTipoReporte = false;
      this.visibleModalReporte = true;
    },
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte.csv`);
      document.body.appendChild(link);
      link.click();
    },
   
    onChangeRecaudadora() {
      if (this.formBusqueda.recaudadorId != "All") {
        this.formBusqueda.estado = "COBRADO";
        this.disableEstado = false;
      } else {
        this.disableEstado = false;
      }
    },
    limpiar() {
      this.formBusqueda.fechaInicio = null;
      this.formBusqueda.fechaFin = null;
      this.formBusqueda.recaudadorId = "All";
      this.formBusqueda.estado = "All";
      this.formBusqueda.export = "pdf";
      this.checkedListRecaudacion = [];
      this.checkedListEstado = [];
      this.data = [];
    },
    onChangeRecaudacion(checkedListRecaudacion) {
      this.indeterminateRecaudacion =
        !!checkedListRecaudacion.length &&
        checkedListRecaudacion.length < this.recaudadoresList.length;
      this.checkAllRecaudacion =
        checkedListRecaudacion.length === this.recaudadoresList.length;
    },
    onCheckAllChangeRecaudacion() {
      let i = 0;
      let v = [];
      this.recaudadoresList.forEach((element) => {
        v[i] = element.value;
        i++;
      });
      this.checkedListRecaudacion = v;
    },

    onChangeEstado(checkedListEstado) {
      this.indeterminateEstado =
        !!checkedListEstado.length &&
        checkedListEstado.length < this.estadoList.length;
      this.checkAllEstado = checkedListEstado.length === this.estadoList.length;
    },
    onCheckAllChangeEstado() {
      let i = 0;
      let v = [];
      this.estadoList.forEach((element) => {
        v[i] = element.value;
        i++;
      });
      this.checkedListEstado = v;
    },

    openModalTipoReporte() {
      console.log("-----------openModalTipoReporte--------")
      
      if (this.formBusqueda.fechaFin < this.formBusqueda.fechaInicio) {
        this.$warning({
          title: "Corrija los campos en el formulario de búsqueda.",
          content: "La ‘Fecha Fin’ no puede ser menor a la ‘Fecha Inicio’",
          okText: 'Aceptar',
         
        });
      }else{
          this.openModalGenerarReporte();
      }
    },
  },
};
</script>
<style scoped>
@import "../../../../public/plantilla.css";
.a-item-form {
  margin: 0px;
}
</style>