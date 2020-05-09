if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    let removeCartItemButtons = document.getElementsByClassName('btn-danger');
    for (let i = 0; i < removeCartItemButtons.length; i++) {
        let button = removeCartItemButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    let quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    let addToCartButtons = document.getElementsByClassName('product-card-button')
    for (let i = 0; i < addToCartButtons.length; i++) {
        let button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked);
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
};

let stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,   // being sent from post-index-layout.ejs file
    locale: 'auto',
    // token is response method that server will return after purchase is completed and authenticated by stripe 
    token: function (token) {
        let posts = [];
        let cartItemContainer = document.getElementsByClassName('cart-items')[0];
        let cartRows = cartItemContainer.getElementsByClassName('cart-row');
        for (let i = 0; i < cartRows.length; i++) {
            let cartRow = cartRows[i];
            let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            let quantity = quantityElement.value;
            let id = cartRow.dataset.itemId;
            posts.push({
                id: id,
                quantity: quantity
            })
        }
        console.log(posts);
        console.log(token);

        // send data to server and get back info asynchronously
        fetch('/cart-charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                posts: posts
            })
        }).then(res => {
            return res.json();
        }).then(data => {
            console.log(data);
            alert(data.message);
            // remove all items from cart after user clicks ok on alert
            let cartItems = document.getElementsByClassName('cart-items')[0];
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild);
            }
            updateCartTotal();
            // if error when emptying cart
        }).catch(error => console.log(error));
    }
});

function purchaseClicked() {
    let priceElement = document.getElementsByClassName('cart-total-price')[0];
    // remove $ sign from price
    let price = parseFloat(priceElement.innerText.replace('$', '')) * 100;
    // open Stripe payment box
    stripeHandler.open({
        amount: price
    });
};

function removeCartItem(event) {
    let buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
};

function quantityChanged(event) {
    let input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
};

function addToCartClicked(event) {
    let button = event.target;
    let productItem = button.parentElement.parentElement;
    let title = productItem.getElementsByClassName('product-title')[0].innerText;
    let price = productItem.getElementsByClassName('product-price')[0].innerText;
    let imageSrc = productItem.getElementsByClassName('product-image')[0].src;
    let id = productItem.dataset.itemId;
    addItemToCart(title, price, imageSrc, id);
    updateCartTotal();
};

function addItemToCart(title, price, imageSrc, id) {
    let cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    cartRow.dataset.itemId = id;
    let cartItems = document.getElementsByClassName('cart-items')[0];
    let cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }
    let cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
};

function updateCartTotal() {
    let cartItemContainer = document.getElementsByClassName('cart-items')[0];
    let cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        let cartRow = cartRows[i];
        let priceElement = cartRow.getElementsByClassName('cart-price')[0];
        let quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        let price = parseFloat(priceElement.innerText.replace('$', ''));
        let quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
};