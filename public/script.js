// ===============================
// LOAD MENU
// ===============================

async function loadMenu() {
    try {
        const response = await fetch("/api/menu");
        const data = await response.json();

        document.getElementById("menuCount").textContent = data.length;

        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Available</th>
                </tr>
        `;

        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                    <td>${item.category || "-"}</td>
                    <td>${item.available ? "Yes" : "No"}</td>
                </tr>
            `;
        });

        html += `
            </table>
        `;

        document.getElementById("menuContainer").innerHTML = html;

    } catch (error) {
        document.getElementById("menuContainer").innerHTML =
            "Error loading menu";

        console.error(error);
    }
}


// ===============================
// LOAD CUSTOMERS
// ===============================

async function loadCustomers() {
    try {
        const response = await fetch("/api/customers");
        const data = await response.json();

        document.getElementById("customerCount").textContent = data.length;

        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                </tr>
        `;

        data.forEach(customer => {
            html += `
                <tr>
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.email || "-"}</td>
                </tr>
            `;
        });

        html += `
            </table>
        `;

        document.getElementById("customerContainer").innerHTML = html;

    } catch (error) {
        document.getElementById("customerContainer").innerHTML =
            "Error loading customers";

        console.error(error);
    }
}


// ===============================
// LOAD ORDERS
// ===============================

async function loadOrders() {
    try {
        const response = await fetch("/api/orders");
        const data = await response.json();

        document.getElementById("orderCount").textContent = data.length;

        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
        `;

        data.forEach(order => {
            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.item_name}</td>
                    <td>${order.quantity}</td>
                    <td>₹${order.total_price}</td>
                    <td>${order.status}</td>
                </tr>
            `;
        });

        html += `
            </table>
        `;

        document.getElementById("orderContainer").innerHTML = html;

    } catch (error) {
        document.getElementById("orderContainer").innerHTML =
            "Error loading orders";

        console.error(error);
    }
}


// ===============================
// LOAD INVENTORY
// ===============================

async function loadInventory() {
    try {
        const response = await fetch("/api/inventory");
        const data = await response.json();

        document.getElementById("inventoryCount").textContent = data.length;

        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                </tr>
        `;

        data.forEach(item => {
            html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.item_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unit || "-"}</td>
                </tr>
            `;
        });

        html += `
            </table>
        `;

        document.getElementById("inventoryContainer").innerHTML = html;

    } catch (error) {
        document.getElementById("inventoryContainer").innerHTML =
            "Error loading inventory";

        console.error(error);
    }
}


// ===============================
// LOAD TABLES
// ===============================

async function loadTables() {
    try {
        const response = await fetch("/api/tables");
        const data = await response.json();

        document.getElementById("tableCount").textContent = data.length;

        let html = `
            <table>
                <tr>
                    <th>ID</th>
                    <th>Table Number</th>
                    <th>Capacity</th>
                    <th>Status</th>
                </tr>
        `;

        data.forEach(table => {
            html += `
                <tr>
                    <td>${table.id}</td>
                    <td>Table ${table.table_number}</td>
                    <td>${table.capacity}</td>
                    <td>${table.status}</td>
                </tr>
            `;
        });

        html += `
            </table>
        `;

        document.getElementById("tableContainer").innerHTML = html;

    } catch (error) {
        document.getElementById("tableContainer").innerHTML =
            "Error loading tables";

        console.error(error);
    }
}


// ===============================
// LOAD EVERYTHING
// ===============================

loadMenu();
loadCustomers();
loadOrders();
loadInventory();
loadTables();