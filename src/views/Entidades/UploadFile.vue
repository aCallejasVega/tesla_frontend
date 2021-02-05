<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-divider orientation="left"
            >Cargue aquí su archive de deudas de clientes.</a-divider
          >
          <a-upload-dragger
            name="file"
            :multiple="true"
            method="post"
            :action="this.url"
            :headers="{ Authorization: 'Bearer ' + this.token2 }"
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
          <template slot="actions" class="ant-card-actions">
            <a-button type="link" block> Cancelar Subida </a-button>
            <a-button type="link" block @click="procesarArchivo">
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

          <a-table :columns="columns" :data-source="data" bordered>
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
                  <th>Monto Unit.</th>
                  <th>Sub-Total</th>
                </tr>
                <tr v-for="(concepto, i) in record.conceptoLisit" :key="i">
                  <td>{{ concepto.cantidad }}</td>
                  <td>{{ concepto.concepto }}</td>
                  <td>{{ concepto.montoUnitario }}</td>
                  <td>{{ concepto.subTotal }}</td>
                </tr>
              </table>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import UploadFileService from '@/service/Entidades/UploadFile.service.js';

const columns = [
  {
    title: 'DEUDA DE LOS CLIENTES',
    dataIndex: 'archivoId',
    scopedSlots: { customRender: 'archivoId' },
  },
];

const data = [
  {
    archivoId: 'John Brown',
    servicio: 'Internet',
    tipoServicio: 'ADSL 200',
    periodo: 'sep-20',
    codigoCliente: '1030',
    nit: '6018392',
    direccion: 'Av. 6 de Agosto nro. 20157',
    nroDocumento: '65784458',
    telefono: '73591373',
    nombreCliente: 'Ricardo Beltran',
  },
  {
    archivoId: 'Jim Green',
  },
];

export default {
  data() {
    return {
      archivo: {},
      paramBusqueda: '',
      data: [],
      columns,
      token: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      url: 'http://localhost:9080/api/deudaCliente/upload',
      token2: '',
    };
  },
  created() {
    this.token2 = localStorage.getItem('token');
    // this.findDeudasClientesByArchivoId();
  },
  methods: {
    handleChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        this.archivo = info.file.response.archivo;
        console.log('se pudo cargar done');
        console.log('----------------------------------');
        console.log(JSON.stringify(info.file.response.archivo));
        console.log('----------------------------------');
      } else if (status === 'error') {
        console.log('no se pudo cargar error');
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    },
    procesarArchivo() {
      UploadFileService.processFile(this.archivo.archivoId)
        .then((response) => {
          console.log('----------------------------------');
          console.log(JSON.stringify(response.data));
          console.log('----------------------------------');
          this.findDeudasClientesByArchivoId(this.archivo.archivoId, '');
        })
        .catch((error) => {});
    },
    findDeudasClientesByArchivoId(archivoId, paramBusqueda) {
      UploadFileService.findDeudasClientesByArchivoId(archivoId, paramBusqueda)
        .then((response) => {
          this.data = response.data.data;
          console.log('------------Succes----------------');
          console.log(JSON.stringify(response.data.data));
          console.log('----------------------------');
        })
        .catch((error) => {
          console.log('-------------Error ---------------');
          console.log(JSON.stringify(error));
        });
    },
    onSearch() {
      this.findDeudasClientesByArchivoId(this.archivo.archivoId, this.paramBusqueda);
    },
  },
};
</script>
<style>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>
