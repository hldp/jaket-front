import { MarkerPopup } from "./marker-popup.model";

export class MarkerObject {
    public id: number;
    public position: L.LatLng;
    public icon: L.DivIcon;
    public popup?: MarkerPopup
    public isStation?: boolean = false;

    constructor(id: number, position: L.LatLng, icon: L.DivIcon, popup?: MarkerPopup){
        this.id = id;
        this.position = position;
        this.icon = icon;
        this.popup = popup;
    }
}