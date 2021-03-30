<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        class="a-page-header"
        title="LISTA DE DEUDAS."
      />
      <a-divider orientation="left">Busqueda</a-divider>

      <a-form >
        <a-row :gutter="1">
          <a-col :span="5"></a-col>
          <a-col :span="7">
            <a-form-item
              label="Fecha Inicio :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
              style="margin-bottom: 25px;"
               class="a-item-form"
            >
              <a-date-picker
                format="DD/MM/YYYY "
                v-model="formBusqueda.fechaInicio"
                :locale="locale"
              />
            </a-form-item>
          </a-col>
          <a-col :span="7">
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
          <a-col :span="5"></a-col>
        </a-row>
      </a-form>
      <a-form>
        <a-row :gutter="1">
          <a-col :span="2"></a-col>

          <a-col :span="6">
            <a-form-item
              label="Empresas :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
               class="a-item-form"
            >
              <a-select
                v-model="formBusqueda.entidadId"
                @change="onChangeRecaudadora()"
              >
                <a-select-option value="All">
                  TODAS LAS EMPRESAS :
                </a-select-option>
                <a-select-option
                  v-for="item in entidadesList"
                  v-bind:value="item.entidadId"
                  v-bind:key="item.entidadId"
                  >{{ item.nombre }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="7">
            <a-form-item
              label="Recaudadoras :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
               class="a-item-form"
            >
              <a-select
                v-model="formBusqueda.recaudadorId"
                @change="onChangeRecaudadora()"
              >
                <a-select-option value="All">
                  TODAS LAS RECAUDADORES :
                </a-select-option>
                <a-select-option
                  v-for="item in recaudadorasList"
                  v-bind:value="item.recaudadorId"
                  v-bind:key="item.recaudadorId"
                  >{{ item.nombre }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              label="Estado :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
               class="a-item-form"
            >
              <a-select v-model="formBusqueda.estado" :disabled="disableEstado">
                <a-select-option value="All">
                  TODOS LOS ESTADOS
                </a-select-option>
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
          <a-col :span="3"></a-col>
        </a-row>
      </a-form>

      <template slot="actions" class="ant-card-actions">
        <a-button type="link"  @click="limpiar()">
          <span :style="{ fontSize: '20px' }">
            <a-icon type="undo" /> Limpiar
          </span>
        </a-button>
        <a-button
          type="link"
        
          @click="findDeudasByParameterForReport(1)"
        >
          <span :style="{ fontSize: '20px' }">
            <a-icon type="search" /> Buscar
          </span>
        </a-button>
        <a-button
          type="link"
          icon="printer"
          @click="visibleModalTipoReporte = true"
        >
          Generar Reporte
        </a-button>
      </template>
    </a-card>
    <a-card style="width: 100%">
      <a-divider orientation="left">DATOS DE LAS DEUDAS</a-divider>
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
      width="900px"
      height="400px"
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
import ReportesAdmin from "../../../service/Administraciones/ReportesAdmin.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";

const columns = [
  {
    title: "Empresa",
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
        entidadId: "All",
        recaudadorId: "All",
        estado: "All",
        export: "pdf",
      },
      columns,
      data: [],
      pagination: {},
      page: 1,
      total: 0,
      recaudadorasList: [],
      entidadesList: [],
      estadoList: [],
      visibleModalTipoReporte: false,
      visibleModalReporte: false,
      link: null,
      viewCargando: false,
      disableEstado: false,
      loadingTable:false,
    };
  },
  created() {
    this.findDeudasByParameterForReport(1);
    this.getEstadoHistoricos();
    this.getRecaudadora();
    this.getEntidades();
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findDeudasByParameterForReport(page);
      },
    };
  },
  methods: {
    findDeudasByParameterForReport(page) {
      this.loadingTable=true;
      this.formBusqueda.paginacion = page;
    
      ReportesAdmin.findDeudasByParameterForReport(this.formBusqueda)
        .then((response) => {
          
          this.data = response.data.data.content;
          this.pagination.pageSize = response.data.data.numberOfElements;
          this.pagination.total = response.data.data.totalElements;
          this.loadingTable=false;
        })
        .catch((error) => {
          this.data = [];
          this.loadingTable=false;
        });
    },
    getEstadoHistoricos() {
      ReportesAdmin.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
        })
        .catch((error) => {
          this.estadoList = [];
        });
    },
    getEntidades() {
      ReportesAdmin.getEntidades()
        .then((response) => {
          this.entidadesList = response.data.data;
        })
        .catch((error) => {
          this.entidadesList = [];
        });
    },
    getRecaudadora() {
      ReportesAdmin.getRecaudadora()
        .then((response) => {
          this.recaudadorasList = response.data.data;
        })
        .catch((error) => {
          this.recaudadorasList = [];
        });
    },
    openModalGenerarReporte() {
      this.link = null;
      this.viewCargando = true;

      ReportesAdmin.openModalGenerarReporte(this.formBusqueda)
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