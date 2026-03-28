// @ts-check
import { test, expect } from "@playwright/test";

let app = "http://localhost:3000";

async function setup(page) {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Javier" }).click();

  await page.getByTestId("borrar datos").click();
  await page.getByTestId("cargar datos").click();

  await page.waitForTimeout(1000);
}

//Página principal
test("has title", async ({ page }) => {
  await page.goto(app);
  await expect(page).toHaveTitle(/Global Electrical Vehicles/);
});

//Página personal (título)
test("Navegación a página con título", async ({ page }) => {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Javier" }).click();
  await expect(page).toHaveTitle(/global-ev-charging-infrastuctures/);
});

//Cargar datos iniciales y que sean 10
test("Cargar datos iniciales", async ({ page }) => {
  await setup(page);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(10);
});

test("Editar elemento", async ({ page }) => {
  await setup(page);

  // Ir a editar (primer elemento)
  await page.getByRole("link", { name: "Editar" }).first().click();

  // Esperar a que carguen los datos
  await page.waitForSelector('input[placeholder="Charging Points"]');

  // Cambiar valor
  const input = page.getByPlaceholder("Charging Points");
  await input.fill("99999");

  // Guardar cambios
  await page.getByRole("button", { name: "Actualizar" }).click();

  await page.waitForTimeout(1000);

  // Volver a la lista
  await page.getByRole("link", { name: "Volver" }).click();

  await page.waitForSelector('[data-testid="filas tabla"]');

  // Comprobar que el valor actualizado aparece
  await expect(page.getByText("99999")).toBeVisible();
});

//Test búsqueda avanzada
test("Busqueda avanzada germany devuelve 5 resultados", async ({ page }) => {
  await setup(page);

  await page.getByPlaceholder("País búsqueda").fill("germany");
  await page.getByRole("button", { name: "Buscar" }).click();

  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(5);
});

//Borrar todos los datos
test("Borrar todos los datos", async ({ page }) => {
  await setup(page);

  await page.getByTestId("borrar datos").click();
  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(0);
});

// Recuperar datos iniciales
test("Recuperar datos iniciales", async ({ page }) => {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Javier" }).click();

  await page.getByTestId("recuperar").click();
  await page.waitForSelector('[data-testid="filas tabla"]');

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(10);
});

//Crear elemento
test("Crear elemento y comprobar total de filas", async ({ page }) => {
  await setup(page);

  await page.getByPlaceholder("País crear").fill("testland");
  await page.getByPlaceholder("Año crear").fill("2025");
  await page.getByPlaceholder("Charging Points crear").fill("123");
  await page.getByPlaceholder("AC Slow crear").fill("10");
  await page.getByPlaceholder("DC Fast crear").fill("5");
  await page.getByPlaceholder("Total Power kW crear").fill("500");

  await page.getByRole("button", { name: "Crear" }).click();

  await page.waitForSelector('[data-testid="filas tabla"]');
  await page.waitForTimeout(1000);
  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(11);
});

test("Borrar un elemento", async ({ page }) => {
  await setup(page);

  const filasAntes = await page.getByTestId("filas tabla").count();

  // Borrar primera fila
  await page.getByRole("button", { name: "Borrar fila" }).first().click();

  await page.waitForTimeout(1000);

  const filasDespues = await page.getByTestId("filas tabla").count();

  expect(filasDespues).toBe(filasAntes - 1);
});