import React from "react";
import './Map.css';
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { MarkerObject } from "../../models/marker-object.model";
import { Station } from "../../models/station.model";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Schedule } from "../../models/schedule.model";

// Props, state
class Map extends React.Component<{ stations: Array<Station> }, { markers: Array<MarkerObject>, clusters: Array<Array<MarkerObject>>, circles: Array<L.Circle> }> {

    public map: L.Map | null;

    constructor(props: any) {
        super(props);
        this.addMarker = this.addMarker.bind(this);
        this.map = null;
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
            cluster.push(this.getStationMarker(station));
        });
        this.addCluster(cluster);
    }

    /**
     * Get the current day schedule from a list of schedules
     * @param schedules 
     */
    private getCurrentDateSchedule(schedules: Schedule[]): Schedule | undefined {
        let date = new Date();
        let dateDay = date.getDay();
        if (dateDay === 0) dateDay = 7;
        let daySchedule: Schedule | undefined;
        schedules.forEach((schedule: Schedule) => {
            if (schedule.id === dateDay) daySchedule = schedule;
        });
        return daySchedule;
    }

    /**
     * Return if a station is opened now
     * @param schedules 
     * @returns 
     */
    private isStationOpened(daySchedule: Schedule | undefined): boolean {
        let date = new Date();
        if (daySchedule) {
            const start = daySchedule.opening.getHours() * 60 + daySchedule.opening.getMinutes();
            const end = daySchedule.closing.getHours() * 60 + daySchedule.closing.getMinutes();
            const now = date.getHours() * 60 + date.getMinutes();
            return (start <= now && now <= end)
        }
        return false;
    }

    /**
     * Format a date with format hh:mm am/pm
     * @param date 
     * @returns 
     */
    private formatDate(date: Date) {
        let hours = date.getHours()+1;
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let strTime = hours + ':' + (minutes < 10 ? '0'+minutes : minutes) + ' ' + ampm;
        return strTime;
      }

    /**
     * Add a station to the map
     */
    private getStationMarker(station: Station) {

        let markerIcon = L.divIcon({className: 'marker', html: '<i class="marker-circle company-step-'+1+'"></i><i class="marker-icon"></i>'});

        let popupHtml = '<div class="infobulle" style="height:320px;">';
        if (station.name) popupHtml += '<p style="text-align: center; font-weight: bold; font-size: 18px;">'+station.name+'</p>';
        if (station.address) popupHtml += '<p class="marker-popup-item address-icon">'+station.address+'</p>';
        if (station.schedules) {
            let daySchedule = this.getCurrentDateSchedule(station.schedules);
            if (daySchedule) {
                let is_opened = this.isStationOpened(daySchedule)
                popupHtml += '<p>'+
                '<span class="'+(is_opened?'opened-text':'closed-text')+'">'+
                (is_opened?'Open':'Close')+'</span> • '+
                (is_opened?'Closing at':'Opening at')+' '+this.formatDate(is_opened?daySchedule.closing:daySchedule.opening)
                +'</p>';
            }
        }
        if (station.prices) {
            station.prices.forEach((price) => {
                popupHtml += '<p><span class="gas-name">'+price.gas_name+'</span> : '+price.price+' €</p>';
            });
        }
        popupHtml += '</div>';

        return new MarkerObject(station.id, 
            L.latLng(station.latitude, station.longitude), 
            markerIcon, 
            {
                content: popupHtml,
                autoPan : true, 
                minWidth: 320,
                maxWidth : 320, 
                maxHeight : 320,
            }, true
        );
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

            clusters.push(<MarkerClusterGroup>{cluster_markers}</MarkerClusterGroup>)
        });
        return clusters;
    }
    
    /**
     * Render the component
     * @returns 
     */
    render(): React.ReactNode {
        return(
            <div className="map-container">
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