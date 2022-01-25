import { MarkerPopup } from "./marker-popup.model";

export class MarkerObject {
    public position: L.LatLng;
    public icon: L.DivIcon;
    public popup?: MarkerPopup

    constructor(position: L.LatLng, icon: L.DivIcon, popup?: MarkerPopup){
        this.position = position;
        this.icon = icon;
        this.popup = popup;
    }
}