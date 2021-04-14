<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224, 206, 206)"
        :title="title"
        @back="$router.back()"
      />
      <br />
      <div v-if="!displayCliente">
        <!--Buscar Clientes-->
        <a-row type="flex" justify="end">
          <a-col :xs="24" :sm="24" :md="18" :lg="18">
            <a-input-search
              v-model="search"
              placeholder="Datos Cliente: Código, CI/NIT o Nombre "
              @keyup="buscar(false)"
              @search="buscar(true)"
              enter-button=" Buscar "
              :maxLength="15"
              size="small"
            />
          </a-col>
        </a-row>
        <br />
        <!--Lista de Clientes-->
        <a-table
          :row-selection="rowSelectionC"
          :columns="columns"
          :data-source="lstClientes"
          rowKey="codigoCliente"
          :locale="{
            emptyText: 'No existen cliente con parámetro de búsqueda',
          }"
          :scroll="{ x: 350 }"
          size="small"
          :pagination="pagination"
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
        </a-table>
      </div>

      <!-- Lista de Deudas-->
      <div v-if="displayCliente">
        <a-row type="flex" justify="space-around">
          <a-col :xs="24" :sm="24" :md="24" :lg="24" align="right">
            <a-button type="primary" @click="reload" size="small">
              Nueva Búsqueda
            </a-button>
          </a-col>
        </a-row>
        <br />
        <div class="titulo-tabla">
          <a-row>
            <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
              <b>N° Documento: </b>
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:12}" :lg="{span:12}">
              <a-input v-model="clienteDto.nroDocumento" size="small" :maxLength="13" />
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:3}" :lg="{span:3}">
              <b>Código Cliente: </b>
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:3}" :lg="{span:6}">
              {{ clienteDto.codigoCliente }}
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
              <b>Nombre Cliente: </b>
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:18}" :lg="{span:21}">
              <a-input v-model="clienteDto.nombreCliente" size="small" :maxLength="200"/>
            </a-col>
          </a-row>
        </div>
        <!--TABLA DE DEUDAS-->
        <!--
            {{selectedRowKeys}}
            {{clienteDto.servicioDeudaDtoList}}-->
        <a-table
          :columns="columnsA"
          :data-source="lstServiciosDeudas"
          bordered
          :row-selection="rowSelectionS"
          :pagination="false"
          :scroll="{ x: 350 }"
          :loading="loading"
        >
          <template slot="key" slot-scope="text, record">
            <div class="grupo-tabla">
              <a-row>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
                  <b>Tipo Servicio:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:12}" :lg="{span:12}">
                  {{ record.tipoServicio }}
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:3}" :lg="{span:3}">
                  <b>Período:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:3}" :lg="{span:6}">
                  {{ record.periodo }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
                  <b>Servicio:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:18}" :lg="{span:21}">
                  {{ record.servicio }}
                </a-col>
              </a-row>
            </div>

            <br />
            <table style="tabla">
              <tr>
                <th align="rigth" style="width: 10%">Cantidad</th>
                <th style="width: 50%">Concepto</th>
                <th class="th-amount">Monto Unit. (Bs)</th>
                <th class="th-amount">Monto (Bs)</th>
                <th style="width: 5px"></th>
              </tr>
              <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                <td align="center">{{ deuda.cantidad }}</td>
                <td>{{ deuda.concepto }}</td>
                <td align="right">
                  <money
                    v-model="deuda.montoUnitario"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    size="small"
                  ></money>
                </td>

                <!-- Mostrando Botones de edicion y resteo-->
                <td align="right" v-if="deuda.editable && record.editando">
                  <!-- OJO Sin Botones de edicion y resteo, habilitando los campos con prepago y subtotal=0>
                <td align="right" v-if="deuda.editable>  -->
                  <money
                    v-model="deuda.subTotal"
                    v-bind="money"
                    @keydown.native="
                      $event.key === '-' ? $event.preventDefault() : null
                    "
                    @keyup.native="sumSubTotal(record, deuda)"
                    class="input-amount"
                  ></money>
                </td>
                <td align="right" v-else>
                  <money
                    v-model="deuda.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    max="4"
                  ></money>
                </td>
                <td>
                  <span v-if="deuda.subTotal == 0" style="color: red">*</span>
                </td>
              </tr>
              <tr class="subgrupo-tabla">
                <td></td>
                <td>
                  <div align="right" v-if="record.editable">
                    <a-button
                      type="default"
                      @click="record.editando = true"
                      size="small"
                    >
                      Editar
                    </a-button>
                    <a-button
                      type="default"
                      @click="resetear(record)"
                      size="small"
                    >
                      Resetear
                    </a-button>
                  </div>
                </td>
                <td align="right"><div style="background-color:#ded8da"><b>Sub Total (Bs)</b></div></td>
                <td align="right">
                  <money
                    v-model="record.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                  ></money>
                </td>
              </tr>
            </table>
          </template>
          <template slot="footer">
            <div class="grupo-tabla">
              <a-row>
                <a-col span="15" align="right">
                  <b>Total (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="sumTotal"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="15" align="right">
                  <b>Efectivo (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="efectivo"
                    v-bind="money"
                    class="input-amount"
                    :disabled="!selectedRowKeys.length > 0"
                    @keydown.native="
                      $event.key === '-' ? $event.preventDefault() : null
                    "
                  ></money>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="15" align="right">
                  <b>Cambio (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="cambio"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-table>
      </div>
      <template slot="actions" class="ant-card-actions">
        <a-tooltip placement="top" title="Registra cobro de deudas">
          <a-button
            type="link"
            :disabled="!selectedRowKeys.length > 0"
            @click="confirmCobro"
          >
            Cobrar
          </a-button>
        </a-tooltip>
      </template>
      <!--Confirmación Modal de Cobro-->
      <a-modal
        v-model="displayModal"
        title="Confirmación Cobro Deudas"
        ok-text="Cobrar"
        cancel-text="Cancelar"
        @ok="cobrarDeudas"
        width="80%"
        :centered="true"
        :closable="false"
        :maskClosable="false"
      >
        <p> <a-icon type="question-circle" theme="twoTone" two-tone-color="#FAAD14" :style="{ fontSize: '2em' }"/>
        ¿Está seguro de cobrar las deudas seleccionadas? (Comprobante {{entidadObj.comprobanteEnUno ? 'En Uno' : 'Por Transacción'}})</p>
        <br/>
        <div class="titulo-tabla">
          <a-row>
            <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
              <b>N° Documento: </b>
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:6}" :lg="{span:6}">
              {{clienteDto.nroDocumento}}
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:5}">
              <b>Nombre Cliente: </b>
            </a-col>
            <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:6}" :lg="{span:10}">
              {{clienteDto.nombreCliente}}
            </a-col>
          </a-row>
        </div>
    
        <a-table
          :columns="columnsA"
          :data-source="clienteDto.servicioDeudaDtoList"
          bordered
          :pagination="false"
          :scroll="{ x: 350 }"
          size="small"
        >
          <template slot="key" slot-scope="text, record">
            <div class="grupo-tabla">
              <a-row>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
                  <b>Tipo Servicio:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:12}" :lg="{span:12}">
                  {{ record.tipoServicio }}
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:3}" :lg="{span:3}">
                  <b>Período:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:3}" :lg="{span:6}">
                  {{ record.periodo }}
                </a-col>
              </a-row>
              <a-row>
                <a-col :xs="{span:24}" :sm="{span:10}" :md="{span:6}" :lg="{span:3}">
                  <b>Servicio:</b>
                </a-col>
                <a-col :xs="{span:24}" :sm="{span:14}" :md="{span:18}" :lg="{span:21}">
                  {{ record.servicio }}
                </a-col>
              </a-row>
            </div>
            <br />
            <table style="tabla">
              <tr>
                <th align="rigth" style="width: 10%">Cantidad</th>
                <th style="width: 50%">Concepto</th>
                <th class="th-amount">Monto Unit. (Bs)</th>
                <th class="th-amount">Monto (Bs)</th>
              </tr>
              <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                <td align="center">{{ deuda.cantidad }}</td>
                <td>{{ deuda.concepto }}</td>
                <td align="right">
                  <money
                    v-model="deuda.montoUnitario"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    size="small"
                  ></money>
                </td>
                <td align="right">
                  <money
                    v-model="deuda.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    max="4"
                  ></money>
                </td>
              </tr>
              <tr class="subgrupo-tabla">
                <td><b>{{record.plantilla}}</b></td>
                <td></td>
                <td align="right"><b>Sub Total (Bs)</b></td>
                <td align="right">
                  <money
                    v-model="record.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                  ></money>
                </td>
              </tr>
            </table>
          </template>
          <template slot="footer">
            <div class="grupo-tabla">
              <a-row>
                <a-col span="15" align="right">
                  <b>Total (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="sumTotal"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-table>

      </a-modal>
    </a-card>

    <a-modal
      v-model="visibleModalReporte"
      title="Reporte Generado"
      width="900px"
      height="400px"
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
import PaymentDebts from "../../service/Recaudaciones/PaymentDebts.service";
import Entidades from "../../service/Administraciones/Entidad.service";
import { Money } from "v-money";
//TABLA CLIENTES
const columns = [
  { title: "Código Cliente", dataIndex: "codigoCliente", key: "codigoCliente" },
  { title: "CI/NIT", dataIndex: "nroDocumento", key: "nroDocumento" },
  { title: "Nombre Cliente", dataIndex: "nombreCliente", key: "nombreCliente" },
];

//TABLA SERVICIOSDEUDAS
const columnsA = [
  {
    title: "DEUDA DEL CLIENTE",
    dataIndex: "key",
    scopedSlots: { customRender: "key" },
  },
];

export default {
  components: { Money },
  data() {
    return {
      //BÚSQUEDA DE CLIENTE
      search: "",
      form: null,
      lstClientes: [],
      columns,

      //DATOS DE ENTIDAD
      entidadId: null,
      entidadObj: {},
      title: "Deudas Clientes",

      //DATOS DE CLIENTE
      displayCliente: false,
      clienteDto: {},
      formC: null,
      pagination: {
        pageSize: 10,
      },

      //TABLA SERVICIODEUDAS
      lstServiciosDeudas: [],
      columnsA,
      sumTotal: 0,
      efectivo: 0,
      selectedRowKeys: [],
      loading: false,

      //MONTOS
      money: {
        decimal: ".",
        thousands: ",",
        //prefix: 'Bs ',
        precision: 2,
        masked: false,
        maxlength: 17,
      },

      /**Visualizacion */
      displayEdition: false,
      displayModal: false,
      //REPORTE
      visibleModalReporte: false,
      link: null,
      viewCargando: false,
    };
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
    this.cargarEntidad(this.entidadId);
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
          this.efectivo = selected ? this.efectivo : 0;

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
          this.efectivo = selected ? this.efectivo : 0;

          //asignar deudas seleccionadas
          this.clienteDto.servicioDeudaDtoList = selectedRows;
          console.log(JSON.stringify(this.clienteDto));
        },
      };
    },
    cambio: {
      get: function () {
        let vFormateado =
          this.efectivo > 0 ? -1 * (this.sumTotal - this.efectivo) : 0;
        return Number(vFormateado).toFixed(2);
      },
      set: function () {
        0;
      },
    },
  },
  watch: {
    "clienteDto.servicioDeudaDtoList": {
      handler: function (val, oldVal) {
        this.sumTotal = 0;
        this.sumTotal =
          this.sumTotal +
          val.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
      },
      deep: true,
    },
  },

  methods: {
    /********ENTIDADES***********/
    cargarEntidad(entidadId) {
      Entidades.getEntidad(entidadId)
        .then((r) => {
          this.entidadObj = r.data.result;
          this.title = this.entidadObj.nombre + ": Deudas Clientes";
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },

    /*********************************************** 
    BUSQUEDA DE CLIENTE
    ************************************************/
    cargarClientes(dato, mostrarMensajeVacio) {
      PaymentDebts.cargarClientes(this.entidadId, dato)
        .then((r) => {
          if (r.status === 204) {
            this.lstClientes = [];
            if(mostrarMensajeVacio) {
              this.$notification.warning(
                "No existen cliente con parámetro de búsqueda: " + dato + "."
              );
            }
            return;
          }

          this.lstClientes = r.data.result;
        })
        .catch((error) => {
          this.lstClientes = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    buscar(mostrarMensajeVacio) {
      if (this.search.length > 0) {
        this.cargarClientes(this.search, mostrarMensajeVacio);
      } else {
        this.lstClientes = [];
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
      this.sumTotal = 0;
      this.efectivo = 0;
    },
    cargarServicioDeudas() {
      this.$Progress.start();
      PaymentDebts.cargarServicioDeudas(
        this.entidadId,
        this.clienteDto.codigoCliente
      )
        .then((r) => {
          if (r.status === 204) {
            this.$notification.warning(
              "No existe registro de deudas para el cliente seleccionado"
            );
            this.lstServiciosDeudas = [];
            this.loading = false;
            this.$Progress.finish();
            return;
          }

          this.lstServiciosDeudas = r.data.result;
          this.loading = false;
          console.log(JSON.stringify(this.lstServiciosDeudas));
          //this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.lstServiciosDeudas = [];
          this.loading = false;
          this.$Progress.fail();
        });
    },
    sumSubTotal(record, deuda) {
      //debe ser solo de campos editables
      if (deuda.subTotal < 0 && deuda.editable) {
        console.log("negat");
        deuda.subTotal = 0;
      }
      deuda.montoUnitario = deuda.subTotal;
      record.subTotal = record.deudaClienteDtos.reduce(
        (sum, item) => sum + Number(item.subTotal),
        0
      );
      return record.subTotal;
    },

    /************************************************/
    //COBROS DEUDAS
    //************************************************/
    verificarMontoPrepago(lstServiciosDeudas) {
      for (var i in lstServiciosDeudas) {
        for (var j in lstServiciosDeudas[i].deudaClienteDtos) {
          if (lstServiciosDeudas[i].deudaClienteDtos[j].editable) {
            if (
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == null ||
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == "" ||
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == 0
            )
              return false;
            else return true;
          }
        }
      }
      return true;
    },
    confirmCobro() {
      if (
        this.clienteDto.nombreCliente === null ||
        this.clienteDto.nroDocumento === null
      ) {
        this.$notification.warning(
          "Debe especificar obligatoriamente el NOMBRE CLIENTE y NÚMERO DOCUMENTO."
        );
        this.displayModal = false;
        return;
      }

      if (
        this.clienteDto.nombreCliente.trim() === "" ||
        this.clienteDto.nroDocumento.trim() === ""
      ) {
        this.$notification.warning(
          "Debe especificar obligatoriamente el NOMBRE CLIENTE y NÚMERO DOCUMENTO."
        );
        this.displayModal = false;
        return;
      }

      if (!this.verificarMontoPrepago(this.clienteDto.servicioDeudaDtoList)) {
        this.$notification.warning(
          "Para el caso de prepagos debe llenar el monto correspondiente, por favor verifique."
        );
        this.displayModal = false;
        return;
      }
      //this.cobrarDeudas();

      this.displayModal = true;
    },
    cancelCobro(e) {
      this.$notificarion.warning(
        "Ha cancelado el Cobro, puede proceder a modificar."
      );
    },
    cobrarDeudas(e) {
      this.$Progress.start();
      PaymentDebts.cobrarDeudas(this.clienteDto, 5) //Debe ser Ctte = 5
        .then((r) => {
          this.viewFileDownload(r);
          //this.$notification.success(r.data.message);

          //debe actualizar las deudas
          this.cargarServicioDeudas();
          this.inicializar();
          this.displayModal = false;
          console.log("entro al then");

          this.visibleModalReporte = true;
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log("entro a error");
          console.log(error.response.data.message);
          //Se añade por el reporte implementado
          this.cargarServicioDeudas();
          this.inicializar();
          //
          this.displayModal = false;
          /*this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );*/
          this.$Progress.fail();
        });
    },
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/pdf",
      });
      this.link = URL.createObjectURL(file);
      this.viewCargando = false;
    },
    /*******************************************
     * Otros
     *******************************************/
    reload() {
      location.reload();
    },
    resetear(record) {
      record.editando = false;
      record.deudaClienteDtos.forEach((deuda) => {
        if (deuda.editable) {
          deuda.subTotal = 0;
          deuda.montoUnitario = 0;
        }
        this.sumSubTotal(record, deuda);
      });
    },
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

.input-amount {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid rgb(237,239,247);
  border-radius: 4px;
  transition: all 0.3s;
  height: 24px;
  padding: 1px 7px;
  text-align: right;
}

.ant-input[disabled] {
  color: rgba(0, 0, 0, 0.65);
  background-color: rgb(238, 235, 238);
  text-align: right;
  height: 24px;
  padding: 1px 7px;
}

.titulo-tabla {
  width: 100%;
  background-color: rgb(45,82,98);
  color: white;
}
.grupo-tabla {
  width: 100%;
  background-color: rgb(65,135,145);
  color: white;
}
.subgrupo-tabla {
  background: rgb(150,197,203); 
  border: 1px;
}
</style>
