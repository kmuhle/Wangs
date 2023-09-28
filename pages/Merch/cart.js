var cart = {};
if (sessionStorage.getItem("cart")) {
    cart = JSON.parse(sessionStorage.getItem("cart"));
}

var tbody = document.getElementById("tbody");

for (var id in cart) {
    var item = cart[id];

    var tr = document.createElement('tr')

    var title_td = document.createElement('td')
    title_td.textContent = item.title
    tr.appendChild(title_td)


    var price_td = document.createElement("td");
    price_td.textContent = item.price;
    tr.appendChild(price_td);

    var qty_td = document.createElement("td");
    qty_td.textContent = item.qty;
    tr.appendChild(qty_td);

    tbody.appendChild(tr)
}