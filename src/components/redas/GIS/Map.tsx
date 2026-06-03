'use client';

import type { PlaceCenter, PlaceCircleArea, PlaceCount } from '@/types';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    FeatureGroup,
    useMap,
} from 'react-leaflet';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import {
    getAllPlaceCoordinates,
    savePlaceCoordinates,
} from '@/lib/action/redas';
import L from 'leaflet';
import { GeocodingQueue } from '@/lib/action/gis';
import { Button } from '@heroui/react';
import { Card, CardBody } from '@heroui/react';
import { Chip } from '@heroui/react';
import { Progress } from '@heroui/react';
import { Spinner } from '@heroui/react';
import { MapPin, RefreshCw, Download, ArrowRight } from 'lucide-react';
import MarkerLegend from '@/components/redas/GIS/MarkerLegend';

// HeroUI Fetch Button Component
const SpecialButton = ({
    onClick,
    isDisabled,
    onGoToRedas,
    onOpenConfirm,
}: {
    onClick: () => void;
    isDisabled: boolean;
    onGoToRedas: () => void;
    onOpenConfirm: () => void;
}) => {
    const map = useMap();
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const customControl = L.Control.extend({
            options: {
                position: 'topright',
            },
            onAdd: () => {
                const container = L.DomUtil.create(
                    'div',
                    'leaflet-control-custom'
                );
                containerRef.current = container;
                container.style.background = 'none';
                container.style.border = 'none';
                return container;
            },
        });

        const control = new customControl();
        map.addControl(control);

        return () => {
            if (control) {
                map.removeControl(control);
            }
        };
    }, [map]);

    if (!containerRef.current) return null;

    return (
        <div
            ref={containerRef}
            className="absolute top-4 right-4 flex flex-col gap-2 p-1 z-[1000]"
        >
            <Card className="shadow-lg border-0">
                <CardBody className="p-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Fetch Places Button */}
                        <Button
                            className="bg-blue-900 text-white hover:bg-blue-800"
                            variant="shadow"
                            size="md"
                            isDisabled={isDisabled}
                            onPress={onOpenConfirm}
                            startContent={
                                isDisabled ? (
                                    <Spinner size="sm" color="white" />
                                ) : (
                                    <Download size={16} />
                                )
                            }
                        >
                            {isDisabled ? 'Fetching...' : 'Fetch Places'}
                        </Button>

                        {/* Go to Redas Button */}
                        <Button
                            className="bg-green-700 text-white hover:bg-green-600"
                            variant="shadow"
                            size="md"
                            onPress={onGoToRedas}
                            endContent={<ArrowRight size={16} />}
                        >
                            Go to Redas
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

// Enhanced loading overlay component
const LoadingOverlay = ({
    isVisible,
    message,
    progress,
}: {
    isVisible: boolean;
    message: string;
    progress?: number;
}) => {
    if (!isVisible) return null;

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 shadow-xl z-[1001]">
            <Card>
                <CardBody className="flex flex-row items-center gap-3 px-4 py-3">
                    <Spinner size="sm" color="primary" />
                    <div className="flex flex-col gap-1">
                        <span
                            className="text-sm font-medium"
                            id="loading-message"
                        >
                            {message}
                        </span>
                        {progress !== undefined && (
                            <Progress
                                size="sm"
                                value={progress}
                                color="primary"
                                className="w-48"
                                aria-labelledby="loading-message"
                                aria-valuenow={progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            />
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

// Enhanced marker popup component
const MarkerPopupContent = ({ place }: { place: PlaceCircleArea }) => (
    <div className="p-2 min-w-[200px]">
        <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-blue-600" />
            <h3 className="font-semibold text-lg">{place.place}</h3>
        </div>
        <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Training Count:</span>
            <Chip
                color="primary"
                variant="flat"
                size="sm"
                className="font-semibold"
            >
                {place.count.toLocaleString()}
            </Chip>
        </div>
        <div className="mt-2 text-xs text-gray-500">
            Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
        </div>
    </div>
);

// Statistics panel component
const StatsPanel = ({
    placeCoordinates,
    isVisible,
}: {
    placeCoordinates: PlaceCircleArea[];
    isVisible: boolean;
}) => {
    if (!isVisible || placeCoordinates.length === 0) return null;

    const totalCount = placeCoordinates.reduce(
        (sum, place) => sum + place.count,
        0
    );
    const avgCount = Math.round(totalCount / placeCoordinates.length);

    return (
        <div className="absolute bottom-12 left-4 z-[1000]">
            <Card className="shadow-lg">
                <CardBody className="px-4 py-3">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />
                        Statistics
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-600">Total Places:</span>
                            <Chip color="default" size="sm" variant="flat">
                                {placeCoordinates.length}
                            </Chip>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-600">Total Count:</span>
                            <Chip color="primary" size="sm" variant="flat">
                                {totalCount.toLocaleString()}
                            </Chip>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-600">Average:</span>
                            <Chip color="secondary" size="sm" variant="flat">
                                {avgCount.toLocaleString()}
                            </Chip>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

// All controls component that must be inside MapContainer
const AllControls = ({
    showStats,
    setShowStats,
    showLegend,
    setShowLegend,
    hasCoordinates,
}: {
    showStats: boolean;
    setShowStats: (show: boolean) => void;
    showLegend: boolean;
    setShowLegend: (show: boolean) => void;
    hasCoordinates: boolean;
}) => {
    const map = useMap();

    return (
        <div className="absolute bottom-28 right-4 z-[1000] flex flex-col gap-2">
            {/* Zoom In Button */}
            <Button
                isIconOnly
                color="default"
                variant="shadow"
                size="sm"
                onPress={() => map.zoomIn()}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                title="Zoom In"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
            </Button>

            {/* Zoom Out Button */}
            <Button
                isIconOnly
                color="default"
                variant="shadow"
                size="sm"
                onPress={() => map.zoomOut()}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                title="Zoom Out"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
            </Button>

            {/* Divider */}
            {hasCoordinates && (
                <div className="w-full h-px bg-gray-300 my-1"></div>
            )}

            {/* Toggle Statistics Button */}
            {hasCoordinates && (
                <Button
                    isIconOnly
                    color="default"
                    variant="shadow"
                    size="sm"
                    onPress={() => setShowStats(!showStats)}
                    className={`bg-white/90 backdrop-blur-sm hover:bg-white ${showStats ? 'ring-2 ring-blue-500' : ''}`}
                    title="Toggle Statistics"
                >
                    <RefreshCw size={16} />
                </Button>
            )}

            {/* Toggle Legend Button */}
            {hasCoordinates && (
                <Button
                    isIconOnly
                    color="default"
                    variant="shadow"
                    size="sm"
                    onPress={() => setShowLegend(!showLegend)}
                    className={`bg-white/90 backdrop-blur-sm hover:bg-white ${showLegend ? 'ring-2 ring-blue-500' : ''}`}
                    title="Toggle Legend"
                >
                    <MapPin size={16} />
                </Button>
            )}
        </div>
    );
};

const ZoomTracker = ({
    setZoomLevel,
}: {
    setZoomLevel: (z: number) => void;
}) => {
    const map = useMap();

    useEffect(() => {
        const updateZoom = () => {
            setZoomLevel(map.getZoom());
        };

        map.on('zoomend', updateZoom);

        // set initial zoom
        setZoomLevel(map.getZoom());

        return () => {
            map.off('zoomend', updateZoom);
        };
    }, [map, setZoomLevel]);

    return null;
};

const Map = () => {
    const [zoomLevel, setZoomLevel] = useState(7);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();
    const [placeCoordinates, setPlaceCoordinates] = useState<PlaceCircleArea[]>(
        []
    );
    const [placeCount, setPlaceCount] = useState<PlaceCount[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [geocodingProgress, setGeocodingProgress] = useState<number>(0);
    const [showStats, setShowStats] = useState<boolean>(true);
    const [showLegend, setShowLegend] = useState<boolean>(true);
    const geocodingQueueRef = useRef(new GeocodingQueue(1000));

    // Move these functions to component scope
    const createCustomIcon = (
        color: string,
        baseSize: 'small' | 'medium' | 'large' = 'medium',
        zoom: number
    ) => {
        // scale based on zoom level (VERY IMPORTANT FIX)
        const zoomScale = Math.max(0.5, Math.min(1.2, zoom / 10));

        const sizeMap = {
            small: 28,
            medium: 36,
            large: 44,
        };

        const base = sizeMap[baseSize];
        const size = base * zoomScale;

        return L.divIcon({
            html: `
        <div style="
            width: ${size}px;
            height: ${size}px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translateY(-2px);
        ">

            <!-- 3D Shadow -->
            <div style="
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(0,0,0,0.25);
                border-radius: 50%;
                transform: translateY(3px) scale(0.85);
                filter: blur(2px);
            "></div>

            <!-- Main Pin Body (3D effect) -->
            <div style="
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(145deg, ${color}, #494949);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow:
                    0 6px 14px rgba(0,0,0,0.35),
                    inset -3px -3px 6px rgba(0,0,0,0.25),
                    inset 2px 2px 4px rgba(255,255,255,0.25);
                border: 2px solid white;
                position: absolute;
            "></div>

            <!-- Inner Glow Ring -->
            <div style="
                width: ${size * 0.45}px;
                height: ${size * 0.45}px;
                background: white;
                border-radius: 50%;
                position: absolute;
                z-index: 2;
                opacity: 0.9;
            "></div>

            <!-- Center Dot -->
            <div style="
                width: ${size * 0.2}px;
                height: ${size * 0.2}px;
                background: ${color};
                border-radius: 50%;
                position: absolute;
                z-index: 3;
            "></div>

        </div>
        `,
            className: 'custom-marker',
            iconSize: [size, size],
            iconAnchor: [size / 2, size],
            popupAnchor: [0, -size],
        });
    };

    const getMarkerStyle = (count: number) => {
        // 🔴 Very High: 21+
        if (count >= 21) {
            return { color: '#ef4444', size: 'large' as const };
        }

        // 🟠 High: 16–20
        if (count >= 16) {
            return { color: '#f97316', size: 'medium' as const };
        }

        // 🟡 Moderate: 10–15
        if (count >= 10) {
            return { color: '#eab308', size: 'medium' as const };
        }

        // 🟢 Low: 5–9
        if (count >= 5) {
            return { color: '#22c55e', size: 'medium' as const };
        }

        // 🔵 Very Low: 0–4
        return { color: '#3b82f6', size: 'small' as const };
    };

    const fetchPlaces = async () => {
        setIsLoading(true);
        setIsFetching(true);
        setPlaceCount([]);
        setGeocodingProgress(0);

        try {
            const response = await fetch(
                '/api/redas?sheetName=Trainings&label=PROVINCES&count=true'
            );
            const result = await response.json();
            setPlaceCount(result || []);
        } catch (error) {
            console.error('Error fetching places:', error);
            setIsFetching(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoToRedas = () => {
        window.open('https://redas.phivolcs.dost.gov.ph/', '_blank');
    };

    useEffect(() => {
        const fetchPlaceCoordinates = async () => {
            const coordinates: PlaceCircleArea[] = [];
            const totalPlaces = placeCount.length;

            for (let i = 0; i < placeCount.length; i++) {
                const place = placeCount[i];
                try {
                    const center = await getCenterCoordinates(place.place);
                    if (center) {
                        coordinates.push({ ...place, ...center });
                        await savePlaceCoordinates(
                            place.place,
                            place.count,
                            center.lat,
                            center.lng
                        );
                    }

                    // Update progress
                    setGeocodingProgress(((i + 1) / totalPlaces) * 100);
                } catch (error) {
                    console.error(
                        `Error getting coordinates for ${place.place}:`,
                        error
                    );
                }
            }

            setPlaceCoordinates(coordinates);
            setIsFetching(false);
            setGeocodingProgress(0);
        };

        if (placeCount.length > 0) {
            fetchPlaceCoordinates();
        }
    }, [placeCount]);

    const getCenterCoordinates = async (place: string) => {
        try {
            const data: PlaceCenter =
                await geocodingQueueRef.current.add(place);
            return { lat: data.lat, lng: data.lng };
        } catch (error) {
            console.error('Error fetching place coordinates:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPlaceCoordinates = async () => {
            try {
                const coordinates = await getAllPlaceCoordinates();
                const placeCoords: PlaceCircleArea[] = coordinates.map(
                    (coord) => ({
                        place: coord.place,
                        count: coord.count,
                        lat: coord.latitude,
                        lng: coord.longitude,
                    })
                );
                setPlaceCoordinates(placeCoords);
            } catch (error) {
                console.error('Error fetching place coordinates:', error);
            }
        };

        fetchPlaceCoordinates();
    }, []);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={[14.5995, 120.9842]}
                zoom={7}
                minZoom={5}
                maxZoom={18}
                zoomControl={false}
                maxBounds={[
                    [-90, Number.NEGATIVE_INFINITY],
                    [90, Number.POSITIVE_INFINITY],
                ]}
                maxBoundsViscosity={0.5}
                worldCopyJump={true}
                className="h-full w-full"
            >
                <TileLayer
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                <ZoomTracker setZoomLevel={setZoomLevel} />

                <SpecialButton
                    onClick={fetchPlaces}
                    isDisabled={isFetching}
                    onGoToRedas={handleGoToRedas}
                    onOpenConfirm={() => setShowConfirm(true)}
                />

                <FeatureGroup>
                    {placeCoordinates.map((place, index) => {
                        const markerStyle = getMarkerStyle(place.count);
                        const customIcon = createCustomIcon(
                            markerStyle.color,
                            markerStyle.size,
                            zoomLevel
                        );

                        return (
                            <Marker
                                key={index}
                                position={[place.lat, place.lng]}
                                icon={customIcon}
                            >
                                <Popup className="custom-popup">
                                    <MarkerPopupContent place={place} />
                                </Popup>
                            </Marker>
                        );
                    })}
                </FeatureGroup>
                <AllControls
                    showStats={showStats}
                    setShowStats={setShowStats}
                    showLegend={showLegend}
                    setShowLegend={setShowLegend}
                    hasCoordinates={placeCoordinates.length > 0}
                />
            </MapContainer>

            <Modal isOpen={showConfirm} onOpenChange={setShowConfirm}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Confirm Fetch</ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-gray-600">
                                    This will fetch updated training data from
                                    REDAS. This process may take some time
                                    depending on the number of locations.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-blue-900 text-white"
                                    onPress={() => {
                                        onClose();
                                        fetchPlaces();
                                    }}
                                >
                                    Confirm
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <LoadingOverlay
                isVisible={isLoading}
                message="Loading places from server..."
            />

            <LoadingOverlay
                isVisible={isFetching && !isLoading}
                message={`Geocoding places... (${Math.round(geocodingProgress)}%)`}
                progress={geocodingProgress}
            />

            <StatsPanel
                placeCoordinates={placeCoordinates}
                isVisible={showStats && placeCoordinates.length > 0}
            />

            <MarkerLegend
                isVisible={showLegend && placeCoordinates.length > 0}
            />
        </div>
    );
};

export default Map;
