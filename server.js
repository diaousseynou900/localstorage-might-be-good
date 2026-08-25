const express = require("express");

const app = express();

app.use(express.json());

app.use(express.static("."));


const commandes = [];


app.post("/commandes", (req, res) => {

    const {
        nom,
        telephone,
        adresse,
        produits,
        total
    } = req.body;


    if (!nom || !telephone || !adresse) {

        return res.status(400).json({

            success: false,

            message: "Informations manquantes"

        });

    }


    const nouvelleCommande = {

        id: commandes.length + 1,

        nom,

        telephone,

        adresse,

        produits: produits || [],

        total: total || 0,

        date: new Date()

    };


    commandes.push(nouvelleCommande);


    console.log("================================");

    console.log("NOUVELLE COMMANDE");

    console.log("================================");

    console.log("ID :", nouvelleCommande.id);

    console.log("Nom :", nouvelleCommande.nom);

    console.log("Téléphone :", nouvelleCommande.telephone);

    console.log("Adresse :", nouvelleCommande.adresse);

    console.log("Produits :", nouvelleCommande.produits);

    console.log("Total :", nouvelleCommande.total, "CFA");

    console.log("Date :", nouvelleCommande.date);

    console.log("================================");


    res.json({

        success: true,

        message: "Commande enregistrée",

        commandeId: nouvelleCommande.id

    });

});


app.listen(3000, () => {

    console.log(
        "Serveur lancé sur http://localhost:3000"
    );

});