import { Card, CardBody } from '@heroui/react';

const MarkerLegend = ({ isVisible }: { isVisible: boolean }) => {
    if (!isVisible) return null;

    const legendItems = [
        { color: '#ef4444', label: '21+', desc: 'Very High' },
        { color: '#f97316', label: '16–20', desc: 'High' },
        { color: '#eab308', label: '10–15', desc: 'Moderate' },
        { color: '#22c55e', label: '5–9', desc: 'Low' },
        { color: '#3b82f6', label: '0–4', desc: 'Very Low' },
    ];

    return (
        <div className="absolute top-4 left-4 z-[1000]">
            <Card className="shadow-lg">
                <CardBody className="px-4 py-3">
                    <h4 className="font-semibold mb-2 text-base">
                        Training Density
                    </h4>
                    <p className="text-sm text-gray-500 mb-3">
                        Number of trainings per location
                    </p>
                    <div className="space-y-2">
                        {legendItems.map((item, index) => {
                            const emojiMap: Record<string, string> = {
                                '#ef4444': '🔴',
                                '#f97316': '🟠',
                                '#eab308': '🟡',
                                '#22c55e': '🟢',
                                '#3b82f6': '🔵',
                            };

                            return (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-sm"
                                >
                                    {/* Left side */}
                                    <div className="flex items-center gap-2">
                                        <span>{emojiMap[item.color]}</span>
                                        <span className="font-normal">
                                            {item.desc}
                                        </span>
                                    </div>

                                    {/* Right side */}
                                    <span className="text-gray-600 font-normal">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default MarkerLegend;
