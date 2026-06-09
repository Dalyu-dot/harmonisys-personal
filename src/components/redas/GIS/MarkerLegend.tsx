import { Card, CardBody } from '@heroui/react';

const MarkerLegend = ({ isVisible }: { isVisible: boolean }) => {
    if (!isVisible) return null;

    const stops = [
        { color: '#3b82f6', label: '0' },
        { color: '#22c55e', label: '5' },
        { color: '#eab308', label: '10' },
        { color: '#f97316', label: '16' },
        { color: '#ef4444', label: '21+' },
    ];

    const gradientId = 'heatmap-gradient';

    return (
        <div className="absolute top-4 left-4 z-[1000]">
            <Card className="shadow-lg">
                <CardBody className="px-4 py-3">
                    <h4 className="font-semibold mb-1 text-base">
                        Training Density
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                        Number of trainings per location
                    </p>

                    {/* Gradient bar */}
                    <svg width="100%" height="16" style={{ display: 'block' }}>
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                            >
                                {stops.map((stop, i) => (
                                    <stop
                                        key={i}
                                        offset={`${(i / (stops.length - 1)) * 100}%`}
                                        stopColor={stop.color}
                                    />
                                ))}
                            </linearGradient>
                        </defs>
                        <rect
                            x="0"
                            y="0"
                            width="100%"
                            height="16"
                            rx="4"
                            fill={`url(#${gradientId})`}
                        />
                    </svg>

                    {/* Tick labels */}
                    <div className="flex justify-between mt-1">
                        {stops.map((stop, i) => (
                            <span key={i} className="text-xs text-gray-500">
                                {stop.label}
                            </span>
                        ))}
                    </div>

                    {/* Low / High label */}
                    <div className="flex justify-between mt-2">
                        <span className="text-xs font-medium text-blue-500">
                            Very Low
                        </span>
                        <span className="text-xs font-medium text-red-500">
                            Very High
                        </span>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default MarkerLegend;
