<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import Highcharts from 'highcharts';

    let container: HTMLElement;

    onMount(async () => {
        if (!browser) return;

        try {
            // 1. CARGA DE MÓDULOS
            const [tm, hm] = await Promise.all([
                import('highcharts/modules/treemap'),
                import('highcharts/modules/heatmap')
            ]);
            const initTreemap = tm.default || tm;
            const initHeatmap = hm.default || hm;
            if (typeof initTreemap === 'function') initTreemap(Highcharts);
            if (typeof initHeatmap === 'function') initHeatmap(Highcharts);

            // 2. CARGA DE DATOS
            await fetch('/api/v1/global-ev-stock-volumes/loadInitialData');
            const res = await fetch('/api/v1/global-ev-stock-volumes');
            
            if (res.ok) {
                const stockData = await res.json();

                // 3. MAPEO DE TODOS LOS CAMPOS DE TU API
                const chartData = stockData.map((d: any) => ({
                    name: d.region_country,
                    value: d.ev_stock,                      // Campo 1: ev_stock
                    colorValue: d.oil_world_displacement,   // Campo 2: oil_world_displacement
                    year: d.year,                           // Campo 3: year
                    macro: d.macro_region_stock || d.macroregion_stock, // Campo 4: macro_region_stock
                    world: d.worldwide_stock,                // Campo 5: worldwide_stock
                    oil: d.oil_world_displacement           // Campo 6: oil_world_displacement
                }));

                // 4. CONFIGURACIÓN DEL GRÁFICO
                // @ts-ignore
                Highcharts.chart(container, {
                    colorAxis: {
                        stops: [
                            [0, '#C9FFBF'], 
                            [0.5, '#56ab2f'], 
                            [1, '#004e92']    
                        ],
                        title: { text: 'Impacto Ambiental (Oil Displacement)' }
                    },

                    legend: {
                        enabled: true,
                        title: { text: 'Escala de Ahorro de Petróleo (pts)' },
                        symbolWidth: 500
                    },

                    title: { text: 'Análisis Integral de Stock de Vehículos Eléctricos' },

                    // --- TOOLTIP CON TODOS LOS CAMPOS ---
                    tooltip: {
                        useHTML: true,
                        headerFormat: '<table style="width:200px">',
                        pointFormat: '<tr><th colspan="2" style="font-size:14px; border-bottom:1px solid #ccc">{point.name} ({point.year})</th></tr>' +
                            '<tr><td><b>EV Stock:</b></td><td style="text-align:right">{point.value}</td></tr>' +
                            '<tr><td><b>Macro Region Stock:</b></td><td style="text-align:right">{point.macro}</td></tr>' +
                            '<tr><td><b>Worldwide Stock:</b></td><td style="text-align:right">{point.world}</td></tr>' +
                            '<tr><td><b>Oil Displacement:</b></td><td style="text-align:right"><b>{point.oil} pts</b></td></tr>',
                        footerFormat: '</table>',
                        followPointer: true
                    },

                    series: [{
                        type: 'treemap',
                        layoutAlgorithm: 'squarified',
                        colorKey: 'colorValue', 
                        dataLabels: {
                            enabled: true,
                            // Mostramos país, año y stock macro en el cuadro
                            format: '{point.name}<br>({point.year})<br>Global: {point.world}',
                            style: { fontSize: '12px', textOutline: 'none', color: 'white' }
                        },
                        data: chartData
                    }]
                } as any);
            }
        } catch (err) {
            console.error("Error en Treemap:", err);
        }
    });
</script>

<div bind:this={container}></div>

<style>
	div {
		width: 100%;
		height: 750px;
		margin: 0 auto;
        padding: 10px;
        background-color: white;
	}
</style>