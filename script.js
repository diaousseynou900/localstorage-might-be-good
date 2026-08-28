// ======================================================
// EM LOCAL - PANIER ET COMMANDES
// ======================================================


// ======================================================
// PANIER
// ======================================================

let cart = JSON.parse(
    localStorage.getItem("brightLooksCart")
) || [];


// ======================================================
// SAUVEGARDER LE PANIER
// ======================================================

function saveCart() {

    localStorage.setItem(
        "brightLooksCart",
        JSON.stringify(cart)
    );

}


// ======================================================
// AFFICHER LE PANIER
// ======================================================

function displayCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML = "";


    let total = 0;
    let totalQuantity = 0;


    // Panier vide

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="text-center py-4">

                <i
                    class="bi bi-bag"
                    style="font-size: 50px;"
                ></i>

                <p class="mt-3 text-muted">
                    Votre panier est vide.
                </p>

            </div>

        `;

        if (cartCount) {
            cartCount.textContent = "0";
        }

        if (cartTotal) {
            cartTotal.textContent = "CFA 0";
        }

        return;
    }


    // Produits

    cart.forEach((product, index) => {

        const price =
            Number(product.price || 0);

        const quantity =
            Number(product.quantity || 1);

        const productTotal =
            price * quantity;


        total += productTotal;

        totalQuantity += quantity;


        cartItems.innerHTML += `

            <div class="cart-item mb-4">

                <div class="d-flex align-items-center">


                    <img
                        src="${product.image || ""}"
                        alt="${product.name || "Produit"}"
                        style="
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 8px;
                        "
                    >


                    <div class="ms-3 flex-grow-1">


                        <h6 class="mb-1">

                            ${product.name || "Produit"}

                        </h6>


                        <p class="mb-2">

                            CFA ${price.toLocaleString("fr-FR")}

                        </p>


                        <div class="d-flex align-items-center">


                            <button
                                class="btn btn-sm btn-outline-dark decrease"
                                data-index="${index}"
                            >
                                -
                            </button>


                            <span class="mx-3">

                                ${quantity}

                            </span>


                            <button
                                class="btn btn-sm btn-outline-dark increase"
                                data-index="${index}"
                            >
                                +
                            </button>


                        </div>


                    </div>


                    <button
                        class="btn btn-sm btn-danger remove"
                        data-index="${index}"
                    >

                        <i class="bi bi-trash"></i>

                    </button>


                </div>

            </div>

        `;

    });


    // Nombre

    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    // Total

    if (cartTotal) {

        cartTotal.textContent =
            "CFA " +
            total.toLocaleString("fr-FR");

    }


    // ==================================================
    // AUGMENTER
    // ==================================================

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    cart[index].quantity++;

                    saveCart();

                    displayCart();

                }
            );

        });


    // ==================================================
    // DIMINUER
    // ==================================================

    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }


                    saveCart();

                    displayCart();

                }
            );

        });


    // ==================================================
    // SUPPRIMER
    // ==================================================

    document
        .querySelectorAll(".remove")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);

                    cart.splice(index, 1);

                    saveCart();

                    displayCart();

                }
            );

        });

}


// ======================================================
// AJOUTER AU PANIER
// ======================================================

document
    .querySelectorAll(".add-to-cart")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {


                const id =
                    this.dataset.id;


                const name =
                    this.dataset.name;


                const price =
                    Number(
                        this.dataset.price
                    );


                const image =
                    this.dataset.image;


                console.log(
                    "PRODUIT AJOUTÉ :",
                    {
                        id,
                        name,
                        price,
                        image
                    }
                );


                // Chercher produit existant

                const existingProduct =
                    cart.find(
                        product =>
                            product.id === id
                    );


                if (existingProduct) {

                    existingProduct.quantity++;

                }

                else {

                    cart.push({

                        id: id,

                        name: name,

                        price: price,

                        image: image,

                        quantity: 1

                    });

                }


                saveCart();

                displayCart();


                // Animation

                const originalText =
                    this.textContent;


                this.textContent =
                    "✓ Ajouté";


                this.classList.remove(
                    "btn-dark"
                );


                this.classList.add(
                    "btn-success"
                );


                setTimeout(() => {

                    this.textContent =
                        originalText;

                    this.classList.remove(
                        "btn-success"
                    );

                    this.classList.add(
                        "btn-dark"
                    );

                }, 1000);

            }
        );

    });


// ======================================================
// VIDER LE PANIER
// ======================================================

const clearCartButton =
    document.getElementById("clear-cart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            cart = [];

            saveCart();

            displayCart();

        }
    );

}


// ======================================================
// RECHERCHE
// ======================================================

const searchForm =
    document.getElementById("search-form");

const searchInput =
    document.getElementById("search-input");

const allProducts =
    document.querySelectorAll(".add-to-cart");


if (searchForm && searchInput) {


    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();


            let found = false;


            allProducts.forEach(button => {

                const productCard =
                    button.closest(".col-md-4");


                const productName =
                    (
                        button.dataset.name || ""
                    ).toLowerCase();


                if (
                    searchText === "" ||
                    productName.includes(searchText)
                ) {

                    productCard.style.display =
                        "";

                    found = true;

                }

                else {

                    productCard.style.display =
                        "none";

                }

            });


            let noResult =
                document.getElementById(
                    "no-result"
                );


            if (!noResult) {

                noResult =
                    document.createElement("div");

                noResult.id =
                    "no-result";

                noResult.className =
                    "col-12 text-center mt-4";

                noResult.innerHTML = `

                    <h4>
                        Aucun produit trouvé
                    </h4>

                    <p class="text-muted">
                        Essayez un autre nom.
                    </p>

                `;


                const row =
                    document.querySelector(
                        ".row.g-4"
                    );


                if (row) {

                    row.prepend(noResult);

                }

            }


            if (found || searchText === "") {

                noResult.style.display =
                    "none";

            }

            else {

                noResult.style.display =
                    "block";

            }

        }
    );


    searchInput.addEventListener(
        "input",
        function () {

            if (
                this.value.trim() === ""
            ) {

                allProducts.forEach(button => {

                    const productCard =
                        button.closest(".col-md-4");

                    productCard.style.display =
                        "";

                });


                const noResult =
                    document.getElementById(
                        "no-result"
                    );


                if (noResult) {

                    noResult.style.display =
                        "none";

                }

            }

        }
    );

}


// ======================================================
// FORMULAIRE DE LIVRAISON
// ======================================================

const boutonCommande =
    document.getElementById(
        "passerCommande"
    );

const formulaire =
    document.getElementById(
        "formLivraison"
    );

const livraisonForm =
    document.getElementById(
        "livraisonForm"
    );

const messageCommande =
    document.getElementById(
        "messageCommande"
    );


// Vérifier que les éléments existent

if (
    boutonCommande &&
    formulaire
) {

    boutonCommande.addEventListener(
        "click",
        function () {


            if (cart.length === 0) {

                alert(
                    "Votre panier est vide."
                );

                return;

            }


            formulaire.classList.add(
                "active"
            );


            formulaire.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


// ======================================================
// ENVOYER LA COMMANDE
// ======================================================

if (livraisonForm) {

    livraisonForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==========================================
            // INFORMATIONS CLIENT
            // ==========================================

            const nom =
                document
                    .getElementById("nom")
                    .value
                    .trim();


            const telephone =
                document
                    .getElementById("telephone")
                    .value
                    .trim();


            const adresse =
                document
                    .getElementById("adresse")
                    .value
                    .trim();


            // ==========================================
            // VÉRIFICATIONS
            // ==========================================

            if (
                !nom ||
                !telephone ||
                !adresse
            ) {

                alert(
                    "Veuillez remplir tous les champs."
                );

                return;

            }


            if (
                !Array.isArray(cart) ||
                cart.length === 0
            ) {

                alert(
                    "Votre panier est vide."
                );

                return;

            }


            // ==========================================
            // TOTAL
            // ==========================================

            let total = 0;


            cart.forEach(product => {

                total +=
                    Number(product.price || 0) *
                    Number(product.quantity || 1);

            });


            // ==========================================
            // COPIE DU PANIER
            // ==========================================

            const produitsCommande =
                cart.map(product => ({

                    id: product.id,

                    name: product.name,

                    price: Number(
                        product.price || 0
                    ),

                    image: product.image || "",

                    quantity: Number(
                        product.quantity || 1
                    )

                }));


            // ==========================================
            // OBJET COMMANDE
            // ==========================================

            const commande = {

                nom: nom,

                telephone: telephone,

                adresse: adresse,

                produits: produitsCommande,

                total: total

            };


            console.log(
                "================================"
            );

            console.log(
                "COMMANDE ENVOYÉE AU SERVEUR :"
            );

            console.log(
                commande
            );

            console.log(
                "PRODUITS :",
                commande.produits
            );

            console.log(
                "TOTAL :",
                commande.total
            );

            console.log(
                "================================"
            );


            // ==========================================
            // ENVOI AU SERVEUR
            // ==========================================

            try {


                const response =
                    await fetch(
                        "/commandes",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    commande
                                )

                        }
                    );


                const result =
                    await response.json();


                console.log(
                    "RÉPONSE DU SERVEUR :",
                    result
                );


                if (result.success) {


                    if (messageCommande) {

                        messageCommande.innerHTML = `

                            <div class="alert alert-success">

                                ✅ Commande enregistrée avec succès !

                                <br>

                                Merci ${nom}.

                            </div>

                        `;

                    }


                    // Vider le panier

                    cart = [];

                    saveCart();

                    displayCart();


                    // Réinitialiser formulaire

                    livraisonForm.reset();


                }

                else {


                    if (messageCommande) {

                        messageCommande.innerHTML = `

                            <div class="alert alert-danger">

                                ❌ ${result.message}

                            </div>

                        `;

                    }

                }


            }

            catch (error) {


                console.error(
                    "ERREUR ENVOI :",
                    error
                );


                if (messageCommande) {

                    messageCommande.innerHTML = `

                        <div class="alert alert-danger">

                            ❌ Impossible d'envoyer la commande.

                            <br>

                            Vérifiez que le serveur est lancé.

                        </div>

                    `;

                }

            }

        }
    );

}


// ======================================================
// AFFICHAGE INITIAL
// ======================================================

displayCart();
