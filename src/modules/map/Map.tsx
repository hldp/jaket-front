import React, { Fragment } from "react";
import './Map.css';
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { MarkerObject } from "../../models/marker-object.model";
import { Station } from "../../models/station.model";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import MapService from "./Map.service";
import { Adress } from "../../models/adress.model";
import StationsApi from "../services/stationsAPI.service";
import { Subscription } from "rxjs";
import { connect } from "react-redux";
import { Area } from "../../models/area.model";

// Props, state
class Map extends React.Component<{ 
    centerOn?: Adress | null,
    radius?: number,
    height: string,
    enableStationPopup?: boolean
    stationFilter: any,
    dispatch: any
 }, { geolocation: { marker: MarkerObject, circle: L.Circle | null } | null, clusters: Array<Array<MarkerObject>>, radius: L.Circle | null }> {

    public map: L.Map | null;

    private mapService: MapService;
    private mapCenter: LatLngExpression;
    private stationsApi: StationsApi = new StationsApi();
    private stations_request: Subscription | undefined;

    constructor(props: any) {
        super(props);
        this.map = null;
        this.mapCenter = [46.227638, 2.213749];
        this.mapService = new MapService();
        this.state = {
            geolocation: null,
            clusters: [],
            radius: null
        };
        this.mapCreated = this.mapCreated.bind(this);
    }

    componentDidMount() {
        this.loadStations();
    }

    componentWillUnmount() {
        if (this.stations_request) this.stations_request.unsubscribe();
    }

    componentDidUpdate(previousProps: any, previousState: any){
        if (this.props.centerOn != null && this.map) {
            if (this.props.centerOn.label === 'position') {
                this.subscribeToGeolocation(true);
            }
            else {
                this.mapCenter = [this.props.centerOn.latitude, this.props.centerOn.longitude];
                this.map.flyTo(this.mapCenter, 13, { animate: false });
            }
        }
        if (previousProps.stationFilter !== this.props.stationFilter) {
            this.updateRadius();
            this.loadStations();
            this.centerMap();
        }
    }

    public mapCreated(map: any) {
        this.map = map;
        this.centerMap();
    }

    /**
     * Center the map on :
     * - the filter city if exist
     * - else the user geolocation if available
     * - else the default position
     */
    private centerMap() {
        let panToUserPosition: boolean = true;

        if (this.props.stationFilter.selectedCity == null) {
            panToUserPosition = this.props.centerOn ? false : true;
        } else {
            panToUserPosition = false;
            this.map?.flyTo(
                [
                    this.props.stationFilter.selectedCity.latitude, 
                    this.props.stationFilter.selectedCity.longitude
                ],
                Math.round(Math.abs(Math.pow(this.props.stationFilter.radius,1/8.5) - 12)), 
                {animate: false}
            );
        }
        this.subscribeToGeolocation(panToUserPosition);
    }

    /**
     * Update radius circle on the map
     */
    private updateRadius(): void {
        this.setState({ radius: L.circle([
            this.props.stationFilter.selectedCity.latitude, 
            this.props.stationFilter.selectedCity.longitude
        ], this.props.stationFilter.radius*1000)})
        setTimeout(() => this.setState({ radius: null }), 2000);
    }

    private loadStations() {
        this.setState({ clusters: [] });
        let selectedGas = this.props.stationFilter.selectedGas;
        let area;
        if (this.props.stationFilter.selectedCity != null) {
            area = {
                radius: this.props.stationFilter.radius,
                coordinate: [this.props.stationFilter.selectedCity.latitude, this.props.stationFilter.selectedCity.longitude]
            }
        }
        this.stations_request = this.stationsApi.getStations(
                ["position"],
                selectedGas,
                area
            ).subscribe((stations: Station[]) => {
                this.displayStations(stations);
            });
    }

    /**
     * Display all stations received on the map
     */
    private displayStations(stations: Station[]) {
        let cluster: MarkerObject[] = [];
        stations.forEach((station: Station) => {
            cluster.push(this.mapService.getStationMarker(station));
        });
        this.addCluster(cluster);
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
     * Subscribe to navigator geolocation events.
     * When an event is triggered, a marker is created on the map
     */
    private subscribeToGeolocation(panToUserPosition:boolean) {
        this.setState({ geolocation: null })
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition((position) =>
            {
                

                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                let marker = {
                    id: 0,
                    position: L.latLng(latitude, longitude),
                    icon: L.divIcon({className: 'marker', html: '<i class="marker-position"></i>'})
                };

                let circle = (position.coords.accuracy)?L.circle([latitude, longitude], position.coords.accuracy):null;

                this.setState({ geolocation: { marker: marker, circle: circle }})

                if (panToUserPosition && this.map) {
                    this.mapCenter = [latitude, longitude];
                    this.map.flyTo(this.mapCenter, 17, {
                        animate: false, 
                    });
                }
            }, () => {
                if (this.map) {
                    this.mapCenter = [43.552550, 7.022886];
                    this.map.flyTo(this.mapCenter, this.map.getZoom(), {
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
                if(this.props.enableStationPopup === undefined || this.props.enableStationPopup === true){
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
                    else {
                        this.mapCenter = e.target.getLatLng();
                        this.map?.flyTo(this.mapCenter, 17, {animate: false});
                    }

                    e.target.openPopup();
                }

            },
          }}>
            {
                (marker.popup && this.props.enableStationPopup) ?
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
    public renderGeolocation() {
        if (this.state.geolocation) {
            let marker = this.getMarker(this.state.geolocation.marker, '0');
            let circle = (this.state.geolocation.circle)?
                        <Circle key={`circle-0`} center={this.state.geolocation.circle.getLatLng()} radius={this.state.geolocation.circle.getRadius()} weight={1} className="position-circle"/>:
                        null
            return <Fragment>{marker} {circle != null?circle:null}</Fragment>;
        }
        else return null;
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
                <MapContainer center={[46.227638, 2.213749]} style={{ height: this.props.height }}
                              zoom={6} scrollWheelZoom={true} className="map" trackResize={false} doubleClickZoom={true} 
                              zoomControl={true} whenCreated={this.mapCreated}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}{r}.png?lang=FR"
                    />

                    {this.renderGeolocation()}

                    {this.renderClusters()}

                    {
                        this.state.radius != null ?
                        <Circle key={`circle-radius`} center={this.state.radius.getLatLng()} radius={this.state.radius.getRadius()} fill={false} weight={1} className="radius-circle"/>:
                        null
                    }
                    
                </MapContainer>
            </div>
        );
    }

}

const mapStateToProps = (state: any) => {
    return {
      stationFilter: state.stationFilter
    }
}
export default connect(mapStateToProps)(Map);