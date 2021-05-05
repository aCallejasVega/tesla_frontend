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
          <a-button :icon="item.imagen"  v-for="(item, i) in lstOpciones" 
            :key="i"
            @click="seleccionarOpcion(item.transaccion)"
            type="primary"
            >
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
        :data-source="lstFilter "
        rowKey="sucursalId"
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
          <div v-if="record.estado == 'INACTIVO'" align="center">
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
              {{record.nombre}} 
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
        :model="sucursalObj"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        size="small"
      >
        <a-form-model-item ref="nombre" label="Nombre Sucursal" prop="nombre">
          <a-input
            v-model="sucursalObj.nombre"
            @blur="
              () => {
                $refs.nombre.onFieldBlur();
              }
            "
            :maxLength="250"
          />
        </a-form-model-item>
        <a-form-model-item label="Departamento" prop="departamentoId">
          <a-select
            v-model="sucursalObj.departamentoId"
            placeholder="Seleccione Departamento"
             @change="cargarLocalidades(sucursalObj.departamentoId)"
          >
            <a-select-option
              v-for="(item, i) in lstDepartamentos"
              :key="i"
              :value="item.dominioId" 
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="Localidad" prop="localidadId">
          <a-select
            v-model="sucursalObj.localidadId"
            placeholder="Seleccione Localidad"
          >
            <a-select-option
              v-for="(item, i) in lstLocalidades"
              :key="i"
              :value="item.dominioId"
            >
              {{ item.descripcion }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item ref="direccion" label="Dirección" prop="direccion">
          <a-input
            v-model="sucursalObj.direccion"
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
            v-model="sucursalObj.telefono"
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
import Dominios from "../../service/Administraciones/Dominio.service";
import Sucursales from "../../service/Administraciones/Sucursal.service";
import Sidebar from "../../service/Home/Sidebar.service";

const sorter = (data) => {
  return data.slice().sort((a,b) => b.sucursalId - a.sucursalId)
};

const columns = [
  {
    title: "Datos Generales",
    dataIndex: "nombre",
    scopedSlots: { customRender: "datosGenerales" },
    width: "75%"
  },
  {
    title: "Estado",
    dataIndex: "estado",
    //fixed: "right",
    scopedSlots: { customRender: "estado" },
    width: "25%"
  },
];

export default {
  data() {
    return {
      /*******LISTADO DE SUCURSALES********* */
      /*Datos*/
      recaudadorId: null,
      lstSucursales: [],
      title: this.$route.params.nombre + ": Administración Sucursales por Recaudadora",
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
      sucursalObj: {},
      /*Formulario*/
      subTitle: '',
      displayForm: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      rules: {
        nombre: [
          {
            required: true,
            message: "Debe registrar el nombre",
            trigger: "blur",
          },
          {
            min: 2,
            message: "Mínimante el nombre debe tener 2 caracteres",
            trigger: "blur",
          },
        ],
        departamentoId: [
          {
            required: true,
            message: "Debe seleccionar un Departamento",
            trigger: "change",
          },
        ],
        localidadId: [
          {
            required: true,
            message: "Debe seleccionar una Localidad",
            trigger: "change",
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
            message: "Debe registrar el teléfono",
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

      /*Dominios*/
      lstDepartamentos: [],
      lstLocalidades: [],

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
    this.recaudadorId = this.$route.params.recaudadorId;
    this.cargarSucursalesPorRecaudadora(this.recaudadorId);
    this.cargarDepartamentos();

    this.cargarOpcionesByEstado(null);
    
  },
  methods: {
    /*****LISTADO DE SUCURSALES*** */
    /**Menú */
    cargarOpcionesByEstado(estadoInicial) {
      Sidebar.getOpcionesByEstado("SUCURSALES", estadoInicial).then((r) => {
        console.log(r);
        this.lstOpciones = r.data.data;
        console.log(JSON.stringify(this.lstOpciones));
      });
    },
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.sucursalObj = {};
          this.displayForm = true;
          this.subTitle = "Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarSucursal(this.selectedRowKeys);
            this.displayForm = true;
            this.subTitle = "Modificación de Registro";

            //this.selectedRowKeys = [];
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
                this.actualizaListaSucursalTransaccion(this.selectedRowKeys, "ELIMINAR");
                //this.selectedRowKeys = [];
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
                this.actualizaListaSucursalTransaccion(this.selectedRowKeys, "ACTIVAR");
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
        case 'INACTIVAR': //BAJAR
          if(this.selectedRowKeys.length > 0) {
            this.$confirm({
              title: "¿Está seguro de DAR BAJA el(los) registro(s) seleccionado(s)?",
              content: "Considere que el registro ya no podrá realizar transacciones en el Sistema.",
              okText: "Aceptar",
              okType: "danger",
              cancelText: "Cancelar",
              onOk: () => {
                console.log('ok')
                this.actualizaListaSucursalTransaccion(this.selectedRowKeys, "INACTIVAR");
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
    cargarSucursalesPorRecaudadora(recaudadorId) {
      this.loading = true;
      Sucursales.getLstSucursales(recaudadorId).then((r) => {
        console.log('eñiminado')
        console.log(r)
        if(r.status === 204 ) {
          this.lstSucursales = [],
          this.lstFilter = [];
          this.$notification.warning("No se ha encontrado ninguna Sucursal registrada para Recaudadoras.");
          this.loading = false;
          return;
        }
        this.lstSucursales = sorter(r.data.result);
        this.lstFilter = this.lstSucursales;
        this.loading = false;
        this.countRows();
       
       //Para opciones
        this.selectedRowKeys = [];
        this.cargarOpcionesByEstado(null);

      }).catch((error) => {
        this.lstSucursales = [],
        this.lstFilter = [];
        this.$notification.error(
          error.response.data.message,
          error.response.data.code
        );
        this.loading = false;
      });
    },
    actualizaListaSucursalTransaccion(sucursalIdLst, transaccion) {
      Sucursales.putLstSucursalTransaccion(sucursalIdLst, transaccion).then((r) => {
        this.$Progress.start();
        this.cargarSucursalesPorRecaudadora(this.recaudadorId);

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
      this.sucursalObj = {};
      this.selectedRowKeys = [];
    },
    
    /*Lista de Dominio*/
    cargarDepartamentos() {
      Dominios.getListDominos("departamento_id").then((r) => {
        if(r.status === 204) {
          this.lstDepartamentos = [];
          this.$notification.warning("La parametrización de dominios no esta completa.");
          return;
        }

        this.lstDepartamentos = r.data.result;
      }).catch((error) => {
          console.log(error);
          this.lstDepartamentos = [];
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
    },
    cargarLocalidades(agrupadorId) {
      Dominios.getListDominosByAgrupador(agrupadorId).then((r) => {
        if(r.status === 204) {
          this.lstLocalidades = [];
          this.$notification.warning("La parametrización de dominios no esta completa.");
          return;
        }

        this.lstLocalidades = r.data.result;
      }).catch((error) => {
          console.log(error);
          this.lstLocalidades = [];
          this.$notification.error(error.response.data.message, error.response.data.code);
        });
    },
    /*Operaciones*/
    cargarSucursal(sucursalId) {
      Sucursales.getSucursal(sucursalId).then((r) => {
        this.sucursalObj = r.data.result;
        this.cargarLocalidades(this.sucursalObj.departamentoId);
      });
    },
    guardarSucursal() {
      this.$Progress.start();
      this.sucursalObj.recaudadorId = this.recaudadorId;
      Sucursales.postSucursal(this.sucursalObj)
        .then((r) => {
          console.log(r);
          this.displayForm = false;
          this.cargarSucursalesPorRecaudadora(this.recaudadorId);
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
          this.guardarSucursal(this.sucursalObj);

          this.selectedRowKeys = [];
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
      this.lstFilter = this.lstSucursales.filter((s) => {
        if(this.search != null || this.search != '') {
          return s.nombre.toLowerCase().includes(this.search.toLowerCase());   
        }
      });
      this.countRows();
    },
    countRows() {
      let rowFilter = this.lstFilter.length;
      let rowTotal = this.lstSucursales.length;
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
