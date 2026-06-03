'use client';

import { useEffect, useMemo, useState } from 'react';
import type React from 'react';
import L from 'leaflet';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import {
    Layers,
    LocateFixed,
    Map as MapIcon,
    X,
    Compass,
    Minus,
    Plus,
    Radius,
    ClipboardPlus,
} from 'lucide-react';

type BasemapKey = 'osm' | 'satellite' | 'hybrid' | 'navigation' | 'topographic';

type HazardHunterMapProps = {
    lat: number;
    lng: number;
    locationName?: string;
    highRiskCount?: number;
    totalHazards?: number;
    onLocationSelect?: (coords: { lat: number; lng: number }) => void;
    onLocationDoubleClick?: (coords: { lat: number; lng: number }) => void;
    onOpenReportIncident?: () => void;
};

const DEFAULT_ZOOM = 13;
const MIN_RADIUS_KM = 1;
const MAX_RADIUS_KM = 1000;
const DEFAULT_RADIUS_KM = 5;
const QUICK_PRESETS = [5, 10, 50, 100, 500];

const BASEMAP_OPTIONS: Array<{
    key: BasemapKey;
    label: string;
    description: string;
    previewUrl?: string;
    overlayUrl?: string;
}> = [
    {
        key: 'hybrid',
        label: 'Hybrid',
        description: 'Imagery with labels',
        previewUrl:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/8/117/214',
        overlayUrl:
            'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/8/117/214',
    },
    {
        key: 'satellite',
        label: 'Satellite',
        description: 'Satellite imagery',
        previewUrl:
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/8/117/214',
    },
    {
        key: 'osm',
        label: 'OpenStreetMap',
        description: 'Default street map',
        previewUrl: 'https://tile.openstreetmap.org/8/214/117.png',
    },
    {
        key: 'navigation',
        label: 'Navigation',
        description: 'Clean roads and labels',
        previewUrl:
            'https://a.basemaps.cartocdn.com/rastertiles/voyager/8/214/117.png',
    },
    {
        key: 'topographic',
        label: 'Topographic',
        description: 'Terrain contours and elevation',
        previewUrl: 'https://a.tile.opentopomap.org/8/214/117.png',
    },
];

const getRiskColor = (highRiskCount: number) => {
    if (highRiskCount >= 5) return '#e11d48';
    if (highRiskCount >= 3) return '#f59e0b';
    return '#22c55e';
};

const kmToMeters = (km: number) => km * 1000;

function MapClickHandler({
    onLocationDoubleClick,
}: {
    onLocationDoubleClick?: (coords: { lat: number; lng: number }) => void;
}) {
    useMapEvents({
        dblclick(e) {
            const target = e.originalEvent.target as HTMLElement | null;

            if (target?.closest('[data-map-ui="true"]')) {
                return;
            }

            const coords = {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            };

            if (onLocationDoubleClick) {
                onLocationDoubleClick(coords);
            }
        },
    });

    return null;
}

function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();

    useEffect(() => {
        map.setView([lat, lng], map.getZoom(), {
            animate: true,
        });
    }, [lat, lng, map]);

    return null;
}

