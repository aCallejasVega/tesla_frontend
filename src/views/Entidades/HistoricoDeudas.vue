<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        style="border: 5px solid rgb(235, 237, 240)"
        title="LISTA DE ARCHIVOS HISTÓRICOS ENVIADOS."
      />
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
              <a-radio-button value="null" @click="findArchivos(1)">
                Todos
              </a-radio-button>
              <a-radio-button value="ACTIVO" @click="findArchivos(1)">
                Activo
              </a-radio-button>
              <a-radio-button value="DESACTIVO" @click="findArchivos(1)">
                Desactivado
              </a-radio-button>
              <a-radio-button value="FALLIDO" @click="findArchivos(1)">
                Fallidos
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </a-row>

      <template slot="actions" class="ant-card-actions">
        <a-button type="link" icon="undo" @click="limpiar()">
          Limpiar
        </a-button>
        <a-button type="link" icon="search" @click="findArchivos(1)">
          Buscar
        </a-button>
      </template>
    </a-card>

    <a-card style="width: 100%">
      <a-divider orientation="left">Datos de los Archivos</a-divider>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        align="center"
      >
        <template slot="nombre" slot-scope="text, record">
          <a
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
              <a @click="showModal(record.archivoId)">DESACTIVADO</a>
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
              <a-select-option value="0"> TODS LAS RECAUDADORAS </a-select-option>
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
        <a-button key="back" @click="visibleModalReporte=false"> Cerrar </a-button>
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
      formBusqueda: {
        fechaInicio: null,
        fechaFin: null,
        estado: "ACTIVO",
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
        estado: null,
        recaudadorId: null,
        formato: null,
      },
      urlReporte: null,
      visibleModalReporte: false,
      url: null,
      recaudadoresList: [],
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
         
        })
        .catch((error) => {
          console.log("error");
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
    getTipoReporte() {
      HistoricoDeudas.findDominioByDominio()
        .then((response) => {
          this.tipoReporteList = response.data.data;
          console.log(JSON.stringify(this.tipoReporteList));
        })
        .catch((error) => {
          this.tipoReporteList = [];
        });
    },
    getEstadoHistoricos() {
      HistoricoDeudas.getEstadoHistoricos()
        .then((response) => {
          this.estadoList = response.data.data;
          console.log(JSON.stringify(this.estadoList));
        })
        .catch((error) => {
          this.estadoList = [];
        });
    },

    generarReporte() {
      this.visibleModalForm = false;
      this.visibleModalReporte = true;
      this.formBusqueda.archivoId = this.archivoId;

      this.urlReporte = `http://localhost:9080/api/ReportEntidad/findDeudasByArchivoIdAndEstado/${this.formBusqueda.archivoId}/${this.formBusqueda.recaudadorId}/${this.formBusqueda.formato}/${this.formBusqueda.estado}`;
      console.log("-------------------------------------------");
      console.log(JSON.stringify(this.urlReporte));
      console.log("-------------------------------------------");
    },
    getRecaudadores() {
      HistoricoDeudas.getRecaudadoresByEntidad()
        .then((response) => {
          this.recaudadoresList = response.data.data;
          console.log(JSON.stringify(this.recaudadoresList));
        })
        .catch((error) => {
          this.recaudadoresList = [];
        });
    },
  },
};
</script>
<style></style>
