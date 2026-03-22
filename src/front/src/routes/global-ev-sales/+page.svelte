<script>
	// 🔹 VARIABLES PARA CREAR
	let region_crear = $state('');
	let category_crear = $state('');
	let parameter_crear = $state('');
	let mode_crear = $state('');
	let powertrain_crear = $state('');
	let year_crear = $state('');
	let unit_crear = $state('');
	let value_crear = $state('');
	let economic_impact_crear = $state('');

	// 🔹 VARIABLES PARA EDITAR
	let region_editar = $state('');
	let category_editar = $state('');
	let parameter_editar = $state('');
	let mode_editar = $state('');
	let powertrain_editar = $state('');
	let year_editar = $state('');
	let unit_editar = $state('');
	let value_editar = $state('');
	let economic_impact_editar = $state('');

	// 🔹 GENERAL
	let data = $state([]);
	let mensaje = $state('');
	let tipoMensaje = $state('info');

	// De momento apuntamos a v1 hasta que hagamos la copia a v2 en el backend
	let API = '/api/v1/global-ev-sales/';

	// Función para mostrar mensajes amigables (desaparecen a los 5 seg)
	function mostrarMensaje(texto, tipo) {
		mensaje = texto;
		tipoMensaje = tipo;
		setTimeout(() => { mensaje = ''; }, 5000);
	}

	// GET
	async function getData() {
		const res = await fetch(API);
		data = await res.json();
	}

	// CARGAR DATOS INICIALES
	async function LoadData() {
		const res = await fetch(API + 'loadInitialData');
		if (res.status === 201) {
			mostrarMensaje('Datos base cargados correctamente.', 'exito');
		} else if (res.status === 409) {
			mostrarMensaje('La base de datos ya contiene información.', 'error');
		} else {
			mostrarMensaje('Error inesperado al cargar los datos.', 'error');
		}
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
		if (res.status === 200) {
			mostrarMensaje(`El registro de ${region} en ${year} ha sido eliminado.`, 'exito');
		} else {
			mostrarMensaje(`No pudimos encontrar el registro de ${region} para eliminarlo.`, 'error');
		}
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
			mostrarMensaje(`Atención: Ya existe un registro de ${region_crear} en el año ${year_crear}. Usa el formulario de edición si quieres cambiarlo.`, 'error');
		} else {
			mostrarMensaje('Fallo de conexión al intentar añadir el registro.', 'error');
		}
		await getData();
	}

	// CARGAR DATOS EN EL FORMULARIO DE EDICIÓN
	function cargarFormulario(dato) {
		region_editar = dato.region;
		category_editar = dato.category;
		parameter_editar = dato.parameter;
		mode_editar = dato.mode;
		powertrain_editar = dato.powertrain;
		year_editar = dato.year;
		unit_editar = dato.unit;
		value_editar = dato.value;
		economic_impact_editar = dato.economic_impact;
		mostrarMensaje(`Editando registro de ${dato.region} (${dato.year}). Baja hasta el formulario de edición.`, 'info');
	}

	// ACTUALIZAR (PUT)
	async function actualizarElemento() {
		const res = await fetch(API + `${region_editar}/${year_editar}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region: region_editar,
				category: category_editar,
				parameter: parameter_editar,
				mode: mode_editar,
				powertrain: powertrain_editar,
				year: Number(year_editar),
				unit: unit_editar,
				value: Number(value_editar),
				economic_impact: Number(economic_impact_editar)
			})
		});

		if (res.status === 200) {
			mostrarMensaje('¡Registro actualizado correctamente!', 'exito');
			// Limpiamos el formulario tras editar
			region_editar = ''; year_editar = ''; category_editar = ''; parameter_editar = '';
			mode_editar = ''; powertrain_editar = ''; unit_editar = ''; value_editar = ''; economic_impact_editar = '';
		} else if (res.status === 400) {
			mostrarMensaje('Revisa los datos introducidos, hay algún formato incorrecto.', 'error');
		} else {
			mostrarMensaje('No se pudo actualizar el registro.', 'error');
		}
		await getData();
	}

	// Cargar datos nada más abrir la página
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
	<button style="padding: 10px; background-color: #33b5e5; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick={LoadData}>Cargar Datos Iniciales</button>
	<button style="padding: 10px; background-color: #ffbb33; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick={getData}>Refrescar Tabla</button>
	<button style="padding: 10px; background-color: #ff4444; color: white; border: none; border-radius: 5px; cursor: pointer; float: right;" onclick={borrarColeccion}>Borrar Todos los Datos</button>
</div>

<table style="border-collapse: collapse; width: 100%; margin-bottom: 30px;">
	<thead>
		<tr style="background-color: #f2f2f2; text-align: left;">
			<th style="border: 1px solid #ddd; padding: 8px;">Región</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Categoría</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Parámetro</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Modo</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Motor(Powertrain)</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Año</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Unidad</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Valor</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Impacto Económico</th>
			<th style="border: 1px solid #ddd; padding: 8px;">Acciones</th>
		</tr>
	</thead>
	<tbody>
		{#each data as dato (dato.region + dato.year)}
			<tr>
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
					<button style="padding: 5px; background-color: #00C851; color: white; border: none; border-radius: 3px; cursor: pointer; margin-right: 5px;" onclick={() => cargarFormulario(dato)}>Editar</button>
					<button style="padding: 5px; background-color: #ff4444; color: white; border: none; border-radius: 3px; cursor: pointer;" onclick={() => borrarElemento(dato.region, dato.year)}>Eliminar</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div style="display: flex; gap: 20px;">
	<div style="flex: 1; background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #ddd;">
		<h3>Añadir Nuevo Registro</h3>
		<form onsubmit={(e) => { e.preventDefault(); crearElemento(); }} style="display: flex; flex-direction: column; gap: 10px;">
			<input type="text" placeholder="Región" bind:value={region_crear} required style="padding: 8px;" />
			<input type="number" placeholder="Año" bind:value={year_crear} required style="padding: 8px;" />
			<input type="text" placeholder="Categoría" bind:value={category_crear} required style="padding: 8px;" />
			<input type="text" placeholder="Parámetro" bind:value={parameter_crear} required style="padding: 8px;" />
			<input type="text" placeholder="Modo" bind:value={mode_crear} required style="padding: 8px;" />
			<input type="text" placeholder="Motor (Powertrain)" bind:value={powertrain_crear} required style="padding: 8px;" />
			<input type="text" placeholder="Unidad" bind:value={unit_crear} required style="padding: 8px;" />
			<input type="number" step="any" placeholder="Valor" bind:value={value_crear} required style="padding: 8px;" />
			<input type="number" step="any" placeholder="Impacto Económico" bind:value={economic_impact_crear} required style="padding: 8px;" />
			<button type="submit" style="padding: 10px; background-color: #00C851; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Guardar Nuevo</button>
		</form>
	</div>

	<div style="flex: 1; background-color: #e9ecef; padding: 20px; border-radius: 5px; border: 1px solid #ddd;">
		<h3>Actualizar Registro Existente</h3>
		<form onsubmit={(e) => { e.preventDefault(); actualizarElemento(); }} style="display: flex; flex-direction: column; gap: 10px;">
			<input type="text" placeholder="Región (Solo lectura)" bind:value={region_editar} readonly style="padding: 8px; background-color: #ccc;" />
			<input type="number" placeholder="Año (Solo lectura)" bind:value={year_editar} readonly style="padding: 8px; background-color: #ccc;" />
			<input type="text" placeholder="Categoría" bind:value={category_editar} required style="padding: 8px;" />
			<input type="text" placeholder="Parámetro" bind:value={parameter_editar} required style="padding: 8px;" />
			<input type="text" placeholder="Modo" bind:value={mode_editar} required style="padding: 8px;" />
			<input type="text" placeholder="Motor (Powertrain)" bind:value={powertrain_editar} required style="padding: 8px;" />
			<input type="text" placeholder="Unidad" bind:value={unit_editar} required style="padding: 8px;" />
			<input type="number" step="any" placeholder="Valor" bind:value={value_editar} required style="padding: 8px;" />
			<input type="number" step="any" placeholder="Impacto Económico" bind:value={economic_impact_editar} required style="padding: 8px;" />
			<button type="submit" style="padding: 10px; background-color: #ffbb33; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Aplicar Cambios</button>
		</form>
	</div>
</div>