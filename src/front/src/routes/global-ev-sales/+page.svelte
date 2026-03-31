<svelte:head>
	<title>global-ev-sales</title>
</svelte:head>
<script>
	// VARIABLES PARA CREAR
	let region_crear = $state('');
	let category_crear = $state('');
	let parameter_crear = $state('');
	let mode_crear = $state('');
	let powertrain_crear = $state('');
	let year_crear = $state('');
	let unit_crear = $state('');
	let value_crear = $state('');
	let economic_impact_crear = $state('');

	// VARIABLES PARA BÚSQUEDA AVANZADA
	let search_region = $state('');
	let search_category = $state('');
	let search_parameter = $state('');
	let search_mode = $state('');
	let search_powertrain = $state('');
	let search_unit = $state('');

	let search_year_mode = $state('eq');
	let search_year = $state('');
	let search_from = $state('');
	let search_to = $state('');

	let search_value_mode = $state('eq');
	let search_value = $state('');

	let search_economic_impact_mode = $state('eq');
	let search_economic_impact = $state('');

	// GENERAL
	let data = $state([]);
	let mensaje = $state('');
	let tipoMensaje = $state('info');

	let API = '/api/v1/global-ev-sales/';

	function mostrarMensaje(texto, tipo) {
		mensaje = texto;
		tipoMensaje = tipo;
		setTimeout(() => { mensaje = ''; }, 5000);
	}

	// GET CON BÚSQUEDA INCLUIDA
	async function getData() {
		let params = [];

		if (search_region) params.push(`region=${search_region}`);
		if (search_category) params.push(`category=${search_category}`);
		if (search_parameter) params.push(`parameter=${search_parameter}`);
		if (search_mode) params.push(`mode=${search_mode}`);
		if (search_powertrain) params.push(`powertrain=${search_powertrain}`);
		if (search_unit) params.push(`unit=${search_unit}`);

		if (search_year_mode === 'eq' && search_year) params.push(`year=${search_year}`);
		if (search_year_mode === 'range') {
			if (search_from) params.push(`from=${search_from}`);
			if (search_to) params.push(`to=${search_to}`);
		}

		function addNumeric(field, val, mode) {
			if (!val) return;
			if (mode === 'eq') params.push(`${field}=${val}`);
			if (mode === 'gt') params.push(`${field}_gt=${val}`);
			if (mode === 'lt') params.push(`${field}_lt=${val}`);
		}

		addNumeric('value', search_value, search_value_mode);
		addNumeric('economic_impact', search_economic_impact, search_economic_impact_mode);

		let url = API;
		if (params.length > 0) {
			url += '?' + params.join('&');
		}

		const res = await fetch(url);
		if (res.ok) {
			data = await res.json();
		} else {
			mostrarMensaje('Error al obtener los datos de búsqueda.', 'error');
		}
	}

	function limpiarBusqueda() {
		search_region = ''; search_category = ''; search_parameter = ''; search_mode = '';
		search_powertrain = ''; search_unit = ''; search_year = ''; search_from = ''; search_to = '';
		search_value = ''; search_economic_impact = '';
		getData();
	}

	// CARGAR DATOS INICIALES
	async function LoadData() {
		const res = await fetch(API + 'loadInitialData');
		if (res.status === 201) mostrarMensaje('Datos base cargados correctamente.', 'exito');
		else if (res.status === 409) mostrarMensaje('La base de datos ya contiene información.', 'error');
		else mostrarMensaje('Error inesperado al cargar los datos.', 'error');
		await getData();
	}

	// BORRAR TODO
	async function borrarColeccion() {
		if(confirm("¿Estás seguro de que quieres borrar TODOS los registros? Esta acción es irreversible.")){
			await fetch(API, { method: 'DELETE' });
			mostrarMensaje('Todos los datos han sido eliminados.', 'exito');
			await getData();
		}
	}

	// BORRAR UNO
	async function borrarElemento(region, year) {
		const res = await fetch(API + `${region}/${year}`, { method: 'DELETE' });
		if (res.status === 200) mostrarMensaje(`El registro de ${region} en ${year} ha sido eliminado.`, 'exito');
		else mostrarMensaje(`No pudimos encontrar el registro de ${region} para eliminarlo.`, 'error');
		await getData();
	}

	// CREAR (POST)
	async function crearElemento() {
		const res = await fetch(API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region: region_crear,
				category: category_crear,
				parameter: parameter_crear,
				mode: mode_crear,
				powertrain: powertrain_crear,
				year: Number(year_crear),
				unit: unit_crear,
				value: Number(value_crear),
				economic_impact: Number(economic_impact_crear)
			})
		});

		if (res.status === 201) {
			mostrarMensaje('¡Nuevo registro añadido con éxito!', 'exito');
			region_crear = ''; category_crear = ''; parameter_crear = ''; mode_crear = '';
			powertrain_crear = ''; year_crear = ''; unit_crear = ''; value_crear = ''; economic_impact_crear = '';
		} else if (res.status === 400) {
			mostrarMensaje('Por favor, rellena todos los campos con datos válidos.', 'error');
		} else if (res.status === 409) {
			mostrarMensaje(`Atención: Ya existe un registro de ${region_crear} en el año ${year_crear}. Usa el botón de editar en la tabla si quieres cambiarlo.`, 'error');
		} else {
			mostrarMensaje('Fallo de conexión al intentar añadir el registro.', 'error');
		}
		await getData();
	}

	$effect(() => {
		getData();
	});
