<script>
	import { count } from 'console';

	// 🔹 CREAR
	let pais_crear = $state('');
	let year_crear = $state('');
	let charging_point_crear = $state('');
	let ac_slow_crear = $state('');
	let dc_fast_crear = $state('');
	let total_power_kw_crear = $state('');

	// 🔹 EDITAR
	let pais_editar = $state('');
	let year_editar = $state('');
	let charging_point_editar = $state('');
	let ac_slow_editar = $state('');
	let dc_fast_editar = $state('');
	let total_power_kw_editar = $state('');

	// 🔹 BUSQUEDA AVANZADA

	// COUNTRY
	let pais_busqueda = $state('');

	// YEAR
	let year_mode = $state('eq'); // "eq" o "range"
	let year_busqueda = $state('');
	let year_from = $state('');
	let year_to = $state('');

	// CHARGING POINT
	let charging_point_busqueda = $state('');
	let charging_point_mode = $state('eq'); // eq | gt | lt

	// AC SLOW
	let ac_slow_busqueda = $state('');
	let ac_slow_mode = $state('eq');

	// DC FAST
	let dc_fast_busqueda = $state('');
	let dc_fast_mode = $state('eq');

	// TOTAL POWER
	let total_power_kw_busqueda = $state('');
	let total_power_kw_mode = $state('eq');

	// 🔹 GENERAL
	let data = $state([]);
	let mensaje = $state('');

	let API = '/api/v1/global-ev-charging-infrastructures/';

	// GET
	async function getData() {
		const res = await fetch(API);
		data = await res.json();
	}

	async function getData_campos() {
		let url = API;
		let params = [];

		// COUNTRY (exacto)
		if (pais_busqueda) {
			params.push(`country=${pais_busqueda}`);
		}

		// YEAR
		if (year_mode === 'eq' && year_busqueda) {
			params.push(`year=${year_busqueda}`);
		}

		if (year_mode === 'range') {
			if (year_from) params.push(`from=${year_from}`);
			if (year_to) params.push(`to=${year_to}`);
		}

		// NUMÉRICOS
		function addNumeric(field, value, mode) {
			if (!value) return;

			if (mode === 'eq') params.push(`${field}=${value}`);
			if (mode === 'gt') params.push(`${field}_gt=${value}`);
			if (mode === 'lt') params.push(`${field}_lt=${value}`);
		}

		addNumeric('charging_point', charging_point_busqueda, charging_point_mode);
		addNumeric('ac_slow', ac_slow_busqueda, ac_slow_mode);
		addNumeric('dc_fast', dc_fast_busqueda, dc_fast_mode);
		addNumeric('total_power_kw', total_power_kw_busqueda, total_power_kw_mode);

		if (params.length > 0) {
			url += '?' + params.join('&');
		}

		const res = await fetch(url);
		data = await res.json();
	}

	// LOAD INITIAL DATA
	async function LoadData() {
		const res = await fetch(API + 'loadInitialData');
		if (res.status === 201) {
			mensaje = 'Datos cargados correctamente';
		} else if (res.status === 409) {
			mensaje = 'Los datos ya habían sido cargados previamente';
		} else {
			mensaje = 'Error inesperado';
		}
	}

	// DELETE ALL
	async function borrarColeccion() {
		await fetch(API, { method: 'DELETE' });
		mensaje = 'Datos borrados';
		await getData();
	}

	// DELETE ONE
	async function borrarElemento(pais, year) {
		await fetch(API + `${pais}/${year}`, { method: 'DELETE' });
		mensaje = 'Elemento borrado';
		await getData();
	}

	// POST
	async function crearElemento() {
		const res = await fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				country: pais_crear,
				year: Number(year_crear),
				charging_point: Number(charging_point_crear),
				ac_slow: Number(ac_slow_crear),
				dc_fast: Number(dc_fast_crear),
				total_power_kw: Number(total_power_kw_crear)
			})
		});

		if (res.status === 201) {
			mensaje = 'Elemento creado correctamente';
			await getData();
		} else if (res.status === 400) {
			mensaje = 'Datos inválidos. Revisa que todos los campos estén completos y sean correctos';
		} else if (res.status === 409) {
			mensaje = `Ya existe un registro para ${pais_crear} en el año ${year_crear}`;
		} else {
			mensaje = 'Error inesperado al crear el elemento';
		}
		await getData();
	}

	// PUT
	async function actualizarElemento() {
		const res = await fetch(API + `${pais_editar}/${year_editar}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				country: pais_editar,
				year: Number(year_editar),
				charging_point: Number(charging_point_editar),
				ac_slow: Number(ac_slow_editar),
				dc_fast: Number(dc_fast_editar),
				total_power_kw: Number(total_power_kw_editar)
			})
		});

		if (res.status === 200) {
			mensaje = 'Elemento actualizado';
			await getData();
		} else {
			mensaje = 'Error al actualizar';
		}
	}

	// CARGAR DATOS EN FORM EDITAR
	function cargarFormulario(dato) {
		pais_editar = dato.country;
		year_editar = dato.year;
		charging_point_editar = dato.charging_point;
		ac_slow_editar = dato.ac_slow;
		dc_fast_editar = dato.dc_fast;
		total_power_kw_editar = dato.total_power_kw;
	}
</script>

<button style="border-radius: 10px; background-color: aquamarine;" onclick={LoadData}
	>Cargar Datos</button
>
<br />
<br />
<button style="border-radius: 10px; background-color: cornflowerblue;" onclick={getData}
	>Obtener datos</button
>
<table style="border-collapse: collapse; width: 100%;">
	<thead>
		<tr style="border: 1px solid black;padding: 8px;text-align: center;">
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Pais</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Año</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Puntos de carga</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Corriente Alterna Lenta</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Corriente Continua Rápida</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Total de Kilovátios (kW)</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Acción</th
			>
		</tr>
	</thead>
	<tbody>
		{#each data as dato (dato.country + dato.year)}
			<tr>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.country}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.year}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					>{dato.charging_point}</td
				>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.ac_slow}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.dc_fast}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					>{dato.total_power_kw}</td
				>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					><button
						style="border-radius: 10px; background-color: cornflowerblue;"
						onclick={() => cargarFormulario(dato)}>Editar</button
					>
					<button
						style="border-radius: 10px; background-color: cornflowerblue;"
						onclick={() => borrarElemento(dato.country, dato.year)}>Borrar fila</button
					></td
				>
			</tr>
		{/each}
	</tbody>
</table>
<button style="border-radius: 10px; background-color: red;" onclick={borrarColeccion}
	>Borrar datos</button
>
<br />
<br />

Crear elemento
<form onsubmit={() => crearElemento()}>
	<input
		style="border-radius: 10px;"
		type="text"
		placeholder="País"
		bind:value={pais_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Año"
		bind:value={year_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Charging Points"
		bind:value={charging_point_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="AC Slow"
		bind:value={ac_slow_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="DC Fast"
		bind:value={dc_fast_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Total Power kW"
		bind:value={total_power_kw_crear}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Crear</button>
</form>

<h3>Editar elemento</h3>

<form onsubmit={actualizarElemento}>
	<input
		style="border-radius: 10px;"
		type="text"
		placeholder="País"
		bind:value={pais_editar}
		readonly
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Año"
		bind:value={year_editar}
		readonly
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Charging Points"
		bind:value={charging_point_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="AC Slow"
		bind:value={ac_slow_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="DC Fast"
		bind:value={dc_fast_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Total Power kW"
		bind:value={total_power_kw_editar}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Actualizar</button>
</form>

Busqueda avanzada
<form
	onsubmit={getData_campos}
	style="display: flex; flex-direction: column; gap: 10px; max-width: 500px;"
>
	<!-- COUNTRY -->
	<input
		style="border-radius: 10px; padding: 5px;"
		type="text"
		placeholder="País"
		bind:value={pais_busqueda}
	/>

	<!-- YEAR -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={year_mode} style="border-radius: 10px;">
			<option value="eq">Exacto</option>
			<option value="range">Rango</option>
		</select>

		{#if year_mode === 'eq'}
			<input
				type="number"
				placeholder="Año"
				bind:value={year_busqueda}
				style="border-radius: 10px; padding: 5px;"
			/>
		{/if}

		{#if year_mode === 'range'}
			<input
				type="number"
				placeholder="From"
				bind:value={year_from}
				style="border-radius: 10px; padding: 5px;"
			/>
			<input
				type="number"
				placeholder="To"
				bind:value={year_to}
				style="border-radius: 10px; padding: 5px;"
			/>
		{/if}
	</div>

	<!-- FUNCIÓN PARA CAMPOS NUMÉRICOS -->
	<!-- CHARGING POINT -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={charging_point_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="Charging Points"
			bind:value={charging_point_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- AC SLOW -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={ac_slow_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="AC Slow"
			bind:value={ac_slow_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- DC FAST -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={dc_fast_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="DC Fast"
			bind:value={dc_fast_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- TOTAL POWER -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={total_power_kw_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="Total Power kW"
			bind:value={total_power_kw_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- BOTÓN -->
	<button
		type="submit"
		style="border-radius: 10px; background-color: green; color: white; padding: 8px;"
	>
		Buscar
	</button>
</form>
<p>Estado de la operación:</p>
{mensaje}
