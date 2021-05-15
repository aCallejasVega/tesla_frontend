<template>
  <div style="background-color: #fff !important">
    <a-alert message="Dosificaciones a punto de vencer" type="info" show-icon />
    <a-table
      :columns="columnsDosificacion"
      :data-source="lstDosificaciones"
      rowKey="dosificacionId"
      :loadingDosif="loadingDosif"
      size="small"
      :pagination="pagination"
    >
      <template slot="fechaLimite" slot-scope="text, record">
        {{ $dates.formaDateWithoutTime(record.fechaLimiteEmision) }}
      </template>
    </a-table>
  </div>
</template>
<script>
const columnsDosificacion = [
  {
    title: "Sucursal",
    dataIndex: "nombreSucursal",
  },
  {
    title: "Código",
    dataIndex: "codigoActividadEconomica",
  },
  {
    title: "Actividad Económica",
    dataIndex: "actividadEconomica",
  },
  {
    title: "Fecha Límite Emisión",
    dataIndex: "fechaLimiteEmision",
    scopedSlots: { customRender: "fechaLimite" },
  },
];

import Dosificaciones from "../../service/Facturacion/Dosages.service";

export default {
  name: "Notif",
  data() {
    return {
      countNotifications: 0,
      pagination: {
        pageSize: 5,
      },

      /**Dosificaciones */
      columnsDosificacion,
      lstDosificaciones: [],
      loadingDosif: false,
    };
  },
  created() {
    this.cargarDosificacionesAlertas();
  },
  methods: {
    cargarDosificacionesAlertas() {
      this.loadingDosif = true;
      Dosificaciones.getDosificacionesLstAlertas()
        .then((r) => {
          if (r.status === 204) {
            this.lstDosificaciones = [];
            this.loadingDosif = false;
            return;
          }
          this.lstDosificaciones = r.data.result;
          this.countNotifications = this.lstDosificaciones.length;
          this.loadingDosif = false;

          this.$emit('updatingNotif', this.countNotifications);

        })
        .catch((error) => {
          this.lstDosificaciones = [];
          this.loadingDosif = false;
        });
    },
  },
};
</script>