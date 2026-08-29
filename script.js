// ======================================================
// GIRL'S PALACE
// PANIER + RECHERCHE + COMMANDES + MODAL
// ======================================================


// ======================================================
// PANIER
// ======================================================

let cart = JSON.parse(
    localStorage.getItem("brightLooksCart")
) || [];


// ======================================================
// SAUVEGARDER
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


    // PANIER VIDE

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="bi bi-bag"></i>

                <p>
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


    // PRODUITS

    cart.forEach((product, index) => {

        const price =
            Number(product.price) || 0;


        const quantity =
            Number(product.quantity) || 1;


        const productTotal =
            price * quantity;


        total += productTotal;

        totalQuantity += quantity;


        cartItems.innerHTML += `

            <div class="cart-item">

                <img
                    src="${product.image || ""}"
                    alt="${product.name || "Produit"}"
                >


                <div class="cart-item-info">

                    <h6>
                        ${product.name || "Produit"}
                    </h6>


                    <p>
                        CFA ${price.toLocaleString("fr-FR")}
                    </p>


                    <div class="quantity-controls">

                        <button
                            type="button"
                            class="decrease"
                            data-index="${index}"
                        >
                            -
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            type="button"
                            class="increase"
                            data-index="${index}"
                        >
                            +
                        </button>

                    </div>

                </div>


                <button
                    type="button"
                    class="remove"
                    data-index="${index}"
                    aria-label="Supprimer"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </div>

        `;

    });


    // NOMBRE ARTICLES

    if (cartCount) {

        cartCount.textContent =
            totalQuantity;

    }


    // TOTAL

    if (cartTotal) {

        cartTotal.textContent =
            "CFA " +
            total.toLocaleString("fr-FR");

    }


    // ==================================================
    // + AUGMENTER
    // ==================================================

    document
        .querySelectorAll(".increase")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (cart[index]) {

                        cart[index].quantity =
                            Number(cart[index].quantity || 1) + 1;

                    }


                    saveCart();

                    displayCart();

                }
            );

        });


    // ==================================================
    // - DIMINUER
    // ==================================================

    document
        .querySelectorAll(".decrease")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(this.dataset.index);


                    if (!cart[index]) {
                        return;
                    }


                    const quantity =
                        Number(cart[index].quantity || 1);


                    if (quantity > 1) {

                        cart[index].quantity =
                            quantity - 1;

                    }

                    else {

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
                    Number(this.dataset.price) || 0;


                const image =
                    this.dataset.image || "";


                // CHERCHER PRODUIT EXISTANT

                const existingProduct =
                    cart.find(
                        product =>
                            product.id === id
                    );


                if (existingProduct) {

                    existingProduct.quantity =
                        Number(existingProduct.quantity || 1) + 1;

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


                // ANIMATION

                const originalText =
                    this.innerHTML;


                this.innerHTML =
                    "✓ Ajouté";


                this.classList.remove(
                    "btn-dark"
                );


                this.classList.add(
                    "btn-success"
                );


                setTimeout(() => {

                    this.innerHTML =
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

            if (cart.length === 0) {
                return;
            }


            const confirmation =
                confirm(
                    "Voulez-vous vraiment vider le panier ?"
                );


            if (!confirmation) {
                return;
            }


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


const searchButton =
    document.getElementById("search-button");


const searchInput =
    document.getElementById("search-input");


const products =
    document.querySelectorAll(
        ".add-to-cart"
    );


// ======================================================
// OUVRIR / FERMER LA RECHERCHE
// ======================================================

if (
    searchButton &&
    searchInput
) {

    searchButton.addEventListener(
        "click",
        function (event) {

            // Si la recherche est fermée
            if (!searchInput.classList.contains("active")) {

                event.preventDefault();

                searchInput.classList.add("active");

                searchInput.focus();

            }

            // Sinon le formulaire est envoyé
        }
    );

}


// ======================================================
// EFFECTUER LA RECHERCHE
// ======================================================

function effectuerRecherche() {

    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    let found = false;


    products.forEach(button => {

        /*
         * IMPORTANT :
         * col-6 col-md-4
         */

        const productCard =
            button.closest(
                ".col-6.col-md-4"
            );


        if (!productCard) {
            return;
        }


        const productName =
            (
                button.dataset.name || ""
            ).toLowerCase();


        const productDescription =
            (
                button
                    .closest(".card")
                    ?.querySelector(".product-image")
                    ?.dataset.description || ""
            ).toLowerCase();


        const searchableText =
            productName +
            " " +
            productDescription;


        if (
            searchText === "" ||
            searchableText.includes(searchText)
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


    afficherMessageRecherche(
        found,
        searchText
    );

}


// ======================================================
// MESSAGE AUCUN PRODUIT
// ======================================================

function afficherMessageRecherche(
    found,
    searchText
) {

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
            document.getElementById(
                "products-row"
            );


        if (row) {

            row.prepend(noResult);

        }

    }


    if (
        found ||
        searchText === ""
    ) {

        noResult.style.display =
            "none";

    }

    else {

        noResult.style.display =
            "block";

    }

}


// ======================================================
// ENTRÉE DANS LA RECHERCHE
// ======================================================

if (searchForm) {

    searchForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            effectuerRecherche();

        }
    );

}


// ======================================================
// RECHERCHE EN DIRECT
// ======================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            effectuerRecherche();

        }
    );

}


// ======================================================
// FORMULAIRE DE COMMANDE
// ======================================================

const livraisonForm =
    document.getElementById(
        "livraisonForm"
    );


const messageCommande =
    document.getElementById(
        "messageCommande"
    );


if (livraisonForm) {

    livraisonForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ==================================================
            // INFORMATIONS
            // ==================================================

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


            // ==================================================
            // VALIDATION
            // ==================================================

            if (
                !nom ||
                !telephone ||
                !adresse
            ) {

                afficherMessageCommande(
                    "danger",
                    "Veuillez remplir tous les champs."
                );

                return;

            }


            if (
                !Array.isArray(cart) ||
                cart.length === 0
            ) {

                afficherMessageCommande(
                    "danger",
                    "Votre panier est vide."
                );

                return;

            }


            // ==================================================
            // TOTAL
            // ==================================================

            let total = 0;


            cart.forEach(product => {

                total +=
                    Number(product.price || 0) *
                    Number(product.quantity || 1);

            });


            // ==================================================
            // PRODUITS
            // ==================================================

            const produitsCommande =
                cart.map(product => ({

                    id:
                        product.id || "",

                    name:
                        product.name || "Produit",

                    price:
                        Number(product.price || 0),

                    image:
                        product.image || "",

                    quantity:
                        Number(product.quantity || 1)

                }));


            // ==================================================
            // COMMANDE
            // ==================================================

            const commande = {

                nom,

                telephone,

                adresse,

                produits:
                    produitsCommande,

                total

            };


            console.log(
                "Commande envoyée :",
                commande
            );


            // ==================================================
            // ENVOI AU SERVEUR
            // ==================================================

            try {

                /*
                 * IMPORTANT :
                 *
                 * PAS :
                 * http://localhost:3000/commandes
                 *
                 * MAIS :
                 * /commandes
                 *
                 * Cela permet au téléphone de fonctionner.
                 */

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
                    "Réponse serveur :",
                    result
                );


                if (
                    response.ok &&
                    result.success
                ) {

                    afficherMessageCommande(
                        "success",
                        `✅ Commande enregistrée avec succès !<br>Merci ${nom}.`
                    );


                    // VIDER PANIER

                    cart = [];

                    saveCart();

                    displayCart();


                    // RESET

                    livraisonForm.reset();

                }

                else {

                    afficherMessageCommande(
                        "danger",
                        "❌ " +
                        (
                            result.message ||
                            "Erreur lors de l'enregistrement."
                        )
                    );

                }

            }

            catch (error) {

                console.error(
                    "Erreur envoi commande :",
                    error
                );


                afficherMessageCommande(
                    "danger",
                    "❌ Impossible d'envoyer la commande.<br>Vérifiez que le serveur est lancé."
                );

            }

        }
    );

}


