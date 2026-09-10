import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Disaster, Hospital, RescueTeam } from '../types';
import { Shield, Hospital as HospitalIcon, AlertTriangle, Navigation, ArrowRight } from 'lucide-react';

interface DisasterMapProps {
  disasters: Disaster[];
  hospitals: Hospital[];
  rescueTeams: RescueTeam[];
  selectedDisaster?: Disaster | null;
  onSelectDisaster?: (disaster: Disaster) => void;
  center?: [number, number];
  zoom?: number;
}

// Custom Leaflet DivIcons
const createDisasterIcon = (severity: string, isSelected: boolean) => {
  const colorClass = {
    CRITICAL: 'bg-rose-600 border-rose-400 ring-rose-500/50',
    HIGH: 'bg-orange-600 border-orange-400 ring-orange-500/50',
    MEDIUM: 'bg-amber-500 border-amber-300 ring-amber-500/50',
    LOW: 'bg-emerald-500 border-emerald-300 ring-emerald-500/50'
  }[severity] || 'bg-rose-600 border-rose-400 ring-rose-500/50';

  const pulseClass = severity === 'CRITICAL' || severity === 'HIGH' ? 'pulsing-marker' : '';

  return L.divIcon({
    className: 'custom-disaster-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full ${colorClass} ${pulseClass} border-2 text-white flex items-center justify-center shadow-2xl ${isSelected ? 'scale-125 ring-4 ring-white' : ''}">
          <span style="font-size: 14px;">⚠️</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const hospitalIcon = L.divIcon({
  className: 'custom-hospital-marker',
  html: `
    <div class="w-7 h-7 rounded-lg bg-sky-600 border-2 border-sky-300 text-white flex items-center justify-center shadow-lg">
      <span style="font-size: 13px; font-weight: bold;">🏥</span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const rescueIcon = L.divIcon({
  className: 'custom-rescue-marker',
  html: `
    <div class="w-7 h-7 rounded-lg bg-emerald-600 border-2 border-emerald-300 text-white flex items-center justify-center shadow-lg">
      <span style="font-size: 13px; font-weight: bold;">🛡️</span>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

// Map recentering helper
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const DisasterMap: React.FC<DisasterMapProps> = ({
  disasters,
  hospitals,
  rescueTeams,
  selectedDisaster,
  onSelectDisaster,
  center = [16.5062, 80.6480],
  zoom = 12
}) => {
  const activeCenter: [number, number] = selectedDisaster
    ? [selectedDisaster.latitude, selectedDisaster.longitude]
    : center;

  // Extract route lines if selected disaster has traffic response plan
  const plan = selectedDisaster?.response_plan;
  const safeRoute = plan?.traffic?.route_waypoints?.map((wp: { lat: number; lng: number }) => [wp.lat, wp.lng] as [number, number]) || [];
  const blockedRoute = plan?.traffic?.blocked_waypoints?.map((wp: { lat: number; lng: number }) => [wp.lat, wp.lng] as [number, number]) || [];

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700/70 shadow-lg text-[11px] text-slate-300 space-y-1.5 pointer-events-auto">
        <div className="font-bold text-slate-100 flex items-center justify-between pb-1 border-b border-slate-700">
          <span>Map Intelligence</span>
          <span className="text-rose-400 font-mono text-[10px]">LIVE GIS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Critical / High Disaster</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Medium Severity</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-sky-600"></span>
          <span>Trauma Center Hospital</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600"></span>
          <span>NDRF / SDRF Unit</span>
        </div>
        {safeRoute.length > 0 && (
          <>
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-800">
              <span className="w-3 h-0.5 bg-emerald-400"></span>
              <span className="text-emerald-300 font-medium">Safe Bypass Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 border-b border-dashed border-rose-500"></span>
              <span className="text-rose-300 font-medium">Blocked / Flooded Route</span>
            </div>
          </>
        )}
      </div>

      <MapContainer
        center={activeCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <ChangeMapView center={activeCenter} zoom={selectedDisaster ? 13 : zoom} />

        {/* CartoDB Dark Matter tiles for High-Tech Command Center look */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Polylines for Safe and Blocked Routes */}
        {safeRoute.length > 1 && (
          <Polyline
            positions={safeRoute}
            pathOptions={{ color: '#10B981', weight: 5, opacity: 0.85 }}
          >
            <Tooltip permanent direction="center" className="route-tooltip">
              ✅ Safe Alternate Route ({plan?.traffic?.alternative_route_name})
            </Tooltip>
          </Polyline>
        )}

        {blockedRoute.length > 1 && (
          <Polyline
            positions={blockedRoute}
            pathOptions={{ color: '#EF4444', weight: 4, opacity: 0.7, dashArray: '8, 8' }}
          >
            <Tooltip permanent direction="center" className="route-tooltip">
              ⛔ {plan?.traffic?.primary_route_status}
            </Tooltip>
          </Polyline>
        )}

        {/* Disaster Markers */}
        {disasters.map((d) => (
          <Marker
            key={`disaster-${d.id}`}
            position={[d.latitude, d.longitude]}
            icon={createDisasterIcon(d.severity, selectedDisaster?.id === d.id)}
            eventHandlers={{
              click: () => onSelectDisaster && onSelectDisaster(d)
            }}
          >
            <Popup className="disaster-popup">
              <div className="p-2 text-slate-900 min-w-[200px]">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="font-bold text-xs uppercase text-rose-600 flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    {d.disaster_type}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {d.severity}
                  </span>
                </div>
                <h4 className="font-bold text-sm mt-1">{d.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{d.description}</p>
                <div className="mt-2 text-xs flex justify-between items-center text-slate-500 font-medium">
                  <span>👥 {d.affected_people} Affected</span>
                  <span className="text-emerald-600 font-semibold">AI Conf: {d.verification_score}%</span>
                </div>
                {onSelectDisaster && (
                  <button
                    onClick={() => onSelectDisaster(d)}
                    className="w-full mt-2.5 py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold flex items-center justify-center space-x-1"
                  >
                    <span>Inspect AI Response Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Hospital Markers */}
        {hospitals.map((h) => (
          <Marker
            key={`hospital-${h.id}`}
            position={[h.latitude, h.longitude]}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="p-1 text-slate-900 text-xs">
                <div className="font-bold text-sm text-sky-700 flex items-center">
                  <HospitalIcon className="w-3.5 h-3.5 mr-1" />
                  {h.name}
                </div>
                <p className="text-slate-600 mt-0.5">{h.address}</p>
                <div className="mt-2 grid grid-cols-2 gap-1 font-semibold text-[11px] bg-sky-50 p-1.5 rounded">
                  <div>🛏️ Available Beds: <span className="text-sky-800">{h.available_beds}</span></div>
                  <div>🩺 ICU Beds: <span className="text-sky-800">{h.icu_beds}</span></div>
                  <div>👨‍⚕️ Medical Staff: <span className="text-slate-700">{h.medical_staff}</span></div>
                  <div>📞 <span className="text-slate-700">{h.contact_phone}</span></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rescue Team Markers */}
        {rescueTeams.map((team) => (
          <Marker
            key={`rescue-${team.id}`}
            position={[team.latitude, team.longitude]}
            icon={rescueIcon}
          >
            <Popup>
              <div className="p-1 text-slate-900 text-xs">
                <div className="font-bold text-sm text-emerald-700 flex items-center">
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {team.name}
                </div>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                    {team.unit_type}
                  </span>
                  <span className="font-semibold text-slate-600">{team.personnel_count} Responders</span>
                </div>
                <div className="mt-2 text-[11px] text-slate-600">
                  <div className="font-semibold text-slate-700">Equipped With:</div>
                  <ul className="list-disc pl-4 mt-0.5">
                    {team.equipment.slice(0, 3).map((eq, i) => (
                      <li key={i}>{eq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
