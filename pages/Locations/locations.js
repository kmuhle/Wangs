let map;
let locations;
let user_loc = [];
let user_marker;
let user_restaurant;

window.onload = function(){
    $.when(
        $.get("locations.json", function(locs) {
            locations = locs.locations;    
        })
    ).done(function(){
        make_map();
        make_location_table();  
    });
};

function make_map(){
    mapboxgl.accessToken = 'pk.eyJ1Ijoia211aGxlIiwiYSI6ImNsZXc1cXdpbjBhMmg0M3MzaTBvdW44dnoifQ.XmHXiG9o13RRtPTgo0hgHQ';
    map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3,
    center: [-98.5795, 39.8283],
    crossOrigin: true
    });

        
    locations.forEach(function(loc){
        var popup = new mapboxgl.Popup().setHTML(make_popup(loc));
        var marker = new mapboxgl.Marker({color:'#c8b146'})
            .setLngLat([loc.longitude, loc.latitude])
            .setPopup(popup)
            .addTo(map);

        marker.getElement().addEventListener('click', e => {
            var location_box = $("div[name='" + loc.name + "']");
            location_box.toggleClass('active');
            var info = location_box.next();
            info.slideToggle();
            var coordinates = marker.getLngLat();
            map.flyTo({ center: coordinates, zoom: 10 });
        });
    });
}

function make_user_marker(){
    if(user_marker != undefined){
        user_marker.remove();
    }
    var userLocation = [user_loc["long"], user_loc["lat"]];
    user_marker = new mapboxgl.Marker({color:"#d1292d"})
    .setLngLat(userLocation)
    .addTo(map);
    map.flyTo({center: userLocation, zoom: 10 });
}


function get_location() {
    var loc_promise = new Promise(function(resolve, reject) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                user_loc["long"] = position.coords.longitude;
                user_loc["lat"] = position.coords.latitude;
                resolve();
            });
        } else {
            reject("Unable to find location");
        }
    });

    loc_promise.then(function(){
        make_user_marker();
        make_location_table();
    },
    function(error){
        $("#error_message").html(error);
    });
}

function sort_locations() {
    locations.sort(function(loc1, loc2){
        var distance1 = calc_distance(user_loc["lat"], user_loc["long"], loc1.latitude, loc1.longitude);
        var distance2 = calc_distance(user_loc["lat"], user_loc["long"], loc2.latitude, loc2.longitude);
        return distance1 - distance2;
    });
    user_restaurant = locations[0];
}

function calc_distance(user_lat, user_long, loc_lat, loc_long){
    var u_lat = (user_lat * Math.PI) / 180;
    var u_long = (user_long * Math.PI) / 180;
    var l_lat = (loc_lat * Math.PI) / 180;
    var l_long = (loc_long * Math.PI) / 180;
    var distance_km = Math.acos(Math.sin(u_lat)*Math.sin(l_lat)+Math.cos(u_lat)*Math.cos(l_lat)*Math.cos(l_long-u_long))*6371;
    var distance_mi = distance_km * 0.621371;
    return distance_mi;
}

function make_location_table(){
    sort_locations();
    var t = "<div id='location_table' >";
    locations.forEach( function(location){
        t += "<div class='location' name ='" + location.name + "' onclick='show_info(event)'><h2><b>" + location.name + "</b></h2>" + location.address + "<br>";
        if(!isNaN(user_loc["lat"]) && !isNaN(user_loc["long"])){
            t += calc_distance(user_loc["lat"], user_loc["long"], location.latitude, location.longitude).toFixed(2) + " miles away";
        }
        t += "</div><div class='info' hidden></div>";
    });
    t += "</div>";
    document.getElementById("locations_block").innerHTML = t;
    make_info();
}

function make_info(){
    var info_divs = $(".info");
    $.each(info_divs, function(index, div){
        loc = locations[index];
        var phone_div = "<h4>Phone</h4><hr><div class='phone'>" + loc.phone + "</div>";
        var day_div = "<h4>Hours</h4><hr><div class='days'>";
        var hours_div = "<div class='hours'>";

        $.each(loc.hours, function(i, day){
            day_div += day.day + "  :<br>";
            hours_div += day.times  + "<br>";
        });

        day_div += "</div>";
        hours_div += "</div>";
        $(div).html(phone_div + day_div + hours_div);
    });
}

function show_info(e) {
    var location = $(e.target).closest('.location');
    location.toggleClass('active');
    var info = location.next();
    info.slideToggle();
    var curr_loc;

    if (location.hasClass('active')) {
        $.each(locations, function(i, loc){
            if(loc.name == location.attr("name")){
                curr_loc = loc;
            }
        })
        map.flyTo({center: [curr_loc.longitude, curr_loc.latitude], zoom: 10 });
    }
}

function get_address_location(){
    var address = $("#address_input").val();
    var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1Ijoia211aGxlIiwiYSI6ImNsZXc1cXdpbjBhMmg0M3MzaTBvdW44dnoifQ.XmHXiG9o13RRtPTgo0hgHQ";

    $.when(
        $.get(url, function(data) {
          user_loc["long"] = data.features[0].center[0];
          user_loc["lat"] = data.features[0].center[1];
        })
    ).done(function(){
        make_user_marker();
        make_location_table();
    });
}

function make_popup(location){
    var popupContent = "<div class='location-popup'>" +
        "<h2>" + location.name + "</h2>" + "<p>" + location.address + "</p>" + 
        "</div>";
    return popupContent
}
