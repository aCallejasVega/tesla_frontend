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
            <table style="width: 100%; background-color: #f2f0ef;" size="small">
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
            <!--
            {{selectedRowKeys}}
            {{clienteDto.servicioDeudaDtoList}}-->
            <a-table :columns="columnsA" :data-source="lstServiciosDeudas" bordered 
            :row-selection="rowSelectionS"
            :pagination="false"
            :scroll="{x:350}" >
              <template slot="key" slot-scope="text, record">
                <table style="width: 100%; background-color: #f2f0ef"
                  :scroll="{x:400}">
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
                    <td align="right" v-if="deuda.esPostpago">{{ deuda.montoUnitario }}</td>
                    <td align="right" v-if="!deuda.esPostpago">
                      <a-input v-model="deuda.montoUnitario" align="right" 
                      type="number"
                      size="small"
                      :min="0"
                      defaultValue="0.00"
                      class="ant-iput-cambio" 
                      />
                    </td>
                    <td align="right" v-if="deuda.esPostpago">{{ deuda.subTotal }}</td>
                    <td align="right" v-if="!deuda.esPostpago">{{ montoPrepago(deuda) }}</td>
                  </tr>
                  <tr style="background: #cc99cc; border-size:1px">
                    <td></td>
                    <td></td>
                    <td align="right"><b>SubTotal</b></td>
                    <td align="right"><b>{{ sumSubTotal(record) }}</b></td>
                    
                  </tr>
                </table>
              </template>
              <template slot="footer">
                <a-row style="background: #cc99ff">
                  <a-col align="right">
                <table style="width: 30%;">
                <!--  <table style="width: 30%; background: #ffd5b1">-->
                  <tr>
                    <td align="right"><b>Total</b></td>
                    <td style="text-align: right"><b>{{sumTotal}}</b></td> 
                  </tr>
                  <tr>
                    <td align="right"><b>Efectivo</b></td>
                    <td><a-input v-model="efectivo" align="right" :disabled="!selectedServicio" 
                    type="number"
                      size="small"
                      :min="0"
                      defaultValue="0.00"
                      class="ant-iput-cambio"
                      /></td>
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
            <div v-if="clienteDto.servicioDeudaDtoList.length > 0">
            <template class="ant-card-actions">
              <a-row type="flex" justify="space-around">
                <a-col>
                  <a-popconfirm title="¿Esta seguro de Cobrar las deudas seleccionadas?"
                    ok-text="Si"
                    cancel-text="No"
                    @confirm="confirm"
                    @cancel="cancel">
                    <a-button type="primary"> Cobrar </a-button> 
                  </a-popconfirm>  
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
      selectedRowKeys: [],

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
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log("onChange");
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
        },
        onSelect: (record, selected, selectedRows) => {
          console.log("onSelect");
          console.log(record, selected, selectedRows);
          //calcular suma
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
      let vFormateado = this.efectivo > 0 ? -1 * (this.sumTotal - this.efectivo) : 0;
      return Number(vFormateado).toFixed(2)
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

      //Restrablecer valores iniciales
      this.displayCliente = false;
      this.inicializar();
    },


    /*********************************************** 
    SERVICIOS DEUDAS
    ************************************************/
    inicializar() {
      this.selectedRowKeys = [];
      this.sumTotal = Number(0).toFixed(2);
      this.comprobanteAllinOne = null;
      this.selectedServicio = false;
      this.efectivo = Number(0).toFixed(2);
      this.selectedRowsArray = [];
    },
    cargarServicioDeudas() {
      PaymentDebts.cargarServicioDeudas(this.entidadId, this.clienteDto.codigoCliente)
        .then((r) => {
          this.lstServiciosDeudas = r.data.result;
          console.log(JSON.stringify(this.lstServiciosDeudas));
        })
        .catch((error) => {
          this.$message.error(error.response.data.message);
        });
    },
    montoPrepago(deuda) {
      if(deuda.cantidad != null && deuda.montoUnitario != null ) {
        deuda.subTotal = deuda.cantidad * deuda.montoUnitario;
      }
      return deuda.subTotal; 
    },

    sumSubTotal(record) {
        record.subTotal = record.deudaClienteDtos.reduce((sum, item) => 
        sum + Number(item.subTotal), 0);
        return record.subTotal;
    },

     /*********************************************** 
    COBROS DEUDAS
    ************************************************/
    verificarMontoPrepago(lst) {
      for(var i in lst) {
        for(var j in lst[i].deudaClienteDtos) {
          console.log(lst[i].deudaClienteDtos[j].subTotal)
          if(lst[i].deudaClienteDtos[j].subTotal == null || lst[i].deudaClienteDtos[j].subTotal == '' || lst[i].deudaClienteDtos[j].subTotal == 0)
            return false;
        }
       
      }
      return true;
    },
    confirm(e) {
      this.cobrarDeudas();
    },
    cancel(e) {
      this.$message.warning('Proceda a modificar el cobro')
    },
    cobrarDeudas() {
      console.log(JSON.stringify(this.clienteDto.servicioDeudaDtoList));
      if(this.verificarMontoPrepago(this.clienteDto.servicioDeudaDtoList)) {
        PaymentDebts.cobrarDeudas(this.clienteDto, 5)
          .then((r) => {
            console.log(r);
            this.$message.success(r.data.message);
            //debe actualizar las deudas
            this.cargarServicioDeudas();
            this.inicializar();
          })
          .catch((error) => {
            console.log(error)
            this.$message.error(error.response.data.message + '\n. Código de error: ' + error.response.data.code );
          });
      } else {
        this.$message.warning('Para el caso de prepagos debe llenar el monto correspondiente, por favor verifique');
      }
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
  .ant-iput-cambio {
    text-align: right;
  }
</style>
