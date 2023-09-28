/* This is an ascii shark by Seal :)
                                 ,-
                               ,'::|
                              /::::|
                            ,'::::o\                                      _..
         ____........-------,..::?88b                                  ,-' /
 _.--"""". . . .      .   .  .  .  ""`-._                           ,-' .;'
<. - :::::o......  ...   . . .. . .  .  .""--._                  ,-'. .;'
 `-._  ` `":`:`:`::||||:::::::::::::::::.:. .  ""--._ ,'|     ,-'.  .;'
     """_=--       //'doo.. ````:`:`::::::::::.:.:.:. .`-`._-'.   .;'
         ""--.__     P(       \               ` ``:`:``:::: .   .;'
                "\""--.:-.     `.                             .:/
                  \. /    `-._   `.""-----.,-..::(--"".\""`.  `:\
                   `P         `-._ \          `-:\          `. `:\
                                   ""            "            `-._)
*/

// put all my const here
const path = "../../assets/content/food.json";

function foodTemplate(name, id, price, description, image_url) {
    this.name = name;
    this.id = id;
    this.price = price;
    this.description = description;
    this.image_url = image_url;
    this.count = 0;
}

// put all my var declarations here
var food_data = [];

/**
 * I need a function that:
 * a) loops through a json file
 * b) using info of each element in json to spawn a food-display
 */

function Init_display() {
    // get json data
    $.getJSON(path, function (data) {
        if (sessionStorage.getItem("food_data") !== null) {
            food_data = JSON.parse(sessionStorage.getItem("food_data"));
        } else {
            data.forEach(function (food) {
                let temp = new foodTemplate(
                    food.name,
                    food.id,
                    food.price,
                    food.description,
                    food.image_url
                );
                food_data.push(temp);
            });
        }

        for (let i = 0; i < food_data.length; i++) {
            // add food-display to grid
            let cur = document.createElement("div");
            cur.className = "food-display";
            cur.id = food_data[i].id + "-" + "food";

            document.getElementById("display-grid").appendChild(cur);

            // add image to food-display
            let target = document.createElement("a");
            target.target = "_blank";
            target.href = food_data[i].image_url;

            let img = document.createElement("img");
            img.src = food_data[i].image_url;
            img.width = "5vw";

            target.appendChild(img);

            $("div[class=food-display]")[i].appendChild(target);

            // add name price to food-display
            let text = document.createElement("div");
            text.className = "text-display";
            text.textContent = food_data[i].name + " | $" + food_data[i].price;
            $("div[class=food-display]")[i].appendChild(text);

            // add description to food-display
            let des = document.createElement("div");
            des.textContent = food_data[i].description;
            $("div[class=food-display]")[i].appendChild(des);

            // add count to food-display
            let count = document.createElement("div");
            count.className = "count-display";
            count.textContent = food_data[i].count + " ordered";
            $("div[class=food-display]")[i].appendChild(count);

            // add two buttons to food-display
            let butView = document.createElement("div");
            butView.className = "button-display";

            let butAdd = document.createElement("button");
            butAdd.id = cur.id + "-add";
            butAdd.addEventListener("click", function (event) {
                let id = parseInt(event.target.id);
                let count = parseInt(
                    $("div[class=count-display]")[id].textContent
                );
                count++;
                food_data[id].count = count;
                $("div[class=count-display]")[id].textContent =
                    count + "  ordered";
                sessionStorage.setItem("food_data", JSON.stringify(food_data));
            });
            butAdd.textContent = "ADD";

            let butMin = document.createElement("button");
            butMin.id = cur.id + "-min";
            butMin.addEventListener("click", function (event) {
                let id = parseInt(event.target.id);
                let count = parseInt(
                    $("div[class=count-display]")[id].textContent
                );
                count = count > 0 ? count - 1 : count;
                food_data[id].count = count;
                $("div[class=count-display]")[id].textContent =
                    count + "  ordered";
                sessionStorage.setItem("food_data", JSON.stringify(food_data));
            });
            butMin.textContent = "DROP";

            butView.appendChild(butAdd);
            butView.appendChild(butMin);

            sessionStorage.setItem("food_data", JSON.stringify(food_data));
            $("div[class=food-display]")[i].appendChild(butView);
        }
    }).fail(function (error) {
        console.error(error);
    });
}

Init_display();
