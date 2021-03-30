<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        class="a-page-header"
        title="REPORTE DE ENTIDAD"
        @back="back()"
      />
      <a-divider orientation="left">Busqueda</a-divider>
      <a-row style="width: 100%">
        <a-form layout="inline">
          <a-form-item
            label="Fecha Inicio :"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              format="DD/MM/YYYY "
              :locale="locale"
              v-model="formBusqueda.fechaInicio"
            />
          </a-form-item>
          <a-form-item
            label="Fecha Fin :"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-date-picker
              format="DD/MM/YYYY"
              :locale="locale"
              v-model="formBusqueda.fechaFin"
            />
          </a-form-item>
        </a-form>
      </a-row>
      <a-row>
        <a-form layout="inline">
          <a-form-item
            label="Recaudador :"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-select
              show-search
              placeholder="Seleccione el estado"
              option-filter-prop="children"
              style="width: 200px"
              v-model="formBusqueda.recaudadorId"
            >
              <a-select-option value="null"> TODOS LAS RECAUDADORAS </a-select-option>
              <a-select-option value="1"> BANCO FIES </a-select-option>
              <a-select-option value="3"> BANCO BNB </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="Estado :" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              show-search
              placeholder="Select a person"
              option-filter-prop="children"
              style="width: 200px"
              v-model="formBusqueda.estado"
            >
              <a-select-option value="null"> TODOS LOS ESTADOS </a-select-option>
              <a-select-option value="ACTIVO"> ACTIVO </a-select-option>
              <a-select-option value="DESACTIVO"> DESACTIVADO </a-select-option>
              <a-select-option value="FALLIDO"> FALLIDOS </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-row>

      <template slot="actions" class="ant-card-actions">
        <a-button type="link" icon="undo" @click="limpiar()"> Limpiar </a-button>
        <a-button type="link" icon="search" @click="chartOption()"> Buscar </a-button>
        <a-button type="link" icon="search"> Imprimir </a-button>
      </template>
    </a-card>
    <a-card style="width: 100%">
      <a-divider orientation="left">CANTIDAD DE DEUDAS COBRADAS POR DÍA.</a-divider>
      <a-row>
        <a-col>
          <GChart
            type="LineChart"
            :data="chartLinealData"
            :options="chartLinealOptions.chart"
            style="width: 100%; height: 600px"
          />
        </a-col>
      </a-row>
      <a-divider orientation="left">CANTIDAD DE SERVICIOS PAGADOS.</a-divider>
      <a-row type="flex" justify="center">
        <a-col
          ><GChart
            type="PieChart"
            :data="pieChartData"
            :options="pieChartOptions.chart"
            style="width: 100%; height: 400px"
          />
        </a-col>
      </a-row>
      <a-divider orientation="left">CANTIDAD DE TIPO DE SERVICIOS PAGADOS .</a-divider>
      <a-row type="flex" justify="center">
        <a-col>
          <GChart
            type="PieChart"
            :data="columnChartData"
            :options="columnChartOptions.chart"
            style="width: 100%; height: 400px"
          />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import ReportesEntidad from "../../service/Entidades/ReportesEntidad.service";
import locale from "ant-design-vue/es/date-picker/locale/es_ES";
import moment from "moment";
import "moment/locale/es";
export default {
  data() {
    return {
      locale,
      moment,
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
      formBusqueda: {
        entidadId: null,
        recaudadorId: null,
        fechaInicio: null,
        fechaFin: null,
        estado: null,
      },
      chartLinealWatch: false,
      chartLinealData: null,
      chartLinealOptions: {
        chart: {
          curveType: "function",
        },
      },
      pieChartWatch: false,
      pieChartData: null,
      pieChartOptions: {
        chart: {},
      },
      columnChartWatch: false,
      columnChartData: null,
      columnChartOptions: {
        chart: {},
      },
    };
  },
  created() {
    this.formBusqueda.entidadId = 1;
    this.chartOption();
  },
  methods: {
    chartOption() {
      this.getLinealChart();
      this.getPieChart();
      this.getColumnChart();
    },
    getLinealChart() {
      this.chartLinealWatch = true;
      ReportesEntidad.linealChart(this.formBusqueda)
        .then((response) => {
          this.chartLinealData = response.data.data;
        })
        .catch((error) => {});
    },
    getPieChart() {
      this.pieChartWatch = true;
      ReportesEntidad.pieChart(this.formBusqueda)
        .then((response) => {
          this.pieChartData = response.data.data;
        })
        .catch((error) => {});
    },
    getColumnChart() {
      this.pieChartWatch = true;
      ReportesEntidad.columnChart(this.formBusqueda)
        .then((response) => {
          this.columnChartData = response.data.data;
        })
        .catch((error) => {});
    },
  },
};
</script>
<style >
@import "../../../public/plantilla.css";
</style>
