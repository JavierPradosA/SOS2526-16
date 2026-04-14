<script>
	import Highcharts from 'highcharts';
	import { onMount } from 'svelte';

	let data_ev_charging_infrastructures = [];
	let data_ev_sales = [];
	let data_ev_stock_volumes = [];

	onMount(async () => {
		//Cargar datos en paraleloç
		  await Promise.all([
            fetch('/api/v1/global-ev-stock-volumes/loadInitialData'),
            fetch('/api/v1/global-ev-sales/loadInitialData'),
            fetch('/api/v1/global-ev-charging-infrastructures/loadInitialData')
        ]);

		const [carga_ev_charging_infrastructures, carga_ev_sales, carga_ev_stock_volumes] =
			await Promise.all([
				fetch('/api/v1/global-ev-charging-infrastructures'),
				fetch('/api/v1/global-ev-sales'),
				fetch('/api/v1/global-ev-stock-volumes')
			]);

		data_ev_charging_infrastructures = await carga_ev_charging_infrastructures.json();
		data_ev_sales = await carga_ev_sales.json();
		data_ev_stock_volumes = await carga_ev_stock_volumes.json();

		const countries = ['finland', 'germany', 'canada'];

		const countries_stocks = countries.map((c) => {
			const item = data_ev_stock_volumes.find((d) => d.region_country.toLowerCase() === c);
			return item ? item.ev_stock : 0;
		});

		const countries_sales = countries.map((c) => {
			const item = data_ev_sales.find((d) => d.region.toLowerCase() === c);
			return item ? item.value : 0; // Ajusta 'sales' al nombre real de su campo
		});

		const countries_infrastructure = countries.map((c) => {
			const item = data_ev_charging_infrastructures.find((d) => d.country === c);
			return item ? item.charging_point : 0; // Ajusta al nombre real
		});

		 // 3. Renderizamos Highcharts
        Highcharts.chart('container', {
                chart: { zooming: { type: 'xy' } },
                title: { text: 'Análisis Integrado de Movilidad Eléctrica Global' },
                subtitle: { text: 'Fuentes: APIs del Grupo SOS2526-16' },
                xAxis: [{
                    categories: countries,
                    crosshair: true
                }],
                yAxis: [{ // Eje para Ventas (Socio A)
                    labels: { format: '{value} uds', style: { color: Highcharts.getOptions().colors[2] } },
                    title: { text: 'Ventas (Socio A)', style: { color: Highcharts.getOptions().colors[2] } },
                    opposite: true
                }, { // Eje para Stock (Tú)
                    gridLineWidth: 0,
                    title: { text: 'Volumen Stock (Tú)', style: { color: Highcharts.getOptions().colors[0] } },
                    labels: { format: '{value} uds', style: { color: Highcharts.getOptions().colors[0] } }
                }, { // Eje para Infraestructura (Socio B)
                    gridLineWidth: 0,
                    title: { text: 'Puntos de Carga (Socio B)', style: { color: Highcharts.getOptions().colors[1] } },
                    labels: { format: '{value} pts', style: { color: Highcharts.getOptions().colors[1] } },
                    opposite: true
                }],
                tooltip: { shared: true },
                legend: {
                    layout: 'vertical', align: 'left', x: 80, verticalAlign: 'top', y: 55,
                    floating: true, backgroundColor: 'rgba(255,255,255,0.25)'
                },
                series: [{
                    name: 'Volumen Stock (Tú)',
                    type: 'column', // Cumple requisito: No es tipo "line"
                    yAxis: 1,
                    data: countries_stocks,
                    tooltip: { valueSuffix: ' unidades' }
                }, {
                    name: 'Puntos de Carga (Socio B)',
                    type: 'spline',
                    yAxis: 2,
                    data: countries_infrastructure,
                    dashStyle: 'shortdot',
                    tooltip: { valueSuffix: ' puntos' }
                }, {
                    name: 'Ventas (Socio A)',
                    type: 'spline',
                    data: countries_sales,
                    tooltip: { valueSuffix: ' ventas' }
                }]
            });
        }
    );

	/*
	chart: {
        zooming: {
            type: 'xy'
        }
    },
	*/

	/*
	onMount(async () => {

		Highcharts.chart('container', {
			title: {
				text: 'Evolución Vehículos Eléctricos',
				align: 'left'
			},

			subtitle: {
				text: 'Infraestructura vs Ventas vs Producción (datos de prueba)',
				align: 'left'
			},

			yAxis: {
				title: {
					text: 'Cantidad'
				}
			},

			xAxis: {
				categories: ['2018', '2019', '2020', '2021', '2022'],
				accessibility: {
					rangeDescription: 'Range: 2018 to 2022'
				}
			},

			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle'
			},

			plotOptions: {
				series: {
					label: {
						connectorAllowed: false
					}
				}
			},

			series: [
				{
					name: 'Puntos de carga',
					data: [5000, 8000, 12000, 15000, 20000]
				},
				{
					name: 'Ventas EV',
					data: [10000, 18000, 30000, 45000, 60000]
				},
				{
					name: 'Producción EV',
					data: [12000, 20000, 35000, 50000, 70000]
				}
			],

			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500
						},
						chartOptions: {
							legend: {
								layout: 'horizontal',
								align: 'center',
								verticalAlign: 'bottom'
							}
						}
					}
				]
			}
		});
	});

	*/
</script>

<div id="container" style="width: 100%; height: 400px; margin: 0 auto"></div>
