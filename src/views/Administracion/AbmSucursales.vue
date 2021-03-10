<template>
  <div>
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      title="Administrar Registro de Sucursales por Entidades"
      :sub-title="subTitle"
      @back="() => (displayForm = !displayForm)"
    />
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="20">
        <a-card style="width: 100%">
          <a-page-header
            style="border: 1px solid rgb(235, 237, 240)"
            title="Administrar Registro de Sucursales"
            :sub-title="subTitle"
            @back="() => (displayForm = !displayForm)"
          />
          <br />
          <!--LISTADO DE ENTIDADES-->
          <div v-if="!displayForm">
            <!-- <a-popconfirm
              title="¿Esta seguro de realizar la operación?"
              ok-text="Si"
              cancel-text="No"
              @confirm="confirmOpcion(current)"
              @cancel="cancelOpcion"
            >-->
            <a-menu v-model="current" mode="horizontal" align="right">
              <a-menu-item
                v-for="(item, i) in lstOpciones"
                :key="i"
                @click="seleccionarOpcion(i)"
              >
                {{ item.item }}
              </a-menu-item>
            </a-menu>
            <!--</a-popconfirm>
-->
            <br />
            <a-alert
              :message="message"
              :description="descriptionMessage"
              :type="typeMessage"
              show-icon
              v-if="displayAlert"
            />
            <br />
            <a-table
              :row-selection="rowSelection"
              :columns="columns"
              :data-source="lstSucursalesEntidades"
              rowKey="sucursalEntidadId"
              :pagination="pagination"
              :scroll="{ x: 1500 }"
            >
            </a-table>
          </div>
          <!--FORMULARIO ENTIDAD-->
          {{sucursalEntidadObj}}
          <a-form-model
            v-if="displayForm"
            ref="ruleForm"
            :v-model="sucursalEntidadObj"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            size="small"
            layout="vertical"
          >
            <!--:rules="rules"-->
            <a-row>
              <a-col :xs="24" :sm="24" :md="24" :lg="24">
                <a-form-model-item ref="nombre" label="Nombre" prop="nombre">
                  <a-input
                    v-model="sucursalEntidadObj.nombreSucursal"
                    @blur="
                      () => {
                        $refs.nombre.onFieldBlur();
                      }
                    "
                    :maxLength="200"
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-model-item
                  ref="direccion"
                  label="Dirección"
                  prop="direccion"
                >
                  <a-input
                    v-model="sucursalEntidadObj.direccion"
                    @blur="
                      () => {
                        $refs.direccion.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
              <a-col :xs="24" :sm="24" :md="12" :lg="12">
                <a-form-model-item
                  ref="telefono"
                  label="Teléfono"
                  prop="telefono"
                >
                  <a-input
                    v-model="sucursalEntidadObj.telefono"
                    @blur="
                      () => {
                        $refs.telefono.onFieldBlur();
                      }
                    "
                  />
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onSubmit"> Registrar </a-button>
              <a-button style="margin-left: 10px" @click="resetForm">
                Limpiar
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
const columns = [
  {
    title: "Nombre",
    dataIndex: "nombreSucursal",
    width: 100,
    fixed: "left",
  },
  {
    title: "Dirección",
    dataIndex: "direccion",
  },
  {
    title: "Teléfono",
    dataIndex: "telefono",
  },
  {
    title: "Estado",
    dataIndex: "estado",
    fixed: "right",
  },
];

import SucursalesEntidades from "../../service/Administraciones/SucursalEntidad.service";
export default {
  data() {
    return {
      entidadId: this.$route.params.entidadId,

      subTitle: "Listado",

      /*******LISTADO DE ENTIDADES********* */
      lstSucursalesEntidades: [],
      columns,

      lstOpciones: [
        { id: 0, item: "CREAR" },
        { id: 1, item: "MODIFICAR" },
        { id: 2, item: "ELIMINAR" },
        { id: 3, item: "DAR ALTA" },
        { id: 4, item: "DAR BAJA" },
      ],

      selectedRowKeys: [],
      current: null,
      pagination: {
        pageSize: 5,
      },
      disabledNombreComercial: true,

      //Alerts
      displayAlert: false,
      message: "",
      descriptionMessage: "",
      typeMessage: "",

      /*******FORMULARIO ENTIDADES********* */
      labelCol: {}, //{ span: 4 },
      wrapperCol: {}, //{ span: 14 },

      displayForm: false,

      /*Dominios*/
      lstTiposEntidades: [],
      lstActividadesEconomicas: [],
      lstMunicipios: [],

      /*Entidad*/
      sucursalEntidadObj: {},

      /*Reglas*/
      rules: {
        nombre: [
          { required: false, message: " Dato Requerido.", trigger: "blur" },
          //{ min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        direccion: [
          { required: true, message: "Obligatorio", trigger: "blur" },
        ],
        telefono: [
          { required: true, message: "Obligatorio", trigger: "blur" },
        ],        
      },
    };
  },
  computed: {
    rowSelection() {
      return {
        type: "radio",
        //selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
        },
      };
    },
  },
  created() {
    this.cargarSucursalesEntidades(this.entidadId);
  },
  methods: {
    /*****LISTADO DE ENTIDADES*** */
    cargarSucursalesEntidades(entidadId) {
      SucursalesEntidades.getLstSucursalEntidadByEntidadId(entidadId).then((r) => {
        console.log('cargar sucursales ')
        console.log(r)
        this.lstSucursalesEntidades = r.data.result;
      });
    },
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 0: //CREAR
          this.sucursalEntidadObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;
        case 1: //Modiicar
          console.log(this.selectedRowKeys )
          if(this.selectedRowKeys.length > 0) {
            this.cargarSucursalEntidad(this.selectedRowKeys);

            this.displayForm = true;
            this.subTitle = "Formulario Modificación de Registro";
          } else {
            this.$message.warning('Debe seleccionar un registro para MODIFICAR');
          }
          break;
        case 2: //ELIMINAR
          if(this.selectedRowKeys.length > 0) {
          this.actualizaSucursalEntidadTransaccion(this.selectedRowKeys, "ELIMINAR");
          } else {
            this.$message.warning('Debe seleccionar un registro para ELIMINAR')
          }
          break;
        case 3: //ALTA
          if(this.selectedRowKeys.length > 0) {
            this.actualizaSucursalEntidadTransaccion(this.selectedRowKeys, "ACTIVAR");
          } else {
            this.$message.warning('Debe seleccionar un registro para DAR DE ALTA')
          }
          break;
        case 4: //BAJAR
          if(this.selectedRowKeys.length > 0) {
            this.actualizaSucursalEntidadTransaccion(this.selectedRowKeys, "DESACTIVAR");
          } else {
            this.$message.warning('Debe seleccionar un registro para DAR DE BAJA')
          }
          break;
      }
    },

    actualizaSucursalEntidadTransaccion(entidadId, transaccion) {
      SucursalesEntidades.putSucursalEntidadTransaccion(entidadId, transaccion).then((r) => {
        this.cargarSucursalesEntidades(this.entidadId);
      });
    },

    /*****FORMULARIO ENTIDAD**** */
    cargarSucursalEntidad(sucursalEntidadId) {
      SucursalesEntidades.getSucursalEntidad(sucursalEntidadId).then((r) => {
        this.sucursalEntidadObj = r.data.result;
      });
    },
    guardarSucursalEntidad() {
      this.sucursalEntidadObj.entidadId = this.entidadId;
      SucursalesEntidades.postSucursalEntidad(this.sucursalEntidadObj)
        .then((r) => {
          console.log(r);

          this.$message.success(r.data.message);
          //this.loadMessageSuccess(r.data.message);
        })
        .catch((error) => {
          console.log(error);
          this.$message.error(
            error.response.data.message +
              "\n. Código de error: " +
              error.response.data.code
          );
          //this.loadMessageWarning(error.response.data.message);
        });
      this.displayForm = false;
      this.cargarSucursalesEntidades(this.entidadId);
    },

    loadMessageSuccess() {
      (this.displayAlert = true), (this.message = "Éxito");
      this.descriptionMessage = r.data.message;
      this.typeMessage = "success";
    },
    loadMessageWarning() {
      (this.displayAlert = true), (this.message = "Advertencia");
      this.descriptionMessage = r.data.message;
      this.typeMessage = "warning";
    },

    onSubmit() {
      console.log("****Guardar*****");
      this.guardarSucursalEntidad(this.sucursalEntidadObj);

      /*this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarSucursalEntidad(this.sucursalEntidadObj);

          this.displayForm = false;
          this.cargarEntidades();
        } else {
          console.log("error submit!!");
          return false;
        }
      });*/
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

