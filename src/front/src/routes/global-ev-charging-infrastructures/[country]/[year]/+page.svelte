<script>
    import {page} from '$app/state'
    import { onMount } from 'svelte';

    let API = '/api/v1/global-ev-charging-infrastructures/';
    let country = page.params.country
    let year = page.params.year
	let charging_point_editar = $state('');
	let ac_slow_editar = $state('');
	let dc_fast_editar = $state('');
	let total_power_kw_editar = $state('');

    let mensaje = $state('');

    async function obtener_Dato() {
        const res = await fetch(API + `${country}/${year}`);
        if (res.status === 200) {
            const data = await res.json();
            charging_point_editar = data.charging_point;
            ac_slow_editar = data.ac_slow;
            dc_fast_editar = data.dc_fast;
            total_power_kw_editar = data.total_power_kw;
    }
}

    // PUT
	async function actualizarElemento() {
		const res = await fetch(API + `${country}/${year}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				country: country,
				year: Number(year),
				charging_point: Number(charging_point_editar),
				ac_slow: Number(ac_slow_editar),
				dc_fast: Number(dc_fast_editar),
				total_power_kw: Number(total_power_kw_editar)
			})
		});

		if (res.status === 200) {
			mensaje = 'Elemento actualizado';
		} else {
			mensaje = 'Error al actualizar';
		}
	}
    
    onMount(() => {
        obtener_Dato();
    });

    
</script>

<h3>Editar elemento</h3>

<form onsubmit={actualizarElemento}>
	<input
		style="border-radius: 10px;"
		type="text"
		placeholder="País"
		bind:value={country}
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

{mensaje}
