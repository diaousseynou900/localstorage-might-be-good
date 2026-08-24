const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("."));

const commandes = [];

app.post("/commandes", (req, res) => {

    const { nom, telephone, adresse } = req.body;

    if (!nom || !telephone || !adresse) {
        return res.status(400).json({
            success: false,
            message: "Informations manquantes"
        });
    }

    commandes.push({
        nom,
        telephone,
        adresse,
        date: new Date()
    });

    console.log("Nouvelle commande :", {
        nom,
        telephone,
        adresse
    });

    res.json({
        success: true
    });
});

app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});
