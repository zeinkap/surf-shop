// function confirmDelete() {
//     let x = confirm("Are you sure you want to delete this post?");
//     if (x)
//         return true;
//     else
//       return false;
// }

mapboxgl.accessToken = 'pk.eyJ1IjoiemVpbmthcCIsImEiOiJjazVoNHpzZDIwMDRjM2ptbjEwN3luN203In0.Nca_LAtI_ck6yV-OuhJU1Q';
 
 const map = new mapboxgl.Map({
     container: 'map',
     style: 'mapbox://styles/mapbox/light-v10',
     center: post.coordinates,
     zoom: 6
 });
 
 // create a HTML element for our post location/marker 
 let el = document.createElement('div');
 el.className = 'marker';

 // make a marker for our location and add to the map
 new mapboxgl.Marker(el)
 .setLngLat(post.coordinates)
 .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
 .setHTML('<h3>' + post.title + '</h3><p>' + post.location + '</p>'))
 .addTo(map);

 // Toggle edit review form 
$('.toggle-edit-form').on('click', function() {
    $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
    // toggle visibility of edit review form
    $(this).siblings('.edit-review-form').toggle();
})

// add click listener for clearing of rating from edit/review form
$('.clear-rating').click(function() {
    $(this).siblings('.input-no-rate').click();
});