<script>
// 🔹 CREAR
	let pais_crear = $state('');
	let year_crear = $state('');
	let ev_stock_crear = $state('');
	let macroregion_stock_crear = $state('');
	let worldwide_stock_crear = $state('');
	let oil_world_displacement_crear = $state('');

	// 🔹 EDITAR
	let pais_editar = $state('');
	let year_editar = $state('');
	let ev_stock_editar = $state('');
	let macroregion_stock_editar = $state('');
	let worldwide_stock_editar = $state('');
	let oil_world_displacement_editar = $state('');


// 🔹 GENERAL
	let data = $state([]);
	let mensajeEstado = $state('');

	let URL_API = '/api/v1/global-ev-stock-volumes/';

	// GET Colección
	async function getData() {
		const res = await fetch(URL_API);
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

	// PUT
	async function actualizarElemento() {
		const res = await fetch(URL_API + `${pais_editar}/${year_editar}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region_country: pais_editar,
				year: Number(year_editar),
				ev_stock: Number(ev_stock_editar),
				macroregion_stock: Number(macroregion_stock_editar),
				worldwide_stock: Number(worldwide_stock_editar),
				oil_world_displacement: Number(oil_world_displacement_editar)
			})
		});

		if (res.status === 200) {
			mensajeEstado = 'Elemento actualizado';
			await getData();
		} else {
			mensajeEstado = 'Error al actualizar';
		}
	}

	// Formulario de edición de registros
	
</script>

<button style="border-radius: 10px; background-color: aquamarine;" onclick={LoadData}>Cargar Datos</button>
<button style="border-radius: 10px; background-color: cornflowerblue;" onclick={getData}>Obtener registros</button>

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
			<tr>
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

<button style="border-radius: 10px; background-color: red;" onclick={borrarColeccion}>Borrar datos</button>

<h2>Crear registro </h2>
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
		placeholder="Ev stock"
		bind:value={ev_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Macroregion_stock"
		bind:value={macroregion_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Worldwide stock"
		bind:value={worldwide_stock_crear}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Oil_world_displacement"
		bind:value={oil_world_displacement_crear}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Crear</button>
</form>


<h2>Editar elemento</h2>

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
		placeholder="Ev stock"
		bind:value={ev_stock_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Macroregion stock"
		bind:value={macroregion_stock_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Worldwide stock"
		bind:value={worldwide_stock_editar}
		required
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Oil world displacement"
		bind:value={oil_world_displacement_editar}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Actualizar</button>
</form>

<p>Estado de la operación:</p>
{mensajeEstado}