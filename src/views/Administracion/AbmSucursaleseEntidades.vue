

<template>
  <div>
    <a-card v-if="!displayForm" style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        :title="title"
        @back="$router.back()"
      />
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group >
          <a-button v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)">
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE SUCURSALES-->
      <a-row type="flex" justify="end">
         <a-col :span="12">
          <b>{{filter}}</b>
         </a-col>
        <a-col :span="12" >
          <a-input-search
            v-model="search"
            placeholder="Buscar por nombre..."
            @search="filterTable"
            enter-button=" Buscar "
            :maxLength="50"
            size="small"
          />
        </a-col>
      </a-row>
      <br/>
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstFilter"
        rowKey="sucursalEntidadId"
        :pagination="pagination"
        :scroll="{ x: 1500 }"
      >      
        <template slot="estado" slot-scope="text, record" >
          <div v-if="record.estado == 'ACTIVO'" align="center">
            <a-tag color="green">
              <a-icon type="caret-up" :style="{ fontSize: '20px' }" />
              {{record.estado}}
            </a-tag>
          </div>
          <div v-if="record.estado == 'DESACTIVO'" align="center">
            <a-tag color="red">
              <a-icon type="caret-down" :style="{ fontSize: '20px' }" />
               {{record.estado}}
            </a-tag>
          </div>
          <div v-if="record.estado == 'CREADO'" align="center">
            <a-tag color="blue">
               {{record.estado}}
            </a-tag>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-card v-if="displayForm">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        :title="title"
        :sub-title="subTitle"
        @back="() => volverListado()"
      />
      <br/>
      <!--LISTADO DE SUCURSALES-->
      <a-form-model
        ref="ruleForm"
        :model="sucursalEntidadObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-form-model-item ref="nombreSucursal" label="Nombre Sucursal" prop="nombreSucursal">
          <a-input
            v-model="sucursalEntidadObj.nombreSucursal"
            @blur="
              () => {
                $refs.nombreSucursal.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="sucursalEntidadObj.direccion"
            @blur="
              () => {
                $refs.direccion.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item ref="telefono" label="Teléfono" prop="telefono">
          <a-input
            v-model="sucursalEntidadObj.telefono"
            @blur="
              () => {
                $refs.telefono.onFieldBlur();
              }
            "
            :maxLength="10"
          />
        </a-form-model-item>
      </a-form-model>
      <template slot="actions" class="ant-card-actions">
         <a-button type="link" @click="onSubmit"> Registrar </a-button>
          <a-button type="link" @click="resetForm"> Limpiar </a-button>
      </template>
    </a-card>
  </div>
</template>
<script>
import SucursalesEntidades from "../../service/Administraciones/SucursalEntidad.service";
import Sidebar from "../../service/Home/Sidebar.service";

const columns = [
  {
    title: "Nombre",
    dataIndex: "nombreSucursal",
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
    scopedSlots: { customRender: "estado" },
  },
];

export default {
  data() {
    return {
      /*******LISTADO DE SUCURSALES********* */
      /*Datos*/
      entidadId: null,
      lstSucursalesEntidades: [],
      title: this.$route.params.nombre + ": Administración Sucursales",
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      /*menu*/
      lstOpciones: [],
      /**Otros */
      current: null,
      displayModal: true,

      /*******FORMULARIO SUCRUSALES********* */
      /*Datos*/
      sucursalEntidadObj: {},
      /*Formulario*/
      subTitle: '',
      displayForm: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        nombreSucursal: [
          {
            required: true,
            message: "Debe registrar el nombre.",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Mínimante el nombre debe tener 2 caracteres",
            trigger: "blur",
          },
        ],
        direccion: [
          {
            required: true,
            message: "Debe registrar la dirección",
            trigger: "blur",
          },
          {
            min: 5,
            message: "Mínimante la dirección debe tener 5 caracteres",
            trigger: "blur",
          },
        ],
        telefono: [
          {
            required: true,
            message: "Debe registrar el teléfono.",
            trigger: "blur",
          },
          {
            min: 7,
            max: 10,
            message: "El teléfono debe contener al menos 7 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
      },
       /**Filter */
      search: '',
      lstFilter: [],
      filter: 'Registros: 0/0',

    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        //type: "radio",
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
           //Opciones
          const mismoEstado = [...new Set(selectedRows.map(i => i.estado))];
          if(mismoEstado.length > 1) {
            this.$notification.warning("Debe seleccionar registros del mismo ESTADO para realizar operaciones múltiples.");
            this.cargarOpcionesByEstado("INICIAL");
          } else {
            if(selectedRows.length > 0) 
              this.cargarOpcionesByEstado(selectedRows[0].estado)
            else
              this.cargarOpcionesByEstado(null);
          }
        },
      };
    },
  },
  mounted() {
    this.entidadId = this.$route.params.entidadId;
    this.cargarSucursalEntidadesPorEntidad(this.entidadId);

     this.cargarOpcionesByEstado(null);
  },

  methods: {
    /*****LISTADO DE SUCURSALES*** */
    /**Menú */
    cargarOpcionesByEstado(estadoInicial) {
      Sidebar.getOpcionesByEstado("SUCURSALES_ENTIDADES", estadoInicial).then((r) => {
        console.log(r);
        this.lstOpciones = r.data.data;
        console.log(JSON.stringify(this.lstOpciones));
      });
    },
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.sucursalEntidadObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarSucursalEntidad(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Formulario Modificación de Registro";
          } else {
            this.$notification.warning('Debe seleccionar un solo registro para MODIFICAR');
          }
          break;
        case 'ELIMINAR': //ELIMINAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de ELIMINAR el(los) registro(s) seleccionado(s)?",
              content: "Considere que el(los) registro(s) ya no podrá(n) ser visualizado(s).",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "ELIMINAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para ELIMINAR')
          }
          break;
        case 'ACTIVAR': //ALTA
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR ALTA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el(los) registro(s) ingresará(n) en transacciones en el Sistema.",
              okText: "Aceptar",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "ACTIVAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
            
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR ALTA')
          }
          break;
        case 'DESACTIVAR': //BAJAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaSucursalEntidadTransaccion(this.selectedRowKeys, "DESACTIVAR");
              },
              onCancel() {  
                console.log('Cancel');
              },
              class: 'test',
            });
          } else {
            this.$notification.warning('Debe seleccionar al menos un registro para DAR BAJA')
          }
          break;
      }
      

    },
    /**Opeaciones */
    cargarSucursalEntidadesPorEntidad(entidadId) {
      this.$Progress.start();
      SucursalesEntidades.getLstSucursalEntidadByEntidadId(entidadId).then((r) => {
        console.log('cargar')
        console.log(r)
        if(r.status === 204 ) {
          this.lstSucursalesEntidades = [];
          this.lstFilter = [];
          this.$notification.warning("No se ha encontrado ninguna Sucursal registrada para Entidad.");
          this.$Progress.finish();
          return;
        }
        this.lstSucursalesEntidades = r.data.result;
        this.lstFilter = this.lstSucursalesEntidades;
        this.countRows();
        this.$Progress.finish();
      }).catch((error) => {
        this.lstSucursalesEntidades = [];
        this.lstFilter = [];
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
        this.$Progress.fail();
      });
    },
    actualizaListaSucursalEntidadTransaccion(sucursalIdLst, transaccion) {
      SucursalesEntidades.putLstSucursalEntidadTransaccion(sucursalIdLst, transaccion).then((r) => {
        this.$Progress.start();
        this.cargarSucursalEntidadesPorEntidad(this.entidadId);
        
        this.selectedRowKeys = [];
        
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
        console.log(error)
        this.$notification.error(error.response.data.message, error.response.data.code);
        this.$Progress.fail();
      });
    },
   
    /****FORMULARIO**** */
    /*Control de campos*/
    volverListado() {
      this.displayForm = !this.displayForm;
      this.sucursalEntidadObj = {};
      this.selectedRowKeys = [];
    },
    
    /*Operaciones*/
    cargarSucursalEntidad(sucursalId) {
      SucursalesEntidades.getSucursalEntidad(sucursalId).then((r) => {
        this.sucursalEntidadObj = r.data.result;
      });
    },
    guardarSucursalEntidad() {
      this.$Progress.start();
      this.sucursalEntidadObj.entidadId = this.entidadId;
      SucursalesEntidades.postSucursalEntidad(this.sucursalEntidadObj)
        .then((r) => {
          console.log(r);
          this.displayForm = false;
          this.cargarSucursalEntidadesPorEntidad(this.entidadId);
          this.$notification.success(r.data.message);
          this.$Progress.finish();
        })
        .catch((error) => {
          console.log(error);
          this.$notification.error(error.response.data.message, error.response.data.code);
          this.$Progress.fail();
        });
      
    },
    /*Acciones de Formulario*/
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.guardarSucursalEntidad(this.sucursalEntidadObj);
        } else {
          console.log("error submit!!");
          this.$notification.warning("Debe resolver las validaciones del formulario.");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },


    /**Filtrado */
    filterTable() {
      this.lstFilter = this.lstSucursalesEntidades.filter((s) => {
        if(this.search != null || this.search != '') {
          return s.nombreSucursal.toLowerCase().includes(this.search.toLowerCase());  
        } 
      });
      this.countRows();
    },
    countRows() {
      let rowFilter = this.lstFilter.length;
      let rowTotal = this.lstSucursalesEntidades.length;
      this.filter = "Registros: " + rowFilter + "/" + rowTotal;
    }
    
  },
};
</script>
<style scoped>
</style>
