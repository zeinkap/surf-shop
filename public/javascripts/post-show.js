 // alert for delete submit
 let postDeleteForm = document.querySelector('#postDeleteForm');
 postDeleteForm.addEventListener('submit', (event) => {
     alert('Are you sure you want to delete this post?');
 });

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