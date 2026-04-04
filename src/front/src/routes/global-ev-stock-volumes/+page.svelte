<svelte:head><title>Global EV Stock Volumes</title></svelte:head>
<script>
	import { onMount } from "svelte";
// 🔹 CREAR
	let pais_crear = $state('');
	let year_crear = $state('');
	let ev_stock_crear = $state('');
	let macroregion_stock_crear = $state('');
	let worldwide_stock_crear = $state('');
	let oil_world_displacement_crear = $state('');

//Búsqueda avanzada
	// REGION_COUNTRY
	let pais_busqueda = $state(''); 

	// YEAR
	let year_mode = $state('eq'); // "eq" o "range"
	let year_busqueda = $state('');
	let year_from = $state('');
	let year_to = $state('');

	// EV_STOCK
	let ev_stock_busqueda = $state('');
	let ev_stock_mode = $state('eq'); // eq | gt | lt

	// MACROREGION_STOCK
	let macroregion_stock_busqueda = $state('');
	let macroregion_stock_mode = $state('eq');

	// WORLDWIDE_STOCK
	let worldwide_stock_busqueda = $state('');
	let worldwide_stock_mode = $state('eq');

	// OIL_WORLD_DISPLACEMENT
	let oil_world_displacement_busqueda = $state('');
	let oil_world_displacement_mode = $state('eq');


// 🔹 GENERAL
	let data = $state([]);
	let mensajeEstado = $state('');

	let URL_API = '/api/v1/global-ev-stock-volumes/';

	// GET Colección
	async function getData() {
		const res = await fetch(URL_API);
		data = await res.json();
	}

	//GET AVANZADO

	async function getData_parametro() {
		let url = URL_API;
		let params = [];

		// COUNTRY (exacto)
		if (pais_busqueda) {
			params.push(`region_country=${pais_busqueda}`);
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

		addNumeric('ev_stock', ev_stock_busqueda, ev_stock_mode);
		addNumeric('macroregion_stock', macroregion_stock_busqueda, macroregion_stock_mode);
		addNumeric('worldwide_stock', worldwide_stock_busqueda, worldwide_stock_mode);
		addNumeric('oil_world_displacement', oil_world_displacement_busqueda, oil_world_displacement_mode);

		if (params.length > 0) {
			url += '?' + params.join('&');
		}

		const res = await fetch(url);
		data = await res.json();
	}

	// LOAD INITIAL DATA
	async function LoadData() {
		const res = await fetch(URL_API + 'loadInitialData');
		if (res.status === 201) {
			mensajeEstado = 'Datos cargados correctamente';
		} else if (res.status === 409) {
			mensajeEstado = 'Los datos ya están cargados';
		} else {
			mensajeEstado = 'Error';
		}
	}

	// DELETE colección
	async function borrarColeccion() {
		await fetch(URL_API, { method: 'DELETE' });
		mensajeEstado = 'Datos borrados';
		await getData();
	}

	// DELETE elemento
	async function borrarElemento(region_country, year) {
		await fetch(URL_API + `${region_country}/${year}`, { method: 'DELETE' });
		mensajeEstado = 'Elemento borrado';
		await getData();
	}

	// POST
	async function crearElemento() {
		const res = await fetch(URL_API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region_country: pais_crear,
				year: Number(year_crear),
				ev_stock: Number(ev_stock_crear),
				macroregion_stock: Number(macroregion_stock_crear),
				worldwide_stock: Number(worldwide_stock_crear),
				oil_world_displacement: Number( oil_world_displacement_crear)
			})
		});

		if (res.status === 201) {
			mensajeEstado = 'Elemento creado correctamente';
			await getData();
		} else if (res.status === 400) {
			mensajeEstado = 'Datos inválidos. Revisa que todos los campos estén completos';
		} else if (res.status === 409) {
			mensajeEstado = `Ya existe un registro para ${pais_crear} en el año ${year_crear}`;
		} else {
			mensajeEstado = 'Error inesperado al crear el elemento';
		}
		await getData();
	}

	onMount(async() => {
       await getData();
    });

