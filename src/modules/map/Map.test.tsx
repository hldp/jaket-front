import { render, screen } from '@testing-library/react';
import Map from './Map';
import MapService from './Map.service';
import stations from '../../mock-data/stations';
import { Station } from '../../models/station.model';
import L from "leaflet";

describe('map component', () => {

    test('renders map', () => {
        render(<Map stations={stations}/>);
        const linkElement = screen.getByTestId('map-container');
        expect(linkElement).toBeInTheDocument();
    });

});

describe('map service', () => {

    test('getStationMarker', () => {
        Date.now = jest.fn(() => new Date(Date.UTC(2022, 1, 23, 10)).valueOf())

        let mapService = new MapService();
        let mockStation: Station = {
            address: 'test',
            id: 0,
            latitude: 1.1,
            longitude: 2.2,
            name: 'mock station',
            prices: [{
                gas_id: 1,
                gas_name: 'Gazole',
                last_update: new Date(),
                price: 1.999
            },
            {
                gas_id: 1,
                gas_name: 'SP95',
                last_update: new Date(),
                price: 1.999
            }],
            schedules: [{
                    id: 3,
                    day: 'wednesday',
                    open: true,
                    opening: new Date(Date.parse('01 Jan 1970 09:00:00 GMT')),
                    closing: new Date(Date.parse('01 Jan 1970 18:00:00 GMT'))
            }]
        }
        let popupHtml = '<div class="infobulle" style="height:320px;"><p style="text-align: center; font-weight: bold; font-size: 18px;">'+mockStation.name+'</p>';
        popupHtml += '<p class="marker-popup-item address-icon">'+mockStation.address+'</p>'
        popupHtml += '<p><span class="opened-text">Open</span> • Closing at 08:00 pm</p>';
        popupHtml += '<p><span class="gas-name">Gazole</span> : 1.999 €</p><p><span class="gas-name">SP95</span> : 1.999 €</p></div>';

        let marker = mapService.getStationMarker(mockStation);
        expect(marker.id).toBe(mockStation.id);
        expect(marker.position).toBeInstanceOf(L.LatLng);
        expect(marker.position.lat).toBe(mockStation.latitude);
        expect(marker.position.lng).toBe(mockStation.longitude);
        expect(marker.icon).toBeInstanceOf(L.DivIcon);
        expect(marker.icon.options.html).toBe('<i class="marker-circle company-step-1"></i><i class="marker-icon"></i>');
        expect(marker.icon.options.className).toBe('marker');
        expect(marker.popup).toBeDefined();
        expect(marker.popup?.content).toBe(popupHtml);
        expect(marker.popup?.autoPan).toBe(true);
        expect(marker.popup?.minWidth).toBe(320);
        expect(marker.popup?.maxWidth).toBe(320);
        expect(marker.popup?.maxHeight).toBe(320);
        expect(marker.isStation).toBe(true);
    });

});