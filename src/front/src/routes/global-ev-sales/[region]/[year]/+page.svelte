<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let API = '/api/v1/global-ev-sales/';
	
	let region = page.params.region;
	let year = page.params.year;

	// Variables para los campos editables
	let category_editar = $state('');
	let parameter_editar = $state('');
	let mode_editar = $state('');
	let powertrain_editar = $state('');
	let unit_editar = $state('');
	let value_editar = $state('');
	let economic_impact_editar = $state('');

	let mensaje = $state('');
	let tipoMensaje = $state('info');

	function mostrarMensaje(texto, tipo) {
		mensaje = texto;
		tipoMensaje = tipo;
		setTimeout(() => { mensaje = ''; }, 5000);
	}

	// GET individual al cargar la página
	async function obtener_Dato() {
		const res = await fetch(API + `${region}/${year}`);
		if (res.status === 200) {
			const data = await res.json();
			category_editar = data.category;
			parameter_editar = data.parameter;
			mode_editar = data.mode;
			powertrain_editar = data.powertrain;
			unit_editar = data.unit;
			value_editar = data.value;
			economic_impact_editar = data.economic_impact;
		} else {
			mostrarMensaje('No se ha encontrado el registro original.', 'error');
		}
	}

	// PUT
	async function actualizarElemento(e) {
		e.preventDefault(); // Evita que la página se recargue al enviar el formulario
		const res = await fetch(API + `${region}/${year}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region: region, // Lo enviamos tal cual, es la clave
				year: Number(year),
				category: category_editar,
				parameter: parameter_editar,
				mode: mode_editar,
				powertrain: powertrain_editar,
				unit: unit_editar,
				value: Number(value_editar),
				economic_impact: Number(economic_impact_editar)
			})
		});

		if (res.status === 200) {
			mostrarMensaje('¡Registro actualizado correctamente!', 'exito');
		} else if (res.status === 400) {
			mostrarMensaje('Revisa los datos, hay algún formato incorrecto.', 'error');
		} else {
			mostrarMensaje('Error al intentar guardar los cambios.', 'error');
		}
	}

	// Cargar el dato en cuanto el componente se monta en la pantalla
	onMount(() => {
		obtener_Dato();
	});
</script>

<div style="max-width: 600px; margin: 40px auto; padding: 20px; background-color: #f9f9f9; border-radius: 5px; border: 1px solid #ddd;">
	<h2 style="margin-top: 0;">Editando registro: {region} ({year})</h2>
	
	{#if mensaje}
		<div style="padding: 10px; margin-bottom: 15px; color: white; border-radius: 5px; background-color: {tipoMensaje === 'error' ? '#ff4444' : '#00C851'};">
			{mensaje}
		</div>
	{/if}

	<form onsubmit={actualizarElemento} style="display: flex; flex-direction: column; gap: 15px;">
		<div style="display: flex; gap: 10px;">
			<input type="text" value={region} readonly style="padding: 8px; background-color: #e9ecef; flex: 1; border: 1px solid #ccc; color: #666;" />
			<input type="text" value={year} readonly style="padding: 8px; background-color: #e9ecef; flex: 1; border: 1px solid #ccc; color: #666;" />
		</div>
		
		<input type="text" placeholder="Categoría" bind:value={category_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input type="text" placeholder="Parámetro" bind:value={parameter_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input type="text" placeholder="Modo" bind:value={mode_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input type="text" placeholder="Motor (Powertrain)" bind:value={powertrain_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input type="text" placeholder="Unidad" bind:value={unit_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input data-testid="edit-value" type="number" step="any" placeholder="Valor" bind:value={value_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
		<input type="number" step="any" placeholder="Impacto Económico" bind:value={economic_impact_editar} required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />

		<button data-testid="btn-actualizar" type="submit" style="padding: 10px; background-color: #ffbb33; color: white; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; font-size: 16px;">
			Aplicar Cambios
		</button>
		
		<a href="/global-ev-sales" style="display: block; text-align: center; margin-top: 10px; color: #33b5e5; text-decoration: none;">← Cancelar y volver a la tabla principal</a>
	</form>
</div>