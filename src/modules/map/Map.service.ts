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
    private isStationOpened(daySchedule: Schedule | undefined): boolean {
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