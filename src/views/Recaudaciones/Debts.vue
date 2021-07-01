<template>
  <div>
    <a-card style="width: 100%">
      <div
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
            <h2>
              <b style="color: #21618c"
                ><a-icon type="arrow-left" @click="$router.back()" />
                {{ title }}</b
              >
            </h2></a-col
          >
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            <a-row type="flex" justify="space-between">
              <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
                <a-select
                  v-model="campoBusquedaCliente"
                  placeholder="Campo de Búsqueda"
                  size="small"
                  style="width: 100%"
                  v-if="!displayCliente"
                  @change="resetSearch(campoBusquedaCliente)"
                >
                  <a-select-option
                    v-for="(item, i) in lstCamposBusqueda"
                    :key="i"
                    :value="item"
                  >
                    {{ item }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16" align="right">
                <a-input-search
                  v-model="search"
                  :placeholder="placeholderBC"
                  @search="buscar"
                  enter-button=" Buscar "
                  :maxLength="15"
                  size="small"
                  v-if="!displayCliente"
                />
                <a-button
                  type="primary"
                  @click="reload"
                  size="small"
                  v-if="displayCliente"
                >
                  Nueva Búsqueda
                </a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <!--
      {{displayCliente}}<br/>
      {{lstClientes}}<br/>
      selectedRowKeys = {{selectedRowKeys}}<br/>
      sumTotal =  {{sumTotal}}<br/>
      efectivo = {{efectivo}}<br/>
      search = {{search}}-->
      <br />
      <div v-if="!displayCliente">
        <!--Lista de Clientes-->
        <a-table
          :columns="columns"
          :data-source="lstClientes"
          rowKey="codigoCliente"
          :locale="{
            emptyText: 'No hay data',
          }"
          :scroll="{ x: 350 }"
          :pagination="pagination"
          :loading="loading"
          
        >
          <a slot="name" slot-scope="text">{{ text }}</a>
          <span slot="COBRAR" slot-scope="text, record">
            <a-button
              type="danger"
              block
              size="small"
              @click="mostrarDeudas(record)"
              >Ver Deudas<a-icon type="export"/></a-button>
          </span>
        </a-table>
      </div>

      <!-- Lista de Deudas-->
      <a-row
        v-if="displayCliente"
        style="padding: 0px; margin: 0px; border: 0px"
      >
        <div id="components-form-demo-advanced-search" style="width: 100%;">
          <a-form
            class="ant-advanced-search-form"
            style="padding: 7px; margin: 0px; border: 0px;"
          >
          <!--
            <b style="color: #21618c">DATOS DEL CLIENTE</b>-->
            <a-row style="padding: 0px; margin: 0px; border: 0px;">
              <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="6"
                :xl="6"
                style="padding: 0px; margin: 0px; border: 0px;"
              >
                <a-form-item
                  label="CI/NIT :"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px;"
                >
                  <a-input v-model="clienteDto.nroDocumento" :maxLength="12" :disabled="editCi">
                    <a-icon slot="addonAfter" type="edit"  @click="editCi=!editCi" />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="11"
                :xl="11"
                style="padding: 0px; margin: 0px; border: 0px"
              >
                <a-form-item
                  label="Nombre Cliente:"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px; border: 0px"
                >
                  <a-input v-model="clienteDto.nombreCliente" :maxLength="200" :disabled="editNombre">
                    <a-icon slot="addonAfter" type="edit" @click="editNombre=!editNombre" />
                  </a-input>
                </a-form-item>
              </a-col>
               <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="7"
                :xl="7"
                style="padding: 0px; margin: 0px; border: 0px"
              >
                <a-form-item
                  label="Código Cliente:"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px;"
                >
                  <a-input v-model="clienteDto.codigoCliente" :maxLength="12" :disabled="editcCdigoCliente">
                    <a-icon slot="addonAfter" />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-row>
      <p />

      <a-row :gutter="16" v-if="displayCliente">
        <a-col :xs="22" :sm="24" :md="24" :lg="17" :xl="17">
          <div>
            <div>
              <a-row> </a-row>
            </div>
            <!--TABLA DE DEUDAS-->
            <!--
            {{selectedRowKeys}}
            {{clienteDto.servicioDeudaDtoList}}-->
            <a-table
              :columns="columnsA"
              :data-source="lstServiciosDeudas"
              bordered
              :row-selection="rowSelectionS"
              :pagination="false"
              :scroll="{ x: 600 }"
              :loading="loadingServ"
            >
              <template slot="key" slot-scope="text, record">
                <div class="grupo-tabla">
                  <a-row>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 4 }"
                      style="padding-left: 5px; padding-right: 3px"
                    >
                      <b>Tipo Servicio:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 5 }"
                      style="padding-right: 3px"
                    >
                      {{ record.tipoServicio }}
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 3 }"
                    >
                      <b>Servicio:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 6 }"
                    >
                      {{ record.servicio }}
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 3 }"
                      :lg="{ span: 3 }"
                    >
                      <b>Período:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 5 }"
                      :lg="{ span: 3 }"
                    >
                      {{ record.periodo }}
                    </a-col>
                  </a-row>
                </div>

                <br />
                <table style="tabla">
                  <tr>
                    <th align="rigth" style="width: 10%">Cantidad</th>
                    <th style="width: 50%">Concepto</th>
                    <th class="th-amount">Monto Unit. (Bs)</th>
                    <th class="th-amount">Monto (Bs)</th>
                    <th style="width: 5px"></th>
                  </tr>
                  <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                    <td align="center">{{ deuda.cantidad }}</td>
                    <td>{{ deuda.concepto }}</td>
                    <td align="right">
                      <money
                        v-model="deuda.montoUnitario"
                        v-bind="money"
                        :disabled="true"
                        class="ant-input"
                        size="small"
                      ></money>
                    </td>

                    <!-- Mostrando Botones de edicion y resteo-->
                    <td align="right" v-if="deuda.editable && record.editando">
                      <!-- OJO Sin Botones de edicion y resteo, habilitando los campos con prepago y subtotal=0>
                <td align="right" v-if="deuda.editable>  -->
                      <money
                        v-model="deuda.subTotal"
                        v-bind="money"
                        @keydown.native="
                          $event.key === '-' ? $event.preventDefault() : null
                        "
                        @keyup.native="sumSubTotal(record, deuda)"
                        class="input-amount"
                      ></money>
                    </td>
                    <td align="right" v-else>
                      <money
                        v-model="deuda.subTotal"
                        v-bind="money"
                        :disabled="true"
                        class="ant-input"
                        max="4"
                      ></money>
                    </td>
                    <td>
                      <span v-if="deuda.subTotal == 0" style="color: red"
                        >*</span
                      >
                    </td>
                  </tr>
                  <tr class="subgrupo-tabla">
                    <td></td>
                    <td>
                      <div align="right" v-if="record.editable" style="background-color:#96C5CB;">
                        <a-button
                          type="default"
                          @click="record.editando = true"
                          size="small"
                        >
                          Editar
                        </a-button>
                        <a-button
                          type="default"
                          @click="resetear(record)"
                          size="small"
                        >
                          Resetear
                        </a-button>
                      </div>
                    </td>
                    <td align="right">
                      <div style="background-color: #96C5CB;padding-r">
                        <b>Sub Total (Bs)</b>
                      </div>
                    </td>
                    <td align="right">
                      <money
                        v-model="record.subTotal"
                        v-bind="money"
                        :disabled="true"
                        class="ant-input"
                      ></money>
                    </td>
                  </tr>
                </table>
              </template>
            </a-table>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
          <div class="tablaTit">
            TOTAL DEUDA A COBRAR
          </div>
        <div class="tabla">
           <div class="grupo-tabla">
              <a-row>
                <a-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15" align="right">
                  <b>Total (Bs)</b>
                </a-col>
                <a-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
                  <money
                    v-model="sumTotal"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
              <a-row>
                <a-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15" align="right">
                  <b>Efectivo (Bs)</b>
                </a-col>
                <a-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
                  <money
                    v-model="efectivo"
                    v-bind="money"
                    class="input-amount"
                    :disabled="!selectedRowKeys.length > 0"
                    @keydown.native="
                      $event.key === '-' ? $event.preventDefault() : null
                    "
                  ></money>
                </a-col>
              </a-row>
              <a-row>
               <a-col :xs="24" :sm="24" :md="15" :lg="15" :xl="15" align="right">
                  <b>Cambio (Bs)</b>
                </a-col>
                <a-col :xs="24" :sm="24" :md="9" :lg="9" :xl="9">
                  <money
                    v-model="cambio"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
            </div>
          <p />
          <a-button
            type="danger"
            :disabled="!selectedRowKeys.length > 0"
            @click="confirmCobro"
            block
            style="height: 50px"
          >
            <span :style="{ fontSize: '14px' }">
              <b>
                <a-icon type="dollar" :style="{ fontSize: '22px' }" /> REALIZAR
                COBRO
              </b>
            </span>
          </a-button>
        </div>
        </a-col>
      </a-row>

      <!--Confirmación Modal de Cobro-->
      <a-modal
        v-model="displayModal"
        title="Confirmación Cobro Deudas"
        ok-text="Cobrar"
        cancel-text="Cancelar"
        @ok="cobrarDeudas"
        width="80%"
        :centered="true"
        :closable="false"
        :maskClosable="false"
        :okButtonProps="{
          style: { color: 'white', background: '#339966', border: '0px' },
        }"
        :cancelButtonProps="{
          style: { color: 'white', background: 'red', border: '0px' },
        }"
      >
        <p>
          <a-icon
            type="question-circle"
            theme="twoTone"
            two-tone-color="#FAAD14"
            :style="{ fontSize: '2em' }"
          />
          ¿Está seguro de cobrar las deudas seleccionadas? (Comprobante
          {{ entidadObj.comprobanteEnUno ? "agrupado" : "Por Transacción" }})
        </p>
         <a-row
        v-if="displayCliente"
        style="padding: 0px; margin: 0px; border: 0px"
      >
        <div id="components-form-demo-advanced-search" style="width: 100%;">
          <a-form
            class="ant-advanced-search-form"
            style="padding: 7px; margin: 0px; border: 0px;"
          >
          <!--
            <b style="color: #21618c">DATOS DEL CLIENTE</b>-->
            <a-row style="padding: 0px; margin: 0px; border: 0px;">
              <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="6"
                :xl="6"
                style="padding: 0px; margin: 0px; border: 0px;"
              >
                <a-form-item
                  label="CI/NIT :"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px;"
                >
                  <a-input v-model="clienteDto.nroDocumento" :maxLength="12" :disabled="true">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="11"
                :xl="11"
                style="padding: 0px; margin: 0px; border: 0px"
              >
                <a-form-item
                  label="Nombre Cliente:"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px; border: 0px"
                >
                  <a-input v-model="clienteDto.nombreCliente" :maxLength="200" :disabled="true">
                  </a-input>
                </a-form-item>
              </a-col>
               <a-col
                :xs="22"
                :sm="24"
                :md="24"
                :lg="7"
                :xl="7"
                style="padding: 0px; margin: 0px; border: 0px"
              >
                <a-form-item
                  label="Código Cliente:"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="padding: 0px; margin: 0px;"
                >
                  <a-input v-model="clienteDto.codigoCliente" :maxLength="12" :disabled="editcCdigoCliente">
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-row>
      <p />

      <a-row :gutter="16" v-if="displayCliente">
        <a-col :xs="22" :sm="24" :md="24" :lg="17" :xl="17">
          <div>
            <div>
              <a-row> </a-row>
            </div>
            <!--TABLA DE DEUDAS-->
            <!--
            {{selectedRowKeys}}
            {{clienteDto.servicioDeudaDtoList}}-->
            <a-table
              :columns="columnsA"
              :data-source="clienteDto.servicioDeudaDtoList"
              bordered
              :pagination="false"
              :scroll="{ x: 500 }"
              :loading="loadingServ"
              :showHeader="false"
            >
              <template slot="key" slot-scope="text, record">
                <div class="grupo-tabla">
                  <a-row>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 4 }"
                      style="padding-left: 5px; padding-right: 3px"
                    >
                      <b>Tipo Servicio:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 5 }"
                      style="padding-right: 3px"
                    >
                      {{ record.tipoServicio }}
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 3 }"
                    >
                      <b>Servicio:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 6 }"
                      :lg="{ span: 6 }"
                    >
                      {{ record.servicio }}
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 3 }"
                      :lg="{ span: 3 }"
                    >
                      <b>Período:</b>
                    </a-col>
                    <a-col
                      :xs="{ span: 24 }"
                      :sm="{ span: 6 }"
                      :md="{ span: 5 }"
                      :lg="{ span: 3 }"
                    >
                      {{ record.periodo }}
                    </a-col>
                  </a-row>
                </div>

                <br />
                <table style="tabla">
                  <tr>
                    <th align="rigth" style="width: 10%">Cantidad</th>
                    <th style="width: 50%">Concepto</th>
                    <th class="th-amount">Monto Unit. (Bs)</th>
                    <th class="th-amount">Monto (Bs)</th>
                    <th style="width: 5px"></th>
                  </tr>
                  <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                    <td align="center">{{ deuda.cantidad }}</td>
                    <td>{{ deuda.concepto }}</td>
                    <td align="right">
                      <money
                        v-model="deuda.montoUnitario"
                        v-bind="money"
                        :disabled="true"
                        class="ant-input"
                        size="small"
                      ></money>
                    </td>

                    <!-- Mostrando Botones de edicion y resteo-->
                    <td align="right">
                      <!-- OJO Sin Botones de edicion y resteo, habilitando los campos con prepago y subtotal=0>
                <td align="right" v-if="deuda.editable>  -->
                      <money
                        v-model="deuda.subTotal"
                        v-bind="money"
                        class="input-amount"
                        :disabled="true"
                      ></money>
                    </td>
                  </tr>
                  <tr class="subgrupo-tabla">
                    <td></td>
                    <td>
                      
                    </td>
                    <td align="right">
                      <div style="background-color: #ded8da;padding-r">
                        <b>Sub Total (Bs)</b>
                      </div>
                    </td>
                    <td align="right">
                      <money
                        v-model="record.subTotal"
                        v-bind="money"
                        :disabled="true"
                        class="ant-input"
                      ></money>
                    </td>
                  </tr>
                </table>
              </template>
            </a-table>
          </div>
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
        <div class="tabla">
           <div class="grupo-tabla">
              <a-row>
                <a-col span="15" align="right">
                  <b>Total (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="sumTotal"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="15" align="right">
                  <b>Efectivo (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="efectivo"
                    v-bind="money"
                    class="input-amount"
                    :disabled="!selectedRowKeys.length > 0"
                    @keydown.native="
                      $event.key === '-' ? $event.preventDefault() : null
                    "
                  ></money>
                </a-col>
              </a-row>
              <a-row>
                <a-col span="15" align="right">
                  <b>Cambio (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="cambio"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
            </div>
          <p />
          
        </div>
        </a-col>
      </a-row>



        <!--
        <div class="titulo-tabla">
          <a-row>
            <a-col
              :xs="{ span: 24 }"
              :sm="{ span: 10 }"
              :md="{ span: 6 }"
              :lg="{ span: 3 }"
            >
              <b> CI/NIT : </b>
            </a-col>
            <a-col
              :xs="{ span: 24 }"
              :sm="{ span: 14 }"
              :md="{ span: 6 }"
              :lg="{ span: 6 }"
            >
              {{ clienteDto.nroDocumento }}
            </a-col>
            <a-col
              :xs="{ span: 24 }"
              :sm="{ span: 10 }"
              :md="{ span: 6 }"
              :lg="{ span: 5 }"
            >
              <b>Nombre Cliente : </b>
            </a-col>
            <a-col
              :xs="{ span: 24 }"
              :sm="{ span: 14 }"
              :md="{ span: 6 }"
              :lg="{ span: 10 }"
            >
              {{ clienteDto.nombreCliente }}
            </a-col>
          </a-row>
        </div>

        <a-table
          :columns="columnsA"
          :data-source="clienteDto.servicioDeudaDtoList"
          bordered
          :pagination="false"
          :scroll="{ x: 350 }"
          size="small"
        >
          <template slot="key" slot-scope="text, record">
            <div class="grupo-tabla">
              <a-row>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 10 }"
                  :md="{ span: 6 }"
                  :lg="{ span: 3 }"
                >
                  <b>Tipo Servicio :</b>
                </a-col>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 14 }"
                  :md="{ span: 12 }"
                  :lg="{ span: 12 }"
                >
                  {{ record.tipoServicio }}
                </a-col>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 10 }"
                  :md="{ span: 3 }"
                  :lg="{ span: 3 }"
                >
                  <b>Período:</b>
                </a-col>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 14 }"
                  :md="{ span: 3 }"
                  :lg="{ span: 6 }"
                >
                  {{ record.periodo }}
                </a-col>
              </a-row>
              <a-row>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 10 }"
                  :md="{ span: 6 }"
                  :lg="{ span: 3 }"
                >
                  <b>Servicio:</b>
                </a-col>
                <a-col
                  :xs="{ span: 24 }"
                  :sm="{ span: 14 }"
                  :md="{ span: 18 }"
                  :lg="{ span: 21 }"
                >
                  {{ record.servicio }}
                </a-col>
              </a-row>
            </div>
            <br />
            <table style="tabla">
              <tr>
                <th align="rigth" style="width: 10%">Cantidad</th>
                <th style="width: 50%">Concepto</th>
                <th class="th-amount">Monto Unit. (Bs)</th>
                <th class="th-amount">Monto (Bs)</th>
              </tr>
              <tr v-for="(deuda, i) in record.deudaClienteDtos" :key="i">
                <td align="center">{{ deuda.cantidad }}</td>
                <td>{{ deuda.concepto }}</td>
                <td align="right">
                  <money
                    v-model="deuda.montoUnitario"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    size="small"
                  ></money>
                </td>
                <td align="right">
                  <money
                    v-model="deuda.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                    max="4"
                  ></money>
                </td>
              </tr>
              <tr class="subgrupo-tabla">
                <td>
                  <b>{{ record.plantilla }}</b>
                </td>
                <td></td>
                <td align="right"><b>Sub Total (Bs)</b></td>
                <td align="right">
                  <money
                    v-model="record.subTotal"
                    v-bind="money"
                    :disabled="true"
                    class="ant-input"
                  ></money>
                </td>
              </tr>
            </table>
          </template>
          <template slot="footer">
            <div class="grupo-tabla">
              <a-row>
                <a-col span="15" align="right">
                  <b>Total (Bs)</b>
                </a-col>
                <a-col span="9">
                  <money
                    v-model="sumTotal"
                    v-bind="money"
                    class="ant-input"
                    :disabled="true"
                  ></money>
                </a-col>
              </a-row>
            </div>
          </template>
        </a-table>
        -->

      </a-modal>
    </a-card>

    <a-modal
      v-model="visibleModalReporte"
      title="Documento Generado"
      width="900px"
      height="400px"
      :dialog-style="{ top: '20px' }"
      @ok="visibleModalReporte = false"
      @cancel="link = null"
      :closable="true"
    >
      <a-row type="flex" justify="center">
        <a-spin size="large" tip="Cargando Factura...." v-if="viewCargando">
        </a-spin>
        <iframe width="100%" height="400px" :src="this.link" frameborder="0">
        </iframe>
      </a-row>

      <template slot="footer">
        <a-button key="back" @click="closeReporte"> Cerrar </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import PaymentDebts from "../../service/Recaudaciones/PaymentDebts.service";
