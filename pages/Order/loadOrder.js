/* Global variables */
var food_data = [],
    order_data = [];

/* functions */
function fill_table(id, array) {
    document.getElementById(id).innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        if (array[i].count > 0) {
            let info =
                "<tr><td>" +
                array[i].name +
                "</td><td>" +
                array[i].count +
                "</td><td>" +
                array[i].price +
                " per count</td><td>$ " +
                array[i].price * array[i].count +
                "</td></tr>";
            document.getElementById(id).innerHTML += info;
        }
    }

    if (document.getElementById(id).innerHTML === "") {
        document.getElementById(id).innerHTML = "<h4>Empty Cart</h4>";
    } else {
        document.getElementById(id).innerHTML =
            "<tr><td>Name</td><td>Counts</td>" +
            "<td>Unit Price</td><td>Total</td></tr>" +
            document.getElementById(id).innerHTML;
    }
}

function add_cart_button() {
    let button = document.createElement("button");
    button.innerHTML = "PLACE ORDER";
    button.type = "button";
    button.className = "cart-button";
    button.addEventListener("click", function () {
        if (order_data.length > 0) {
            for (let i = 0; i < food_data.length; i++) {
                order_data[i].count += food_data[i].count;
                food_data[i].count = 0;
            }
        } else {
            for (let i = 0; i < food_data.length; i++) {
                order_data.push(JSON.parse(JSON.stringify(food_data[i])));
                food_data[i].count = 0;
            }
        }
        document.getElementById("cart").removeChild(button);
        sessionStorage.setItem("food_data", JSON.stringify(food_data));
        sessionStorage.setItem("order_data", JSON.stringify(order_data));
        fill_table("order-display", food_data);
        fill_table("ordered-display", order_data);
        add_bill_button();
    });
    document.getElementById("cart").appendChild(button);
}

function add_bill_button() {
    if (document.getElementById("remv")) {
        document.getElementById("remv").remove();
    }
    document.getElementById("bill").innerHTML +=
        "<p id='remv'><input type='radio' checked='checked' name='sl'>" +
        "Pickup   <input type='radio' name='sl'/>Dine in</p>";
    let button = document.createElement("button");
    button.innerHTML = "Submit Payment";
    button.type = "button";
    button.className = "bill-button";
    button.addEventListener("click", function () {
        if (!confirm("Are you sure you want to checkout?")) {
            return;
        }
        let output = payment();
        sessionStorage.setItem("food_data", JSON.stringify(food_data));
        sessionStorage.setItem("order_data", JSON.stringify(order_data));
        sessionStorage.setItem("finished", output);
        document.getElementById("bill").removeChild(button);
    });
    document.getElementById("remv").appendChild(button);
}

function payment() {
    let total = 0;
    let member = sessionStorage.getItem("member?") ? true : false;
    let output;

    document.getElementById("pay-display").innerHTML = "";

    for (let i = 0; i < food_data.length; i++) {
        total += order_data[i].count * order_data[i].price;
        food_data[i].count = 0;
        order_data[i].count = 0;
    }

    tax = total * 0.0625;
    total = member ? total * 0.9 : total;
    subtotal = total + tax;

    if (member) {
        output =
            "<li>Subtotal (member discounted): $ " +
            total.toFixed(2) +
            "</li><li>Tax: $" +
            tax.toFixed(2) +
            "</li><li>Total: $" +
            subtotal.toFixed(2) +
            "</li>";
    } else {
        output =
            "<li>Subtotal: $ " +
            total.toFixed(2) +
            "</li><li> Tax: $ " +
            tax.toFixed(2) +
            "</li><li>Total: $ " +
            subtotal.toFixed(2) +
            "</li>";
    }
    document.getElementById("pay-display").innerHTML = output;
    document.getElementById("display").innerHTML =
        "<h5>Thank you for choosing us!</h5>";

    return output;
}

if (sessionStorage.getItem("food_data") !== null) {
    food_data = JSON.parse(sessionStorage.getItem("food_data"));
} else {
    food_data = [];
}

if (sessionStorage.getItem("order_data") !== null) {
    order_data = JSON.parse(sessionStorage.getItem("order_data"));
} else {
    order_data = [];
}

if (sessionStorage.getItem("finished") !== null) {
    document.getElementById("display").innerHTML =
        "<h5>Thank you for choosing us!</h5>";
    document.getElementById("pay-display").innerHTML =
        sessionStorage.getItem("finished");
} else {
    fill_table("order-display", food_data);
    fill_table("ordered-display", order_data);

    if (
        document.getElementById("order-display").innerHTML !==
        "<h4>Empty Cart</h4>"
    ) {
        add_cart_button();
    }

    if (
        document.getElementById("ordered-display").innerHTML !==
        "<h4>Empty Cart</h4>"
    ) {
        add_bill_button();
    }
}
