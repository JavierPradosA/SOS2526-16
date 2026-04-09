<template>
  <div style="padding:20px">

    <h2>global-ev-charging-infrastructures</h2>

    <!-- BOTONES -->
    <button @click="LoadData">Cargar Datos</button>
    <button @click="recuperarDatos">Recuperar datos iniciales</button>

    <!-- TABLA -->
    <table border="1" style="width:100%">
      <thead>
        <tr>
          <th>Pais</th>
          <th>Año</th>
          <th>Puntos</th>
          <th>AC</th>
          <th>DC</th>
          <th>kW</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="dato in data" :key="dato.country + dato.year">
          <td>{{ dato.country }}</td>
          <td>{{ dato.year }}</td>
          <td>{{ dato.charging_point }}</td>
          <td>{{ dato.ac_slow }}</td>
          <td>{{ dato.dc_fast }}</td>
          <td>{{ dato.total_power_kw }}</td>

          <td>
            <button @click="empezarEdicion(dato)">Editar</button>
            <button @click="borrarElemento(dato.country, dato.year)">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button @click="borrarColeccion">Borrar datos</button>

    <!-- CREAR -->
    <h3>Crear elemento</h3>
    <form @submit.prevent="crearElemento">
      <input v-model="pais_crear" placeholder="País" />
      <input v-model="year_crear" type="number" placeholder="Año" />
      <input v-model="charging_point_crear" type="number" placeholder="Charging" />
      <input v-model="ac_slow_crear" type="number" placeholder="AC" />
      <input v-model="dc_fast_crear" type="number" placeholder="DC" />
      <input v-model="total_power_kw_crear" type="number" placeholder="kW" />

      <button type="submit">Crear</button>
    </form>

    <!-- BUSQUEDA AVANZADA -->
    <h3>Busqueda avanzada</h3>

    <form @submit.prevent="getData_campos">

      <input v-model="pais_busqueda" placeholder="País" />

      <!-- YEAR -->
      <select v-model="year_mode">
        <option value="eq">Exacto</option>
        <option value="range">Rango</option>
      </select>

      <input v-if="year_mode==='eq'" v-model="year_busqueda" type="number" placeholder="Año" />

      <div v-if="year_mode==='range'">
        <input v-model="year_from" type="number" placeholder="From" />
        <input v-model="year_to" type="number" placeholder="To" />
      </div>

      <!-- NUMERICOS -->
      <div>
        <select v-model="charging_point_mode">
          <option value="eq">=</option>
          <option value="gt">></option>
          <option value="lt"><</option>
        </select>
        <input v-model="charging_point_busqueda" type="number" placeholder="Charging" />
      </div>

      <div>
        <select v-model="ac_slow_mode">
          <option value="eq">=</option>
          <option value="gt">></option>
          <option value="lt"><</option>
        </select>
        <input v-model="ac_slow_busqueda" type="number" placeholder="AC" />
      </div>

      <div>
        <select v-model="dc_fast_mode">
          <option value="eq">=</option>
          <option value="gt">></option>
          <option value="lt"><</option>
        </select>
        <input v-model="dc_fast_busqueda" type="number" placeholder="DC" />
      </div>

      <div>
        <select v-model="total_power_kw_mode">
          <option value="eq">=</option>
          <option value="gt">></option>
          <option value="lt"><</option>
        </select>
        <input v-model="total_power_kw_busqueda" type="number" placeholder="kW" />
      </div>

      <button type="submit">Buscar</button>
    </form>

    <!-- EDITAR -->
    <div v-if="editando">
      <h3>Editar</h3>

      <form @submit.prevent="actualizarElemento">
        <input v-model="edit.country" readonly />
        <input v-model="edit.year" readonly />

        <input v-model="edit.charging_point" type="number" />
        <input v-model="edit.ac_slow" type="number" />
        <input v-model="edit.dc_fast" type="number" />
        <input v-model="edit.total_power_kw" type="number" />

        <button type="submit">Actualizar</button>
        <button type="button" @click="editando=false">Cancelar</button>
      </form>
    </div>

    <p>{{ mensaje }}</p>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const API = "/api/v1/global-ev-charging-infrastructures/";

