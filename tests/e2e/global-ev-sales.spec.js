// @ts-check
import { test, expect } from "@playwright/test";

const app = "http://localhost:3000";
const rutaFrontend = app + "/global-ev-sales";

// Función de preparación: Limpia y carga exactamente 10 datos antes de cada test
async function setup(page) {
  await page.goto(rutaFrontend);

  // Acepta automáticamente el cuadro de confirmación nativo del navegador al borrar
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  await page.getByTestId("borrar datos").click();
  await page.waitForTimeout(500); 
  await page.getByTestId("cargar datos").click();
  await page.waitForTimeout(500);
}

// --------------------------------------------------
// TESTS DE ENRUTAMIENTO BÁSICO
// --------------------------------------------------

test("El proyecto base tiene título", async ({ page }) => {
  await page.goto(app);
  await expect(page).toHaveTitle(/Global EV Sales/);
});

test("Navegación al frontend desde la página principal", async ({ page }) => {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Ignacio" }).click();
  await expect(page.getByRole('heading', { name: /Global EV Sales/i })).toBeVisible();
});

// --------------------------------------------------
// TESTS DE LA RÚBRICA (FUNCIONALIDADES E2E)
// --------------------------------------------------

test("Listar recursos: Cargar datos iniciales y comprobar que hay 10", async ({ page }) => {
  await setup(page);
  
  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(10);
});

test("Crear recurso: Añadir uno nuevo y comprobar que el total de filas sube a 11", async ({ page }) => {
  await setup(page);

  // Rellenamos el formulario buscando los placeholders exactos
  await page.locator('input[placeholder="Región"]').fill("TestLand");
  await page.locator('input[placeholder="Año"]').fill("2025");
  await page.locator('input[placeholder="Categoría"]').fill("Historical");
  await page.locator('input[placeholder="Parámetro"]').fill("EV sales");
  await page.locator('input[placeholder="Modo"]').fill("Cars");
  await page.locator('input[placeholder="Motor (Powertrain)"]').fill("BEV");
  await page.locator('input[placeholder="Unidad"]').fill("Vehicles");
  await page.locator('input[placeholder="Valor"]').fill("999");
  await page.locator('input[placeholder="Impacto Económico"]').fill("50");

  // Usamos el data-testid que configuramos en el botón
  await page.getByTestId("btn-crear").click();
  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(11); 
});

test("Borrar recurso concreto: Eliminar la primera fila y comprobar que el total baja", async ({ page }) => {
  await setup(page);

  const filasAntes = await page.getByTestId("filas tabla").count();

  // Hacemos clic en el primer botón de eliminar de la tabla
  await page.getByTestId("btn-eliminar").first().click();
  await page.waitForTimeout(1000);

  const filasDespues = await page.getByTestId("filas tabla").count();
  expect(filasDespues).toBe(filasAntes - 1);
});

test("Borrar todos los recursos: La tabla debe quedar vacía", async ({ page }) => {
  await setup(page);

  await page.getByTestId("borrar datos").click();
  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(0);
});

test("Editar recurso: Actualizar desde la vista separada dinámica", async ({ page }) => {
  await setup(page);

  // 1. Navegamos a la vista dinámica
  await page.getByRole("link", { name: "Editar" }).first().click();
  await page.waitForTimeout(1000); 

  // 2. Modificamos el valor usando el ID que le pusimos en la vista nueva
  await page.getByTestId("edit-value").fill("77777");
  await page.getByTestId("btn-actualizar").click();
  await page.waitForTimeout(1000);

  // 3. Volvemos atrás
  await page.getByRole("link", { name: "← Cancelar y volver a la tabla principal" }).click();
  await page.waitForTimeout(1000);

  // 4. Verificamos que la tabla muestra el número actualizado
  await expect(page.getByText("77777").first()).toBeVisible();
});

test("Búsqueda con la API: Filtrar datos avanzados", async ({ page }) => {
  await setup(page);

  // 1. Creamos un dato señuelo altamente específico
  await page.locator('input[placeholder="Región"]').fill("PaisFantasma");
  await page.locator('input[placeholder="Año"]').fill("2025");
  await page.locator('input[placeholder="Categoría"]').fill("Historical");
  await page.locator('input[placeholder="Parámetro"]').fill("EV sales");
  await page.locator('input[placeholder="Modo"]').fill("Cars");
  await page.locator('input[placeholder="Motor (Powertrain)"]').fill("BEV");
  await page.locator('input[placeholder="Unidad"]').fill("Vehicles");
  await page.locator('input[placeholder="Valor"]').fill("1");
  await page.locator('input[placeholder="Impacto Económico"]').fill("1");
  
  await page.getByTestId("btn-crear").click();
  await page.waitForTimeout(1000);

  // 2. Lo buscamos introduciendo su nombre en el cuadro de búsqueda
  await page.locator('input[placeholder="Ej. Spain"]').fill("PaisFantasma");
  await page.getByRole("button", { name: "Buscar" }).click();
  await page.waitForTimeout(1000);

  // 3. Comprobamos que la tabla solo tiene 1 fila y es la correcta
  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(1);
  await expect(page.getByTestId("filas tabla").first()).toContainText("PaisFantasma");
});