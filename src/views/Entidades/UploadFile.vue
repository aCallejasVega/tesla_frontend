<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #08632d"> CARGADO DE ARCHIVOS. </b>
          </h2>
        </a-col>
      </div>
      <a-row style="width: 100%" align="top">
        <a-col :span="24">
          <a-card style="width: 100%">
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
              :style="{
                fontSize: '19px',
                height: '50px',
              }"
              @click="showConfirmProcearArchivo"
              :disabled="buttonProcesar"
            >
              <span>
                <a-icon type="download" /> Procesar Cargado de Datos
              </span>
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
              <a-form-item label="Busqueda de Deudas : ">
                <a-input-search
                  placeholder="Código de Cliente, Nombre del Cliente, Nro. Documento del Cliente"
                  v-model="paramBusqueda"
                  style="width: 400px"
                  enter-button
                  @search="onSearch"
                />
              </a-form-item>
            </a-form>
          </a-row>

          <a-divider orientation="left" class="a-divider"
            >LISTA DE REGISTROS CARGADOS</a-divider
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
              <font size="2">
                <table
                  style="width: 100%; background-color: #f2f0ef"
                  class="styled-header"
                >
                  <tr>
                    <td class="td-align-right">Código de Cliente:</td>
                    <td class="td-align-left">{{ record.codigoCliente }}</td>
                    <td class="td-align-right">Nro. Documento:</td>
                    <td class="td-align-left">{{ record.nroDocumento }}</td>
                  </tr>
                  <tr>
                    <td class="td-align-right">Nombre de Cliente:</td>
                    <td class="td-align-left">{{ record.nombreCliente }}</td>
                    <td class="td-align-right">Teléfono / correo:</td>
                    <td class="td-align-left">{{ record.telefono }} / {{record.correoCliente}}</td>
                  </tr>
                  <tr>
                    <td class="td-align-right">Dirección:</td>
                    <td class="td-align-left">{{ record.direccion }}</td>
                    <td class="td-align-right">Nit:</td>
                    <td class="td-align-left">{{ record.nit }}</td>
                  </tr>
                  <tr>
                    <td class="td-align-right">Periodo:</td>
                    <td class="td-align-left">{{ record.periodo }}</td>
                    <td class="td-align-right">Tipo de Pago:</td>
                    <td class="td-align-left">
                      <div v-if="record.esPostpago">POSTPAGO</div>
                      <div v-else>PREPAGO</div>
                    </td>
                  </tr>
                   <tr>
                    <td class="td-align-right">Tipo Servicio:</td>
                    <td class="td-align-left">{{ record.tipoServicio }}</td>
                    <td class="td-align-right">Servicio:</td>
                    <td class="td-align-left">
                      {{record.servicio}}
                    </td>
                  </tr>
                </table>
              </font>
              
              <font size="2">
                <table style="width: 100%" class="styled-table">
                  <thead>
                    <tr>
                      <th style="width: 5%">CANTIDAD.</th>
                      <th style="width: 65%">CONCEPTO.</th>
                      <th style="width: 15%">MONTO UNIT.</th>
                      <th style="width: 15%">SUB-TOTAL.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(concepto, i) in record.conceptoLisit"
                      :key="i"
                      :class="i % 2 == 0 ? 'active-row' : ''"
                    >
                      <td style="width: 5%">{{ concepto.cantidad }}</td>
                      <td style="width: 65%">{{ concepto.concepto }}</td>
                      <td align="center" style="width: 15%">
                        {{ concepto.montoUnitario }}
                      </td>
                      <td align="center" style="width: 15%">
                        {{ concepto.subTotal }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="styled-footer">
                      <td colspan="2"></td>
                      <td><b>TOTAL</b></td>
                      <td align="center">
                        <b>{{ record.total }}</b>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </font>
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
          <p>
            <a-icon :style="{ color: 'red' }" type="close-circle" />
            {{ detalle }}
          </p>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import UploadFileService from "@/service/Entidades/UploadFile.service.js";

const columns = [
  {
    title: "DEUDA DE LOS CLIENTES",
    dataIndex: "archivoId",
    scopedSlots: { customRender: "archivoId" },
  },
];

const data = [];

export default {
  data() {
    return {
      fileList: [],
      info: false,
      sucess: false,
      error: false,
      visible: false,
      disableUpload: false,
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
      url: process.env.VUE_APP_EXACTA_TESLA + "api/deudaCliente/upload",
      token: "",
      buttonProcesar: true,
      buttonModal: true,
      showUpload: true,
      loadingTable: false,
    };
  },
  created() {
    this.token = localStorage.getItem("token");
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findDeudasClientesByArchivoId(
          this.archivo.archivoId,
          page,
          this.paramBusqueda
        );
      },
    };
  },
  methods: {
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
        this.data=[];

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
      UploadFileService.processFile(this.archivo.archivoId)
        .then((response) => {
          this.info = false;
          this.sucess = true;
          this.error = false;
          this.buttonModal = false;
          this.buttonProcesar = true;
          this.findDeudasClientesByArchivoId(this.archivo.archivoId, 1, "");
        })
        .catch((error) => {
         /* if (error.response.data.causa == "A") {
            console.log(JSON.stringify(error.response.data));
            this.mensaje = error.response.data.mensaje;
            this.detalle = error.response.data.detalle;
          } else {*/
            this.mensaje = error.response.data.mensaje;
            this.detalle = error.response.data.detalle;
          //}

          this.info = false;
          this.sucess = false;
          this.error = true;
          this.buttonModal = false;
        });
    },
    findDeudasClientesByArchivoId(archivoId, page, paramBusqueda) {
      this.loadingTable = true;
      UploadFileService.findDeudasClientesByArchivoId(
        archivoId,
        page,
        paramBusqueda
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
    onSearch() {
      this.data = [];
      this.loadingTable = true;
      this.findDeudasClientesByArchivoId(
        this.archivo.archivoId,
        1,
        this.paramBusqueda
      );
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
  background-color: #1890ff;
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
  background-color: #033f79;
  color: #ffffff;
  font-size: 1em;
  font-family: sans-serif;
  border: 1px solid #ffffff;
}
.td-align-left {
  text-align: left;
  width: 30%;
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
  background-color: #033f79;
  color: #ffffff;
  text-align: left;
}
.styled-footer {
  background-color: #033f79;
  color: #ffffff;
  text-align: left;
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
  border-bottom: 2px solid #033f79;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #033f79;
}
.a-divider {
  padding: 0px;
}
.card-head {
  border: 2px solid #126580;
  border-radius: 8px;
  height: 55px;
  width: 100%;
  padding: 1%;
  color: #126580;
}
</style>