</script>

<button data-testid="cargar datos" style="border-radius: 10px; background-color: aquamarine;" onclick={LoadData}>Cargar Datos</button>
<button data-testid="obtener registros"style="border-radius: 10px; background-color: cornflowerblue;" onclick={getData}>Obtener registros</button>

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
				>Disponibilidad en el año</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Disponibilidad en la macroregion</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Disponibilidad global</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Ahorro global en combustible</th
			>
			<th
				style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;"
				>Acción</th
			>
		</tr>
	</thead>
	<tbody>
		{#each data as dato (dato.region_country + dato.year)}
			<tr data-testid="filas tabla" >
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.region_country}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.year}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					>{dato.ev_stock}</td
				>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.macroregion_stock}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.worldwide_stock}</td>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					>{dato.oil_world_displacement}</td
				>
				<td style="border: 1px solid black;padding: 8px;text-align: center;"
					><button style="border-radius: 10px; background-color: cornflowerblue;"><a href={`/global-ev-stock-volumes/${dato.region_country}/${dato.year}`}>Editar</a></button>
					<button style="border-radius: 10px; background-color: cornflowerblue;" onclick={() => borrarElemento(dato.region_country, dato.year)}>Borrar registro</button></td
				>
			</tr>
		{/each}
	</tbody>
</table>

<button data-testid ="borrar datos" style="border-radius: 10px; background-color: red;" onclick={borrarColeccion}>Borrar datos</button>

<h2>Crear registro </h2>
<form onsubmit={() => crearElemento()}>
	<input
		style="border-radius: 10px;"
		type="text"
		placeholder="País crear"
		bind:value={pais_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Año crear"
		bind:value={year_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Ev_stock crear"
		bind:value={ev_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Macroregion_stock crear"
		bind:value={macroregion_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Worldwide_stock crear"
		bind:value={worldwide_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Oil_world_displacement crear"
		bind:value={oil_world_displacement_crear}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Crear</button>
</form>

<h2>Búsqueda avanzada</h2>

<form onsubmit={getData_parametro}
	style="display: flex; flex-direction: column; gap: 10px; max-width: 500px;"
>
	<!-- REGION_COUNTRY -->
	<input
		style="border-radius: 10px; padding: 5px;"
		type="text"
		placeholder="País búsqueda"
		bind:value={pais_busqueda}
	/>

	<!-- YEAR -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={year_mode} style="border-radius: 10px;">
			<option value="eq">VALOR EXACTO</option>
			<option value="range">Rango</option>
		</select>

		{#if year_mode === 'eq'}
			<input
				type="number"
				placeholder="Año búsqueda"
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

	<!-- EV_STOCK -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={ev_stock_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="EV_stock búsqueda"
			bind:value={ev_stock_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- MACROREGION_STOCK -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={macroregion_stock_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="Macroregion_stock búsqueda"
			bind:value={macroregion_stock_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- Worldwide stock -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={worldwide_stock_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="Worldwide_stock búsqueda"
			bind:value={worldwide_stock_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- Oil_world_displacement -->
	<div style="display: flex; gap: 5px;">
		<select bind:value={oil_world_displacement_mode} style="border-radius: 10px;">
			<option value="eq">=</option>
			<option value="gt">mayor que</option>
			<option value="lt">menor que</option>
		</select>

		<input
			type="number"
			placeholder="Oil_world_displacement búsqueda"
			bind:value={oil_world_displacement_busqueda}
			style="border-radius: 10px; padding: 5px;"
		/>
	</div>

	<!-- BOTÓN -->
	<button type="submit" style="border-radius: 10px; background-color: green; color: white; padding: 8px;"
	>Buscar
	</button>
</form>



<p>Estado de la operación:</p>
{mensajeEstado}