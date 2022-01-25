import React from "react";
import './Map.css';
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { MarkerObject } from "../../models/marker-object.model";
import { Station } from "../../models/station.model";

// Props, state
class Map extends React.Component<{ stations: Array<Station> }, { markers: Array<MarkerObject>, circles: Array<L.Circle> }> {

    public map: L.Map | null;

    constructor(props: any) {
        super(props);
        this.addMarker = this.addMarker.bind(this);
        this.map = null;
        this.state = {
            markers: [],
            circles: []
        };
    }

    componentDidMount() {
        this.subscribeToGeolocation();
        this.displayStations();
    }

    /**
     * Display all stations received on the map
     */
    private displayStations() {
        this.props.stations.forEach((station: Station) => {
            this.addStationToMap(station);
        });
    }

    /**
     * Add a station to the map
     */
    private addStationToMap(station: Station) {

        let markerIcon = L.divIcon({className: 'marker', html: '<i class="marker-circle company-step-'+1+'"></i><i class="marker-icon"></i>'});

        let popupHtml = '<div class="infobulle" style="height:320px;">';
        if (station.name) popupHtml += '<p style="text-align: center; font-weight: bold; font-size: 18px;">'+station.name+'</p>';
        if (station.address) popupHtml += '<p class="marker-popup-item address-icon">'+station.address+'</p>';
        popupHtml += '</div>';

        this.addMarker({
            position: L.latLng(station.latitude, station.longitude),
            icon: markerIcon,
            popup: {
                content: popupHtml,
                autoPan : true, 
                minWidth: 320,
                maxWidth : 320, 
                maxHeight : 320
            }
        });

        // marker.off('click');
        // marker.counter = 1;
        // marker.namespaces = [];
        // marker.need_popup_update = false;


        // // Add to cluster
        // if (self.cluster_enable) {
        //     self.markerCluster.addLayer(marker);
        // }
        // else marker.addTo(self.map);

        // // update bounds
        // self.bounds.extend(marker.getLatLng());

        // marker.on('click', function() {
        //     //auto center marker on click
        //     if (self.center_on_click) {
        //         var map_height = $('.inner-map').height();
        //         var popup_height = 320;
        //         if(map_height >= popup_height) {
        //             var marker_lat_lng = map.project(marker.getLatLng());
        //             marker_lat_lng.y -= popup_height / 2;
        //             var marker_adjusted = map.unproject(marker_lat_lng);
        //             self.map.panTo(marker_adjusted);
        //         }
        //         else self.map.panTo(marker.getLatLng());
        //     }

        //     // check if popup is enable
        //     if (marker.infobubble_enable !== undefined) {
        //         if (marker.infobubble_enable === false) return;
        //     }
        //     else if (self.infobubble_enable !== undefined) {
        //         if (self.infobubble_enable === false) return;
        //     }

        //     marker.openPopup();
        // });
    }

    /**
     * Add a marker to the map
     * @param marker 
     */
    private addMarker(marker: MarkerObject) {
        const {markers} = this.state
        markers.push(marker)
        this.setState({markers})
    }

    /**
     * Add a circle to the map
     * @param circle 
     */
    private addCircle(circle: L.Circle) {
        const {circles} = this.state
        circles.push(circle)
        this.setState({circles})
    }

    /**
     * Subscribe to navigator geolocation events.
     * When an event is triggered, a marker is created on the map
     */
    private subscribeToGeolocation() {
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position) =>
            {
                let panToUserPosition = true;

                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                this.addMarker({
                    position: L.latLng(latitude, longitude),
                    icon: L.divIcon({className: 'marker', html: '<i class="marker-position"></i>'})
                });

                if (position.coords.accuracy) {
                    this.addCircle(L.circle([latitude, longitude], position.coords.accuracy));
                }

                if (panToUserPosition && this.map) {
                    this.map.flyTo([latitude, longitude], 17, {
                        animate: true, 
                    });
                }
            }, () => {
                if (this.map) {
                    this.map.flyTo([43.552550, 7.022886], this.map.getZoom(), {
                        animate: true,
                    });
                }
            });
        }
    }
    
    /**
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return(
            <div className="map-container">
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="map" trackResize={false} doubleClickZoom={true} zoomControl={true} whenCreated={(map) => { this.map = map }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png?lang=FR"
                    />

                    {this.state.markers.map((marker: MarkerObject, idx) => 
                        <Marker key={`marker-${idx}`} position={marker.position} icon={marker.icon}>
                            {
                                (marker.popup) ?
                                <Popup autoPan={marker.popup.autoPan} minWidth={marker.popup.minWidth} maxWidth={marker.popup.maxWidth} maxHeight={marker.popup.maxHeight}>
                                    <div dangerouslySetInnerHTML={{__html: marker.popup.content}} />
                                </Popup> 
                                : ''
                            }

                        </Marker>
                    )}
                    {this.state.circles.map((circle: L.Circle, idx) => 
                        <Circle key={`circle-${idx}`} center={circle.getLatLng()} radius={circle.getRadius()} weight={1} className="position-circle"/>
                    )}
                    
                </MapContainer>
            </div>
        );
    }

}

export default Map;