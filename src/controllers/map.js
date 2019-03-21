let events = require('./events');

module.exports = {

    mapInit: function() {
        return this.getGeolocation()
            .then(coordinates => this.makeMap(coordinates))
            .then(() => this.clusterer());
    },

    makeMap: function(coordinates) {
        let map = document.querySelector('#map-id');

        map.makeMap = new ymaps.Map(map, {
            center: coordinates,
            zoom: 10
        });
    },
  
    getGeolocation: () => {
        return ymaps.geolocation.get({ provider: 'auto' })
            .then(res => res.geoObjects.position);
    },

    clusterer: () => {
        console.log(ymaps)
        try {
            ymaps.clusterer = new ymaps.Clusterer({
                clusterDisableClickZoom: true,
                clusterOpenBalloonOnClick: true,
                clusterBalloonContentLayout: 'cluster#balloonCarousel'
            });

            ymaps.map.geoObjects.add(ymaps.clusterer);
            
        } catch (err) {
            console.log(err);
        }        
    },

    createPlacemark: data => {
        console.log('createplacemark')
        let { coordinates, address, place, name, review, time } = data;
        let placemark = new ymaps.Placemark(coordinates, 
            {
                coordinates: coordinates,
                place: place,
                name: name,
                review: review,
                time: time,
                address: address,
                balloonContentHeader: place,
                balloonContentBody: `<div class="baloon-content">
                                    <a href="#" class="placelink" data-coordinates="${coordinates.join()}">${place}</a>
                                    <br>${name}: ${review}</div>`,
                balloonContentFooter: `<div class="baloon-footer">${time}</div>` 

            },
            {
                preset: 'islands#redIcon',
                openBaloonOnclick: false
            }    
        );

        let objectReview = map.objectReview || [];
        objectReview.push(data);

        map.objectReview = objectReview;
        map.clusterer.add(placemark);
    },
    
    geoCode: coordinates => {
        console.log('geocode')
        return ymaps.geocode(coordinates)
            .then(result => result.geoObjects.get(0).properties.get('name'));
    }    
};