// DATA
const data = ref([]);
const mensaje = ref("");

// CREAR
const pais_crear = ref("");
const year_crear = ref("");
const charging_point_crear = ref("");
const ac_slow_crear = ref("");
const dc_fast_crear = ref("");
const total_power_kw_crear = ref("");

// BUSQUEDA
const pais_busqueda = ref("");

const year_mode = ref("eq");
const year_busqueda = ref("");
const year_from = ref("");
const year_to = ref("");

const charging_point_busqueda = ref("");
const charging_point_mode = ref("eq");

const ac_slow_busqueda = ref("");
const ac_slow_mode = ref("eq");

const dc_fast_busqueda = ref("");
const dc_fast_mode = ref("eq");

const total_power_kw_busqueda = ref("");
const total_power_kw_mode = ref("eq");

// EDIT
const editando = ref(false);
const edit = ref({});

// GET
const getData = async () => {
  const res = await fetch(API);
  data.value = await res.json();
};

onMounted(getData);

// BUSQUEDA
const getData_campos = async () => {
  let url = API;
  let params = [];

  if (pais_busqueda.value) params.push(`country=${pais_busqueda.value}`);

  if (year_mode.value === "eq" && year_busqueda.value) {
    params.push(`year=${year_busqueda.value}`);
  }

  if (year_mode.value === "range") {
    if (year_from.value) params.push(`from=${year_from.value}`);
    if (year_to.value) params.push(`to=${year_to.value}`);
  }

  function addNumeric(field, value, mode) {
    if (!value) return;

    if (mode === "eq") params.push(`${field}=${value}`);
    if (mode === "gt") params.push(`${field}_gt=${value}`);
    if (mode === "lt") params.push(`${field}_lt=${value}`);
  }

  addNumeric("charging_point", charging_point_busqueda.value, charging_point_mode.value);
  addNumeric("ac_slow", ac_slow_busqueda.value, ac_slow_mode.value);
  addNumeric("dc_fast", dc_fast_busqueda.value, dc_fast_mode.value);
  addNumeric("total_power_kw", total_power_kw_busqueda.value, total_power_kw_mode.value);

  if (params.length > 0) url += "?" + params.join("&");

  const res = await fetch(url);
  data.value = await res.json();
};

// LOAD
const LoadData = async () => {
  const res = await fetch(API + "loadInitialData");
  mensaje.value = res.status === 201 ? "Datos cargados" : "Ya cargados";
  getData();
};

const recuperarDatos = async () => {
  await borrarColeccion();
  await LoadData();
};

// DELETE
const borrarColeccion = async () => {
  await fetch(API, { method: "DELETE" });
  getData();
};

const borrarElemento = async (pais, year) => {
  await fetch(API + `${pais}/${year}`, { method: "DELETE" });
  getData();
};

// POST
const crearElemento = async () => {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: pais_crear.value,
      year: Number(year_crear.value),
      charging_point: Number(charging_point_crear.value),
      ac_slow: Number(ac_slow_crear.value),
      dc_fast: Number(dc_fast_crear.value),
      total_power_kw: Number(total_power_kw_crear.value)
    })
  });

  mensaje.value = res.status === 201 ? "Creado" : "Error";
  getData();
};

// EDIT
const empezarEdicion = (dato) => {
  editando.value = true;
  edit.value = { ...dato };
};

// PUT
const actualizarElemento = async () => {
  const res = await fetch(API + `${edit.value.country}/${edit.value.year}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...edit.value,
      year: Number(edit.value.year),
      charging_point: Number(edit.value.charging_point),
      ac_slow: Number(edit.value.ac_slow),
      dc_fast: Number(edit.value.dc_fast),
      total_power_kw: Number(edit.value.total_power_kw)
    })
  });

  if (res.status === 200) {
    mensaje.value = "Actualizado";
    editando.value = false;
    getData();
  }
};
</script>