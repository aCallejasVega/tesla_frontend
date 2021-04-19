  

<template>
  <div>
     <div v-if="!displayForm"
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 100%;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="$router.back()"/> {{title}} </b></h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            <a-row type="flex" justify="end">
              <a-col :xs="24" :sm="24" :md="24" :lg="4" :xl="4"
                ><b>{{filter}}</b></a-col
              >
              <a-col :xs="24" :sm="24" :md="24" :lg="20" :xl="20" align="right">
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
          </a-col>
        </a-row>
      </div>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <b>{{filter}}</b>
        <a-button-group >
          <a-button v-for="(item, i) in lstOpciones"
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
            type="primary">
            {{ item.etiqueta }}
          </a-button>
        </a-button-group>
      </template>
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <!--LISTADO DE SUCURSALES-->
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="lstFilter"
        rowKey="sucursalEntidadId"
        :pagination="pagination"
        :loading = "loading"
        :scroll="{ x: 1000 }"
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
         <template slot="datosGenerales" slot-scope="text, record">
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Nombre
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValueMain">
              {{record.nombreSucursal}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Dirección
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.direccion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Teléfono
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.telefono}} 
            </a-col>
          </a-row>
         </template>
         <template slot="informacionTributaria" slot-scope="text, record">
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Departamento
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.departamentoDescripcion}} 
            </a-col>
          </a-row>
          <a-row type="flex">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="10" class="labelTittle">
              Localidad
            </a-col>
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14" class="labelValue">
              {{record.localidadDescripcion}} 
            </a-col>
          </a-row>
          
        </template>
      </a-table>
    </a-card>
    <div v-if="displayForm"
        style="
          border: 2px solid #21618c;
          border-radius: 5px;
          height: 100%;
          width: 100%;
          padding: 1%;
          color: #21618c;
        "
      >
        <a-row type="flex" justify="space-around" align="middle"
          ><a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <h2><b style="color: #21618c"><a-icon type="arrow-left" @click="volverListado"/> {{title}}: {{subTitle}} </b></h2>
            </a-col
          >
        </a-row>
    </div>
    <a-card v-if="displayForm">
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
         <a-button type="link" @click="onSubmit" style="color:white; background-color:#339966;border:0px" > 
          <a-icon type="form" />
            Registrar 
          </a-button>
          <a-button type="primary" ghost @click="resetForm"><a-icon type="reload" /> Limpiar </a-button>
      </template>
    </a-card>
  </div>
</template>
<script>
import SucursalesEntidades from "../../service/Administraciones/SucursalEntidad.service";
import Sidebar from "../../service/Home/Sidebar.service";

const columns = [
  {
    title: "Datos Generales",
    dataIndex: "nombreSucursal",
    //fixed: "left",
    scopedSlots: { customRender: "datosGenerales" },
    width: "40%"
  },
  {
    title: "Información Tributaria",
    scopedSlots: { customRender: "informacionTributaria" },
    width: "40%"
  },
  {
    title: "Estado",
    dataIndex: "estado",
    scopedSlots: { customRender: "estado" },
    width: "20%"
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
      loading: false,
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
          this.subTitle = "Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarSucursalEntidad(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Modificación de Registro";
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
      this.loading = true;
      SucursalesEntidades.getLstSucursalEntidadByEntidadId(entidadId).then((r) => {
        console.log('cargar')
        console.log(r)
        if(r.status === 204 ) {
          this.lstSucursalesEntidades = [];
          this.lstFilter = [];
          this.$notification.warning("No se ha encontrado ninguna Sucursal registrada para Entidad.");
          this.loading = false;
          return;
        }
        this.lstSucursalesEntidades = r.data.result;
        this.lstFilter = this.lstSucursalesEntidades;
        this.countRows();
        this.loading = false;
      }).catch((error) => {
        this.lstSucursalesEntidades = [];
        this.lstFilter = [];
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
        this.loading = false;
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
.labelTittle {
    background-color:#FAFAFA; 
    font-weight:bold; 
    padding-right:5px;
    height: 100%;
  }
  .labelValue {
    border-width: 0.1px;
    border-color:#FAFAFA;
    border-style: solid;
  }
  .labelValueMain {
    border-width: 0.1px;
    border-color:#FAFAFA;
    border-style: solid;
    color: #839DFF;
    background-color:#FAFAFA; 
  }
</style>
