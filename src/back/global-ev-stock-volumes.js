import express from "express";
import dataStore from 'nedb';

let db = new dataStore();

//Buena Práctica: URL Base
let BASE_URL_API = "/api/v1";
let DOCS_URL = "https://documenter.getpostman.com/view/52409063/2sBXigLtC2";

function evStockAPI(app, verifyToken) {

    const initialData = [
        { region_country: "Brazil", year: 2024, ev_stock: 214003, macroregion_stock: 1884600, worldwide_stock: 50000000, oil_world_displacement: 58001 },
        { region_country: "Brazil", year: 2010, ev_stock: 0, macroregion_stock: 400, worldwide_stock: 20426, oil_world_displacement: 25 },
        { region_country: "Canada", year: 2011, ev_stock: 555, macroregion_stock: 23800, worldwide_stock: 67526, oil_world_displacement: 88 },
        { region_country: "Mexico", year: 2012, ev_stock: 91, macroregion_stock: 4671, worldwide_stock: 190026, oil_world_displacement: 190 },
        { region_country: "China", year: 2013, ev_stock: 32600, macroregion_stock: 111000, worldwide_stock: 390027, oil_world_displacement: 420 },
        { region_country: "China", year: 2014, ev_stock: 85000, macroregion_stock: 208000, worldwide_stock: 710087, oil_world_displacement: 830 },
        { region_country: "Colombia", year: 2015, ev_stock: 124, macroregion_stock: 18620, worldwide_stock: 1250810, oil_world_displacement: 1500 },
        { region_country: "Costa Rica", year: 2016, ev_stock: 12, macroregion_stock: 37990, worldwide_stock: 2003100, oil_world_displacement: 2100 },
        { region_country: "Denmark", year: 2017, ev_stock: 10683, macroregion_stock: 570000, worldwide_stock: 3106800, oil_world_displacement: 3500 },
        { region_country: "Finland", year: 2018, ev_stock: 15400, macroregion_stock: 820000, worldwide_stock: 5111000, oil_world_displacement: 6000 },
        { region_country: "Finland", year: 2019, ev_stock: 29701, macroregion_stock: 1330000, worldwide_stock: 7219000, oil_world_displacement: 8100 }
    ];

    //Load initialData
    app.get(BASE_URL_API + "/global-ev-stock-volumes/loadInitialData", (req, res) => {
        db.count({}, (err, count) => {
            if (count === 0) {
                db.insert(initialData, () => {
                    res.sendStatus(201);
                });
            } else {
                res.sendStatus(409);
            }
        });
    });

    //Get colección
    app.get(BASE_URL_API + "/global-ev-stock-volumes/", (req, res) => {

        db.find({}, { _id: 0 }, (err, result) => {

            // FILTROS
            // FILTROS STRING
            if (req.query.region_country) {
                result = result.filter(d =>
                    d.region_country.toLowerCase() === req.query.region_country.toLowerCase()
                );
            }

            // FILTRO EXACTO AÑO
            if (req.query.year) {
                result = result.filter(d =>
                    d.year == Number(req.query.year)
                );
            }

            // RANGO AÑO
            if (req.query.from) {
                result = result.filter(d =>
                    d.year >= Number(req.query.from)
                );
            }

            if (req.query.to) {
                result = result.filter(d =>
                    d.year <= Number(req.query.to)
                );
            }

            // ===== ev_stock =====
            if (req.query.ev_stock) {
                result = result.filter(d =>
                    d.ev_stock == Number(req.query.ev_stock)
                );
            }

            if (req.query.ev_stock_gt) {
                result = result.filter(d =>
                    d.ev_stock > Number(req.query.ev_stock_gt)
                );
            }

            if (req.query.ev_stock_lt) {
                result = result.filter(d =>
                    d.ev_stock < Number(req.query.ev_stock_lt)
                );
            }

            // ===== macroregion_stock =====
            if (req.query.macroregion_stock) {
                result = result.filter(d =>
                    d.macroregion_stock == Number(req.query.macroregion_stock)
                );
            }

            if (req.query.macroregion_stock_gt) {
                result = result.filter(d =>
                    d.macroregion_stock > Number(req.query.macroregion_stock_gt)
                );
            }

            if (req.query.macroregion_stock_lt) {
                result = result.filter(d =>
                    d.macroregion_stock < Number(req.query.macroregion_stock_lt)
                );
            }

            // ===== worldwide_stock =====
            if (req.query.worldwide_stock) {
                result = result.filter(d =>
                    d.worldwide_stock == Number(req.query.worldwide_stock)
                );
            }

            if (req.query.worldwide_stock_gt) {
                result = result.filter(d =>
                    d.worldwide_stock > Number(req.query.worldwide_stock_gt)
                );
            }

            if (req.query.worldwide_stock_lt) {
                result = result.filter(d =>
                    d.worldwide_stock < Number(req.query.worldwide_stock_lt)
                );
            }

            // ===== oil_world_displacement =====
            if (req.query.oil_world_displacement) {
                result = result.filter(d =>
                    d.oil_world_displacement == Number(req.query.oil_world_displacement)
                );
            }

            if (req.query.oil_world_displacement_gt) {
                result = result.filter(d =>
                    d.oil_world_displacement > Number(req.query.oil_world_displacement_gt)
                );
            }

            if (req.query.oil_world_displacement_lt) {
                result = result.filter(d =>
                    d.oil_world_displacement < Number(req.query.oil_world_displacement_lt)
                );
            }

            // PAGINACIÓN
            let offset = Number(req.query.offset);
            let limit = Number(req.query.limit);

            if (offset) {
                result = result.slice(offset);
            }

            if (limit) {
                result = result.slice(0, limit);
            }

            res.json(result);
        });


    });




    //Get recurso
    app.get(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
        const { region_country, year } = req.params;

        db.find({ region_country: region_country, year: Number(year) }, (err, registros) => {
            if (err) {
                res.sendStatus(500);
            } else if (registros.length === 0) {
                res.sendStatus(404, "NOT FOUND");
            } else {
                // Devolvemos el primer elemento encontrado (sin el _id de NeDB)
                const result = registros[0];
                delete result._id;
                res.json(result);
            }
        });
    });


    //Post
    app.post(BASE_URL_API + "/global-ev-stock-volumes",verifyToken, (req, res) => {
        const newRegister = req.body;
        //Comprobamos si tiene los atributos mínimos
        if (
            !newRegister.region_country ||
            !newRegister.year ||
            newRegister.ev_stock === undefined ||
            newRegister.macroregion_stock === undefined ||
            newRegister.worldwide_stock === undefined ||
            newRegister.oil_world_displacement === undefined
        ) {
            return res.sendStatus(400);
        }


        db.find({ region_country: newRegister.region_country, year: newRegister.year }, (err, registros) => {
            if (registros.length > 0) {
                res.sendStatus(409);

            } else {
                delete newRegister._id;
                db.insert(newRegister);
                res.sendStatus(201);
            }

        })

    });

    //Post sobre dato. NO PERMITIDO
    app.post(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year", (req, res) => {
        res.sendStatus(405);
    });

    //Put 
    app.put(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year",verifyToken, (req, res) => {
        const register = req.body;
        const region_country = req.params.region_country.toLowerCase();
        const year = Number(req.params.year);
        if (
            !register.region_country ||
            !register.year ||
            register.region_country.toLowerCase() !== region_country ||
            Number(register.year) !== year
        ) {
            return res.sendStatus(400);
        }

        delete register._id;

        db.update({ region_country: register.region_country, year: register.year }, register, {}, (err, updated) => {
            if (updated === 0) {
                return res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        });

    });

    //PUT sobre la lista general.NO VÁLIDO
    app.put(BASE_URL_API + "/global-ev-stock-volumes", (req, res) => {
        res.sendStatus(405);
    });

    //Delete individual
    app.delete(BASE_URL_API + "/global-ev-stock-volumes/:region_country/:year",verifyToken, (req, res) => {
        const region_country = req.params.region_country;
        const year = Number(req.params.year);
        //Comprobamos si existe ese registro
        db.find({ region_country: region_country, year: year }, (err, registros) => {
            if (registros.length === 0) {
                res.sendStatus(404);
            } else {
                db.remove({ region_country: region_country, year: year }, {}, (err, numRemoved) => {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                }
                );
            }
        });

    });


    //Delete colección
    app.delete(BASE_URL_API + "/global-ev-stock-volumes", verifyToken, (req, res) => {
        db.remove({}, { multi: true }, () => {
            res.sendStatus(200);
        });

    });


    //Portal de documentación de la API
    app.get(BASE_URL_API + "/global-ev-stock-volumes/docs", (req, res) => {
        res.redirect(DOCS_URL);
    });

}
export { evStockAPI };
