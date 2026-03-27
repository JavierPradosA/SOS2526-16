<script>
    import {page} from '$app/state'
    import { onMount } from 'svelte';

    let URL_API = '/api/v1/global-ev-stock-volumes/';
    let region_country = page.params.region_country
    let year = page.params.year
	let ev_stock_editar = $state('');
	let macroregion_stock_editar = $state('');
	let worldwide_stock_editar = $state('');
	let oil_world_displacement_editar = $state('');

    let mensajeEstado = $state('');

    async function obtener_registro() {
        const res = await fetch(URL_API + `${region_country}/${year}`);
        if (res.status === 200) {
            const data = await res.json();
            ev_stock_editar = data.ev_stock;
            macroregion_stock_editar = data.macroregion_stock;
            worldwide_stock_editar = data.worldwide_stock;
            oil_world_displacement_editar = data.oil_world_displacement;
    }
}



// PUT
	async function actualizarElemento() {
		const res = await fetch(URL_API + `${region_country}/${year}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				region_country: region_country ,
				year: Number(year),
				ev_stock: Number(ev_stock_editar),
				macroregion_stock: Number(macroregion_stock_editar),
				worldwide_stock: Number(worldwide_stock_editar),
				oil_world_displacement: Number(oil_world_displacement_editar)
			})
		});

		if (res.status === 200) {
			mensajeEstado = 'Elemento actualizado';
		} else {
			mensajeEstado = 'Error al actualizar';
		}
	}
    onMount(() => {
        obtener_registro();
    });


</script>
<h2>Editar elemento</h2>

<form onsubmit={actualizarElemento}>
	<input
		style="border-radius: 10px;"
		type="text"
		placeholder="País"
		bind:value={region_country}
		readonly
	/>

	<input
		style="border-radius: 10px;"
		type="number"
		placeholder="Año"
		bind:value={year}
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
<button style="border-radius: 10px; background-color: cornflowerblue;"><a href={`/global-ev-stock-volumes/`}>Volver a página principal</a></button>