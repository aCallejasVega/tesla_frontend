<template>
  <div>
    <a-card v-if="!displayForm" style="width: 100%">
      <a-page-header
        style="border: 1px solid rgb(224,206,206)"
        title="Administración de Registro de Sucursales por Recaudadora"
        @back="$router.back()"
      />
    </a-card>
    <a-card v-if="!displayForm" style="width: 100%">
      <template slot="actions" class="ant-card-actions">
        <a-button-group >
          <a-button  v-for="(item, i) in lstOpciones" 
            :key="i"
            @click="seleccionarOpcion(item.transaccion)">
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
        :data-source="lstSucursales"
        rowKey="sucursalId"
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
        title="Administración de Sucursales"
        :sub-title="subTitle"
        @back="() => volverListado()"
      />
      <br/>
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
         <a-button type="link" @click="onSubmit"> Registrar </a-button>
          <a-button type="link" @click="resetForm"> Limpiar </a-button>
      </template>
    </a-card>
  </div>
</template>
<script>
import Dominios from "../../service/Administraciones/Dominio.service";
import Sucursales from "../../service/Administraciones/Sucursal.service";

const columns = [
  {
    title: "Nombre",
    dataIndex: "nombre",
    fixed: "left",
  },
  {
    title: "Departamento",
    dataIndex: "departamentoDescripcion",
  },
  {
    title: "Municipio",
    dataIndex: "munipioId",
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
      recaudadorId: null,
      lstSucursales: [],
      /*Tabla*/
      columns,
      selectedRowKeys: [],
      pagination: {
        pageSize: 5,
      },
      /*menu*/
      lstOpciones: [
        { transaccion: "CREAR", etiqueta: "CREAR", imagen: "imagen.png", orden: 1 },
        { transaccion: "MODIFICAR", etiqueta: "MODIFICAR", imagen: "imagen.png", orden: 2 },
        { transaccion: "ELIMINAR", etiqueta: "ELIMINAR", imagen: "imagen.png", orden: 3 },
        { transaccion: "ACTIVAR", etiqueta: "DAR ALTA", imagen: "imagen.png", orden: 4 },
        { transaccion: "DESACTIVAR", etiqueta: "DAR BAJA", imagen: "imagen.png", orden: 5 },
      ],
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
            message: "Debe registrar la dirección",
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

    };
  },
  computed: {
    /*Tabla*/
    rowSelection() {
      return {
        //type: "radio",
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
  mounted() {
    this.recaudadorId = this.$route.params.recaudadorId;
    this.cargarSucursalesPorRecaudadora(this.recaudadorId);
    this.cargarDepartamentos();
    this.cargarLocalidades();
  },

  methods: {
    /*****LISTADO DE SUCURSALES*** */
    /**Menú */
    seleccionarOpcion(opcion) {
      switch (opcion) {
        case 'CREAR': //CREAR
          this.sucursalObj = {};
          this.displayForm = true;
          this.subTitle = "Formulario Registro Nuevo";
          break;  
        case 'MODIFICAR': //Modiicar
          if(this.selectedRowKeys.length === 1) {
            this.cargarSucursal(this.selectedRowKeys);
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
                this.actualizaListaSucursalTransaccion(this.selectedRowKeys, "ELIMINAR");
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
                this.actualizaListaSucursalTransaccion(this.selectedRowKeys, "DESACTIVAR");
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
      this.$Progress.start();
      Sucursales.getLstSucursales(recaudadorId).then((r) => {
        console.log('eñiminado')
        console.log(r)
        if(r.status === 204 ) {
           this.lstSucursales = [],
          this.$notification.warning("No se ha encontrado ninguna Sucursal registrada para Recaudadoras.");
          this.$Progress.finish();
          return;
        }
        console.log('aqui')
        this.lstSucursales = r.data.result;
        this.$Progress.finish();
      }).catch((error) => {
          console.log(error);
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.$Progress.fail();
        });
    },
    /*actualizaSucursalTransaccion(sucursalId, transaccion) { //Solo se usara el listado
      this.$Progress.start();
      Sucursales.putSucursalTransaccion(sucursalId, transaccion).then((r) => {
        this.cargarSucursalesPorRecaudadora(this.recaudadorId);
        this.$notification.success(r.data.message);
        this.$Progress.finish();
      }).catch((error) => {
        console.log(error)
        this.$notification.error(error.response.data.message, error.response.data.code);
        this.$Progress.fail();
      });
    },
*/
    actualizaListaSucursalTransaccion(sucursalIdLst, transaccion) {
      
      Sucursales.putLstSucursalTransaccion(sucursalIdLst, transaccion).then((r) => {
        this.$Progress.start();
        this.cargarSucursalesPorRecaudadora(this.recaudadorId);
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
    cargarLocalidades() {
      Dominios.getListDominos("municipio_id").then((r) => {
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

    
  },
};
</script>
<style scoped>
</style>
