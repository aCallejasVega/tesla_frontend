<template>
  <div>
    <a-card style="width: 100%">
      <div
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 55px;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
          <h2>
            <b style="color: #21618c"
              > <a-icon type="arrow-left"  @click="$router.back()"/>  CENTRO DE PAGOS - {{ servicioProducto.descripcion }}</b
            >
          </h2>
        </a-col>
      </div>

      <!--a-page-header
        style="border: 1px solid rgb(224, 206, 206)"
        :title="servicioProducto.descripcion"
        @back="$router.back()"
      >
      </a-page-header-->
    </a-card>

    <a-row>
      <a-col
        :xs="24"
        :sm="24"
        :md="24"
        :lg="10"
        :xl="10"
        style="padding-right: 3px"
      >
        <a-card
          title="Busqueda de Beneficiario"
          :headStyle="{
            backgroundColor: '#288371',

            color: '#FFFF',
          }"
        >
          <a-row type="flex" justify="end">
            <a-col :xs="24" :sm="24" :md="20" :lg="20">
              <a-input-search
                v-model="paramBusqueda"
                placeholder="Ingrese parametros de busqueda."
                @search="getAbonosParaPagar()"
                enter-button=" Buscar "
                :maxLength="100"
              />
            </a-col>
          </a-row>
          <br />
          <a-row>
            <a-table
              :columns="columns"
              :data-source="beneficiarioList"
              :pagination="false"
              :loading="loadingTable"
            >
              <span slot="PAGAR" slot-scope="text, record">
                <a-button
                  type="link"
                  shape="circle"
                  icon="right-circle"
                  size="large"
                  @click="getAbonado(record)"
                />
              </span>
            </a-table>
          </a-row>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
        <a-card
          :loading="!showAbonadoTable"
          style="width: 100%; padding: 0px; margin: 0px; border: 0px"
          title="Beneficiario Seleccionado"
          :headStyle="{
            backgroundColor: '#288371',

            color: '#FFFFFF',
          }"
        >
          <!--a slot="extra">
            <a-button ghost @click="openModalDatosAdicionales">
              Datos Adicionales
            </a-button>
          </a-->
          <a-table
            :columns="columnsBeneficiario"
            :data-source="beneficiarioPagoList"
            :pagination="false"
            :showHeader="false"
            :row-selection="rowSelection"
            style="width: 100%; padding: 0px; margin: 0px; border: 0px"
          >
            <template
              slot="archivoId"
              slot-scope="text, record"
              style="padding: 0px; margin: 0px; border: 0px"
            >
              <table
                class="styled-header"
                style="
                  width: 100%;
                  background-color: #f2f0ef;
                  padding: 0px;
                  margin: 0px;
                  border: 0px;
                "
              >
                <tr>
                  <td class="td-align-right">Código:</td>
                  <td class="td-align-left">
                    {{ record.codigoCliente }}
                  </td>
                  <td class="td-align-right">Periodo:</td>
                  <td class="td-align-left">{{ record.periodo }}</td>
                </tr>
                <tr>
                  <td class="td-align-right">Abonado:</td>
                  <td class="td-align-left">
                    {{ record.nombreCliente }}
                  </td>
                  <td class="td-align-right">Nro. Doc.:</td>
                  <td class="td-align-left">
                    {{ record.nroDocumentoCliente }}
                  </td>
                </tr>

                <tr>
                  <td class="td-align-right">Extensión:</td>
                  <td class="td-align-left">
                    {{ record.tipoDocumentoId }}
                  </td>

                  <td class="td-align-right">Fec. Nac.:</td>
                  <td class="td-align-left">
                    {{ record.fechaNacimientoCliente }}
                  </td>
                </tr>
              </table>
              <br />
              <table
                style="width: 100%; padding: 0px; margin: 0px; border: 0px"
                class="styled-header"
              >
                <thead align="center">
                  <tr>
                    <th style="width: 20%">
                      CANTIDAD.
                      <hr />
                      <hr />
                    </th>
                    <th style="width: 40%; text-align: left">
                      CONCEPTO.
                      <hr />
                      <hr />
                    </th>
                    <th style="width: 20%">
                      M. UNIT.
                      <hr />
                      <hr />
                    </th>
                    <th style="width: 20%">
                      SUBTOTAL.
                      <hr />
                      <hr />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(concepto, i) in record.abonosClientesList"
                    :key="i"
                    :class="i % 2 == 0 ? 'active-row' : ''"
                  >
                    <td style="width: 20%" align="center">
                      {{ concepto.cantidad }}
                    </td>
                    <td style="width: 40%">{{ concepto.concepto }}</td>
                    <td align="right" style="width: 20%; padding-right: 5%">
                      {{ concepto.montoUnitario | numericFormat("0.00") }}
                    </td>
                    <td align="right" style="width: 20%; padding-right: 5%">
                      {{ concepto.subTotal | numericFormat("0.00") }}
                    </td>
                  </tr>
                </tbody>

                <tfoot class="styled-footer,styled-header">
                  <tr>
                    <td class="td-align-footer" colspan="2"></td>
                    <td class="td-align-footer">TOTAL</td>
                    <td
                      align="right"
                      style="padding-right: 5%"
                      v-if="showAbonadoTable"
                      class="td-align-footer"
                    >
                      <b>{{ record.totalPagar | numericFormat("0.00") }}</b>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </template>
          </a-table>

          <div>
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="24">
                <a-button
                  @click="openConfirmvVsible"
                  type="primary"
                  :disabled="showButtonRealizaPago"
                  block
                  style="
                    height: 50px;
                    background-color: #0d9178;
                    border-color: #0d9178;
                  "
                >
                  <span :style="{ fontSize: '19px' }">
                    <b>
                      <a-icon type="dollar" :style="{ fontSize: '22px' }" />
                      Realizar Pago</b
                    >
                  </span>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-modal v-model="modalDatosAdicionales" title="DATOS ADICIONALES">
      <a-row>
        <a-col :span="24">
          <div>
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
              <a-checkbox
                :checked="formDatosAdicionales.datosTitular"
                @change="checkDatosTitular"
              >
                <b>DATOS DEL TITULAR \ APODERADO</b></a-checkbox
              >
            </div>
            <br />
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="11">
                Nombre Titular:
                <a-input
                  v-model="formDatosAdicionales.nombreTitular"
                  :disabled="!formDatosAdicionales.datosTitular"
                />
              </a-col>
              <a-col :span="11">
                Nro. Documento:
                <a-input
                  v-model="formDatosAdicionales.documento"
                  :disabled="!formDatosAdicionales.datosTitular"
                />
              </a-col>
            </a-row>
            <br />
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="11">
                <a-checkbox
                  :checked="formDatosAdicionales.fotocopiaTitualar"
                  @change="
                    formDatosAdicionales.fotocopiaTitualar = !formDatosAdicionales.fotocopiaTitualar
                  "
                  :disabled="!formDatosAdicionales.datosTitular"
                >
                  Fotocopia de CI Beneficiario.</a-checkbox
                >
              </a-col>
              <a-col :span="11">
                <a-checkbox
                  :checked="formDatosAdicionales.cartaPoder"
                  @change="
                    formDatosAdicionales.cartaPoder = !formDatosAdicionales.cartaPoder
                  "
                  :disabled="!formDatosAdicionales.datosTitular"
                  >Carta Poder
                </a-checkbox>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <br />
      <a-row type="flex" justify="space-around" align="middle">
        <a-col :span="24">
          <div>
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
              <a-checkbox
                :checked="formDatosAdicionales.datosBeneficiario"
                @change="checkDatosBeneficiario"
              >
                <b>DOCUMENTOS ENTREGADOS</b></a-checkbox
              >
            </div>
            <br />
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="11">
                <a-checkbox
                  :checked="formDatosAdicionales.fotocopiaBeneficiario"
                  @change="
                    formDatosAdicionales.fotocopiaBeneficiario = !formDatosAdicionales.fotocopiaBeneficiario
                  "
                  :disabled="!formDatosAdicionales.datosBeneficiario"
                >
                  Fotocopia de CI Beneficiario.
                </a-checkbox>
              </a-col>
              <a-col :span="11">
                <a-checkbox> Otros </a-checkbox>
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="modalDatosAdicionales = false">
          Cancelar
        </a-button>
        <a-button key="Guardar" type="primary"> Adicionar </a-button>
      </template>
    </a-modal>

    <a-modal
      v-model="confirmvVsible"
      :closable="false"
      :confirmLoading="true"
      :mask="true"
      :maskClosable="false"
      width="60%"
      height="80%"
      :dialog-style="{ top: '5px' }"
      title="CONFIRMACIÓN DEL PAGO"
    >
      <a-row>
        <a-col :span="24">
          <div>
            <div :style="{ borderBottom: '1px solid #E9E9E9' }">
              <a-checkbox
                :checked="formDatosAdicionales.datosTitular"
                @change="checkDatosTitular"
              >
                <b>DATOS DEL TITULAR \ APODERADO</b></a-checkbox
              >
            </div>
            <br />
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="11">
                Nombre Titular:
                <a-input
                  v-model="formDatosAdicionales.nombreTitular"
                  :disabled="!formDatosAdicionales.datosTitular"
                />
              </a-col>
              <a-col :span="11">
                Nro. Documento:
                <a-input
                  v-model="formDatosAdicionales.documento"
                  :disabled="!formDatosAdicionales.datosTitular"
                />
              </a-col>
            </a-row>
          </div>
        </a-col>
      </a-row>
      <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <b>DETALLE DEL PAGO</b>
      </div>

      <a-table
        :columns="columnsBeneficiario"
        :data-source="selectedBeneficiarioLits"
        :pagination="false"
        :showHeader="false"
        style="width: 100%; padding: 0px; margin: 0px; border: 0px"
      >
        <template
          slot="archivoId"
          slot-scope="text, record"
          style="padding: 0px; margin: 0px; border: 0px"
        >
          <table
            class="styled-header"
            style="
              width: 100%;
              background-color: #f2f0ef;
              padding: 0px;
              margin: 0px;
              border: 0px;
            "
          >
            <tr>
              <td class="td-align-right">Código:</td>
              <td class="td-align-left">
                {{ record.codigoCliente }}
              </td>
              <td class="td-align-right">Nro. Doc.:</td>
              <td class="td-align-left">
                {{ record.nroDocumentoCliente }}
              </td>
            </tr>
            <tr>
              <td class="td-align-right">Abonado:</td>
              <td class="td-align-left">
                {{ record.nombreCliente }}
              </td>
              <td class="td-align-right">Extensión:</td>
              <td class="td-align-left">
                {{ record.tipoDocumentoId }}
              </td>
            </tr>

            <tr>
              <td class="td-align-right">Periodo:</td>
              <td class="td-align-left">{{ record.periodo }}</td>
              <td class="td-align-right">Fecha de Nac.:</td>
              <td class="td-align-left">
                {{ record.fechaNacimientoCliente }}
              </td>
            </tr>
          </table>
          <br />
          <table
            style="width: 100%; padding: 0px; margin: 0px; border: 0px"
            class="styled-header"
          >
            <thead align="center">
              <tr>
                <th style="width: 20%">
                  CANTIDAD.
                  <hr />
                  <hr />
                </th>
                <th style="width: 40%; text-align: left">
                  CONCEPTO.
                  <hr />
                  <hr />
                </th>
                <th style="width: 20%">
                  M. UNIT.
                  <hr />
                  <hr />
                </th>
                <th style="width: 20%">
                  SUBTOTAL.
                  <hr />
                  <hr />
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(concepto, i) in record.abonosClientesList"
                :key="i"
                :class="i % 2 == 0 ? 'active-row' : ''"
              >
                <td style="width: 20%" align="center">
                  {{ concepto.cantidad }}
                </td>
                <td style="width: 40%">{{ concepto.concepto }}</td>
                <td align="right" style="width: 20%; padding-right: 5%">
                  {{ concepto.montoUnitario | numericFormat("0.00") }}
                </td>
                <td align="right" style="width: 20%; padding-right: 5%">
                  {{ concepto.subTotal | numericFormat("0.00") }}
                </td>
              </tr>
            </tbody>

            <tfoot class="styled-footer">
              <tr>
                <td colspan="2"></td>
                <td><b>TOTAL</b></td>
                <td
                  align="right"
                  style="padding-right: 5%"
                  v-if="showAbonadoTable"
                >
                  <b>{{ record.totalPagar | numericFormat("0.00") }}</b>
                </td>
              </tr>
            </tfoot>
          </table>
        </template>
        <!--template slot="footer">
          <table style="width: 100%; height: 30px">
            <tfoot class="styled-footer">
              <tr>
                <td colspan="2"></td>
                <td align="right"><b>TOTAL A CANCELAR </b></td>
                <td
                  align="right"
                  style="padding-right: 5%"
                  v-if="showAbonadoTable"
                >
                  <b>{{ montoTotalPagar | numericFormat("0.00") }}</b>
                </td>
              </tr>
            </tfoot>
          </table>
        </template-->
      </a-table>

      <template slot="footer">
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="11">
            <a-button
              key="back"
              @click="confirmvVsible = false"
              block
              style="height: 40px"
            >
              Cancelar
            </a-button>
          </a-col>
          <a-col :span="11">
            <a-button
              key="Guardar"
              type="primary"
              @click="realizarPago"
              block
              style="
                height: 40px;
                background-color: #0d9178;
                border-color: #0d9178;
              "
            >
              Procesar
            </a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
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
        <iframe
          width="100%"
          height="400px"
          :src="this.linkReport"
          frameborder="0"
          v-if="viewFrame"
        >
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
import PaymentsAbonos from "../../service/Pagos/PaymentsAbonos.service";

