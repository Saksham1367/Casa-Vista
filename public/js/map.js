mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style:"mapbox://styles/mapbox/streets-v12",
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

console.log(coordinates);
const marker1 = new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML("<p>Exact Location Will Be Provided After Booking!!</p>")
)
.addTo(map);