module.exports = {

    mapInit: () => {
        return this.getGeolocation()
            .then(coordinates => this.makeMap(coordinates))
            .then(res => this.clusterer());
    },

    makeMap: coordinates => {
        let map = document.querySelector('#map');
        
        map.makeMap = new ymaps.Map(map, {
            center: coordinates,
            zoom: 10
        });
    },
  
    getGeolocation: () => {
        return map.getGeolocation.get({ provider: 'auto'})
            .then(res => res.geoObjects.position)
    },

    clusterer: () => {
        map.clusterer = new ymaps.Clusterer({
            clusterBalloonContentLayout: 'cluster#balloonCarousel',
            clusterDisableClickZoom: true,
            openBaloonOnclick: true
        });

        map.makeMap.geoObjects.add(map.clusterer);
    },

    createPlacemark: data => {
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
                preset: 'islands#blueStretchyIcon',
                openBaloonOnclick: false
            }    
        );

        let objectReview = map.objectReview || [];
        objectReview.push(data);

        map.objectReview = objectReview;
        map.clusterer.add(placemark);
    },
    
    geoCode: coordinates => {
        return map.geocode(coordinates)
            .then(result => result.geoObjects.get(0).properties.get('name'));
    }    
};