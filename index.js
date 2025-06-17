import menuArray from './data.js'


const menuSection = document.getElementById('menu-section')
const cartSection = document.getElementById('cart-section')
const cardForm = document.querySelector('.card-form')
const cart = []



document.addEventListener("click", function (e) {

    if (e.target.closest('.add-icon-container')) {
        const menuId = e.target.closest('.add-icon-container')
        const itemId = Number(menuId.dataset.menu)
        handleAddToCart(itemId)
    }

    else if (e.target.matches(".item-remove-btn")) {
        const itemId = Number(e.target.dataset.remove)
        handleRemoveFromCart(itemId)
    }

    else if (e.target.matches(".complete-order-btn")) {
        handleCompleteOrder()
    }

})

cardForm.addEventListener('submit', handlePayBtn)

function handleAddToCart(itemId) {

    const existingItem = cart.find(item => item.id === itemId)

    if (existingItem) {
        existingItem.quantity++
    }
    else {
        const menuItem = menuArray.find(item => item.id === itemId)
        cart.push({
            name: menuItem.name,
            price: menuItem.price,
            id: itemId,
            quantity: 1
        })

    }

    console.log(cart)
    renderCart()
}

function handleRemoveFromCart(itemId) {
    const item = cart.find(item => item.id === itemId)

    if (item) {
        item.quantity--

        if (item.quantity === 0) {
            const index = cart.findIndex(item => item.id === itemId)

            cart.splice(index, 1)
        }
    }
    renderCart()
}

function handleCompleteOrder() {
    document.getElementById('card-modal').classList.remove('hidden')
}

function handlePayBtn(e) {
    e.preventDefault()

    document.getElementById('card-modal').classList.add('hidden')
    cardForm.reset()
    cartSection.innerHTML = `
            <div class="thanks-div">
                <h3 class="thanks-text">Thanks, Mikki! Your order is on its way!<h3>
            </div>`
}


function renderCart() {

    cartSection.innerHTML = ''

    if (cart.length === 0) {
        return
    }

    // 1. Render "Your Order" heading
    const orderHeading = `<h3 class="your-order-text">Your Order</h3>`

    // 2. Render each cart item
    const cartItemsHTML = cart.map(item => {

        return `    <div class="cart-item">
                        <div class="item-info">
                            <span class="item-name">${item.name}</span> <span class="item-quantity">x${item.quantity}</span>
                            <button class="item-remove-btn" data-remove="${item.id}">remove</button>
                        </div>
                        <span class="item-price">$${item.price * item.quantity}</span>
                    </div>`

    }).join('')

    // 3. Compute total price
    const totalPrice = cart.reduce((total, currentItem) => {
        return total + currentItem.price * currentItem.quantity
    }, 0)

    // 4. Render complete order section
    const completeOrderHTML = `
                        <div class="complete-order">
                            <div class="complete-order-text">
                                <span class="order-text-price">Total price:</span>
                                <span class="order-price">$${totalPrice}</span>
                            </div>
                            <button class="complete-order-btn">Complete order</button>
                        </div>`

    // 5. Append everything into cart section
    cartSection.innerHTML = orderHeading + cartItemsHTML + completeOrderHTML

}

function getMenuHTML(menu) {

    return menu.map(menuItems => {

        const { name, ingredients, id, price, emoji } = menuItems

        return `    <div class="menu">
                        <p class="menu-emoji">${emoji}</p>
                        <div class="menu-desc">
                            <h2 class="menu-name">${name}</h2>
                            <p class="menu-ingredients">${ingredients}</p>
                            <p class="menu-price">$${price}</p>
                        </div>
                        <div class="add-icon-container"
                            role="button"
                            tabindex="0"
                            aria-label="Add item to order"
                            data-menu="${id}">
                            <i class="fa-solid fa-plus icon"></i>
                        </div>
                    </div>`

    }).join('')

}

function renderHtml() {

    menuSection.innerHTML += getMenuHTML(menuArray)
}

renderHtml()
