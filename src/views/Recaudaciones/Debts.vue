<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">

          <a-row type="flex" justify="space-around">
            <a-col :xs="24" :sm="24" :md="8" :lg="8">
              <h1>Deudas Clientes {{ entidad }}</h1>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12" :lg="12">
              <a-input
                v-model="search"
                placeholder="Código, CI/NIT o Nombre "
                @keyup="buscar"
              />
            </a-col>
            <a-col :xs="24" :sm="4" :md="4" :lg="4">
              <a-button type="primary" @click="buscar"> Buscar </a-button>
            </a-col>
          </a-row>
          <br/>
          <!--Lista de Clientes-->
          <div v-if="!displayCliente">
            <a-table
              :row-selection="rowSelectionC"
              :columns="columns"
              :data-source="lstClientes"
              rowKey="codigoCliente"
              :locale="{emptyText: 'No existen cliente con parámetro de búsqueda'}"
              :scroll="{x:350}"
              size="small"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
          </div>
       
          <!-- Lista de Deudas-->
          <div v-if="displayCliente">
            <table style="width: 100%; background-color: #f2f0ef" size="small">
              <tr>
                <td><b>Nro. Documento</b></td>
                <td><a-input v-model="clienteDto.nroDocumento" size="small"/></td>
                <td><b>Código de Cliente</b></td>
                <td>{{ clienteDto.codigoCliente }}</td>
              </tr>
              <tr>
                <td><b>Nombre de Cliente</b></td>
                <td colspan="2"><a-input v-model="clienteDto.nombreCliente" size="small"/></td>
              </tr>
            </table>
            <!--TABLA DE DEUDAS-->
            {{comprobanteAllinOne}}
            <a-table :columns="columnsA" :data-source="lstServiciosDeudas" bordered 
            :row-selection="rowSelectionS"
            :pagination="false"
            :scroll="{x:350}" >
              <template slot="key" slot-scope="text, record">
                <table style="width: 100%; background-color: #f2f0ef"
                  >
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
                <br/>
                <table style="width: 100%">
                  <tr>
                    <th align="center">Cantidad</th>
                    <th>Concepto</th>
                    <th class="th-amount">Monto Unit</th>
                    <th class="th-amount">Monto</th>
                  </tr>
                  <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                    <td align="center">{{ deuda.cantidad }}</td>
                    <td>{{ deuda.concepto }}</td>
                    <td align="right">{{ deuda.montoUnitario }}</td>
                    <td align="right">{{ deuda.subTotal }}</td>
                  </tr>
                  <tr style="background: #ffead8">
                    <td></td>
                    <td></td>
                    <td align="right"><b>SubTotal</b></td>
                    <td align="right"><b>{{record.subTotal}}</b></td> 
                  </tr>
                </table>
              </template>
              <template slot="footer">
                <a-row style="background: #ffd5b1">
                  <a-col align="right">
                <table style="width: 30%;">
                <!--  <table style="width: 30%; background: #ffd5b1">-->
                  <tr>
                    <td align="right"><b>Total</b></td>
                    <td style="text-align: right"><b>{{sumTotal}}</b></td> 
                  </tr>
                  <tr>
                    <td align="right"><b>Efectivo</b></td>
                    <td><a-input v-model="efectivo" align="right" :disabled="!selectedServicio" size="small" type="number"/></td>
                  </tr>
                  <tr>
                    <td align="right"><b>Cambio</b></td>
                    <td align="right"><b>{{cambio}}</b></td>
                  </tr>
                </table>
                  </a-col>
                </a-row>
              </template>
            </a-table>
            
            <!--SECTOR BOTONES-->
            <br/>
            <div>
            <template class="ant-card-actions">
              <a-row type="flex" justify="space-around">
                <a-col>
                  <a-radio-group v-model="comprobanteAllinOne">
                    <a-radio :value="false">
                      Un comprobante por tiqueo
                    </a-radio>
                    <a-radio :value="true">
                      En un solo comprobante
                    </a-radio>
                  </a-radio-group>
                </a-col>
                <a-col>
                  <a-button type="primary" @click="cobrarDeudas"> Cobrar </a-button> 
                </a-col>
              </a-row>
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
      entidad: null,
      search: null,
      form: null,
      lstClientes: [],
      columns,

      //DATOS DE CLIENTE
      displayCliente: false,
      clienteDto: {},
      formC: null,

      //TABLA SERVICIODEUDAS
      lstServiciosDeudas: [],
      columnsA,
      sumTotal: 0,
      efectivo: 0,
      selectedServicio: false,

      //SECCION COBRO
      comprobanteAllinOne: null,
    };
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
    this.entidad= this.$route.params.entidad;
  },
  computed: {
    rowSelectionC() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows,
          );
          this.displayCliente = true;
          this.clienteDto = {
            codigoCliente: selectedRows[0].codigoCliente,
            nroDocumento: selectedRows[0].nroDocumento,
            nombreCliente: selectedRows[0].nombreCliente,
            servicioDeudaDtoList: [],
          };
          console.log(JSON.stringify(this.clienteDto));
          this.cargarServicioDeudas();
        },
      };
    },
    rowSelectionS() {
      return {
        /*onChange: (selectedRowKeys, selectedRows) => {
          console.log("onChange");
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },*/
        onSelect: (record, selected, selectedRows) => {
          console.log("onSelect");
          console.log(record, selected, selectedRows);
          //calcular suma
          this.sumTotal = this.sumTotal + (selected ? record.subTotal : -1 * record.subTotal);
          //control de cambio
          this.selectedServicio = selected;
          //asignar deudas seleccionadas
          this.clienteDto.servicioDeudaDtoList = selectedRows;
          console.log(JSON.stringify(this.clienteDto)); 
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          console.log("onSelectAll");
          console.log(selected, selectedRows, changeRows);
          //calcular total
          this.sumTotal = 0;
          this.sumTotal = selectedRows.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
          //control de cambio
          this.selectedServicio = selected;
          //asignar deudas seleccionadas
          this.clienteDto.servicioDeudaDtoList = selectedRows;
          console.log(JSON.stringify(this.clienteDto));
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
      
      PaymentDebts.cargarClientes(this.entidadId, dato)
        .then((r) => {
          console.log(r)
          console.log(JSON.stringify(r.data.result));
          this.lstClientes = r.data.result;
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    buscar() {
      if(this.search.length > 0) {
        this.cargarClientes(this.search)
      }
      else {
        this.lstClientes = []
      }
      this.displayCliente = false
      this.sumTotal = 0
      comprobanteAllinOne: null
    },


    /*********************************************** 
    SERVICIOS DEUDAS
    ************************************************/
    cargarServicioDeudas() {
      PaymentDebts.cargarServicioDeudas(this.entidadId, this.clienteDto.codigoCliente)
        .then((r) => {
          this.lstServiciosDeudas = r.data.result;
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },

     /*********************************************** 
    COBROS DEUDAS
    ************************************************/
    cobrarDeudas() {
      PaymentDebts.cobrarDeudas(this.clienteDto, this.comprobanteAllinOne, 5)
        .then((r) => {
          console.log(r);
          this.$message.success(r.data.message);
          //debe actualizar las deudas
          this.cargarServicioDeudas();


        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error.response.data.message);
        });
    }
  },
};
</script>

<style scoped>
  .th-amount {
    text-align: right;
  }
  .ant-table-body {
    overflow-x: auto !important;
  }
</style>
