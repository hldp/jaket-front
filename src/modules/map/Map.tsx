import React from "react";
import './Map.css';
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { MarkerObject } from "../../models/marker-object.model";
import { Station } from "../../models/station.model";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Schedule } from "../../models/schedule.model";
import MapService from "./Map.service";

// Props, state
class Map extends React.Component<{ stations: Array<Station> }, { markers: Array<MarkerObject>, clusters: Array<Array<MarkerObject>>, circles: Array<L.Circle> }> {

    public map: L.Map | null;

    private mapService: MapService;

    constructor(props: any) {
        super(props);
        this.addMarker = this.addMarker.bind(this);
        this.map = null;
        this.mapService = new MapService();
        this.state = {
            markers: [],
            clusters: [],
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
        let cluster: MarkerObject[] = [];
        this.props.stations.forEach((station: Station) => {
            cluster.push(this.mapService.getStationMarker(station));
        });
        this.addCluster(cluster);
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
     * Add a marker cluster to the state
     * @param cluster 
     */
    private addCluster(cluster: MarkerObject[]) {
        const {clusters} = this.state
        clusters.push(cluster)
        this.setState({clusters})
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
                    id: 0,
                    position: L.latLng(latitude, longitude),
                    icon: L.divIcon({className: 'marker', html: '<i class="marker-position"></i>'})
                });

                if (position.coords.accuracy) {
                    this.addCircle(L.circle([latitude, longitude], position.coords.accuracy));
                }

                if (panToUserPosition && this.map) {
                    this.map.flyTo([latitude, longitude], 17, {
                        animate: false, 
                    });
                }
            }, () => {
                if (this.map) {
                    this.map.flyTo([43.552550, 7.022886], this.map.getZoom(), {
                        animate: false,
                    });
                }
            });
        }
    }

    /**
     * Get a marker element to display
     * @param marker 
     * @param id 
     * @returns 
     */
    private getMarker(marker: MarkerObject, id: string) {
        return <Marker key={`marker-${id}`} position={marker.position} icon={marker.icon} eventHandlers={{
            click: (e) => {
                //auto center marker on click
                let map_height = 600;
                let popup_height = 320;
                if(map_height >= popup_height) {
                    let marker_lat_lng = this.map?.project(e.target.getLatLng());
                    if (marker_lat_lng) {
                        marker_lat_lng.y -= popup_height / 2;
                        let marker_adjusted = this.map?.unproject(marker_lat_lng);
                        if (marker_adjusted) this.map?.panTo([marker_adjusted?.lat, marker_adjusted?.lng]);
                    }
                }
                else this.map?.flyTo(e.target.getLatLng(), 17, {animate: false});
                e.target.openPopup();
            },
          }}>
            {
                (marker.popup) ?
                <Popup autoPan={marker.popup.autoPan} minWidth={marker.popup.minWidth} maxWidth={marker.popup.maxWidth} maxHeight={marker.popup.maxHeight}>
                    <div dangerouslySetInnerHTML={{__html: marker.popup.content}} />
                </Popup> 
                : ''
            }
        </Marker>
    }

    /**
     * Render the markers on the map
     * @returns 
     */
    public renderMarkers() {
        let markers: JSX.Element[] = [];
        this.state.markers.forEach((marker: MarkerObject, idx) => {
            markers.push(this.getMarker(marker, ''+idx));
        });
        return markers;
    }

    /**
     * Render the marker clusters on the map
     * @returns 
     */
    public renderClusters() {
        let clusters: JSX.Element[] = [];

        this.state.clusters.forEach((cluster: MarkerObject[], idx) => {
            let cluster_markers: JSX.Element[] = [];

            cluster.forEach((marker: MarkerObject, id) => {
                cluster_markers.push(this.getMarker(marker, idx+'_'+id));
            });

            clusters.push(<MarkerClusterGroup key={'cluster_'+idx}>{cluster_markers}</MarkerClusterGroup>)
        });
        return clusters;
    }
    
    /**
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return(
            <div className="map-container" data-testid="map-container">
                <MapContainer center={[46.227638, 2.213749]} zoom={6} scrollWheelZoom={true} className="map" trackResize={false} doubleClickZoom={true} zoomControl={true} whenCreated={(map) => { this.map = map }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png?lang=FR"
                    />

                    {this.renderMarkers()}

                    {this.renderClusters()}

                    {this.state.circles.map((circle: L.Circle, idx) => 
                        <Circle key={`circle-${idx}`} center={circle.getLatLng()} radius={circle.getRadius()} weight={1} className="position-circle"/>
                    )}
                    
                </MapContainer>
            </div>
        );
    }

}

export default Map;