function LocateMeButton({
    onLocationSelect,
    onBeforeLocate,
}: {
    onLocationSelect?: (coords: { lat: number; lng: number }) => void;
    onBeforeLocate?: () => void;
}) {
    const map = useMap();

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;

        onBeforeLocate?.();

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                map.setView([coords.lat, coords.lng], 15, {
                    animate: true,
                });

                if (onLocationSelect) {
                    onLocationSelect(coords);
                }
            },
            (error) => {
                console.error('Error getting current location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    };

    return (
        <button
            type="button"
            onClick={handleLocateMe}
            title="Locate Me"
            className="flex items-center gap-2 rounded-2xl border border-[#eadbc7] bg-white/95 px-4 py-3 text-slate-800 shadow-xl hover:bg-white transition-all"
        >
            <LocateFixed className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold whitespace-nowrap">
                Locate Me
            </span>
        </button>
    );
}

function CompassButton({ onClick }: { onClick?: () => void }) {
    return (
        <button
            type="button"
            title="Compass"
            onClick={onClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white/95 text-slate-800 shadow-xl hover:bg-white transition-all"
        >
            <Compass className="w-5 h-5" />
        </button>
    );
}

function ChangeRadiusPanel({
    radiusKm,
    onRadiusChange,
    isOpen,
    onClose,
}: {
    radiusKm: number;
    onRadiusChange: (radius: number) => void;
    isOpen: boolean;
    onClose: () => void;
}) {
    const map = useMap();
    if (!isOpen) return null;

    const coverageKm2 = Math.PI * radiusKm * radiusKm;

    const updateRadius = (value: number) => {
        const safeValue = Math.max(
            MIN_RADIUS_KM,
            Math.min(MAX_RADIUS_KM, value)
        );
        onRadiusChange(safeValue);
    };

    const disableMapInteractions = (leafletMap: LeafletMap) => {
        leafletMap.dragging.disable();
        leafletMap.doubleClickZoom.disable();
        leafletMap.scrollWheelZoom.disable();
        leafletMap.boxZoom.disable();
        leafletMap.keyboard.disable();
    };

    const enableMapInteractions = (leafletMap: LeafletMap) => {
        leafletMap.dragging.enable();
        leafletMap.doubleClickZoom.enable();
        leafletMap.scrollWheelZoom.enable();
        leafletMap.boxZoom.enable();
        leafletMap.keyboard.enable();
    };

    const handleSliderPointerDown = (
        e: React.PointerEvent<HTMLInputElement>
    ) => {
        e.stopPropagation();
        disableMapInteractions(map);
    };

    const handleSliderMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        disableMapInteractions(map);
    };

    const handleSliderTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
        e.stopPropagation();
        disableMapInteractions(map);
    };

    const handleSliderPointerUp = (e: React.PointerEvent<HTMLInputElement>) => {
        e.stopPropagation();
        enableMapInteractions(map);
    };

    const handleSliderMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        enableMapInteractions(map);
    };

    const handleSliderTouchEnd = (e: React.TouchEvent<HTMLInputElement>) => {
        e.stopPropagation();
        enableMapInteractions(map);
    };

    return (
        <div
            data-map-ui="true"
            className="absolute left-16 bottom-20 z-[1001] w-[300px] max-w-[calc(100%-2rem)] rounded-[24px] border border-white/50 bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden"
            onDoubleClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center justify-between border-b border-[#efe3d6] px-4 py-3">
                <div className="flex items-center gap-2">
                    <Radius className="w-4 h-4 text-slate-700" />
                    <h3 className="text-base font-black text-slate-800">
                        Change Radius
                    </h3>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 transition-all"
                >
                    <X className="w-4 h-4 text-slate-600" />
                </button>
            </div>

            <div className="p-4 space-y-3.5">
                <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[#eadbc7] bg-[#fcfaf7] p-3">
                    <div className="flex items-start gap-2.5">
                        <Radius className="w-4 h-4 text-[#0ea5a4] mt-0.5" />
                        <div>
                            <p className="text-3xl font-black text-slate-800 leading-none">
                                {radiusKm}
                                <span className="text-lg font-medium text-slate-500 ml-1">
                                    km
                                </span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                Local area
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm text-slate-500">Coverage</p>
                        <p className="text-xl font-black text-[#0ea5a4]">
                            {coverageKm2.toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                            })}{' '}
                            <span className="text-sm font-semibold">km²</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => updateRadius(radiusKm - 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white shadow-sm hover:bg-[#fcfaf7]"
                    >
                        <Minus className="w-5 h-5" />
                    </button>

                    <div className="flex-1 rounded-2xl bg-[#eef8f7] px-4 py-3 text-center">
                        <span className="text-3xl font-black text-slate-800 leading-none">
                            {radiusKm}
                        </span>
                        <span className="text-lg text-slate-500 ml-1">km</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => updateRadius(radiusKm + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white shadow-sm hover:bg-[#fcfaf7]"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div
                    className="px-1"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseMove={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerMove={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    <input
                        type="range"
                        min={MIN_RADIUS_KM}
                        max={MAX_RADIUS_KM}
                        value={radiusKm}
                        onChange={(e) => updateRadius(Number(e.target.value))}
                        onMouseDown={handleSliderMouseDown}
                        onMouseUp={handleSliderMouseUp}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={handleSliderPointerDown}
                        onPointerUp={handleSliderPointerUp}
                        onPointerLeave={() => enableMapInteractions(map)}
                        onPointerCancel={() => enableMapInteractions(map)}
                        onTouchStart={handleSliderTouchStart}
                        onTouchEnd={handleSliderTouchEnd}
                        onBlur={() => enableMapInteractions(map)}
                        className="w-full cursor-pointer accent-[#0ea5a4]"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                        <span>1</span>
                        <span>250</span>
                        <span>500</span>
                        <span>750</span>
                        <span>1000</span>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">
                        Quick presets
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                        {QUICK_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => updateRadius(preset)}
                                className={`min-w-0 rounded-xl border px-0 py-2 text-sm font-bold transition-all ${
                                    radiusKm === preset
                                        ? 'border-[#0ea5a4] bg-[#eef8f7] text-slate-800'
                                        : 'border-[#eadbc7] bg-white text-slate-700 hover:bg-[#fcfaf7]'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                    Adjust the radius to change the highlighted local coverage
                    around the selected location.
                </p>
            </div>
        </div>
    );
}

const HazardHunterMap = ({
    lat,
    lng,
    locationName = 'Selected location',
    highRiskCount = 0,
    totalHazards = 0,
    onLocationSelect,
    onLocationDoubleClick,
    onOpenReportIncident,
}: HazardHunterMapProps) => {
    const [selectedBasemap, setSelectedBasemap] =
        useState<BasemapKey>('hybrid');
    const [isBasemapPanelOpen, setIsBasemapPanelOpen] = useState(false);
    const [isRadiusPanelOpen, setIsRadiusPanelOpen] = useState(false);
    const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
    useEffect(() => {
        delete (
            L.Icon.Default.prototype as L.Icon.Default & {
                _getIconUrl?: unknown;
            }
        )._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl:
                'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl:
                'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl:
                'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
    }, []);

    const circleColor = getRiskColor(highRiskCount);
    const circleRadius = kmToMeters(radiusKm);

    const basemapLayers = useMemo(() => {
        switch (selectedBasemap) {
            case 'satellite':
                return (
                    <TileLayer
                        attribution="Tiles &copy; Esri"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                );

            case 'hybrid':
                return (
                    <>
                        <TileLayer
                            attribution="Tiles &copy; Esri"
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                        <TileLayer
                            attribution="Labels &copy; Esri"
                            url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        />
                    </>
                );

            case 'navigation':
                return (
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                );

            case 'topographic':
                return (
                    <TileLayer
                        attribution="Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap"
                        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                    />
                );

            case 'osm':
            default:
                return (
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                );
        }
    }, [selectedBasemap]);

    return (
        <div className="relative w-full h-full rounded-none overflow-visible">
            {isBasemapPanelOpen && (
                <div
                    data-map-ui="true"
                    className="absolute left-16 top-1/2 -translate-y-1/2 z-[1001] w-[360px] max-w-[calc(100%-6rem)] rounded-[28px] border border-white/50 bg-white/95 shadow-2xl backdrop-blur-md overflow-hidden"
                    onDoubleClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerMove={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b border-[#efe3d6] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <MapIcon className="w-4 h-4 text-slate-700" />
                            <h3 className="text-base font-black text-slate-800">
                                Basemaps
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBasemapPanelOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-slate-100 transition-all"
                        >
                            <X className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto p-4">
                        <p className="text-sm text-slate-500 mb-4">
                            Choose a basemap style
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            {BASEMAP_OPTIONS.map((option) => {
                                const isActive = selectedBasemap === option.key;

                                return (
                                    <button
                                        key={option.key}
                                        type="button"
                                        onClick={() =>
                                            setSelectedBasemap(option.key)
                                        }
                                        className={`overflow-hidden rounded-2xl border text-left transition-all ${
                                            isActive
                                                ? 'border-[#0ea5a4] bg-[#f0fdfa] shadow-md'
                                                : 'border-[#eadbc7] bg-white hover:bg-[#fcfaf7]'
                                        }`}
                                    >
                                        <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                                            {option.previewUrl && (
                                                <img
                                                    src={option.previewUrl}
                                                    alt={`${option.label} preview`}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}

                                            {option.overlayUrl && (
                                                <img
                                                    src={option.overlayUrl}
                                                    alt=""
                                                    className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            )}

                                            {isActive && (
                                                <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#0ea5a4] text-white text-sm font-bold shadow-md">
                                                    ✓
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <p className="text-base font-bold text-slate-800">
                                                {option.label}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                                                {option.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <MapContainer
                center={[lat, lng]}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                doubleClickZoom={false}
                className="w-full !h-full"
            >
                <RecenterMap lat={lat} lng={lng} />
                <MapClickHandler
                    onLocationDoubleClick={onLocationDoubleClick}
                />

                {basemapLayers}

                <ChangeRadiusPanel
                    radiusKm={radiusKm}
                    onRadiusChange={setRadiusKm}
                    isOpen={isRadiusPanelOpen}
                    onClose={() => setIsRadiusPanelOpen(false)}
                />

                <Marker position={[lat, lng]}>
                    <Popup>
                        <div className="space-y-1">
                            <p className="font-bold">{locationName}</p>
                            <p>Latitude: {lat}</p>
                            <p>Longitude: {lng}</p>
                            <p>Total Hazards: {totalHazards}</p>
                            <p>High Risk Count: {highRiskCount}</p>
                            <p className="pt-1 text-xs text-slate-500">
                                Double click anywhere to auto-assess
                            </p>
                        </div>
                    </Popup>
                </Marker>

                <Circle
                    center={[lat, lng]}
                    radius={circleRadius}
                    interactive={false}
                    pathOptions={{
                        color: circleColor,
                        fillColor: circleColor,
                        fillOpacity: 0.2,
                    }}
                />
                <>
                    <div
                        data-map-ui="true"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-[1002] flex flex-col items-center gap-2"
                        onDoubleClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsBasemapPanelOpen((prev) => {
                                    const next = !prev;
                                    if (next) setIsRadiusPanelOpen(false);
                                    return next;
                                });
                            }}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white/95 text-slate-800 shadow-xl hover:bg-white transition-all"
                            title="Basemaps"
                        >
                            <Layers className="w-5 h-5" />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setIsRadiusPanelOpen((prev) => {
                                    const next = !prev;
                                    if (next) setIsBasemapPanelOpen(false);
                                    return next;
                                });
                            }}
                            title="Change Radius"
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white/95 text-slate-800 shadow-xl hover:bg-white transition-all"
                        >
                            <Radius className="w-5 h-5" />
                        </button>

                        <CompassButton
                            onClick={() => {
                                setIsBasemapPanelOpen(false);
                                setIsRadiusPanelOpen(false);
                            }}
                        />
                    </div>

                    <div
                        data-map-ui="true"
                        className="absolute left-4 bottom-4 z-[1002]"
                        onDoubleClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <LocateMeButton
                            onLocationSelect={onLocationSelect}
                            onBeforeLocate={() => {
                                setIsBasemapPanelOpen(false);
                                setIsRadiusPanelOpen(false);
                            }}
                        />
                    </div>

                    <div
                        data-map-ui="true"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-[1002]"
                        onDoubleClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsBasemapPanelOpen(false);
                                setIsRadiusPanelOpen(false);
                                onOpenReportIncident?.();
                            }}
                            title="Report Incident"
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#eadbc7] bg-white/95 text-slate-800 shadow-xl hover:bg-white transition-all"
                        >
                            <ClipboardPlus className="w-5 h-5" />
                        </button>
                    </div>
                </>
            </MapContainer>
        </div>
    );
};

export default HazardHunterMap;
