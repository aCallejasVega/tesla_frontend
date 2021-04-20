<template>
  <div v-if="displayFormComision">
    <a-card title="Formulario de Comisión">
      <a-form-model
        ref="ruleFormComision"
        :model="recaudadorComisionObj"
        :rules="rulesComision"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-form-model-item
          ref="tipoComisionId"
          label="Tipo Comision"
          prop="tipoComisionId"
        >
          <a-select
            style="width: 100%"
            v-model="recaudadorComisionObj.tipoComisionId"
            placeholder="Seleccione Tipo Comision"
          >
            <a-select-option
              v-for="(item, i) in lstTipoComisiones"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="comision" label="Comisión" prop="comision">
          <money
            v-model="recaudadorComisionObj.comision"
            v-bind="money"
            @blur="
              () => {
                $refs.comision.onFieldBlur();
              }
            "
          ></money>
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
        <a-tooltip placement="top" title="Registra Comisión por Recaudador">
          <a-button @click="onSubmitComision" type="link" style="color:white; background-color:#339966;border:0px"><a-icon type="form" /> Registrar </a-button>
        </a-tooltip>
        <a-tooltip placement="top" title="Vuelve al Listado de Comisión">
          <a-button type="primary" ghost @click="cancelarFormComisionEdicion"> Cancelar </a-button>
        </a-tooltip>
      </template>
    </a-card>
  </div>
  <div v-else>
    <a-alert
      message="Solo puede modificar registros donde la Entidad no este dado de alta."
      type="info"
      show-icon
    />
    <a-card style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group>
          <a-button type="primary" @click="nuevaComision"> NUEVO </a-button>
          <a-button type="primary" @click="editarRecaudadorComision"> MODIFICAR </a-button>
        </a-button-group>
      </template>
    </a-card>
    <br />
    <a-table
      :columns="columnsComisiones"
      :data-source="lstRecaudadoresComisiones"
      rowKey="recaudadorComisionId"
      :pagination="pagination"
      :row-selection="rowSelectionComision"
      :loading="loading"
    >
      <template slot="comision" slot-scope="text, record">
        <money v-model="record.comision" v-bind="money" disabled="true"></money>
      </template>
      <template slot="estadoComision" slot-scope="text, record">
        <div v-if="record.estado == 'ACTIVO'" align="center">
          <a-tag color="green">
            <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
            {{ record.estado }}
          </a-tag>
        </div>
        <div v-if="record.estado == 'INACTIVO'" align="center">
          <a-tag color="red">
            <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
            {{ record.estado }}
          </a-tag>
        </div>
      </template>
    </a-table>
  </div>
</template>
<script>

/**Listado de alícuotas */
const columnsComisiones = [
  {
    title: "Fecha Inicio",
    dataIndex: "fechaCreacion",
  },
  {
    title: "Tipo Comisión",
    dataIndex: "tipoComisionDescripcion",
  },
  {
    title: "Comision",
    dataIndex: "comision",
    scopedSlots: { customRender: "comision" }
  },
  {
    title: "Estado",
    dataIndex: "estado",
    scopedSlots: { customRender: "estadoComision" },
  }, 
];

import RecaudadoresComisiones from "../../service/Administraciones/RecaudadorComision.service";
import Dominios from "../../service/Administraciones/Dominio.service";
import { Money } from "v-money";

export default {
  props: {
    recaudadorId: null,
  },
  components: { Money },
  data() {
    return {
    /**Modal Comision */
      displayComision: false,
      lstRecaudadoresComisiones: [],
      columnsComisiones,
      displayFormComision: false,
      selectedRowKeysComision: [],
      lstTipoComisiones: [],
      recaudadorComisionObj: {},
      pagination: {
        pageSize: 5,
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      loading: false,
       //MONTOS
      money: {
        decimal: ".",
        thousands: ",",
        //prefix: "Bs",
        precision: 2,
        masked: false,
        maxlength: 17,
      },
      prefix: '',
      rulesComision: {
         comision: [
          {
            required: true,
            message: "Debe registrar el monto de la comisión",
            trigger: "blur",
          },
         ],
        tipoComisionId: [
          {
            required: true,
            message: "Debe seleccionar un Tipo de Comision",
            trigger: "change",
          },
        ],
      },
    }
  },
  computed: {
    rowSelectionComision() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeysComision = selectedRowKeys;
        },
        getCheckboxProps: record => ({
          props: {
            disabled: (record.estado === 'INACTIVO' || (record.estado === 'ACTIVO' && record.estadoRecaudador === 'ACTIVO' )),
          },
        }),
      };
    },
  },
  mounted() {
    this.cargarTipoComisiones();
    this.cargarRecaudadoresComisiones(this.recaudadorId)
  },

  methods: {
     /**RECAUDADORES COMISIONES***************************************** */  
    /**Dominios */
     cargarTipoComisiones() {
      Dominios.getListDominos("tipo_comision_id")
        .then((r) => {
          if (r.status === 204) {
            this.lstTipoComisiones = [];
            this.$notification.warning(
              "La parametrización de dominios no esta completa."
            );
            return;
          }
          this.lstTipoComisiones = r.data.result;
        })
        .catch((error) => {
          console.log(error);
          this.lstTipoComisiones = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    }, 
    /**Menu */
    nuevaComision() {
      this.recaudadorComisionObj = {};
      this.displayFormComision = true;
    },
    editarRecaudadorComision() {
      console.log(this.selectedRowKeysComision)
      
       if (this.selectedRowKeysComision.length === 1) {
            this.cargarRecaudadorComision(this.selectedRowKeysComision);
            this.displayFormComision = true;
          } else {
            this.$notification.warning(
              "Debe seleccionar un solo registro para MODIFICAR"
            );
          }
    },
    
    /**Operaciones */
    cargarRecaudadoresComisiones(recaudadorId) {
      this.loading = true;
      RecaudadoresComisiones.getlstRecaudadoresComisionesByRecaudadorId(recaudadorId).then(
        (r) => {
          this.lstRecaudadoresComisiones = r.data.result;
          this.loading = false;
        }
      ).catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.loading = false;
        });
    },
    cargarRecaudadorComision(recaudadorComisionId) {
      RecaudadoresComisiones.getRecaudadorComision(recaudadorComisionId).then((r) => {
        this.recaudadorComisionObj = r.data.result;
      }).catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
    },

    guardarRecaudadorComision() {
      console.log('wntra')
      this.$Progress.start();
      RecaudadoresComisiones.postRecaudadorComision(this.recaudadorComisionObj)
        .then((r) => {
          console.log('wntra');
          console.log(r);
          this.displayFormComision = false;
          this.cargarRecaudadoresComisiones(this.recaudadorId);
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.$Progress.fail();
        });
    },
    
    onSubmitComision() {
       this.$refs.ruleFormComision.validate((valid) => {
        if (valid) {
          this.recaudadorComisionObj.recaudadorId = this.recaudadorId; 
          this.recaudadorComisionObj.fechaCreacion = null;
          this.recaudadorComisionObj.fechaModificacion = null;
          this.guardarRecaudadorComision(this.recaudadorComisionObj);
        } else {
          console.log("error submit!!");
          this.$notification.warning("Debe resolver las validaciones del formulario de Comisiones.");
          return false;
        }
      });
    },

     /**Visualizacion */
    cancelarFormComisionEdicion() {
      this.displayFormComision = false;
      this.selectedRowKeysComision = [];
    }
  }
}
</script>