const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(express.static("."));


// ======================================================
// SQLITE
// ======================================================

const db = new sqlite3.Database(
    "./commandes.db",
    (err) => {

        if (err) {

            console.error(
                "Erreur SQLite :",
                err.message
            );

        }

        else {

            console.log(
                "Base de données SQLite connectée"
            );

        }

    }
);


// ======================================================
// CRÉER LA TABLE
// ======================================================

db.run(`
    CREATE TABLE IF NOT EXISTS commandes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nom TEXT NOT NULL,

        telephone TEXT NOT NULL,

        adresse TEXT NOT NULL,

        produits TEXT NOT NULL,

        total REAL NOT NULL DEFAULT 0,

        date TEXT NOT NULL

    )
`, (err) => {

    if (err) {

        console.error(
            "Erreur création table :",
            err.message
        );

    }

    else {

        console.log(
            "Table commandes prête"
        );

    }

});


// ======================================================
// ENREGISTRER UNE COMMANDE
// ======================================================

app.post(
    "/commandes",
    (req, res) => {


        console.log("");
        console.log(
            "================================"
        );
        console.log(
            "NOUVELLE REQUÊTE DE COMMANDE"
        );
        console.log(
            "================================"
        );


        console.log(
            "DONNÉES REÇUES :"
        );

        console.log(
            req.body
        );


        const {
            nom,
            telephone,
            adresse,
            produits,
            total
        } = req.body;


        // ==========================================
        // VÉRIFICATIONS
        // ==========================================

        if (
            !nom ||
            !telephone ||
            !adresse
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Informations client manquantes"

            });

        }


        if (
            !Array.isArray(produits) ||
            produits.length === 0
        ) {

            console.error(
                "AUCUN PRODUIT REÇU !"
            );


            return res.status(400).json({

                success: false,

                message:
                    "Aucun produit dans la commande"

            });

        }


        // ==========================================
        // NETTOYER LES PRODUITS
        // ==========================================

        const produitsPropres =
            produits.map(product => ({

                id:
                    product.id || "",

                name:
                    product.name ||
                    product.nom ||
                    product.produit ||
                    "Produit",

                price:
                    Number(
                        product.price || 0
                    ),

                image:
                    product.image || "",

                quantity:
                    Number(
                        product.quantity || 1
                    )

            }));


        // ==========================================
        // TOTAL
        // ==========================================

        const totalFinal =
            Number(total || 0);


        // ==========================================
        // DATE
        // ==========================================

        const date =
            new Date().toISOString();


        // ==========================================
        // JSON PRODUITS
        // ==========================================

        const produitsJSON =
            JSON.stringify(
                produitsPropres
            );


        console.log(
            "PRODUITS À ENREGISTRER :"
        );

        console.log(
            produitsPropres
        );


        console.log(
            "TOTAL :",
            totalFinal
        );


        // ==========================================
        // SQL
        // ==========================================

        const sql = `

            INSERT INTO commandes
            (
                nom,
                telephone,
                adresse,
                produits,
                total,
                date
            )

            VALUES (?, ?, ?, ?, ?, ?)

        `;


        db.run(
            sql,

            [
                nom,
                telephone,
                adresse,
                produitsJSON,
                totalFinal,
                date
            ],

            function (err) {


                if (err) {


                    console.error(
                        "ERREUR SQLITE :",
                        err.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Erreur lors de l'enregistrement"

                    });

                }


                console.log("");
                console.log(
                    "================================"
                );

                console.log(
                    "COMMANDE ENREGISTRÉE !"
                );

                console.log(
                    "ID :",
                    this.lastID
                );

                console.log(
                    "CLIENT :",
                    nom
                );

                console.log(
                    "PRODUITS :",
                    produitsPropres
                );

                console.log(
                    "TOTAL :",
                    totalFinal,
                    "CFA"
                );

                console.log(
                    "================================"
                );


                res.json({

                    success: true,

                    message:
                        "Commande enregistrée",

                    commandeId:
                        this.lastID

                });

            }
        );

    }
);


// ======================================================
// RÉCUPÉRER LES COMMANDES
// ======================================================

app.get(
    "/commandes",
    (req, res) => {


        db.all(
            `
            SELECT *
            FROM commandes
            ORDER BY id DESC
            `,
            [],

            (err, rows) => {


                if (err) {


                    console.error(
                        "Erreur récupération :",
                        err.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Erreur lors de la récupération"

                    });

                }


                const commandes =
                    rows.map(
                        commande => {


                            let produits = [];


                            try {

                                produits =
                                    JSON.parse(
                                        commande.produits ||
                                        "[]"
                                    );

                            }

                            catch (error) {

                                console.error(
                                    "Erreur JSON produit :",
                                    error
                                );

                                produits = [];

                            }


                            return {

                                id:
                                    commande.id,

                                nom:
                                    commande.nom,

                                telephone:
                                    commande.telephone,

                                adresse:
                                    commande.adresse,

                                produits:
                                    produits,

                                total:
                                    Number(
                                        commande.total || 0
                                    ),

                                date:
                                    commande.date

                            };

                        }
                    );


                console.log(
                    "COMMANDES ENVOYÉES À ADMIN :",
                    commandes
                );


                res.json(
                    commandes
                );

            }
        );

    }
);


// ======================================================
// SUPPRIMER UNE COMMANDE
// ======================================================

app.delete(
    "/commandes/:id",
    (req, res) => {


        const id =
            Number(req.params.id);


        if (!id) {

            return res.status(400).json({

                success: false,

                message:
                    "ID invalide"

            });

        }


        db.run(
            `
            DELETE FROM commandes
            WHERE id = ?
            `,

            [id],

            function (err) {


                if (err) {


                    console.error(
                        "Erreur suppression :",
                        err.message
                    );


                    return res.status(500).json({

                        success: false,

                        message:
                            "Erreur lors de la suppression"

                    });

                }


                if (this.changes === 0) {


                    return res.status(404).json({

                        success: false,

                        message:
                            "Commande introuvable"

                    });

                }


                res.json({

                    success: true,

                    message:
                        "Commande supprimée"

                });

            }
        );

    }
);


// ======================================================
// SERVEUR
// ======================================================

app.listen(
    3000,
    () => {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            "Serveur lancé sur"
        );

        console.log(
            "http://localhost:3000"
        );

        console.log(
            "================================"
        );

    }
);