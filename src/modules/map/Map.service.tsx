import { Station } from "../../models/station.model";
import L from "leaflet";
import { MarkerObject } from "../../models/marker-object.model";
import { Schedule } from "../../models/schedule.model";

class MapService {

    /**
     * Get a station marker
    */
    public getStationMarker(station: Station) {

        let markerIcon = L.divIcon({className: 'marker', html: '<i class="marker-circle company-step-'+1+'"></i><i class="marker-icon"></i>'});

        return new MarkerObject(station.id, 
            L.latLng(station.latitude, station.longitude), 
            markerIcon, 
            {
                content: '',
                autoPan : true, 
                minWidth: 320,
                maxWidth : 320, 
                maxHeight : 320,
            }, true
        );
    }

    /**
     * Get a station popup content
     * @param station 
     */
    public getStationPopup(station: Station) {
        let daySchedule = undefined;
        if (station.schedules) {
            daySchedule = this.getCurrentDateSchedule(station.schedules);
        }
        return (
            <div className="infobulle" style={{ height: '320px'}}>
                {(station.address) ? <p style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}> {station.address} </p> : ''}
                {/* {(station.address) ? <p className="marker-popup-item address-icon"> {station.address} </p> : ''} */}
                { (station.schedules) ?
                     (daySchedule) ? 

                        <p>
                            <span className={this.isStationOpened(station)?'opened-text':'closed-text'}>
                                {this.isStationOpened(station)?'Open':'Close'} 
                            </span>
                            {this.getPopupIsOpenText(station)}
                        </p>

                    : '' : ''
                }
                { (station.prices) ?
                        station.prices.map((price, i) => {
                            return (<p key={i} ><span className="gas-name"> {price.gas_name} </span> : {price.price} €</p>)
                        })
                    : ''
                }
            </div>
        );
    }

    /**
     * Get the text to display opening hours on a station popup
     * @param station
     */
    private getPopupIsOpenText(station: Station): string {
        let text = ' • ';
        const isStationOpened = this.isStationOpened(station);
        let daySchedule = undefined;
        if (station.schedules) daySchedule = this.getCurrentDateSchedule(station.schedules);
        text += isStationOpened?'Closing at ':'Opening at ';
        if (daySchedule) text += this.formatDate(isStationOpened?daySchedule.closing:daySchedule.opening)
        return text;
    }

    /**
     * Get the current day schedule from a list of schedules
     * @param schedules 
     */
     private getCurrentDateSchedule(schedules: Schedule[]): Schedule | undefined {
        let date = new Date(Date.now());
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
    public isStationOpened(station: Station): boolean {
        let daySchedule = this.getCurrentDateSchedule(station.schedules);
        let date = new Date(Date.now());
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
        let strTime = (hours < 10 ? '0'+hours : hours) + ':' + (minutes < 10 ? '0'+minutes : minutes) + ' ' + ampm;
        return strTime;
    }

}

export default MapService;