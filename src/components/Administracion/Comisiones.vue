<template>
  <div v-if="displayFormComision">
    <a-card title="Formulario de Comisión">

      <a-form-model
        ref="ruleFormComision"
        :model="entidadComisionObj"
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
            v-model="entidadComisionObj.tipoComisionId"
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
            v-model="entidadComisionObj.comision"
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
        <a-tooltip placement="top" title="Registra Comisión por Entidad">
          <a-button @click="onSubmitComision" type="link"> Registrar </a-button>
        </a-tooltip>
        <a-tooltip placement="top" title="Vuelve al Listado de Comisión">
          <a-button @click="cancelarFormComisionEdicion" type="link"> Cancelar </a-button>
        </a-tooltip>
      </template>
    </a-card>
  </div>
  <div v-else>
    <a-alert
      message="Solo puede modificar registros donde la Empresa no este dado de alta."
      type="info"
      show-icon
    />
    {{entidadId}}
    <a-card style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group>
          <a-button @click="nuevaComision"> NUEVO </a-button>
          <a-button @click="editarEntidadComision"> MODIFICAR </a-button>
        </a-button-group>
      </template>
    </a-card>
    <br />
    <a-table
      :columns="columnsComisiones"
      :data-source="lstEntidadesComisiones"
      rowKey="entidadComisionId"
      :pagination="pagination"
      :row-selection="rowSelectionComision"
    >
      <template slot="comision" slot-scope="text, record">
        {{ record.entidadComisionId }}
        <money v-model="record.comision" v-bind="money" disabled="true"></money>
      </template>
      <template slot="estadoComision" slot-scope="text, record">
        <div v-if="record.estado == 'ACTIVO'" align="center">
          <a-tag color="green">
            <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
            {{ record.estado }}
          </a-tag>
        </div>
        <div v-if="record.estado == 'DESACTIVO'" align="center">
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

import EnitdadesComisiones from "../../service/Administraciones/EntidadComision.service";
import Dominios from "../../service/Administraciones/Dominio.service";
import { Money } from "v-money";

export default {
  props: {
    entidadId: null,
  },
  components: { Money },
  data() {
    return {
    /**Modal Comision */
      displayComision: false,
      lstEntidadesComisiones: [],
      columnsComisiones,
      displayFormComision: false,
      selectedRowKeysComision: [],
      lstTipoComisiones: [],
      entidadComisionObj: {},
      pagination: {
        pageSize: 5,
      },
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
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
            disabled: (record.estado === 'DESACTIVO' || (record.estado === 'ACTIVO' && record.estadoEntidad === 'ACTIVO' )),
          },
        }),
      };
    },
  },
  mounted() {
    this.cargarTipoComisiones();
    this.cargarEntidadesComisiones(this.entidadId)
  },

  methods: {
     /**ENTIDADES COMISIONES***************************************** */  
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
      this.entidadComisionObj = {};
      this.displayFormComision = true;
    },
    editarEntidadComision() {
      console.log(this.selectedRowKeysComision)
      
       if (this.selectedRowKeysComision.length === 1) {
            this.cargarEntidadComision(this.selectedRowKeysComision);
            this.displayFormComision = true;
          } else {
            this.$notification.warning(
              "Debe seleccionar un solo registro para MODIFICAR"
            );
          }
    },
    
    /**Operaciones */
    cargarEntidadesComisiones(entidadId) {
      console.log("aqui " + entidadId);
      EnitdadesComisiones.getlstEntidadesComisionesByEntidadId(entidadId).then(
        (r) => {
          this.lstEntidadesComisiones = r.data.result;
        }
      );
    },
    cargarEntidadComision(entidadComisionId) {
      EnitdadesComisiones.getEntidadComision(entidadComisionId).then((r) => {
        this.entidadComisionObj = r.data.result;
      });
    },

    guardarEntidadComision() {
      console.log('wntra')
      this.$Progress.start();
      EnitdadesComisiones.postEntidadComision(this.entidadComisionObj)
        .then((r) => {
          console.log('wntra');
          console.log(r);
          this.displayFormComision = false;
          this.cargarEntidadesComisiones(this.entidadId);
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
          this.entidadComisionObj.entidadId = this.entidadId; 
          this.entidadComisionObj.fechaCreacion = null;
          this.entidadComisionObj.fechaModificacion = null;
          this.guardarEntidadComision(this.entidadComisionObj);
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