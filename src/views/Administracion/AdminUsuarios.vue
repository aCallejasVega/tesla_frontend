<template>
  <div>
    <a-card style="width: 100%">
      <div class="card-head">
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <b style="color: #08632d"> ADMINISTRACIÓN DE USUARIOS </b>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card style="width: 100%">
      <a-row>
        <a-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
          <a-button
            v-for="(operaciones, index) in operacionesList"
            :key="index"
            style="margin: 1px"
            @click="prepararOperacion(operaciones)"
          >
            <a-icon
              :type="operaciones.imagen"
              theme="twoTone"
              two-tone-color="#2e8b57"
            />
            {{ operaciones.etiqueta }}
          </a-button>
        </a-col>
        <a-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
          <a-form-model-item
            label="Buscar por :"
            :label-col="formItemTowLayout.labelCol"
            :wrapper-col="formItemTowLayout.wrapperCol"
          >
            <a-input-search
              placeholder="Nombre, Nro. Documento"
              enter-button
              @search="findPersonas(1)"
              v-model="formBusqueda.parametro"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">LISTA DE USUARIOS</a-divider>

      <a-table
        :columns="columns"
        :data-source="data"
        align="center"
        :loading="loadingTable"
        :row-selection="rowSelection"
      >
        <template slot="nombreCompleto" slot-scope="text, record">
          <font size="2">
            <table style="width: 100%">
              <tr>
                <th>NOMBRE :</th>
                <td>{{ record.nombreCompleto }}</td>
              </tr>
              <tr>
                <th>NRO. DOC. :</th>
                <td>
                  {{ record.nroDocumento }} {{ record.extensionDocumento }}
                </td>
              </tr>
              <tr>
                <th>CORREO :</th>
                <td>{{ record.correoElectronico }}</td>
              </tr>
              <tr>
                <th>TELÉFONO :</th>
                <td>{{ record.telefono }}</td>
              </tr>
              <tr>
                <th>DIRECCIÓN :</th>
                <td>{{ record.direccion }}</td>
              </tr>
              <tr v-if="record.nombreEntidad != null">
                <th>ENTIDAD :</th>
                <td>
                  <a-tag color="cyan">
                    <a-icon type="caret-up" /> {{ record.nombreEntidad }}
                  </a-tag>
                </td>
              </tr>
              <tr v-if="record.nombreRecaudadora != null">
                <th>Recaudador :</th>
                <td>
                  <a-tag color="cyan">
                    <a-icon type="caret-up" />
                    {{ record.nombreRecaudadora }}</a-tag
                  >
                </td>
              </tr>
              <tr v-if="record.nombreSucursal != null">
                <th>SUCURSAL :</th>
                <td>
                  <a-tag color="cyan">
                    <a-icon type="caret-up" />
                    {{ record.nombreSucursal }}</a-tag
                  >
                </td>
              </tr>
            </table>
          </font>
        </template>
        <template slot="credenciales" slot-scope="text, record">
          <div v-if="record.estadoUsuario == 'ACTIVO'">
            <a-tag color="green"> <a-icon type="lock" /> Asignadas </a-tag>
          </div>
          <div v-if="record.estadoUsuario == null">
            <a-tag color="red"> <a-icon type="lock" />Sin Asignar </a-tag>
          </div>
        </template>
        <template slot="roles" slot-scope="text, record">
         
            <a-timeline>
              <a-timeline-item
                style="margin: 0px; padding: 0"
                v-for="(rol, index) in record.rolTransferList"
                :key="index"
              >
                <font size="2"> {{ rol.description }}   </font>
              </a-timeline-item>
            </a-timeline>
       
        </template>
        <template slot="estado" slot-scope="text, record">
          <div v-if="record.estado == 'ACTIVO'">
            <a-tag color="green">
              <a-icon type="caret-up" /> {{ record.estado }}
            </a-tag>
          </div>
          <div v-if="record.estado == 'DESACTIVO'">
            <a-tag color="orange"> <a-icon type="caret-up" /> INACTIVO </a-tag>
          </div>
          <div v-if="record.estado == 'CREADO'">
            <a-tag color="blue">
              <a-icon type="caret-up" /> {{ record.estado }}
            </a-tag>
          </div>
        </template>
        <template
          slot="opciones"
          slot-scope="text, record"
          v-if="record.estado == 'DESACTIVO' || record.estado == 'CREADO'"
        >
          <a-button type="dashed" block @click="viewCredenciales(record)"
            ><a-icon type="lock" /> Generar Credenciales
          </a-button>
          <a-button
            type="dashed"
            block
            @click="viewVisibleModalRoles(record)"
            :disabled="record.estadoUsuario == null"
            ><a-icon type="user-add" />Asignar Roles
          </a-button>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model="visibleModalRegitro"
      :title="tituloModal"
      :dialog-style="{ top: '20px' }"
      :width="700"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" size="small">
        <a-row>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              ref="nombres"
              prop="nombres"
              label="Nombres :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input
                placeholder="Nombres"
                v-model="form.nombres"
                :readOnly="dissabled"
                @blur="
                  () => {
                    $refs.nombres.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="user" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              ref="paterno"
              prop="paterno"
              label="Ap. Paterno :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input
                placeholder="Apellido Paterno"
                v-model="form.paterno"
                :readOnly="dissabled"
                @blur="
                  () => {
                    $refs.paterno.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="user" />
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Ap. Materno :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input
                placeholder="Apellido Materno"
                v-model="form.materno"
                :readOnly="dissabled"
              >
                <a-icon slot="suffix" type="user" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              ref="extensionDocumentoId"
              prop="extensionDocumentoId"
              label="Nro. Doc. :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input-group compact>
                <a-input
                  placeholder="Nro. de Documento."
                  style="width: 60%"
                  v-model="form.nroDocumento"
                  required
                  :readOnly="dissabled"
                  @blur="
                    () => {
                      $refs.nroDocumento.onFieldBlur();
                    }
                  "
                >
                  <a-icon slot="suffix" type="idcard" />
                </a-input>
                <a-select
                  default-value="Extensión"
                  style="width: 40%"
                  v-model="form.extensionDocumentoId"
                  :disabled="dissabled"
                  @blur="
                    () => {
                      $refs.extensionDocumentoId.onFieldBlur();
                    }
                  "
                >
                  <a-select-option
                    v-for="(extension, index) in extensionDocumentoList"
                    :key="index"
                    v-bind:value="extension.dominioId"
                  >
                    {{ extension.abreviatura }}
                  </a-select-option>
                </a-select>
              </a-input-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <a-form-model-item
              ref="direccion"
              prop="direccion"
              label="Dirección :"
              :label-col="formItemOneLayout.labelCol"
              :wrapper-col="formItemOneLayout.wrapperCol"
            >
              <a-textarea
                placeholder="Dirección domiciliaria"
                auto-size
                v-model="form.direccion"
                :readOnly="dissabled"
                @blur="
                  () => {
                    $refs.direccion.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="environment" />
              </a-textarea>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              ref="correoElectronico"
              prop="correoElectronico"
              label="Email :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input
                placeholder="Correo Electronico"
                v-model="form.correoElectronico"
                :readOnly="dissabled"
                @blur="
                  () => {
                    $refs.correoElectronico.onFieldBlur();
                  }
                "
              >
                <a-icon slot="suffix" type="global" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Teléfono :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-input
                placeholder="Teléfono"
                v-model="form.telefono"
                :readOnly="dissabled"
              >
                <a-icon slot="suffix" type="phone" />
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="subModulo == 'ADM_RECAUDACION'">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Sucursal :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-select v-model="form.sucursalId" :disabled="dissabled">
                <a-select-option
                  v-for="(sucursal, index) in sucursalesRecaudadorList"
                  :key="index"
                  v-bind:value="sucursal.sucursalId"
                >
                  {{ sucursal.nombre }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="subModulo == 'ADMIN'">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Entidad :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-select v-model="form.entidadId" :disabled="dissabled">
                <a-select-option
                  v-for="(entidad, index) in entidadesList"
                  :key="index"
                  v-bind:value="entidad.entidadId"
                >
                  {{ entidad.nombre }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Recaudadora :"
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
            >
              <a-select v-model="form.recaudadorId" :disabled="dissabled">
                <a-select-option
                  v-for="(recaudador, index) in recaudadorasList"
                  :key="index"
                  v-bind:value="recaudador.recaudadorId"
                >
                  {{ recaudador.nombre }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row v-if="subModulo == 'ADMIN'">
          <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <a-form-model-item
              label="Es Administrador "
              :label-col="formItemTowLayout.labelCol"
              :wrapper-col="formItemTowLayout.wrapperCol"
              :readOnly="dissabled"
            >
              <a-switch v-model="form.esAdmin" :disabled="dissabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <template slot="footer">
        <a-row type="flex" justify="center" align="top" :gutter="16">
          <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <a-button
              type="dashed"
              block
              :style="{
                fontSize: '19px',
                height: '40px',
              }"
              @click="cancelarModal()"
            >
              Cancelar
            </a-button>
          </a-col>
          <a-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <a-button
              type="primary"
              block
              :style="{
                fontSize: '19px',
                height: '40px',
              }"
              @click="procesarOperacion"
            >
              <a-icon :type="imagenButton" />
              {{ labelButton }}
            </a-button>
          </a-col>
        </a-row>
      </template>
    </a-modal>
    <a-modal
      v-model="visibleModalCredenciales"
      title="Generación de credenciales"
      :dialog-style="{ top: '20px' }"
      :width="400"
    >
      <a-result
        title="¿Está seguro de generar las credenciales para el usuario?"
        :sub-title="subTitle"
        style="padding: 0px"
      >
        <template #icon>
          <a-icon type="question-circle" />
        </template>
      </a-result>
      <template slot="footer">
        <a-button key="back" @click="visibleModalCredenciales = false">
          Cancelar
        </a-button>
        <a-button key="submit" type="primary" @click="generarCredenciales">
          Aceptar
        </a-button>
      </template>
    </a-modal>

    <a-modal
      v-model="visibleModalRoles"
      title="ASIGNACIÓN DE ROLES"
      :dialog-style="{ top: '20px' }"
      :width="700"
    >
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-transfer
            :data-source="mockData"
            :titles="['Roles por Asignar', 'Roles asignados']"
            :target-keys="targetKeys"
            :selected-keys="selectedKeys"
            :render="(item) => item.title"
            :disabled="disabled"
            @change="handleChange"
            @selectChange="handleSelectChange"
            :list-style="{
              width: '300px',
            }"
          />
        </a-col>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="visibleModalRoles = false">
          Cancelar
        </a-button>
        <a-button key="submit" type="primary" @click="guardarRoles">
          Aceptar
        </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import AdminUsuarios from "../../service/Administraciones/AdminUsuarios.services";
import { mapGetters, mapState, mapActions } from "vuex";
import RegistroPersona from "@/components/Administracion/RegistroPersona.vue";

const formItemTowLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 8 },
    xl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
  },
};
const formItemOneLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 4 },
    lg: { span: 4 },
    xl: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 20 },
    lg: { span: 20 },
    xl: { span: 20 },
  },
};
const columns = [
  {
    title: "DATOS DEL USUARIO",
    dataIndex: "nombreCompleto",
    key: "nombreCompleto",
    width: "35%",
    scopedSlots: { customRender: "nombreCompleto" },
  },
  {
    title: "CREDENCIALES",
    dataIndex: "credenciales",
    key: "credenciales",
    width: "15%",
    scopedSlots: { customRender: "credenciales" },
  },
  {
    title: "ROLES/MÓDULOS",
    dataIndex: "roles",
    key: "roles",
    width: "25%",
    scopedSlots: { customRender: "roles" },
  },

  {
    title: "ESTADO",
    dataIndex: "estado",
    key: "estado",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "estado" },
  },
  {
    title: "OPCIONES",
    dataIndex: "opciones",
    key: "opciones",
    width: "15%",
    align: "center",
    scopedSlots: { customRender: "opciones" },
  },
];
export default {
  components: {
    RegistroPersona,
  },
  data() {
    const mockData = [];

    const oriTargetKeys = [];
    return {
      mockData,
      targetKeys: [],
      selectedKeys: [],
      disabled: false,

      operacionesList: [],
      columns,
      data: [],
      loadingTable: false,
      page: 1,
      total: 0,
      pagination: {},
      selectPersona: {},
      formBusqueda: {},
      visibleModalRegitro: false,
      tituloModal: "",
      dissabled: true,
      formItemTowLayout,
      formItemOneLayout,
      form: {
        nombres: "",
        paterno: "",
        materno: "",
        direccion: "",
        correoElectronico: "",
        telefono: "",
        nroDocumento: "",
        ciudadId: "",
        ciudad: "",
        tipoDocumentoId: "",
        tipoDocumento: "",
        extensionDocumento: "",
        extensionDocumentoId: "",
        transaccion: "",
        sucursalId: "",
        recaudadorId: "",
        entidadId: "",
        esAdmin: "",
      },
      estado: null,
      extensionDocumentoList: [],
      tituloModal: null,
      dissabled: true,
      labelButton: "",
      imagenButton: "",
      transaccion: "",
      modulo: "",
      subModulo: "",
      sucursalmoduloList: [],
      sucursalesRecaudadorList: [],
      visibleModalCredenciales: false,
      personaId: null,
      subTitle: null,
      visibleModalRoles: false,
      moduloUsuario: {},
      privilegiosAsignar: [],
      privilegiosAsignados: [],
      privilegiosKey: [],

      privilegiosActivar: [],
      privilegiosDesActivar: [],
      entidadesList: [],
      recaudadorasList: [],
      rules: {
        nombres: [
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
        paterno: [
          {
            required: true,
            message: "Debe registrar el apellido paterno",
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
        nroDocumento: [
          {
            required: true,
            message: "Debe registrar el Nro. de documento.",
            trigger: "blur",
          },
          {
            min: 7,
            max: 10,
            message:
              "El Nro. de documento contener al menos 5 caracteres y máximo 10",
            trigger: "blur",
          },
        ],
        extensionDocumentoId: [
          {
            required: true,
            message: "Debe seleccionar el tipo de documento",
            trigger: "change",
          },
        ],
        correoElectronico: [
          {
            required: true,
            message: "Debe registrar Correo Electronico.",
            trigger: "change",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("AdmStore", ["getform"]),

    rowSelection() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectPersona = selectedRows[0];
          this.getOperaciones("PERSONAS", this.selectPersona.estado);
        },
      };
    },
  },
  created() {
    this.esSessionEntidad();
    this.findAllEntidad();
    this.findAllRecaudadoras();
    this.getModuloUsuario();

    this.getDominioExtensionDocumento();
    this.getOperaciones("PERSONAS", "INICIAL");
    this.findPersonas(1);

    this.pagination = {
      total: this.total,
      onChange: (page) => {
        this.findPersonas(page);
      },
    };
  },
  methods: {
    ...mapActions("AdmStore", ["almacenarDataStore"]),

    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys;

      this.privilegiosKey = nextTargetKeys;
    },
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    },
    handleScroll(direction, e) {},
    handleDisable(disabled) {
      this.disabled = disabled;
    },

    almacenarFormFuncion(selectPersona) {
      this.$store.dispatch("AdmStore/almacenarDataStore", selectPersona);
    },
    getOperaciones(tablaId, estadoInicial) {
      AdminUsuarios.getOperaciones(tablaId, estadoInicial)
        .then((response) => {
          this.operacionesList = response.data.data;
        })
        .catch((error) => {
          this.operacionesList = [];
        });
    },

    findPersonas(page) {
      this.loadingTable = true;
      this.formBusqueda.page = page;
      this.selectPersona = {};
      this.formBusqueda.modulo = this.modulo;
      this.formBusqueda.subModulo = this.subModulo;
    
      AdminUsuarios.findPersonas(this.formBusqueda)
        .then((response) => {
          this.data = response.data.data.content;
          this.loadingTable = false;
          this.selectPersona = {};
        })
        .catch((error) => {
          
          this.data = [];
          this.loadingTable = false;
          //this.$notification.error(error.response.data.message);
        });
    },
    prepararOperacion(operacion) {
      this.getSucursalesByRecaudadora();
      switch (operacion.transaccion) {
        case "CREAR":
          this.visibleModalRegitro = true;
          this.tituloModal = "REGISTRAR NUEVA PERSONA";
          this.dissabled = false;
          this.form = {};
          this.labelButton = operacion.etiqueta;
          this.imagenButton = operacion.imagen;
          this.transaccion = operacion.transaccion;
          //this.dataStore.selectPersona=this.selectPersona;
          //this.$store.dispatch("AdmStore/almacenarDataStore", this.dataStore);

          break;
        case "MODIFICAR":
          this.visibleModalRegitro = true;
          this.tituloModal = "MODIFICAR PERSONA";
          this.dissabled = false;
          this.form = this.selectPersona;
          this.labelButton = operacion.etiqueta;
          this.imagenButton = operacion.imagen;
          this.transaccion = operacion.transaccion;

          break;
        case "ACTIVAR":
          if (this.selectPersona.estadoUsuario == "ACTIVO") {
            this.visibleModalRegitro = true;
            this.dissabled = true;
            this.tituloModal = "ACTIVAR PERSONA";
            this.dissabled = true;
            this.labelButton = operacion.etiqueta;
            this.imagenButton = operacion.imagen;
            this.transaccion = operacion.transaccion;
            this.form = this.selectPersona;
          } else {
            this.$warning({
              title: "No se puede activar al usuario.",
              content:
                "No se puede activar al usuario debido a que no cuenta con credenciales de acceso al sistema.",
              okText: "Aceptar",
            });
          }

          break;
        case "DESACTIVAR":
          this.visibleModalRegitro = true;
          this.tituloModal = "REGISTRO DE NUEVA PERSONA";
          this.dissabled = true;
          this.labelButton = operacion.etiqueta;
          this.imagenButton = operacion.imagen;
          this.transaccion = operacion.transaccion;
          this.form = this.selectPersona;

          break;
        case "ELIMINAR":
          this.visibleModalRegitro = true;
          this.tituloModal = "REGISTRO DE NUEVA PERSONA";
          this.dissabled = true;
          this.labelButton = operacion.etiqueta;
          this.imagenButton = operacion.imagen;
          this.transaccion = operacion.transaccion;
          this.form = this.selectPersona;

          break;
        case "VISUALIZAR":
          this.visibleModalRegitro = true;
          this.tituloModal = "REGISTRO DE NUEVA PERSONA";
          this.dissabled = true;
          this.labelButton = operacion.etiqueta;
          this.imagenButton = operacion.imagen;
          this.transaccion = operacion.transaccion;
          this.form = this.selectPersona;

          break;
      }
    },

    procesarOperacion() {
      switch (this.transaccion) {
        case "CREAR":
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.$confirm({
                title: "¿Está seguro de seguir con la operación?",
                content: (h) => (
                  <div>Si continua con esta acción no podrá revertirla.</div>
                ),
                okText: "ACEPTAR",
                cancelText: "CANCELAR",
                onOk: () => {
                  this.form.transaccion = this.transaccion;
                  this.savePersona();
                },
              });
            }
          });

          break;
        case "MODIFICAR":
          this.$refs.ruleForm.validate((valid) => {
            if (valid) {
              this.$confirm({
                title: "¿Está seguro de seguir con la operación?",
                content: (h) => (
                  <div>Si continua con esta acción no podrá revertirla.</div>
                ),
                okText: "ACEPTAR",
                cancelText: "CANCELAR",
                onOk: () => {
                  this.form.transaccion = this.transaccion;
                  this.updatePersona();
                },
              });
            }
          });

          break;
        case "ACTIVAR":
          this.$confirm({
            title: "¿Está seguro de seguir con la operación?",
            content: (h) => (
              <div>Si continua con esta acción no podrá revertirla.</div>
            ),
            okText: "ACEPTAR",
            cancelText: "CANCELAR",
            onOk: () => {
              this.form.transaccion = this.transaccion;
              this.cambiarEstadoPersona();
            },
          });

          break;
        case "DESACTIVAR":
          this.$confirm({
            title: "¿Está seguro de seguir con la operación?",
            content: (h) => (
              <div>Si continua con esta acción no podrá revertirla.</div>
            ),
            okText: "ACEPTAR",
            cancelText: "CANCELAR",
            onOk: () => {
              this.form.transaccion = this.transaccion;
              this.cambiarEstadoPersona();
            },
          });

          break;
        case "ELIMINAR":
          this.$confirm({
            title: "¿Está seguro de seguir con la operación?",
            content: (h) => (
              <div>Si continua con esta acción no podrá revertirla.</div>
            ),
            okText: "ACEPTAR",
            cancelText: "CANCELAR",
            onOk: () => {
              this.form.transaccion = this.transaccion;
              this.cambiarEstadoPersona();
            },
          });

          break;
        case "VISUALIZAR":
          this.visibleModalRegitro = false;
          break;
      }
    },
    cancelarModal() {
      this.visibleModalRegitro = false;
      this.$refs["ruleForm"].resetFields();
    },
    getDominioExtensionDocumento() {
      AdminUsuarios.getDominioExtensionDocumento()
        .then((response) => {
          this.extensionDocumentoList = response.data.result;
        })
        .catch((error) => {});
    },
    savePersona() {
      this.form.modulo = this.modulo;
      this.form.subModulo = this.subModulo;
      AdminUsuarios.savePersona(this.form)
        .then((response) => {
          this.findPersonas(1);
          this.visibleModalRegitro = false;
          this.selectPersona = {};
          this.getOperaciones("PERSONAS", "INICIAL");
          this.$notification.success(response.data.message);
          this.$refs["ruleForm"].resetFields();
        })
        .catch((error) => {
          this.$notification.error(error.response.data.message);
        });
    },
    updatePersona() {
      this.form.modulo = this.modulo;
      AdminUsuarios.updatePersona(this.form)
        .then((response) => {
          this.findPersonas(1);
          this.visibleModalRegitro = false;
          this.selectPersona = {};
          this.getOperaciones("PERSONAS", "INICIAL");
          this.$notification.success(response.data.message);
          this.$refs["ruleForm"].resetFields();
        })
        .catch((error) => {
          this.$notification.error(error.response.data.message);
        });
    },
    cambiarEstadoPersona() {
      this.form.modulo = this.modulo;
      AdminUsuarios.cambiarEstadoPersona(this.form)
        .then((response) => {
          this.findPersonas(1);
          this.visibleModalRegitro = false;
          this.selectPersona = {};
          this.getOperaciones("PERSONAS", "INICIAL");
          this.$notification.success(response.data.message);
        })
        .catch((error) => {
          this.$notification.error(error.response.data.message);
        });
    },

    getSucursalesByRecaudadora() {
      if (this.subModulo == "ADM_RECAUDACION") {
        AdminUsuarios.getSucursalesByRecaudadora()
          .then((response) => {
            this.sucursalesRecaudadorList = response.data.data;
            this.selectPersona = {};
            this.getOperaciones("PERSONAS", "INICIAL");
          })
          .catch((error) => {
            this.sucursalesRecaudadorList = [];
          });
      }
    },
    esSessionEntidad() {
      let url = this.$route.fullPath;
      
      switch (url) {
        case "/AdminUsuarios/ADMIN":
          this.modulo = "ADMIN";
          this.subModulo = "ADMIN";
          break;
        case "/AdminUsuarios/COBROS/ADM_ENTIDADES":
          this.modulo = "COBROS";
          this.subModulo = "ADM_ENTIDADES";
          break;
        case "/AdminUsuarios/COBROS/ADM_RECAUDACION":
          this.modulo = "COBROS";
          this.subModulo = "ADM_RECAUDACION";
          break;
      }

      
    },
    viewCredenciales(record) {
      this.visibleModalCredenciales = true;
      this.personaId = record.personaId;
      this.subTitle = `Las credenciales que se generaran para ${record.nombreCompleto} se enviaran a su correo ${record.correoElectronico}.`;
    },
    generarCredenciales() {
      AdminUsuarios.generarCredenciales(this.personaId)
        .then((response) => {
          this.visibleModalCredenciales = false;
          this.$notification.success(response.data.message);
          this.findPersonas(1);
        })
        .catch((error) => {
          this.$notification.success(error.response.data.message);
        });
    },
    viewVisibleModalRoles(record) {
      this.personaId = record.personaId;

      this.findRolesForTransfer(this.subModulo, this.modulo);

      this.findRolesForTransferByUsuario(
        this.subModulo,
        this.modulo,
        record.usuarioId
      );
      this.visibleModalRoles = true;
    },
    getModuloUsuario() {
      AdminUsuarios.getModuloUsuario()
        .then((response) => {
          this.moduloUsuario = response.data.data;
          
        })
        .catch((error) => {});
    },
    findRolesForTransferByUsuario(subModulo, modulo, usuarioId) {
      AdminUsuarios.findRolesForTransferByUsuario(subModulo, modulo, usuarioId)
        .then((response) => {
          this.privilegiosAsignados = response.data.data;
          this.targetKeys = response.data.data;
        })
        .catch((error) => {});
    },
    findRolesForTransfer(subModulo, modulo) {
      AdminUsuarios.findRolesForTransfer(subModulo, modulo)
        .then((response) => {
          this.mockData = response.data.data;
          this.privilegiosAsignar = response.data.data;
        })
        .catch((error) => {});
    },
    guardarRoles() {
      let datosRoles = {};
      datosRoles.privilegiosKey = this.privilegiosKey;
      datosRoles.personaId = this.personaId;
      AdminUsuarios.savePrivilegio(datosRoles)
        .then((response) => {
          this.visibleModalRoles = false;
          this.$notification.success(response.data.message);
          this.findPersonas(1);
        })
        .catch((error) => {
          this.visibleModalRoles = false;
          this.$notification.error(error.response.data.message);
        });
    },
    findAllEntidad() {
      AdminUsuarios.findAllEntidad()
        .then((response) => {
          this.entidadesList = response.data.data;
        })
        .catch((error) => {
          this.entidadesList = [];
        });
    },
    findAllRecaudadoras() {
      AdminUsuarios.findAllRecaudadoras()
        .then((response) => {
          this.recaudadorasList = response.data.data;
        })
        .catch((error) => {
          this.recaudadorasList = [];
        });
    },
  },
};
</script>
<style scoped>
.a-item-form {
  margin: 0px;
}
.card-head {
  border: 2px solid #08632d;
  border-radius: 8px;
  height: 100%;
  width: 100%;
  color: #08632d;
  font-size: 20px;
}
</style>