import Entidades from "../../service/Administraciones/Entidad.service";
import { Money } from "v-money";
import PaymentDebtsService from "../../service/Recaudaciones/PaymentDebts.service";

//TABLA CLIENTES
const columns = [
  {
    title: "Código Cliente",
    dataIndex: "codigoCliente",
    key: "codigoCliente",
    //width: 200,
  },
  { title: "CI/NIT", dataIndex: "nroDocumento", key: "nroDocumento" },
  { title: "Nombre Cliente", dataIndex: "nombreCliente", key: "nombreCliente" },
  {
    title: "Operación",
    key: "COBRAR",
    scopedSlots: { customRender: "COBRAR" },
    //width: 200,
  },
];

//TABLA SERVICIOSDEUDAS
const columnsA = [
  {
    title: "DEUDA DEL CLIENTE",
    dataIndex: "key",
    scopedSlots: { customRender: "key" },
  },
];


export default {
  components: { Money },
  data() {
    return {
      //BÚSQUEDA DE CLIENTE
      search: "",
      form: null,
      lstClientes: [],
      columns,

      //DATOS DE ENTIDAD
      entidadId: null,
      entidadObj: {},
      title: "Deudas Clientes",

      //DATOS DE CLIENTE
      displayCliente: false,
      clienteDto: {},
      formC: null,
      pagination: {
        pageSize: 10,
      },
      loading: false,

      //TABLA SERVICIODEUDAS
      lstServiciosDeudas: [],
      columnsA,
      sumTotal: 0,
      efectivo: 0,
      selectedRowKeys: [],
      loadingServ: false,

      //MONTOS
      money: {
        decimal: ".",
        thousands: ",",
        //prefix: 'Bs ',
        precision: 2,
        masked: false,
        maxlength: 17,
      },

      /**Visualizacion */
      displayEdition: false,
      displayModal: false,
      //REPORTE
      visibleModalReporte: false,
      link: null,
      viewCargando: false,

      /**Campos de Búsqueda */
      lstCamposBusqueda: [],
      campoBusquedaCliente: "CÓDIGO CLIENTE",
      placeholderBC: "Ingrese CÓDIGO CLIENTE",
      editNombre:true,
      editCi:true,
      editcCdigoCliente:true
    };
  },
  created() {
    this.entidadId = this.$route.params.entidadId;
    this.cargarEntidad(this.entidadId);

    this.cargarCamposBusquedasDeudas();
  },
  computed: {
    /* rowSelectionC() {
      return {
        type: "radio",
        onChange: (selectedRowKeys, selectedRows) => {
          this.displayCliente = true;
          this.clienteDto = {
            codigoCliente: selectedRows[0].codigoCliente,
            nroDocumento: selectedRows[0].nroDocumento,
            nombreCliente: selectedRows[0].nombreCliente,
            servicioDeudaDtoList: [],
          };
          this.cargarServicioDeudas();
        },
      };
    },*/
    rowSelectionS() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          /*console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );*/
          this.selectedRowKeys = selectedRowKeys;
        },
        onSelect: (record, selected, selectedRows) => {
          //calcular suma
          this.sumTotal = 0;
          this.sumTotal = selectedRows.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
          //control de cambio
          this.efectivo = selected ? this.efectivo : 0;

          //asignar deudas seleccionadas
          this.clienteDto.servicioDeudaDtoList = selectedRows;
          //console.log(JSON.stringify(this.clienteDto));
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          //calcular total
          this.sumTotal = 0;
          this.sumTotal = selectedRows.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
          //control de cambio
          this.efectivo = selected ? this.efectivo : 0;

          //asignar deudas seleccionadas
          this.clienteDto.servicioDeudaDtoList = selectedRows;
          //console.log(JSON.stringify(this.clienteDto));
        },
      };
    },
    cambio: {
      get: function () {
        let vFormateado =
          this.efectivo > 0 ? -1 * (this.sumTotal - this.efectivo) : 0;
        return Number(vFormateado).toFixed(2);
      },
      set: function () {
        0;
      },
    },
  },
  watch: {
    "clienteDto.servicioDeudaDtoList": {
      handler: function (val, oldVal) {
        this.sumTotal = 0;
        this.sumTotal =
          this.sumTotal +
          val.reduce((tot, current) => {
            return tot + current.subTotal;
          }, 0);
      },
      deep: true,
    },
  },

  methods: {
    
    /********ENTIDADES***********/
    cargarEntidad(entidadId) {
      Entidades.getEntidad(entidadId)
        .then((r) => {
          this.entidadObj = r.data.result;
          this.title = this.entidadObj.nombre + ": Deudas Clientes";
        })
        .catch((error) => {
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },

    /*********************************************** 
    BUSQUEDA DE CLIENTE
    ************************************************/
    cargarClientes(dato) {
      this.loading = true;
      //PaymentDebts.cargarClientes(this.entidadId, dato)
      PaymentDebts.getAllClientesByEntidadIdAndCampos(
        this.entidadId,
        this.campoBusquedaCliente,
        dato
      )
        .then((r) => {
          if (r.status === 204) {
            this.lstClientes = [];
            this.$notification.warning(
              "No existen cliente con parámetro de búsqueda: " + dato + "."
            );
            this.loading = false;
            return;
          }

          this.lstClientes = r.data.result;
          this.loading = false;


          console.log('cargarClientes')
          console.log(JSON.stringify(this.lstClientes));


        })
        .catch((error) => {
          this.lstClientes = [];
          this.loading = false;
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    buscar() {
      if (this.search.length > 0) {
        this.cargarClientes(this.search);
      } else {
        this.lstClientes = [];
      }
      //Restrablecer valores iniciales
      this.displayCliente = false;
      this.inicializar();
    },

    /*********************************************** 
    SERVICIOS DEUDAS
    ************************************************/
    inicializar() {
      this.selectedRowKeys = [];
      this.sumTotal = 0;
      this.efectivo = 0;
    },
    cargarServicioDeudas() {
      this.loadingServ = true;
      PaymentDebts.cargarServicioDeudas(
        this.entidadId,
        this.clienteDto.codigoCliente
      )
        .then((r) => {
          if (r.status === 204) {
            this.$notification.warning(
              "No existe registro de deudas para el cliente seleccionado"
            );
            this.lstServiciosDeudas = [];
            this.loadingServ = false;

            


            return;
          }

          this.lstServiciosDeudas = r.data.result;
          this.loadingServ = false;
          
          
          
          console.log('cargarServicioDeudas');
          console.log(JSON.stringify(this.lstServiciosDeudas));
          //this.$notification.success(r.data.message);
        })
        .catch((error) => {
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
          this.lstServiciosDeudas = [];
          this.loadingServ = false;
        });
    },
    sumSubTotal(record, deuda) {
      //debe ser solo de campos editables
      if (deuda.subTotal < 0 && deuda.editable) {
        deuda.subTotal = 0;
      }
      /*************** */
      //Si la cantidad es diferente de 1
      deuda.montoUnitario = (deuda.subTotal / deuda.cantidad).toFixed(2);
      /******* */
      record.subTotal = record.deudaClienteDtos.reduce(
        (sum, item) => sum + Number(item.subTotal),
        0
      );
      return record.subTotal;
    },
    mostrarDeudas(record) {
      this.displayCliente = true;
      this.clienteDto = {
        codigoCliente: record.codigoCliente,
        nroDocumento: record.nroDocumento,
        nombreCliente: record.nombreCliente,
        servicioDeudaDtoList: [],
      };
      this.cargarServicioDeudas();
    },

    /************************************************/
    //COBROS DEUDAS
    //************************************************/
    
    verificarMontoPrepago(lstServiciosDeudas) {
      for (var i in lstServiciosDeudas) {
        for (var j in lstServiciosDeudas[i].deudaClienteDtos) {
          if (lstServiciosDeudas[i].deudaClienteDtos[j].editable) {
            if (
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == null ||
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == "" ||
              lstServiciosDeudas[i].deudaClienteDtos[j].subTotal == 0
            )
              return false;
            else return true;
          }
        }
      }
      return true;
    },
    confirmCobro() {
      if (
        this.clienteDto.nombreCliente === null ||
        this.clienteDto.nroDocumento === null
      ) {
        this.$notification.warning(
          "Debe especificar obligatoriamente el NOMBRE CLIENTE y CI/NIT."
        );
        this.displayModal = false;
        return;
      }

      if (
        this.clienteDto.nombreCliente.trim() === "" ||
        this.clienteDto.nroDocumento.trim() === ""
      ) {
        this.$notification.warning(
          "Debe especificar obligatoriamente el NOMBRE CLIENTE y NÚMERO DOCUMENTO."
        );
        this.displayModal = false;
        return;
      }

      if (isNaN(this.clienteDto.nroDocumento.trim())) {
        this.$notification.warning("El CI/NIT es solo numérico.");
        this.displayModal = false;
        return;
      }

      if (!this.verificarMontoPrepago(this.clienteDto.servicioDeudaDtoList)) {
        this.$notification.warning(
          "Para el caso de prepagos debe llenar el monto correspondiente, por favor verifique."
        );
        this.displayModal = false;
        return;
      }

      /*
      if(!this.verificarPrelacion(this.selectedRowKeys)) {
        this.$notification.warning(
          "Existe Deudas que deben ser cobradas antes de las seleccionadas."
        );
        this.displayModal = false;
        return;
      }*/

      this.displayModal = true;
    },
    cancelCobro(e) {
      this.$notificarion.warning(
        "Ha cancelado el Cobro, puede proceder a modificar."
      );
    },
    cobrarDeudas(e) {
      this.$Progress.start();

      this.displayModal = false;
      this.visibleModalReporte = true;

      this.clienteDto.montoTotalCobrado = this.sumTotal;
      this.viewCargando = true;

      console.log('cobrarDeudas');
      console.log(JSON.stringify(this.clienteDto));


      PaymentDebts.cobrarDeudas(this.clienteDto, 5) //Debe ser Ctte = 5
        .then((r) => {
          this.viewFileDownload(r);

          //debe actualizar las deudas
          this.cargarServicioDeudas();
          this.inicializar();
          this.$Progress.finish();
        })
        .catch((error) => {
          //Se añade por el reporte implementado
          this.cargarServicioDeudas();
          this.inicializar();
          //
          this.visibleModalReporte = false;
          /*this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );*/
          this.$notification.error(this.ab2str(error.response.data));
          this.$Progress.fail();
        });
    },
    /*******************************************
     *Reporte
     *******************************************/
    viewFileDownload(response) {
      var file = new Blob([response.data], {
        type: "application/pdf",
      });
      this.link = URL.createObjectURL(file);
      this.viewCargando = false;
    },
    closeReporte() {
      this.visibleModalReporte = false;
      this.link = null;
    },

    /*******************************************
     * Otros
     *******************************************/
    ab2str(buf) {
      var binaryString = "",
        bytes = new Uint8Array(buf),
        length = bytes.length;
      for (var i = 0; i < length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
      }
      return binaryString;
    },
    reload() {
      this.lstServiciosDeudas = [];
      this.displayCliente = false;
      this.lstClientes = [];
      this.search = "";
      this.inicializar();
      this.campoBusquedaCliente = "CÓDIGO CLIENTE";
      this.placeholderBC = "Ingrese CÓDIGO CLIENTE";
    },
    resetear(record) {
      record.editando = false;
      record.deudaClienteDtos.forEach((deuda) => {
        if (deuda.editable) {
          deuda.subTotal = 0;
          deuda.montoUnitario = 0;
        }
        this.sumSubTotal(record, deuda);
      });
    },
    verificarPrelacion(selectedRowKeys) {
      let maxRow = Math.max.apply(null, selectedRowKeys);
      if (maxRow != 0) {
        for (let i = maxRow - 1; i >= 0; i--) {
          if (!selectedRowKeys.includes(i)) {
            return false;
          }
        }
        return true;
      } else {
        return true;
      }
    },
    /************************************ */
    //Cargar Campos de búqeuda
    /************************************ */
    cargarCamposBusquedasDeudas() {
      PaymentDebtsService.getCamposBusquedaDeudas()
        .then((r) => {
          if (r.status === 204) {
            this.lstCamposBusqueda = [];
            this.$notification.warning(
              "No se ha encontrado ningun campo de búsqueda de clientes."
            );
            return;
          }
          this.lstCamposBusqueda = r.data.result;
          //this.defaultValue = this.lstCamposBusqueda[0];
        })
        .catch((error) => {
          this.lstCamposBusqueda = [];
          this.$notification.error(
            error.response.data.message,
            error.response.data.code
          );
        });
    },
    resetSearch(valor) {
      this.search = "";
      this.placeholderBC = "Ingrese " + valor;
    },
  },
};
</script>
<style scoped>
.th-amount {
  text-align: right;
}
.ant-table-body {
  overflow-x: auto !important;
}

.input-amount {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: "tnum";
  position: relative;
  display: inline-block;
  width: 100%;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  line-height: 1.5;
  background-color: #fff;
  background-image: none;
  border: 1px solid rgb(237, 239, 247);
  border-radius: 4px;
  transition: all 0.3s;
  height: 24px;
  padding: 1px 7px;
  text-align: right;
}

.ant-input[disabled] {
  color: rgba(0, 0, 0, 0.65);
  background-color: rgb(238, 235, 238);
  text-align: right;
  height: 24px;
  padding: 1px 7px;
}

.titulo-tabla {
  width: 100%;
  background-color: rgb(45, 82, 98);
  color: white;
}
.grupo-tabla {
  width: 100%;
  background-color: rgb(65, 135, 145);
  color: white;
}
.subgrupo-tabla {
  background-color: rgb(150, 197, 203);
  border: 1px;
}
.ant-advanced-search-form {
  padding: 24px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

#components-form-demo-advanced-search .search-result-list {
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
}
.ant-advanced-search-form {
  background: #ecebeb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}
.tabla {
  padding: 16px 16px;
  overflow-wrap: break-word;  
  border: 1px solid #e8e8e8;

}

.tablaTit {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-align: left;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  transition: background 0.3s ease;
  padding: 16px 16px;
  overflow-wrap: break-word;  
  border: 1px solid #e8e8e8;
}

.ant-form-item-label.label {
    color: blue;
}
</style>
