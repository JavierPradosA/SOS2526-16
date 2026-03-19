<script>
	// @ts-ignore
    //Alamacenamiento de datos
    let pais = "";
	let year = "";
	let data = $state([]);
    let mensaje = $state("");
    let mensaje2 = $state("");
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
    async function borrarColeccion() {
        //
		await fetch('http://localhost:3000/api/v1/global-ev-charging-infrastructures/', {
			method: 'DELETE'
		});
        mensaje2 = "Datos Borrados";
	
	}
    async function borrarElemento(pais, year) {
	try {
		await fetch(`http://localhost:3000/api/v1/global-ev-charging-infrastructures/${pais}/${year}`, {
			method: 'DELETE'
		});

		mensaje2 = "Datos Borrados";

	} catch (err) {
		console.error("Error borrando:", err);
	}
}
</script>

<h3>This Page is for Javi's front</h3>
<br>
<button onclick={LoadData}>Cargar Datos</button>
{mensaje}
<br>
<br>
<button onclick={getData}>Obtener datos</button>
<ul>
{#each data as dato (dato.country + dato.year)}
    <li>{JSON.stringify(dato)}</li>
{/each}
</ul>
<button onclick={borrarColeccion}>Borrar datos</button>
{mensaje2}

<form onsubmit={() => borrarElemento(pais, year)}>
	<input
		type="text"
		placeholder="País"
		bind:value={pais}
		required
	/>

	<input
		type="number"
		placeholder="Año"
		bind:value={year}
		required
	/>

	<button type="submit">Borrar</button>
</form>