// ======================================================
// MESSAGE COMMANDE
// ======================================================

function afficherMessageCommande(
    type,
    message
) {

    if (!messageCommande) {
        return;
    }


    messageCommande.innerHTML = `

        <div class="alert alert-${type}">

            ${message}

        </div>

    `;

}


// ======================================================
// MODAL PRODUIT
// ======================================================

const productImages =
    document.querySelectorAll(
        ".product-image"
    );


const modalProductImage =
    document.getElementById(
        "modalProductImage"
    );


const modalProductName =
    document.getElementById(
        "modalProductName"
    );


const modalProductTitle =
    document.getElementById(
        "modalProductTitle"
    );


const modalProductPrice =
    document.getElementById(
        "modalProductPrice"
    );


const modalProductDescription =
    document.getElementById(
        "modalProductDescription"
    );


const modalAddToCart =
    document.getElementById(
        "modalAddToCart"
    );


let selectedProduct = null;


// ======================================================
// CLIQUER SUR UNE IMAGE
// ======================================================

productImages.forEach(image => {

    image.addEventListener(
        "click",
        function () {

            selectedProduct = {

                name:
                    this.dataset.name,

                price:
                    Number(
                        this.dataset.price
                    ),

                image:
                    this.src,

                description:
                    this.dataset.description || ""

            };


            if (modalProductImage) {

                modalProductImage.src =
                    selectedProduct.image;

                modalProductImage.alt =
                    selectedProduct.name;

            }


            if (modalProductName) {

                modalProductName.textContent =
                    selectedProduct.name;

            }


            if (modalProductTitle) {

                modalProductTitle.textContent =
                    selectedProduct.name;

            }


            if (modalProductPrice) {

                modalProductPrice.textContent =
                    "CFA " +
                    selectedProduct.price
                        .toLocaleString("fr-FR");

            }


            if (modalProductDescription) {

                modalProductDescription.textContent =
                    selectedProduct.description;

            }


            const modalElement =
                document.getElementById(
                    "productModal"
                );


            if (modalElement) {

                const modal =
                    bootstrap.Modal.getOrCreateInstance(
                        modalElement
                    );

                modal.show();

            }

        }
    );

});


// ======================================================
// AJOUTER DEPUIS LE MODAL
// ======================================================

if (modalAddToCart) {

    modalAddToCart.addEventListener(
        "click",
        function () {

            if (!selectedProduct) {
                return;
            }


            const buttons =
                document.querySelectorAll(
                    ".add-to-cart"
                );


            buttons.forEach(button => {

                if (
                    button.dataset.name ===
                    selectedProduct.name
                ) {

                    button.click();

                }

            });

        }
    );

}


// ======================================================
// AFFICHAGE INITIAL
// ======================================================

displayCart();

console.log(
    "GIRL'S PALACE - JavaScript chargé correctement."
);