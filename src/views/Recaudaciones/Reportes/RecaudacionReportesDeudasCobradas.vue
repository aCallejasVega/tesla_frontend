<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        style="border: 5px solid rgb(235, 237, 240)"
        title="LISTA DE DEUDAS."
      />
      <a-divider orientation="left">Busqueda</a-divider>

      <a-form>
        <a-row :gutter="1">
          <a-col :span="5"></a-col>
          <a-col :span="7">
            <a-form-item
              label="Fecha Inicio :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
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
          <a-col :span="4"></a-col>
          <a-col :span="7">
            <!--a-form-item
              label="Empresas :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-select
                v-model="formBusqueda.entidadId"
                @change="onChangeRecaudadora()"
              >
                <a-select-option value="All">
                  TODAS LAS EMPRESAS
                </a-select-option>
                <a-select-option
                  v-for="item in entidadesList"
                  v-bind:value="item.entidadId"
                  v-bind:key="item.entidadId"
                  >{{ item.nombre }}</a-select-option
                >
              </a-select>
            </a-form-item-->
            <div
              :style="{ borderBottom: '1px solid #A718B8', color: '#A718B8' }"
            >
              <a-checkbox
                :indeterminate="indeterminateEntidad"
                :checked="checkAllEntidad"
                @change="onCheckAllChangeEntidad"
              >
                TODAS LAS EMPRESAS/ENTIDADES
              </a-checkbox>
            </div>
            <br />
            <a-checkbox-group
              v-model="checkedListEntidad"
              :options="entidadesList"
              @change="onChangeEntidad"
            />
          </a-col>
          <a-col :span="2"></a-col>
          <a-col :span="7">
            <!--a-form-item
              label="Estado :"
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 16 }"
            >
              <a-select v-model="formBusqueda.estado" :disabled="disableEstado">
                <a-select-option value="All">
                  TODOS LOS ESTADOS
                </a-select-option>
                <a-select-option
                  v-for="item in estadoList"
                  v-bind:value="item.estadoId"
                  v-bind:key="item.estadoId"
                >
                  {{ item.estado }}
                </a-select-option>
              </a-select>
            </a-form-item-->

            <div
              :style="{ borderBottom: '1px solid #A718B8', color: '#A718B8' }"
            >
              <a-checkbox
                :indeterminate="indeterminateEstado"
                :checked="checkAllEstado"
                @change="onCheckAllChangeEstado"
              >
                TODOS LOS ESTADOS
              </a-checkbox>
            </div>
            <br />
            <a-checkbox-group
              v-model="checkedListEstado"
              :options="estadoList"
              @change="onChangeEstado"
            />
          </a-col>
          <a-col :span="4"></a-col>
        </a-row>
      </a-form>

      <template slot="actions" class="ant-card-actions">
        <a-button type="link" icon="undo" @click="limpiar()">
          Limpiar
        </a-button>
        <a-button
          type="link"
          icon="search"
          @click="findDeudasByParameterForReport(1)"
        >
          Buscar
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
      this.formBusqueda.paginacion = page;
      this.formBusqueda.entidadArray = this.checkedListEntidad;
      this.formBusqueda.estadoArray = this.checkedListEstado;
      console.log("---------------------------------");
      console.log(JSON.stringify(this.formBusqueda));
      console.log("---------------------------------");
      ReportesRecaudacion.findDeudasByParameterForReport(this.formBusqueda)
        .then((response) => {
          this.data = response.data.data.content;
          this.pagination.pageSize = response.data.data.numberOfElements;
          this.pagination.total = response.data.data.totalElements;
          console.log("---------------------------------");
          console.log(JSON.stringify(this.data));
          console.log("---------------------------------");
        })
        .catch((error) => {
          console.log("---------------------------------");
          console.log("Error");
          console.log("---------------------------------");
          this.data = [];
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
    },
    onChangeEntidad(checkedListEntidad) {
      this.indeterminateEntidad =
        !!checkedListEntidad.length &&
        checkedListEntidad.length < this.entidadesList.length;
      this.checkAllEntidad =
        checkedListEntidad.length === this.entidadesList.length;
    },
    onCheckAllChangeEntidad(e) {
      if (!this.checkAllEntidad) {
        this.indeterminateEntidad = false;
        this.checkAllEntidad = true;
        let i = 0;
        let v = [];
        this.entidadesList.forEach((element) => {
          v[i] = element.value;
          i++;
        });
        this.checkedListEntidad = v;
      } else {
        this.checkedListEntidad = [];
        this.checkAllEntidad = false;
      }
    },
    onChangeEstado(checkedListEstado) {
      this.indeterminateEstado =
        !!checkedListEstado.length &&
        checkedListEstado.length < this.estadoList.length;
      this.checkAllEstado = checkedListEstado.length === this.estadoList.length;
    },
    onCheckAllChangeEstado(e) {
      if (!this.checkAllEstado) {
        this.indeterminateEstado = false;
        this.checkAllEstado = true;
        let i = 0;
        let v = [];
        this.estadoList.forEach((element) => {
          v[i] = element.value;
          i++;
        });
        this.checkedListEstado = v;
      } else {
        this.checkedListEstado = [];
        this.checkAllEstado = false;
      }
    },
  },
};
</script>
<style>
</style>