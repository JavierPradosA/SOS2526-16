// index-IMM.js

// 1. Inicializar el array con los datos extraídos de la imagen
const datos = [
    { region: 'Australia', category: 'Historical', parameter: 'EV stock share', mode: 'Cars', powertrain: 'EV', year: 2011, unit: 'Percent', value: 0.000039253245, economic_impact: 0 },
    { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Vans', powertrain: 'EV', year: 2021, unit: 'Percent', value: 0.3, economic_impact: 0 },
    { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Buses', powertrain: 'BEV', year: 2022, unit: 'Vehicles', value: 550, economic_impact: 154.9 },
    { region: 'USA', category: 'Projection-STEPS', parameter: 'EV charging points', mode: 'EV', powertrain: 'Publicly available fast', year: 2021, unit: 'Charging Points', value: 22000, economic_impact: 358.64 },
    { region: 'Netherlands', category: 'Historical', parameter: 'EV stock', mode: 'Trucks', powertrain: 'PHEV', year: 2020, unit: 'Vehicles', value: 41, economic_impact: 6.71 },
    { region: 'Finland', category: 'Historical', parameter: 'EV stock share', mode: 'Trucks', powertrain: 'EV', year: 2023, unit: 'Percent', value: 0.119, economic_impact: 0 },
    { region: 'Seychelles', category: 'Historical', parameter: 'EV sales', mode: 'Cars', powertrain: 'BEV', year: 2020, unit: 'Vehicles', value: 26, economic_impact: 1.07 },
    { region: 'Germany', category: 'Historical', parameter: 'EV stock', mode: 'Vans', powertrain: 'BEV', year: 2021, unit: 'Vehicles', value: 41000, economic_impact: 2340.04 },
    { region: 'Finland', category: 'Historical', parameter: 'EV sales', mode: 'Cars', powertrain: 'PHEV', year: 2013, unit: 'Vehicles', value: 170, economic_impact: 6.1 },
    { region: 'Finland', category: 'Historical', parameter: 'EV sales', mode: 'Buses', powertrain: 'BEV', year: 2016, unit: 'Vehicles', value: 13, economic_impact: 3.66 }
];

// 2. Definir la región objetivo
const regionObjetivo = 'Finland';

// 3. Algoritmo usando iteradores (filter, map, reduce)
// Primero, filtramos las filas correspondientes a la región objetivo
const datosFiltrados = datos.filter(fila => fila.region === regionObjetivo);

if (datosFiltrados.length > 0) {
    // Usamos map para aislar los valores de 'economic_impact' en un nuevo array
    const impactos = datosFiltrados.map(fila => fila.economic_impact);

    // Usamos reduce para sumar todos esos valores
    const sumaTotal = impactos.reduce((acumulador, valorActual) => acumulador + valorActual, 0);

    // Calculamos la media aritmética
    const mediaImpacto = sumaTotal / impactos.length;

    // 4. Mostrar el resultado por consola
    console.log(`\n=== Resultados del Cálculo ===`);
    console.log(`Región analizada: ${regionObjetivo}`);
    console.log(`Registros procesados: ${datosFiltrados.length}`);
    console.log(`Media de 'economic_impact': ${mediaImpacto.toFixed(3)}\n`);
} else {
    console.log(`No se encontraron registros para la región: ${regionObjetivo}`);
}