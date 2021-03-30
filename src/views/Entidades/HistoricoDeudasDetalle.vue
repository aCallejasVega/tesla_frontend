<template>
  <div>
    <a-card style="width: 100%">
      <a-page-header
        class="a-page-header"
        title="DETALLE DE ARCHIVO SELECCIONADO."
        @back="back()"
      />

      <br />
      <a-row type="flex" justify="end">
        <a-input-search
          placeholder="Introduzca texto de búsqueda"
          v-model="paramBusqueda"
          style="width: 200px"
          enter-button
          @search="findDeudasArchivoHistorico(1)"
        />
      </a-row>
      <br />
      <a-table
        :columns="columns"
        :data-source="data"
        bordered
        :pagination="pagination"
        :showHeader="false"
      >
        <template slot="archivoId" slot-scope="text, record">
          <table style="width: 100%; background-color: #f2f0ef" class="styled-header">
            <tr>
              <td class="td-align-right">Código de Cliente:</td>
              <td class="td-align-left">{{ record.codigoCliente }}</td>
              <td class="td-align-right">Nro. Documento:</td>
              <td class="td-align-left">{{ record.nroDocumento }}</td>
            </tr>
            <tr>
              <td class="td-align-right">Nombre de Cliente:</td>
              <td class="td-align-left">{{ record.nombreCliente }}</td>
              <td class="td-align-right">Teléfono:</td>
              <td class="td-align-left">{{ record.telefono }}</td>
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
          </table>
          <a-divider orientation="left" style="color: #89136b">Detalle</a-divider>
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
                <td align="center" style="width: 15%">{{ concepto.subTotal }}</td>
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
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import HistoricoDeudas from "../../service/Entidades/HistoricoDeudas.service";

const columns = [
  {
    title: "DEUDA DE LOS CLIENTES",
    dataIndex: "archivoId",
    scopedSlots: { customRender: "archivoId" },
  },
];
export default {
  data() {
    return {
      paramBusqueda: "",
      data: [],
      columns,
      pagination: {},
      total: 0,
      archivoId: null,
      page: 1,
    };
  },
  created() {
    this.archivoId = this.$route.params.archivoId;
    this.findDeudasArchivoHistorico(1);
    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findDeudasArchivoHistorico(page);
      },
    };
  },
  methods: {
    findDeudasArchivoHistorico(page) {
      HistoricoDeudas.findDeudasArchivoHistorico(this.archivoId, page, this.paramBusqueda)
        .then((response) => {
          console.log(JSON.stringify(response.data.data.content));
          this.pagination.pageSize = response.data.data.numberOfElements;
          this.pagination.total = response.data.data.totalElements;
          this.data = response.data.data.content;
        })
        .catch((error) => {});
    },
    back() {
      this.$router.back();
    },
  },
};
</script>
<style>

@import "../../../public/plantilla.css";

</style>
