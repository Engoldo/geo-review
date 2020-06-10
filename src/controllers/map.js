module.exports = {

    mapInit: function() {
        return this.getGeolocation()
            .then(coordinates => this.makeMap(coordinates))
            .then(() => this.clusterer());
    },

    makeMap: function(coordinates) {
        let map = document.querySelector('#map-id');

        ymaps.map = new ymaps.Map(map, {
            center: coordinates,
            zoom: 10
        });
    },
  
    getGeolocation: () => {
        return ymaps.geolocation.get({ provider: 'auto' })
            .then(res => res.geoObjects.position);
    },

    clusterer: () => {
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
    }
};