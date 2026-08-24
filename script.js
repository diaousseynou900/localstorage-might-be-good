// ===============================
// BRIGHT LOOKS - PANIER
// ===============================

let cart = JSON.parse(localStorage.getItem("brightLooksCart")) || [];


// ===============================
// SAUVEGARDER LE PANIER
// ===============================

function saveCart() {

    localStorage.setItem(
        "brightLooksCart",
        JSON.stringify(cart)
    );

}


// ===============================
// AFFICHER LE PANIER
// ===============================

function displayCart() {

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return;


    cartItems.innerHTML = "";


    let total = 0;
    let totalQuantity = 0;


    // Panier vide

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="text-center py-4">

                <i 
                    class="bi bi-bag"
                    style="font-size: 50px;">
                </i>

                <p class="mt-3 text-muted">
                    Votre panier est vide.
                </p>

            </div>
        `;

        cartCount.textContent = "0";

        cartTotal.textContent = "CFA 0";

        return;
    }


    // Produits du panier

    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;


        total += productTotal;

        totalQuantity += product.quantity;


        cartItems.innerHTML += `

            <div class="cart-item mb-4">

                <div class="d-flex align-items-center">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        style="
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 8px;
                        "
                    >


                    <div class="ms-3 flex-grow-1">

                        <h6 class="mb-1">
                            ${product.name}
                        </h6>


                        <p class="mb-2">
                            CFA ${product.price.toLocaleString()}
                        </p>


                        <div class="d-flex align-items-center">

                            <button
                                class="btn btn-sm btn-outline-dark decrease"
                                data-index="${index}">
                                -
                            </button>


                            <span class="mx-3">
                                ${product.quantity}
                            </span>


                            <button
                                class="btn btn-sm btn-outline-dark increase"
                                data-index="${index}">
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="btn btn-sm btn-danger remove"
                        data-index="${index}">

                        <i class="bi bi-trash"></i>

                    </button>

                </div>

            </div>

        `;

    });


    // Nombre de produits

    cartCount.textContent = totalQuantity;


    // Total

    cartTotal.textContent =
        "CFA " + total.toLocaleString();


    // ===============================
    // AUGMENTER QUANTITÉ
    // ===============================

    document.querySelectorAll(".increase").forEach(button => {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            cart[index].quantity++;


            saveCart();

            displayCart();

        });

    });


    // ===============================
    // DIMINUER QUANTITÉ
    // ===============================

    document.querySelectorAll(".decrease").forEach(button => {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            if (cart[index].quantity > 1) {

                cart[index].quantity--;

            } else {

                cart.splice(index, 1);

            }


            saveCart();

            displayCart();

        });

    });


    // ===============================
    // SUPPRIMER
    // ===============================

    document.querySelectorAll(".remove").forEach(button => {

        button.addEventListener("click", function () {

            const index =
                Number(this.dataset.index);


            cart.splice(index, 1);


            saveCart();

            displayCart();

        });

    });

}


// ===============================
// AJOUTER AU PANIER
// ===============================

document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", function () {

        const id =
            this.dataset.id;

        const name =
            this.dataset.name;

        const price =
            Number(this.dataset.price);

        const image =
            this.dataset.image;


        // Chercher le produit

        const existingProduct =
            cart.find(product => product.id === id);


        // Si déjà présent

        if (existingProduct) {

            existingProduct.quantity++;

        }

        // Sinon nouveau produit

        else {

            cart.push({

                id: id,

                name: name,

                price: price,

                image: image,

                quantity: 1

            });

        }


        // Sauvegarder

        saveCart();


        // Actualiser l'affichage

        displayCart();


        // Animation du bouton

        const originalText =
            this.textContent;


        this.textContent =
            "✓ Ajouté";


        this.classList.remove("btn-dark");

        this.classList.add("btn-success");


        setTimeout(() => {

            this.textContent =
                originalText;

            this.classList.remove("btn-success");

            this.classList.add("btn-dark");

        }, 1000);

    });

});


// ===============================
// VIDER LE PANIER
// ===============================

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


// ===============================
// AFFICHAGE INITIAL
// ===============================

displayCart();

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const allProducts = document.querySelectorAll(".add-to-cart");

searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchText = searchInput.value
        .trim()
        .toLowerCase();

    let found = false;

    allProducts.forEach(button => {

        const productCard = button.closest(".col-md-4");

        const productName = button.dataset.name.toLowerCase();

        if (
            searchText === "" ||
            productName.includes(searchText)
        ) {

            productCard.style.display = "";

            found = true;

        } else {

            productCard.style.display = "none";

        }

    });


    // Message si aucun produit n'est trouvé

    let noResult = document.getElementById("no-result");

    if (!noResult) {

        noResult = document.createElement("div");

        noResult.id = "no-result";

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

        document.querySelector(".row.g-4").prepend(noResult);

    }


    if (found || searchText === "") {

        noResult.style.display = "none";

    } else {

        noResult.style.display = "block";

    }

});


// Rechercher aussi lorsque l'utilisateur efface le texte

searchInput.addEventListener("input", function() {

    if (this.value.trim() === "") {

        allProducts.forEach(button => {

            const productCard =
                button.closest(".col-md-4");

            productCard.style.display = "";

        });

        const noResult =
            document.getElementById("no-result");

        if (noResult) {

            noResult.style.display = "none";

        }

    }

});

const boutonCommande = document.getElementById("passerCommande");
const formulaire = document.getElementById("formLivraison");

boutonCommande.addEventListener("click", function () {
    formulaire.classList.add("active");

    formulaire.scrollIntoView({
        behavior: "smooth"
    });
});
