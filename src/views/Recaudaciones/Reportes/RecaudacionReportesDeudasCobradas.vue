<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632d"> REPORTE GENERAL DE DEUDAS. </b>
          </h2>
        </a-col>
      </div>
     

      <a-form>
        <a-row>
          <a-col :span="2"></a-col>
          <a-col :span="10">
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
              />
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item
              label="Fecha Fin :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              class="a-item-form"
            >
              <a-date-picker
                format="DD/MM/YYYY"
                v-model="formBusqueda.fechaFin"
                :locale="locale"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-form>
        <a-row :gutter="1">
          <a-col :span="2"></a-col>
          <a-col :span="10">
            <a-form-item
              label="Entidades :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              class="a-item-form"
            >
              <a-select v-model="checkedListEntidad" mode="tags" size="default">
                <a-select-option
                  v-for="item in entidadesList"
                  v-bind:value="item.value"
                  v-bind:key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="10">
            <a-form-item
              label="Estado :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              class="a-item-form"
            >
              <a-select v-model="checkedListEstado" mode="tags" size="default">
                <a-select-option
                  v-for="item in estadoList"
                  v-bind:value="item.value"
                  v-bind:key="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4"></a-col>
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
          <a-button type="primary" @click="visibleModalTipoReporte = true"  block
            :style="{
              fontSize: '19px',
              height: '50px',
            }">
            <span >
              <a-icon type="printer" /> Generar Reporte
            </span>
          </a-button>
        </a-col>
      </a-row>
      <!--template slot="actions" class="ant-card-actions">
        <a-button type="link" @click="limpiar()">
          <span :style="{ fontSize: '20px' }">
            <a-icon type="undo" /> Limpiar
          </span>
        </a-button>
        <a-button type="link" @click="findDeudasByParameterForReport(1)">
          <span :style="{ fontSize: '20px' }">
            <a-icon type="search" /> Buscar
          </span>
        </a-button>
        <a-button type="link" @click="visibleModalTipoReporte = true">
          <span :style="{ fontSize: '20px' }">
            <a-icon type="printer" /> Generar Reporte
          </span>
        </a-button>
      </template-->
    </a-card>
    <a-card style="width: 100%">
      <a-divider orientation="left" class="a-divider"
        >DATOS DE LAS DEUDAS</a-divider
      >
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        align="center"
        :loading="loadingTable"
      ></a-table>
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
import ReportesRecaudacion from "../../../service/Recaudaciones/ReportesRecaudacion.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";

const columns = [
  {
    title: "Entidad",
    dataIndex: "nombreComercial",
    key: "nombreComercial",
    width: "10%",
    scopedSlots: { customRender: "nombreComercial" },
  },
  {
    title: "Servicio",
    dataIndex: "servicio",
    key: "servicio",
    width: "10%",
    scopedSlots: { customRender: "servicio" },
  },
  {
    title: "Tipo Servicio",
    dataIndex: "tipoServicio",
    key: "tipoServicio",
    width: "12%",
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

  /*{
    title: "Nombre Recaudadora",
    dataIndex: "nombreRecaudadora",
    key: "nombreRecaudadora",
    width: "20%",
  },*/
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
        entidadArray: [],
        estadoArray: [],
        export: "pdf",
      },
      columns,
      data: [],
      pagination: {},
      page: 1,
      total: 0,
      entidadesList: [],
      estadoList: [],
      visibleModalTipoReporte: false,
      visibleModalReporte: false,
      link: null,
      viewCargando: false,
      disableEstado: false,

      mensajeReporte:
        "NO SE PUDO CARGAR EL REPORTE, VERIFIQUE LOS PARÁMETROS SELECCIONADOS EN EL ÁREA DE BÚSQUEDA. ",
      mensajeVisible: false,

      checkedListEntidad: [],
      indeterminateEntidad: false,
      checkAllEntidad: false,

      checkedListEstado: [],
      indeterminateEstado: false,
      checkAllEstado: false,

      loadingTable: false,
    };
  },
  created() {
    this.findDeudasByParameterForReport(1);
    this.getEstadoHistoricos();
    this.getEntidadesByRecaudadora();
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findDeudasByParameterForReport(page);
      },
    };
  },
  methods: {
    findDeudasByParameterForReport(page) {
      this.loadingTable = true;
      if (this.checkedListEntidad == null || this.checkedListEntidad == "") {
        this.onCheckAllChangeEntidad();
      }
      if (this.checkedListEstado == null || this.checkedListEstado == "") {
        this.onCheckAllChangeEstado();
      }
      this.formBusqueda.paginacion = page;
      this.formBusqueda.entidadArray = this.checkedListEntidad;
      this.formBusqueda.estadoArray = this.checkedListEstado;

      ReportesRecaudacion.findDeudasByParameterForReport(this.formBusqueda)
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
      ReportesRecaudacion.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
        })
        .catch((error) => {
          this.estadoList = [];
        });
    },
    getEntidadesByRecaudadora() {
      this.entidadesList = [];
      ReportesRecaudacion.getEntidadesByRecaudadora()
        .then((response) => {
          this.entidadesList = response.data.data;
        })
        .catch((error) => {
          this.entidadesList = [];
        });
    },
    openModalGenerarReporte() {
      if (this.checkedListEntidad == null || this.checkedListEntidad == "") {
        this.onCheckAllChangeEntidad();
      }
      if (this.checkedListEstado == null || this.checkedListEstado == "") {
        this.onCheckAllChangeEstado();
      }
      this.link = null;
      this.viewCargando = true;
      this.formBusqueda.entidadArray = this.checkedListEntidad;
      this.formBusqueda.estadoArray = this.checkedListEstado;
      ReportesRecaudacion.openModalGenerarReporte(this.formBusqueda)
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
      this.formBusqueda.entidadId = "All";
      this.formBusqueda.estado = "All";
      this.formBusqueda.export = "pdf";
      this.checkedListEntidad = [];
      this.checkedListEstado = [];
      this.data = [];
    },

    onCheckAllChangeEntidad(e) {
      let i = 0;
      let v = [];
      this.entidadesList.forEach((element) => {
        v[i] = element.value;
        i++;
      });
      this.checkedListEntidad = v;
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
  },
};
</script>
<style scoped>
@import "../../../../public/plantilla.css";
.a-item-form {
  margin: 0px;
}
.card-head {
  border: 2px solid #086346;
  border-radius: 8px;
  height: 55px;
  width: 100%;
  padding: 1%;
  color: #086346;
}
</style>