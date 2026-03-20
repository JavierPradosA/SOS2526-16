<script>
	// @ts-ignore
    //Alamacenamiento de datos
    let pais = $state("");
	let year = $state("");
	let charging_point = $state("");
	let ac_slow = $state("");
	let dc_fast = $state("");
	let total_power_kw = $state("");
	let data = $state([]);
	let mensaje = $state("");
    
    //Async pq no sabemos cuando nos va a dar el resultado
	async function getData() {
        //
		const res = await fetch('http://localhost:3000/api/v1/global-ev-charging-infrastructures/', {
			method: 'GET'
		});
		const d = await res.json();
		data = d;
	}
    async function LoadData() {
        //
		await fetch('http://localhost:3000/api/v1/global-ev-charging-infrastructures/loadInitialData', {
			method: 'GET'
		});
        mensaje = "Datos cargados"
	
	}

	//Borrado de colección
    async function borrarColeccion() {
        //
		await fetch('http://localhost:3000/api/v1/global-ev-charging-infrastructures/', {
			method: 'DELETE'
		});
        mensaje = "Datos Borrados";
	
	}

	//Funcion de borrado de un elemento por su id
    async function borrarElemento(pais, year) {
		await fetch(`http://localhost:3000/api/v1/global-ev-charging-infrastructures/${pais}/${year}`, {
			method: 'DELETE'
		});

		mensaje = "Datos Borrados";

	}

	//Funcion para crear un elemento
	async function crearElemento() {
	
		const res = await fetch("http://localhost:3000/api/v1/global-ev-charging-infrastructures", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			//body a recibir
			body: JSON.stringify({
				country: pais,
				year: Number(year),
				charging_point: Number(charging_point),
				ac_slow: Number(ac_slow),
				dc_fast: Number(dc_fast),
				total_power_kw: Number(total_power_kw)
			})
		});

		//Manejo de respuestas
		if (res.status === 201) {
			mensaje = "Elemento creado correctamente";
		} else if (res.status === 400) {
			mensaje = "Datos incompletos o inválidos";
		} else if (res.status === 409) {
			mensaje = "El elemento ya existe";
		} else {
			mensaje = "Error inesperado";
		}

	}
	async function actualizarElemento() {
		const res = await fetch(`http://localhost:3000/api/v1/global-ev-charging-infrastructures/${pais}/${year}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				country: pais,
				year: Number(year),
				charging_point: Number(charging_point),
				ac_slow: Number(ac_slow),
				dc_fast: Number(dc_fast),
				total_power_kw: Number(total_power_kw)
			})
		});

		if (res.status === 200) {
			mensaje = "Elemento actualizado";
			await getData(); // refresca tabla
		} else if (res.status === 400) {
			mensaje = "Datos incorrectos";
		} else if (res.status === 404) {
			mensaje = "Elemento no encontrado";
		} else {
			mensaje = "Error inesperado";
		}
}
function cargarFormulario(dato) {
	pais = dato.country;
	year = dato.year;
	charging_point = dato.charging_point;
	ac_slow = dato.ac_slow;
	dc_fast = dato.dc_fast;
	total_power_kw = dato.total_power_kw;
}
</script>

<h3>This Page is for Javi's front</h3>
<br />
<button style="border-radius: 10px; background-color: aquamarine;" onclick={LoadData}>Cargar Datos</button>
<br />
<br />
<button style="border-radius: 10px; background-color: cornflowerblue;" onclick={getData}>Obtener datos</button>
<table style="border-collapse: collapse; width: 100%;">
	<thead>
		<tr style="border: 1px solid black;padding: 8px;text-align: center;">
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">Pais</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">Año</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">charging_point</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">ac_slow</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">dc_fast</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">total_power_kw</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">Borrar fila</th>
			<th style="border: 1px solid black;padding: 8px;text-align: center; background-color: chocolate;">Editar fila</th>
			
		</tr>
	</thead>
	<tbody>
	{#each data as dato (dato.country + dato.year)}
		<tr>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.country}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.year}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.charging_point}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.ac_slow}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.dc_fast}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;">{dato.total_power_kw}</td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;"><button onclick={() =>borrarElemento(dato.country, dato.year)}>Borrar fila</button></td>
			<td style="border: 1px solid black;padding: 8px;text-align: center;"><button onclick={() => cargarFormulario(dato)}>Editar</button></td>
		</tr>
	{/each}
	</tbody>
</table>
<button style="border-radius: 10px; background-color: red;" onclick={borrarColeccion}>Borrar datos</button>
<br>
<br>
Borrar colección
<form onsubmit={() => borrarElemento(pais, year)}>
	<input style="border-radius: 10px;" type="text" placeholder="País" bind:value={pais} required />

	<input style="border-radius: 10px;" type="number" placeholder="Año" bind:value={year} required />

	<button style="border-radius: 10px; background-color: red;" type="submit">Borrar</button>
</form>
<br>
<br>

Crear elemento
<form onsubmit={() => crearElemento()}>
	<input style="border-radius: 10px;" type="text" placeholder="País" bind:value={pais} required />

	<input style="border-radius: 10px;" type="number" placeholder="Año" bind:value={year} required />

	<input style="border-radius: 10px;" type="number" placeholder="Charging Points" bind:value={charging_point} required />

	<input style="border-radius: 10px;" type="number" placeholder="AC Slow" bind:value={ac_slow} required />

	<input style="border-radius: 10px;" type="number" placeholder="DC Fast" bind:value={dc_fast} required />

	<input style="border-radius: 10px;" type="number" placeholder="Total Power kW" bind:value={total_power_kw} required />

	<button style="border-radius: 10px; background-color: green;" type="submit">Crear</button>
</form>

<h3>Editar elemento</h3>

<form onsubmit={actualizarElemento}>

	<input style="border-radius: 10px;"
		type="text"
		placeholder="País"
		bind:value={pais}
		readonly
	/>

	<input style="border-radius: 10px;"
		type="number"
		placeholder="Año"
		bind:value={year}
		readonly
	/>

	<input style="border-radius: 10px;"
		type="number"
		placeholder="Charging Points"
		bind:value={charging_point}
		required
	/>

	<input style="border-radius: 10px;"
		type="number"
		placeholder="AC Slow"
		bind:value={ac_slow}
		required
	/>

	<input style="border-radius: 10px;"
		type="number"
		placeholder="DC Fast"
		bind:value={dc_fast}
		required
	/>

	<input style="border-radius: 10px;"
		type="number"
		placeholder="Total Power kW"
		bind:value={total_power_kw}
		required
	/>

	<button style="border-radius: 10px; background-color: green;" type="submit">Actualizar</button>

</form>

<p>Estado de la operación:</p>
{mensaje}