const columns = [
  { title: "CÓDIGO ", dataIndex: "codigoCliente", key: "codigoCliente" },
  {
    title: "NRO. DOC.",
    dataIndex: "nroDocumentoCliente",
    key: "nroDocumentoCliente",
  },
  {
    title: "BENEFICIARIO",
    dataIndex: "nombreCliente",
    key: "nombreCliente",
  },
  {
    title: "PAGAR",
    key: "PAGAR",
    scopedSlots: { customRender: "PAGAR" },
  },
];
const columnsBeneficiario = [
  {
    title: "ABONO DE LOS CLIENTES",
    dataIndex: "archivoId",
    scopedSlots: { customRender: "archivoId" },
  },
];

export default {
  data() {
    return {
      servicioProducto: {},
      columns,
      columnsBeneficiario,
      servicioProductoId: null,
      paramBusqueda: "",
      beneficiarioList: [],
      beneficiarioPagoList: [],
      showAbonadoTable: false,
      loadingTable: false,
      modalDatosAdicionales: false,
      confirmvVsible: false,
      selectedBeneficiarioLit: [],
      showButtonRealizaPago: true,
      formDatosAdicionales: {
        datosTitular: false,
        nombreTitular: "",
        documento: "",
        fotocopiaTitualar: false,
        cartaPoder: false,
        datosBeneficiario: false,
        fotocopiaBeneficiario: false,
      },
      selectedBeneficiarioLits: [],
      montoTotalPagar: 0,
      linkReport: "",
      viewCargando: true,
      visibleModalReporte: false,
      beneficiarioSeleccionado: {},
      viewFrame: false,
    };
  },
  created() {
    this.servicioProductoId = this.$route.params.servicioProductoId;
    this.getDatosServicio();
  },
  computed: {
    rowSelection() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          if (selectedRows.length > 0) {
            this.showButtonRealizaPago = false;
          } else {
            this.showButtonRealizaPago = true;
          }
          this.selectedBeneficiarioLits = selectedRows;
        },
      };
    },
  },
  methods: {
    getDatosServicio() {
      PaymentsAbonos.getServicioProductos(this.servicioProductoId)
        .then((response) => {
          this.servicioProducto = response.data.data;
        })
        .catch((error) => {
          this.servicioProducto = {};
        });
    },
    getAbonosParaPagar() {
      this.beneficiarioPagoList = [];
      this.showButtonRealizaPago = true;
      this.selectedBeneficiarioLits = [];
      this.formDatosAdicionales.nombreTitular = "";
      this.formDatosAdicionales.documento = "";
      (this.formDatosAdicionales.datosTitular = false),
        (this.beneficiarioList = []);
      this.loadingTable = true;
      PaymentsAbonos.getAbonosParaPagar(
        this.servicioProductoId,
        this.paramBusqueda
      )
        .then((response) => {
          this.beneficiarioList = response.data.data;
          this.loadingTable = false;
        })
        .catch((error) => {
          this.beneficiarioList = [];
        });
    },

    getAbonado(beneficiarioSeleccionado) {
      this.beneficiarioPagoList = [];
      this.showButtonRealizaPago = true;
      this.selectedBeneficiarioLits = [];
      this.formDatosAdicionales.nombreTitular = "";
      this.formDatosAdicionales.documento = "";
      (this.formDatosAdicionales.datosTitular = false),
        (this.beneficiarioSeleccionado = beneficiarioSeleccionado);
      this.showAbonadoTable = false;
      PaymentsAbonos.getAbonado(
        beneficiarioSeleccionado.archivoId,
        beneficiarioSeleccionado.codigoCliente,
        beneficiarioSeleccionado.nroDocumentoCliente
      )
        .then((response) => {
          this.beneficiarioPagoList = response.data.data;
          this.showAbonadoTable = true;
        })
        .catch((error) => {
          this.beneficiarioPagoList = {};
        });
    },

    realizarPago() {
      let pagosList = [];
      this.confirmvVsible = false;
      this.visibleModalReporte = true;
      this.viewCargando = true;
      this.viewFrame = false;
      this.selectedBeneficiarioLits.forEach((registro) => {
        let pago = {};
        pago.archivoId = registro.archivoId;
        pago.codigoCliente = registro.codigoCliente;
        pago.nroDocumentoCliente = registro.nroDocumentoCliente;
        pago.periodo = registro.periodo;
        pago.nombreTitular = this.formDatosAdicionales.nombreTitular;
        pago.documentoTitular = this.formDatosAdicionales.documento;
        pagosList.push(pago);
      });

      PaymentsAbonos.realizarPago(pagosList)
        .then((response) => {
          this.viewFileDownload(response);
          this.visibleModalReporte = true;
          this.confirmvVsible = false;

          this.getAbonado(this.beneficiarioSeleccionado);
          this.viewCargando = false;
          this.viewFrame = true;
        })
        .catch((error) => {
          this.visibleModalReporte = false;
        });
    },
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/pdf",
      });
      this.linkReport = URL.createObjectURL(file);
      this.viewCargando = false;
    },
    openModalDatosAdicionales() {
      this.modalDatosAdicionales = true;
    },
    openConfirmvVsible() {
      this.montoTotalPagar = 0;
      console.log(JSON.stringify(this.selectedBeneficiarioLits));
      this.selectedBeneficiarioLits.forEach((item) => {
        this.montoTotalPagar = this.montoTotalPagar + item.totalPagar;
      });
      this.confirmvVsible = true;
    },
    checkDatosTitular() {
      this.formDatosAdicionales.datosTitular = !this.formDatosAdicionales
        .datosTitular;
      this.formDatosAdicionales.nombreTitular = "";
      this.formDatosAdicionales.documento = "";
      this.formDatosAdicionales.fotocopiaTitualar = false;
      this.formDatosAdicionales.cartaPoder = false;
    },
    checkDatosBeneficiario() {
      this.formDatosAdicionales.datosBeneficiario = !this.formDatosAdicionales
        .datosBeneficiario;
      this.formDatosAdicionales.fotocopiaBeneficiario = false;
    },
  },
};
</script>
<style scoped>
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
  background-color: #21618c;
  color: #ffffff;
  font-size: 1em;
  font-family: sans-serif;
  border: 1px solid #ffffff;
}
.td-align-footer {
  text-align: right;
  width: 20%;
  background-color: #21618c;
  color: #ffffff;
  font-size: 1em;
  font-family: sans-serif;
}
.td-align-left {
  text-align: left;
  width: 30%;
  color: #21618c;
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
  background-color: #21618c;
  color: #ffffff;
  text-align: left;
}
.styled-footer {
  border-collapse: collapse;
  margin: 25px 5;

  min-width: 400px;

  background-color: #21618c;
  color: #ffffff;
  text-align: left;
}
.styled-footer tbody tr {
  border-bottom: 1px solid #21618c;
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
  border-bottom: 2px solid #21618c;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #21618c;
}
.a-divider {
  padding: 0px;
}
</style>
