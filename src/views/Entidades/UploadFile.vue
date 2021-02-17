<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-divider orientation="left"
            >Cargue aquí su archivo de deudas de clientes.</a-divider
          >
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
          >
            <p class="ant-upload-drag-icon">
              <a-icon type="inbox" />
            </p>
            <p class="ant-upload-text">
              Haga clic o arrastre el archivo a esta área para cargar.
            </p>
          </a-upload-dragger>
          <a-alert
            :message="titutloMensaje"
            :description="mensajeUpload"
            :type="tipoMensaje"
            show-icon
            v-if="booleanMensjae"
          />

          <template slot="actions" class="ant-card-actions">
            <a-button
              type="link"
              block
              @click="showConfirmProcearArchivo"
              :disabled="buttonProcesar"
            icon="file-ppt"
            >
              Procesar Datos
            </a-button>
          </template>
        </a-card>
      </a-col>
    </a-row>
    <p />
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-row type="flex" justify="end">
            <a-input-search
              placeholder="Introduzca texto de búsqueda"
              v-model="paramBusqueda"
              style="width: 200px"
              enter-button
              @search="onSearch"
            />
          </a-row>

          <a-divider orientation="left">Registro introducidos.</a-divider>

          <a-table
            :columns="columns"
            :data-source="data"
            bordered
            :pagination="pagination"
          >
            <template slot="archivoId" slot-scope="text, record">
              <table style="width: 100%; background-color: #f2f0ef">
                <tr>
                  <td>Código de Cliente:</td>
                  <td>{{ record.codigoCliente }}</td>
                  <td>Nro. Documento</td>
                  <td>{{ record.nroDocumento }}</td>
                </tr>
                <tr>
                  <td>Nombre de Cliente:</td>
                  <td>{{ record.nombreCliente }}</td>
                  <td>Teléfono:</td>
                  <td>{{ record.telefono }}</td>
                </tr>
                <tr>
                  <td>Dirección:</td>
                  <td>{{ record.direccion }}</td>
                  <td>Nit:</td>
                  <td>{{ record.nit }}</td>
                </tr>
              </table>
              <a-divider orientation="left">Detalle</a-divider>
              <table style="width: 100%">
                <tr>
                  <th>Cantidad</th>
                  <th>Concepto</th>
                  <th >Monto Unit.</th>
                  <th >Sub-Total</th>
                </tr>
                <tr v-for="(concepto, i) in record.conceptoLisit" :key="i">
                  <td>{{ concepto.cantidad }}</td>
                  <td>{{ concepto.concepto }}</td>
                  <td align= "center" >{{ concepto.montoUnitario }}</td>
                  <td align= "center">{{ concepto.subTotal }}</td>
                </tr>
                <tr style=" background-color: #f2f0ef;">
                <td colspan="2"></td>
                <td ><b>TOTAL</b></td>
                <td align= "center"><b>{{ record.total }}</b></td>
                </tr>
                
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
        <a-button key="submit" type="primary" @click="handleOk" :disabled="buttonModal"> Aceptar </a-button>
      </template>

      <div class="div" v-if="sucess">
        <div class="spin">
          <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
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
          <a-icon type="close-circle" theme="twoTone" two-tone-color="#F64155" />
        </div>
        <a-alert
          message="El archivo no pudo ser procesado."
          description="Verifique el detalle de los errores y/o las causas que provocaron que el archivo no pueda ser procesado."
          type="error"
          show-icon
        />
        <div class="desc">
          <p><a-icon :style="{ color: 'red' }" type="close-circle" /> {{ mensaje }}</p>
          <p><a-icon :style="{ color: 'red' }" type="close-circle" /> {{ detalle }}</p>
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
    handleChange(info) {
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
      const { status } = info.file;

      if (status === "done") {
        this.disableUpload = false;
        this.archivo = info.file.response.archivo;
        this.mensajeUpload = info.file.response.mensaje;
        this.tipoMensaje = "success";
        this.booleanMensjae = true;
        this.titutloMensaje = "Éxito";
        this.buttonProcesar = false;
      } else if (status === "error") {
        console.log("No se pudo cargar el archivo");
        this.mensajeUpload = info.file.response.mensaje;
        this.tipoMensaje = "warning";
        this.titutloMensaje = "Error";
        this.booleanMensjae = true;
        this.buttonProcesar = true;
      }
    },

    showConfirmProcearArchivo() {
      this.$confirm({
        title: "¿Está seguro de procesar el archivo, no podrá revertir esta acción?",
        content: (h) => (
          <div>
            Al procesar los registros del archivo estos se guardarán y se eliminarán los
            registros anteriores.
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
          this.buttonProcesar=true;
          this.findDeudasClientesByArchivoId(this.archivo.archivoId, 1, "");
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
    findDeudasClientesByArchivoId(archivoId, page, paramBusqueda) {
      UploadFileService.findDeudasClientesByArchivoId(archivoId, page, paramBusqueda)
        .then((response) => {
          this.pagination.pageSize = response.data.data.totalPages + 1;
          this.pagination.total = response.data.data.totalElements;
          this.data = response.data.data.content;
        })
        .catch((error) => {
          console.log(JSON.stringify(error.response));
        });
    },
    onSearch() {
      this.findDeudasClientesByArchivoId(this.archivo.archivoId, 1, this.paramBusqueda);
    },
    handleOk(e) {     
      this.visible = false;
    },
  },
};
</script>
<style>
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
</style>
