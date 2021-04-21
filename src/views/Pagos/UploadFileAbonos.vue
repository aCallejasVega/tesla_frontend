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

      <a-row style="width: 100%" align="top">
        <a-col :span="24">
          <a-card style="width: 100%">
            <a-row type="flex" justify="center" align="top">
              <a-col :xs="0" :sm="0" :md="6" :lg="6" :xl="6"></a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <a-form-item
                  label="Seleccione un Servicio :"
                  :label-col="{
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 24 },
                    lg: { span: 10 },
                    xl: { span: 10 },
                  }"
                  :wrapper-col="{
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 24 },
                    lg: { span: 14 },
                    xl: { span: 14 },
                  }"
                  class="a-item-form"
                >
                  <a-select
                    style="width: 100%"
                    v-model="servicioProductosId"
                    @change="changeServicioProductos"
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
              <a-col :xs="0" :sm="0" :md="6" :lg="6" :xl="6"> </a-col>
            </a-row>
            <a-upload-dragger
              list-type="picture"
              name="file"
              accept=".csv"
              :multiple="false"
              :file-list="fileList"
              :disabled="this.disableUpload"
              method="post"
              :action="this.url"
              :headers="{ Authorization: 'Bearer ' + this.token }"
              @change="handleChange"
              withCredentials
              :showUploadList="this.showUpload"
              :before-upload="handleClick"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox" />
              </p>
              <p class="ant-upload-text">
                Haga clic o arrastre el archivo a esta área.
              </p>
            </a-upload-dragger>
            <a-alert
              :message="titutloMensaje"
              :description="mensajeUpload"
              :type="tipoMensaje"
              show-icon
              v-if="booleanMensjae"
            />
            <br />
            <a-button
              type="primary"
              block
              @click="showConfirmProcearArchivo"
              :style="{
                fontSize: '19px',
                height: '50px',
              }"
              :disabled="buttonProcesar"
            >
              <span> <a-icon type="download" /> Procesar Datos </span>
            </a-button>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <p />
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="24">
        <a-card style="width: 100%">
          <a-row type="flex" justify="end">
            <a-form layout="inline">
              <a-form-item label="Busqueda de Beneficiario : ">
                <a-input-search
                  placeholder="Código, Beneficiario, Periodo......"
                  v-model="paramBusqueda"
                  style="width: 300px"
                  enter-button
                  @search="onSearch"
                />
              </a-form-item>
            </a-form>
          </a-row>

          <a-divider orientation="left" 
            >BENEFICIARIO REGISTRADOS.</a-divider
          >

          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="pagination"
            :showHeader="false"
            :loading="loadingTable"
          >
            <template slot="archivoId" slot-scope="text, record">
              <table
                style="width: 100%; background-color: #f2f0ef"
                class="styled-header"
              >
                <tr>
                  <td class="td-align-right">Código Beneficiario:</td>
                  <td class="td-align-left">{{ record.codigoCliente }}</td>
                  <td class="td-align-right">Periodo</td>
                  <td class="td-align-left">{{ record.periodo }}</td>
                </tr>
                <tr>
                  <td class="td-align-right">Nombre del Beneficiario:</td>
                  <td class="td-align-left">{{ record.nombreCliente }}</td>
                  <td class="td-align-right">Nro. Documento:</td>
                  <td class="td-align-left">
                    {{ record.nroDocumentoCliente }}
                  </td>
                </tr>

                <tr>
                  <td class="td-align-right">Extensión:</td>
                  <td class="td-align-left">{{ record.tipoDocumentoId }}</td>
                  <td class="td-align-right">Fecha de Nacimiento:</td>
                  <td class="td-align-left">
                    {{ record.fechaNacimientoCliente }}
                  </td>
                </tr>
              </table>

              <table style="width: 100%" class="styled-header">
                <thead align="center">
                  <tr>
                    <th style="width: 15%"><b>CANTIDAD.</b></th>
                    <th style="width: 55%; text-align: left">
                      <b>CONCEPTO.</b>
                    </th>
                    <th style="width: 15%"><b>MONTO UNIT.</b></th>
                    <th style="width: 15%"><b>SUB-TOTAL.</b></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(concepto, i) in record.abonosClientesList"
                    :key="i"
                    :class="i % 2 == 0 ? 'active-row' : ''"
                  >
                    <td style="width: 15%" align="center">
                      {{ concepto.cantidad }}
                    </td>
                    <td style="width: 55%">{{ concepto.concepto }}</td>
                    <td align="right" style="width: 15%; padding-right: 5%">
                      {{ concepto.montoUnitario | numericFormat("0.00") }}
                    </td>
                    <td align="right" style="width: 15%; padding-right: 5%">
                      {{ concepto.subTotal | numericFormat("0.00") }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="styled-footer">
                  <tr>
                    <td colspan="2"></td>
                    <td><b>TOTAL</b></td>
                    <td align="right" style="padding-right: 4.5%">
                      <b>{{ record.totalPagar | numericFormat("0.00") }}</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <a-modal
      v-model="visible"
      :closable="false"
      :confirmLoading="true"
      :mask="true"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          @click="handleOk"
          :disabled="buttonModal"
        >
          Aceptar
        </a-button>
      </template>

      <div class="div" v-if="sucess">
        <div class="spin">
          <a-icon
            type="check-circle"
            theme="twoTone"
            two-tone-color="#52c41a"
          />
        </div>
        <a-alert
          message="Su archivo fue procesado con éxito."
          description="Todos los registros del archivo fueron procesados y almacenados correctamente."
          type="success"
          show-icon
        />
      </div>

      <div v-if="info">
        <div class="spin">
          <a-spin size="large" tip="Procesando..." />
        </div>

        <a-alert
          message="Procesando información del archivo."
          description="Esta operación puede tardar varios minutos dependiendo de la cantidad de registros en el archivo, por favor no salga ni actualice esta aplicación."
          type="info"
          show-icon
        />
      </div>

      <div v-if="error">
        <div class="spin">
          <a-icon
            type="close-circle"
            theme="twoTone"
            two-tone-color="#F64155"
          />
        </div>
        <a-alert
          message="El archivo no pudo ser procesado."
          description="Verifique el detalle de los errores y/o las causas que provocaron que el archivo no pueda ser procesado."
          type="error"
          show-icon
        />
        <div class="desc">
          <p>
            <a-icon :style="{ color: 'red' }" type="close-circle" />
            {{ mensaje }}
          </p>
          <!--p>
            <a-icon :style="{ color: 'red' }" type="close-circle" />
            {{ detalle }}
          </p-->
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import UploadFileAbonos from "@/service/Pagos/UploadFileAbonos.service.js";

const columns = [
  {
    title: "ABONO DE LOS CLIENTES",
    dataIndex: "archivoId",
    scopedSlots: { customRender: "archivoId" },
  },
];

const data = [];

export default {
  data() {
    return {
      servicioProductosList: [],
      servicioProductosId: null,
      fileList: [],
      info: false,
      sucess: false,
      error: false,
      visible: false,
      disableUpload: true,

      mensaje: "",
      detalle: "",
      archivo: {},
      paramBusqueda: "",
      data: [],
      columns,
      defaultPageSize: 0,
      total: 0,
      pagination: {},
      mensajeUpload: "",
      tipoMensaje: "",
      booleanMensjae: false,
      titutloMensaje: "",
      url: process.env.VUE_APP_EXACTA_TESLA + "api/pagoCliente/",
      token: "",
      buttonProcesar: true,
      buttonModal: true,
      showUpload: true,
      loadingTable: false,
    };
  },
  created() {
    this.findByEntidadIdForSelect();
    this.token = localStorage.getItem("token");
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findAbonosClientes(
          this.archivo.archivoId,
          page,
          this.paramBusqueda
        );
      },
    };
  },
  methods: {
    findByEntidadIdForSelect() {
      UploadFileAbonos.findByEntidadIdForSelect()
        .then((response) => {
          this.servicioProductosList = response.data.data;
        })
        .catch((error) => {
          this.servicioProductosList = [];
        });
    },
    changeServicioProductos() {
      this.url =
        process.env.VUE_APP_EXACTA_TESLA +
        "api/entidadPago/upload/" +
        this.servicioProductosId;
      this.disableUpload = false;
    },

    handleClick() {
      this.showUpload = true;
      this.booleanMensjae = false;
    },
    handleChange(info) {
      const { status } = info.file;
      let fileList = [...info.fileList];
      // Nro. limites de archivos
      fileList = fileList.slice(-1);
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;

      if (status === "done") {
        this.disableUpload = false;
        this.archivo = info.file.response.archivo;
        this.mensajeUpload = info.file.response.mensaje;
        this.tipoMensaje = "success";
        this.booleanMensjae = true;
        this.titutloMensaje = "Éxito";
        this.buttonProcesar = false;
        this.showUpload = false;
      } else if (status === "error") {
        this.mensajeUpload = info.file.response.mensaje;
        this.tipoMensaje = "warning";
        this.titutloMensaje = "Error";
        this.booleanMensjae = true;
        this.buttonProcesar = true;
        this.showUpload = true;
      }
    },

    showConfirmProcearArchivo() {
      this.$confirm({
        title:
          "¿Está seguro de procesar el archivo, no podrá revertir esta acción?",
        content: (h) => (
          <div>
            Al procesar los registros del archivo estos se guardarán y se
            eliminarán los registros anteriores.
          </div>
        ),
        okText: "Aceptar",
        okType: "primary",
        cancelText: "Cancelar",
        onOk: () => {
          this.procesarArchivo();
        },
      });
    },

    procesarArchivo() {
      this.visible = true;
      this.info = true;
      this.sucess = false;
      this.error = false;
      this.buttonModal = true;
      UploadFileAbonos.processFile(this.archivo.archivoId)
        .then((response) => {
          this.info = false;
          this.sucess = true;
          this.error = false;
          this.buttonModal = false;
          this.buttonProcesar = true;
          this.findAbonosClientes(this.archivo.archivoId, 1, "");
        })
        .catch((error) => {
          if (error.response.data.causa == "A") {
            this.mensaje = error.response.data.mensaje;
            this.detalle = error.response.data.detalle;
          } else {
            this.mensaje = error.response.data.mensaje;
          }

          this.info = false;
          this.sucess = false;
          this.error = true;
          this.buttonModal = false;
        });
    },
    findAbonosClientes(archivoId, page, paramBusqueda) {
      this.loadingTable = true;
      UploadFileAbonos.findAbonosClientes(archivoId, page, paramBusqueda)
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
    onSearch() {
      this.data = [];
      this.loadingTable = true;
      this.findAbonosClientes(this.archivo.archivoId, 1, this.paramBusqueda);
    },
    handleOk(e) {
      this.visible = false;
    },
  },
};
</script>
<style>
@import "../../../public/plantilla.css";
th.column-money,
td.column-money {
  text-align: right !important;
}
.spin {
  text-align: center;
  margin: 20px 0;
  font-size: 80px;
}
.notification-type-info {
  width: 200px;
  background-color: #196c80;
}
.desc p {
  margin-bottom: 1em;
}

.styled-header {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-header td {
  padding: 12px 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  font-weight: bold;
}

.td-align-right {
  text-align: right;
  width: 20%;
  background-color: #196c80;
  color: #ffffff;
  font-size: 1em;
  font-family: sans-serif;
  border: 1px solid #ffffff;
}
.td-align-left {
  text-align: left;
  width: 30%;
  color: #196c80;
}
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 400px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}
.styled-table thead tr {
  background-color: #196c80;
  color: #ffffff;
  text-align: left;
}
.styled-footer {
  border-collapse: collapse;
  margin: 25px 5;

  min-width: 400px;

  background-color: #196c80;
  color: #ffffff;
  text-align: left;
}
.styled-footer tbody tr {
  border-bottom: 1px solid #196c80;
}
.styled-table th,
.styled-table td {
  padding: 12px 15px;
  padding-top: 5px;
  padding-bottom: 5px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #196c80;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #196c80;
}
.a-divider {
  padding: 0px;
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
