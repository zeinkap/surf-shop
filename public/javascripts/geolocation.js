function ipLookUp() {
    const address = document.querySelector('#address');
    address.textContent = '';
    $.ajax('http://ip-api.com/json')
        .then(
            function success(response) {
                address.textContent = 'User location data: ' + JSON.stringify(response);
                console.log('User\'s Location Data', response);
                getAdress(response.lat, response.lon)
            },

            function fail(data, status) {
                console.log('Request failed. Returned status of', status);
            }
        );
}

function getAddress(latitude, longitude) {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');

    mapLink.href = '';
    mapLink.textContent = '';
    $.ajax(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapKey}`)
        .then(
            function success(response) {
                status.textContent = '';
                mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
                mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
                console.log('User\'s Address Data is ', response);
            },
            function fail(status) {
                console.log('Request failed. Returned status of', status);
            }
        )
}

if ("geolocation" in navigator) {
    // check if geolocation is supported/enabled on current browser
    navigator.geolocation.getCurrentPosition(
     function success(position) {
       // for when getting location is a success
       getAddress(position.coords.latitude, 
                  position.coords.longitude)
     },
    function error(err) {
        // for when getting location results in an error
        console.error('Unable to retrieve your location', err)
        ipLookUp()
    });
} else {
    console.log('Geolocation is not supported by your browser')
    ipLookUp()
}

document.querySelector('#find-me').addEventListener('click', ipLookUp);