</script>

{#if mensaje}
	<div style="padding: 15px; margin-bottom: 20px; border-radius: 5px; color: white; background-color: {tipoMensaje === 'error' ? '#ff4444' : (tipoMensaje === 'exito' ? '#00C851' : '#33b5e5')};">
		<strong>Aviso:</strong> {mensaje}
	</div>
{/if}

<div style="margin-bottom: 20px;">
    <button data-testid="cargar datos" style="padding: 10px; background-color: #33b5e5; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick={LoadData}>Cargar Datos Iniciales</button>
    <button style="padding: 10px; background-color: #ffbb33; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick={getData}>Refrescar Tabla</button>
    <button data-testid="borrar datos" style="padding: 10px; background-color: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer; float: right;" onclick={borrarColeccion}>Borrar Todos los Datos</button>
</div>

<div style="background-color: #e9ecef; padding: 20px; border-radius: 5px; border: 1px solid #ddd; margin-bottom: 20px;">
	<h3 style="margin-top: 0;">Búsqueda Avanzada</h3>
	<form onsubmit={(e) => { e.preventDefault(); getData(); }} style="display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end;">
		<div style="display: flex; flex-direction: column;">
			<label style="font-size: 12px; font-weight: bold;">Región</label>
			<input type="text" placeholder="Ej. Spain" bind:value={search_region} style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; width: 120px;" />
		</div>
		<div style="display: flex; flex-direction: column; background-color: #fff; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
			<label style="font-size: 12px; font-weight: bold;">Año</label>
			<div style="display: flex; gap: 5px;">
				<select bind:value={search_year_mode} style="padding: 5px; border-radius: 4px;">
					<option value="eq">Exacto</option>
					<option value="range">Rango</option>
				</select>
				{#if search_year_mode === 'eq'}
					<input type="number" placeholder="Ej. 2021" bind:value={search_year} style="padding: 5px; border-radius: 4px; border: 1px solid #ccc; width: 80px;" />
				{:else}
					<input type="number" placeholder="Desde" bind:value={search_from} style="padding: 5px; border-radius: 4px; border: 1px solid #ccc; width: 70px;" />
					<input type="number" placeholder="Hasta" bind:value={search_to} style="padding: 5px; border-radius: 4px; border: 1px solid #ccc; width: 70px;" />
				{/if}
			</div>
		</div>
		<div style="display: flex; gap: 5px;">
			<button type="submit" style="padding: 10px 15px; background-color: #00C851; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Buscar</button>
			<button type="button" onclick={limpiarBusqueda} style="padding: 10px 15px; background-color: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">Limpiar</button>
		</div>
	</form>
</div>

<table style="border-collapse: collapse; width: 100%; margin-bottom: 30px;">
	<thead>
		<tr style="background-color: #f2f2f2; text-align: left;">
			<th style="border: 1px solid #ddd; padding: 8px;">Región</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Categoría</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Parámetro</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Modo</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Motor</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Año</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Unidad</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Valor</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Impacto Económico</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Acciones</th>
		</tr>
	</thead>
	<tbody>
		{#each data as dato (dato.region + dato.year)}
			<tr data-testid="filas tabla">	
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.region}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.category}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.parameter}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.mode}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.powertrain}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.year}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.unit}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.value}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">{dato.economic_impact}</td>
				<td style="border: 1px solid #ddd; padding: 8px;">
					<a href="/global-ev-sales/{dato.region}/{dato.year}" style="padding: 5px 10px; background-color: #ffbb33; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px; text-decoration: none; font-size: 13px; display: inline-block;">Editar</a>
					<button data-testid="btn-eliminar" style="padding: 5px; background-color: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;" onclick={() => borrarElemento(dato.region, dato.year)}>Eliminar</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #ddd; max-width: 600px;">
	<h3>Añadir Nuevo Registro</h3>
	<form onsubmit={(e) => { e.preventDefault(); crearElemento(); }} style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
		<input type="text" placeholder="Región" bind:value={region_crear} required style="padding: 8px;" />
		<input type="number" placeholder="Año" bind:value={year_crear} required style="padding: 8px;" />
		<input type="text" placeholder="Categoría" bind:value={category_crear} required style="padding: 8px;" />
		<input type="text" placeholder="Parámetro" bind:value={parameter_crear} required style="padding: 8px;" />
		<input type="text" placeholder="Modo" bind:value={mode_crear} required style="padding: 8px;" />
		<input type="text" placeholder="Motor (Powertrain)" bind:value={powertrain_crear} required style="padding: 8px;" />
		<input type="text" placeholder="Unidad" bind:value={unit_crear} required style="padding: 8px;" />
		<input type="number" step="any" placeholder="Valor" bind:value={value_crear} required style="padding: 8px;" />
		<input type="number" step="any" placeholder="Impacto Económico" bind:value={economic_impact_crear} required style="padding: 8px; grid-column: span 2;" />
	<button data-testid="btn-crear" type="submit" style="padding: 10px; background-color: #00C851; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; grid-column: span 2;">Guardar Nuevo</button>
	</form>
</div>