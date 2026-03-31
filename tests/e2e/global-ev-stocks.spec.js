import {test, expect} from '@playwright/test';

let app = 'http://localhost:3000';

//Va a la raíz, busca los botones con esos id y borra y carga datos

async function setup(page) {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Adrián" }).click();

  await page.getByTestId("borrar datos").click();
  await page.getByTestId("cargar datos").click();
  await page.getByTestId("obtener registros").click();

  await page.waitForTimeout(1000);
}

//Página principal
test("has title", async ({ page }) => {
  await page.goto(app);
  await expect(page).toHaveTitle(/Global Electrical Vehicles/);
});


test("Página personal", async ({ page }) => {
  await page.goto(app);
  await page.getByRole("link", { name: "Frontend Adrián" }).click();
  await expect(page).toHaveTitle(/Global EV Stock Volumes/);
});

//Contar datos
test("Cargar datos iniciales", async ({ page }) => {
  await setup(page);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(11);
});


//Comprobar edición de registro
test("Editar elemento", async ({ page }) => {
  await setup(page);

  // Ir a editar (primer elemento)
  await page.getByRole("link", { name: "Editar" }).first().click();

  // Esperar a que carguen los datos
  await page.waitForSelector('input[placeholder="Ev stock"]');

  // Cambiar valor
  const input = page.getByPlaceholder("Ev stock");
  await input.fill("99999");

  // Guardar cambios
  await page.getByRole("button", { name: "Actualizar" }).click();

  await page.waitForTimeout(1000);

  // Volver a la lista
  await page.getByRole("link", { name: "Volver a página principal" }).click();

  await page.waitForSelector('[data-testid="filas tabla"]');

  // Comprobar que el valor actualizado aparece
  await expect(page.getByText("99999")).toBeVisible();
});


//Búsqueda avanzada
test("Busqueda avanzada Brazil, 2 registros esperados", async ({ page }) => {
  await setup(page);

  await page.getByPlaceholder("País búsqueda").fill("brazil");
  await page.getByRole("button", { name: "Buscar" }).click();

  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(2);
});


//Crear elemento
test("Crear elemento y comprobar total de filas", async ({ page }) => {
  await setup(page);

  await page.getByPlaceholder("País crear").fill("MundoSOS");
  await page.getByPlaceholder("Año crear").fill("2026");
  await page.getByPlaceholder("EV_stock crear").fill("0");
  await page.getByPlaceholder("Macroregion_stock crear").fill("0");
  await page.getByPlaceholder("Worldwide_stock crear").fill("0");
  await page.getByPlaceholder("Oil_world_displacement crear").fill("0");

  await page.getByRole("button", { name: "Crear" }).click();

  await page.waitForSelector('[data-testid="filas tabla"]');
  await page.waitForTimeout(1000);
  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(12);
});


//Borrar un registro
test("Borrar registro", async ({ page }) => {
  await setup(page);

  const filasAntes = await page.getByTestId("filas tabla").count();

  //Borrar primera fila
  await page.getByRole("button", { name: "Borrar registro" }).first().click();

  await page.waitForTimeout(1000);

  const filasDespues = await page.getByTestId("filas tabla").count();

  expect(filasDespues).toBe(filasAntes - 1);
});


//Borrar colección
test("Borrar colección", async ({ page }) => {
  await setup(page);

  await page.getByTestId("borrar datos").click();
  await page.waitForTimeout(1000);

  const numDatos = await page.getByTestId("filas tabla").count();
  expect(numDatos).toBe(0);
});