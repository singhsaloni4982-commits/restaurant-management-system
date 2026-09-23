// ===============================
// SHOPPING CART
// ===============================

let cart = [];


// ===============================
// LOAD MENU
// ===============================

async function loadUserMenu() {

    try {

        const response = await fetch("/api/menu");

        const data = await response.json();

        const container =
            document.getElementById("userMenuContainer");

        if (data.length === 0) {

            container.innerHTML =
                "<p>No menu items available.</p>";

            return;
        }

        let html = "";

        data.forEach(item => {

            html += `
                <div class="menu-card">

                    <div class="food-icon">
                        🍽️
                    </div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="category">
                        ${item.category || "Food"}
                    </p>

                    <p class="food-price">
                        ₹${item.price}
                    </p>

                    <p class="availability">
                        ${
                            item.available
                                ? "✅ Available"
                                : "❌ Not Available"
                        }
                    </p>

                    <button
                        onclick="addToCart(
                            ${item.id},
                            '${item.name}',
                            ${item.price}
                        )"
                        ${item.available ? "" : "disabled"}
                    >
                        Add to Cart
                    </button>

                </div>
            `;

        });

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("userMenuContainer").innerHTML =
            "<p>Unable to load menu.</p>";
    }
}


// ===============================
// ADD ITEM TO CART
// ===============================

function addToCart(id, name, price) {

    // Check if item already exists
    const existingItem =
        cart.find(item => item.id === id);


    if (existingItem) {

        // Increase quantity
        existingItem.quantity++;

    } else {

        // Add new item
        cart.push({

            id: id,

            name: name,

            price: Number(price),

            quantity: 1

        });
    }


    displayCart();


    // Scroll to cart
    document.getElementById("selectedOrder")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
}


// ===============================
// CHANGE ITEM QUANTITY
// ===============================

function changeQuantity(id, change) {

    const item =
        cart.find(item => item.id === id);


    if (!item) {
        return;
    }


    item.quantity += change;


    // Remove item if quantity becomes 0
    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);
    }


    displayCart();
}


// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    const container =
        document.getElementById("selectedOrder");

    const totalElement =
        document.getElementById("orderTotal");


    // Cart empty
    if (cart.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                Your cart is empty. Select food items from the menu.
            </p>
        `;

        totalElement.textContent = "₹0";

        return;
    }


    let html = "";

    let total = 0;


    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;


        total += itemTotal;


        html += `

            <div class="selected-food">

                <div>

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ₹${item.price} × ${item.quantity}
                    </p>

                    <strong>
                        ₹${itemTotal}
                    </strong>

                </div>


                <div class="quantity-control">

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        -
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>

        `;
    });


    container.innerHTML = html;


    // Display complete cart total
    totalElement.textContent =
        `₹${total}`;
}


// ===============================
// PLACE ORDER
// ===============================

async function placeOrder() {

    const customerName =
        document.getElementById("customerName")
            .value
            .trim();

    const customerPhone =
        document.getElementById("customerPhone")
            .value
            .trim();


    // Check customer name
    if (!customerName) {

        alert("Please enter your name.");

        return;
    }


    // Check phone
    if (!customerPhone) {

        alert("Please enter your phone number.");

        return;
    }


    // Check cart
    if (cart.length === 0) {

        alert("Please add at least one food item.");

        return;
    }
// Check table
if (!selectedTable) {

    alert("Please select a table before placing your order.");

    return;
}

    try {

        // =================================
        // PLACE EACH CART ITEM
        // =================================

        let orderResults = [];

        let grandTotal = 0;


        for (const item of cart) {

            const response =
                await fetch("/api/orders", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },
body: JSON.stringify({
    customer_name: customerName,
    customer_phone: customerPhone,
    item_name: item.name,
    quantity: item.quantity
})

                });


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    `Unable to order ${item.name}`
                );

                return;
            }


            const itemTotal =
                data.total_price ||
                item.price * item.quantity;


            grandTotal +=
                Number(itemTotal);


            orderResults.push({

                orderId:
                    data.orderId ||
                    data.id ||
                    "Created",

                name: item.name,

                quantity: item.quantity,

                total: itemTotal

            });
        }


        // =================================
        // SHOW ORDER RESULT
        // =================================

        document.getElementById("orderResult")
            .style.display = "block";


        let orderHTML = `

            <div class="success-card">

                <p>
                    <strong>Customer:</strong>
                    ${customerName}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${customerPhone}
                </p>

<p>
    <strong>🪑 Table:</strong>
    Table ${selectedTable.tableNumber}
</p>
        
                <hr>

                <h3>
                    Ordered Items
                </h3>

        `;


        orderResults.forEach(order => {

            orderHTML += `

                <p>

                    <strong>
                        ${order.name}
                    </strong>

                    × ${order.quantity}

                    = ₹${order.total}

                </p>

            `;

        });


        orderHTML += `

                <hr>

                <p>
                    <strong>
                        Grand Total:
                    </strong>

                    ₹${grandTotal}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>

                    Pending
                </p>

                <p>
                    <strong>
                        Payment:
                    </strong>

                    Pending
                </p>

            </div>

        `;


        document.getElementById("orderDetails")
            .innerHTML = orderHTML;


        alert("Order placed successfully!");


        // =================================
        // CLEAR CART
        // =================================

        cart = [];

        displayCart();


        // Reload menu
        loadUserMenu();


    } catch (error) {

        console.error(error);

        alert(
            "Server error while placing order."
        );
    }
}


// ===============================
// LOAD MENU ON PAGE OPEN
// ===============================

loadUserMenu();
// ===============================
// TABLE DATA
// ===============================

let selectedTable = null;


// ===============================
// LOAD TABLES
// ===============================

async function loadTables() {

    try {

        const response = await fetch("/api/tables");

        const tables = await response.json();

        const container =
            document.getElementById("tableContainer");

        if (tables.length === 0) {

            container.innerHTML =
                "<p>No tables available.</p>";

            return;
        }

        let html = "";

        tables.forEach(table => {

            const isAvailable =
                table.status === "Available";

            html += `
                <div class="table-card
                    ${isAvailable ? "available-table" : "reserved-table"}">

                    <div class="table-icon">
                        🪑
                    </div>

                    <h3>
                        Table ${table.table_number}
                    </h3>

                    <p>
                        Capacity: ${table.capacity} people
                    </p>

                    <p>
                        ${
                            isAvailable
                                ? "✅ Available"
                                : "❌ Reserved"
                        }
                    </p>

                    <button
                        onclick="selectTable(${table.id}, '${table.table_number}')"
                        ${isAvailable ? "" : "disabled"}
                    >
                        ${
                            isAvailable
                                ? "Select Table"
                                : "Not Available"
                        }
                    </button>

                </div>
            `;
        });

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        document.getElementById("tableContainer").innerHTML =
            "<p>Unable to load tables.</p>";
    }
}


// ===============================
// SELECT TABLE
// ===============================

async function selectTable(id, tableNumber) {

    try {

        const response = await fetch(
            `/api/tables/${id}/reserve`,
            {
                method: "PUT"
            }
        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message || "Unable to reserve table.");

            return;
        }

        selectedTable = {

            id: id,

            tableNumber: tableNumber

        };

        document.getElementById("selectedTableInfo")
            .innerHTML = `

                <strong>
                    🪑 Selected Table:
                </strong>

                Table ${tableNumber}

                <p>
                    ✅ Table reserved successfully
                </p>

            `;

        alert(`Table ${tableNumber} reserved successfully!`);

        // Refresh table list
        loadTables();

    } catch (error) {

        console.error(error);

        alert("Server error while reserving table.");
    }
}


// ===============================
// LOAD TABLES WHEN PAGE OPENS
// ===============================

loadTables();