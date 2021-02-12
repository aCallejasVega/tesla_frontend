<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-row type="flex" justify="space-around" align="middle">
            <a-col :span="8">
              <h1>Deudas Clientes</h1>
            </a-col>
            <a-col :span="12">
              <a-input v-model="search" placeholder="Código, CI/NIT o Nombre " />
            </a-col>
            <a-col :span="4">
              <a-button type="primary" @click="buscar"> Buscar </a-button>
            </a-col>
          </a-row>
          <br />
          <!--Lista de Clientes-->
          <div v-if="!displayCliente">
            <a-table
              :row-selection="rowSelectionC"
              :columns="columns"
              :data-source="lstClientes"
              rowKey="codigoCliente"
              v-if="lstClientes.length > 0"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
          </div>

          <!-- Lista de Deudas-->
          <div v-show="displayCliente">
            <table style="width: 100%; background-color: #f2f0ef">
              <tr>
                <td>Nro. Documento</td>
                <td><a-input v-model="cliente.nroDocumento" /></td>
                <td>Código de Cliente:</td>
                <td>{{ cliente.codigoCliente }}</td>
              </tr>
              <tr>
                <td>Nombre de Cliente:</td>
                <td colspan="2"><a-input v-model="cliente.nombreCliente" /></td>
              </tr>
            </table>
            <!--TABLA DE DEUDAS-->
            <a-table
              :columns="columnsA"
              :data-source="lstServiciosDeudas"
              bordered
              :row-selection="rowSelectionS"
              :pagination="false"
            >
              <template slot="key" slot-scope="text, record">
                <table style="width: 100%; background-color: #f2f0ef">
                  <tr>
                    <td><b>Tipo Servicio:</b></td>
                    <td>{{ record.tipoServicio }}</td>
                    <td><b>Periodo:</b></td>
                    <td>{{ record.periodo }}</td>
                  </tr>
                  <tr>
                    <td><b>Servicio</b></td>
                    <td>{{ record.servicio }}</td>
                  </tr>
                </table>
                <br />
                <table style="width: 100%">
                  <tr>
                    <th>Cantidad</th>
                    <th>Concepto</th>
                    <th>Monto Unit.</th>
                    <th>Monto</th>
                  </tr>
                  <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                    <td>{{ deuda.cantidad }}</td>
                    <td>{{ deuda.concepto }}</td>
                    <td>{{ deuda.montoUnitario }}</td>
                    <td>{{ deuda.subTotal }}</td>
                  </tr>
                  <tr style="background: #ffead8">
                    <td></td>
                    <td></td>
                    <td><b>SubTotal</b></td>
                    <td>
                      <b>{{ record.subTotal }}</b>
                    </td>
                  </tr>
                </table>
              </template>
              <template slot="footer">
                <table style="width: 100%; background: #ffd5b1">
                  <tr>
                    <td><b>Total</b></td>
                    <td style="text-align: right">
                      <b>{{ sumTotal }}</b>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Efectivo</b></td>
                    <td style="text-align: right">
                      <a-input v-model="efectivo" :disabled="!selectedServicio" />
                    </td>
                  </tr>
                  <tr>
                    <td><b>Cambio</b></td>
                    <td style="text-align: right">
                      <b>{{ cambio }}</b>
                    </td>
                  </tr>
                </table>
              </template>
            </a-table>
            <!--SECTOR BOTONES-->
            <div>
              <template class="ant-card-actions">
                <a-radio-group v-model="value">
                  <a-radio :value="0"> Un comprobante por fila </a-radio>
                  <a-radio :value="1"> En un solo comprobante </a-radio>
                </a-radio-group>
                <a-button type="primary" @click="cobrar"> Cobrar </a-button>
              </template>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import PaymentDebts from "../../service/Recaudaciones/PaymentDebts.service";
//TABLA CLIENTES
const columns = [
  { title: "Código Cliente", dataIndex: "codigoCliente", key: "codigoCliente" },
  { title: "CI/NIT", dataIndex: "nroDocumento", key: "nroDocumento" },
  { title: "Nombre Cliente", dataIndex: "nombreCliente", key: "nombreCliente" },
];

//TABLA SERVICIOSDEUDAS
const columnsA = [
  {
    title: "DEUDA DE LOS CLIENTES",
    dataIndex: "key",
    scopedSlots: { customRender: "key" },
  },
];

export default {
  data() {
    return {
      //BÚSQUEDA DE CLIENTE
      //entidadId: localStorage.getItem("entidadId"),
      entidadId: null,
      search: null,
      form: null,
      lstClientes: [],
      columns,

      //DATOS DE CLIENTE
      displayCliente: false,
      cliente: {},
      formC: null,

      //TABLA SERVICIODEUDAS
      lstServiciosDeudas: [],
      columnsA,
      sumTotal: 0,
      efectivo: 0,
      selectedServicio: false,

      //SECTOR DE BOTONOES
      value: null,
    };
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
  },
  computed: {
    rowSelectionC() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.displayCliente = true;
          this.cliente = {
            codigoCliente: selectedRows[0].codigoCliente,
            nroDocumento: selectedRows[0].nroDocumento,
            nombreCliente: selectedRows[0].nombreCliente,
          };
          this.cargarServicioDeudas();
        },
      };
    },
    rowSelectionS() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log("onChange");
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
        onSelect: (record, selected, selectedRows) => {
          console.log("onSelect");
          console.log(record, selected, selectedRows);
          this.sumTotal =
            this.sumTotal + (selected ? record.subTotal : -1 * record.subTotal);
          this.selectedServicio = selected;
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log("onSelectAll");
          console.log(selected, selectedRows, changeRows);
          this.sumTotal = 0;
          this.sumTotal = selectedRows.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
          this.selectedServicio = selected;
        },
      };
    },
    cambio() {
      return this.efectivo > 0
        ? -1 * Number((this.sumTotal - this.efectivo).toFixed(2))
        : 0;
    },
  },

  methods: {
    /*********************************************** 
    BUSQUEDA DE CLIENTE
    ************************************************/
    cargarClientes(dato) {
      console.log("cargando");
      PaymentDebts.cargarClientes(this.entidadId, dato)
        .then((r) => {
          console.log(JSON.stringify(r.data.result));
          this.lstClientes = r.data.result;
        })
        .catch((error) => {});
    },
    buscar() {
      this.cargarClientes(this.search);
      this.displayCliente = false;
    },

    /*********************************************** 
    SERVICIOS DEUDAS
    ************************************************/
    cargarServicioDeudas() {
      PaymentDebts.cargarServicioDeudas(this.entidadId, this.cliente.codigoCliente)
        .then((r) => {
          console.log(JSON.stringify(r.data.result));
          this.lstServiciosDeudas = r.data.result;
        })
        .catch((error) => {});
    },

    //COBRO DE DEUDAS
    cobrar() {},
  },
};
</script>
