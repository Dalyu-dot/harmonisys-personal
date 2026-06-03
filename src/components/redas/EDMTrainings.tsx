import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Training } from '@/types/Redas';

const EDMTrainings = () => {
    const {
        data: trainings = [],
        isLoading: loading,
        isError,
    } = useQuery<Training[]>({
        queryKey: ['redas-edm-trainings'],
        queryFn: async () => {
            const response = await fetch('/api/redas?sheetName=EDM Trainings');

            if (!response.ok) {
                throw new Error('Failed to fetch trainings');
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div
            ref={scrollRef}
            className="h-64 overflow-y-auto border border-blue-100 rounded-lg p-0 bg-gradient-to-br from-blue-50/70 to-sky-50/70 backdrop-blur-sm relative"
        >
            {loading ? (
                <div className="text-center text-slate-500 py-8">
                    Loading...
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 py-8">
                    Failed to fetch trainings
                </div>
            ) : (
                <table className="min-w-full text-sm text-slate-700">
                    <thead className="sticky top-0 z-10 bg-blue-50/90 backdrop-blur-sm border-b border-blue-100">
                        <tr>
                            <th className="py-2 px-4 text-left">Event</th>
                            <th className="py-2 px-4 text-left">Location</th>
                            <th className="py-2 px-4 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainings.map((training, index) => (
                            <tr
                                key={index}
                                className="bg-white/70 hover:bg-blue-50/80 transition-all"
                            >
                                <td className="py-2 px-4 border-b border-blue-100">
                                    {training.event}
                                </td>
                                <td className="py-2 px-4 border-b border-blue-100">
                                    {training.location}
                                </td>
                                <td className="py-2 px-4 border-b border-blue-100">
                                    {training.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EDMTrainings;
