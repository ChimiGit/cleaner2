'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

// Nollamara [lng, lat]
const CENTER: [number, number] = [115.8544, -31.8776];
const RADIUS_KM = 25;
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const SUBURBS: Array<{ n: string; c: [number, number] }> = [
  { n: 'Landsdale',          c: [115.8713, -31.7840] },
  { n: 'Darch',              c: [115.8644, -31.7957] },
  { n: 'Madeley',            c: [115.8622, -31.8087] },
  { n: 'Alexander Heights',  c: [115.8621, -31.8214] },
  { n: 'Kingsley',           c: [115.8973, -31.7970] },
  { n: 'Greenwood',          c: [115.8889, -31.8069] },
  { n: 'Warwick',            c: [115.8794, -31.8200] },
  { n: 'Ellenbrook',         c: [115.9756, -31.7788] },
  { n: 'Mirrabooka',         c: [115.8647, -31.8488] },
  { n: 'Girrawheen',         c: [115.8663, -31.8432] },
  { n: 'Wangara',            c: [115.8853, -31.7984] },
  { n: 'Westminster',        c: [115.8492, -31.8478] },
  { n: 'Marangaroo',         c: [115.8720, -31.8440] },
  { n: 'Malaga',             c: [115.8898, -31.8474] },
  { n: 'Balga',              c: [115.8502, -31.8621] },
  { n: 'Ballajura',          c: [115.8886, -31.8393] },
  { n: 'Dianella',           c: [115.8722, -31.8818] },
  { n: 'Yokine',             c: [115.8538, -31.9018] },
  { n: 'Tuart Hill',         c: [115.8447, -31.9081] },
  { n: 'Osborne Park',       c: [115.8340, -31.9115] },
  { n: 'Innaloo',            c: [115.8065, -31.9035] },
  { n: 'Doubleview',         c: [115.7893, -31.8954] },
  { n: 'Karrinyup',          c: [115.7822, -31.8698] },
  { n: 'Scarborough',        c: [115.7613, -31.8934] },
  { n: 'Trigg',              c: [115.7577, -31.8782] },
  { n: 'Morley',             c: [115.9049, -31.8888] },
  { n: 'Noranda',            c: [115.9043, -31.8784] },
  { n: 'Beechboro',          c: [115.9322, -31.8823] },
  { n: 'Bassendean',         c: [115.9435, -31.9052] },
  { n: 'Bayswater',          c: [115.9199, -31.9209] },
  { n: 'Ashfield',           c: [115.9307, -31.9211] },
  { n: 'Guildford',          c: [115.9748, -31.8996] },
  { n: 'Midland',            c: [116.0195, -31.8873] },
  { n: 'North Perth',        c: [115.8638, -31.9341] },
  { n: 'Leederville',        c: [115.8432, -31.9396] },
  { n: 'Mount Hawthorn',     c: [115.8489, -31.9341] },
  { n: 'West Perth',         c: [115.8497, -31.9456] },
  { n: 'Perth CBD',          c: [115.8605, -31.9505] },
  { n: 'Highgate',           c: [115.8731, -31.9354] },
  { n: 'East Perth',         c: [115.8791, -31.9527] },
  { n: 'Victoria Park',      c: [115.8876, -31.9799] },
  { n: 'Burswood',           c: [115.8883, -31.9589] },
];

function makeCircle(
  center: [number, number],
  radiusKm: number,
): GeoJSON.Feature<GeoJSON.Polygon> {
  const pts = 80;
  const coords: [number, number][] = [];
  const dX = radiusKm / (111.32 * Math.cos((center[1] * Math.PI) / 180));
  const dY = radiusKm / 110.574;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * 2 * Math.PI;
    coords.push([center[0] + dX * Math.cos(a), center[1] + dY * Math.sin(a)]);
  }
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [coords] },
    properties: {},
  };
}

export function PerthServiceMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: CENTER,
      zoom: 10.4,
      minZoom: 9,
      maxZoom: 14,
      attributionControl: false,
      scrollZoom: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    map.on('load', () => {
      // 25 km radius circle
      map.addSource('radius', { type: 'geojson', data: makeCircle(CENTER, RADIUS_KM) });
      map.addLayer({
        id: 'radius-fill',
        type: 'fill',
        source: 'radius',
        paint: { 'fill-color': '#2da44e', 'fill-opacity': 0.1 },
      });
      map.addLayer({
        id: 'radius-outline',
        type: 'line',
        source: 'radius',
        paint: { 'line-color': '#2da44e', 'line-width': 2, 'line-dasharray': [5, 3] },
      });

      // Suburb dot markers with labels
      SUBURBS.forEach(({ n, c }) => {
        const el = document.createElement('div');
        el.className = 'psm-pin';
        el.innerHTML = `<i class="psm-dot"></i><span class="psm-lbl">${n}</span>`;

        new maplibregl.Marker({ element: el, anchor: 'left' })
          .setLngLat(c)
          .addTo(map);
      });

      // Nollamara center pin
      const pin = document.createElement('div');
      pin.className = 'psm-center-pin';
      pin.innerHTML =
        '<svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 18 12 18s12-9 12-18C24 5.373 18.627 0 12 0z" fill="var(--green)"/>' +
        '<circle cx="12" cy="12" r="5" fill="#fff"/>' +
        '</svg>';

      new maplibregl.Marker({ element: pin, anchor: 'bottom' })
        .setLngLat(CENTER)
        .setPopup(
          new maplibregl.Popup({ closeButton: false, offset: 12, className: 'psm-popup' }).setHTML(
            '<b>Nollamara</b><br><span style="opacity:.7">Our base</span>',
          ),
        )
        .addTo(map);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div ref={containerRef} className="psm-container" />
  );
}
