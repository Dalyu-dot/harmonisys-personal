import { AlertCircle, ClockIcon, CheckCircleIcon } from 'lucide-react';
import { Card, CardBody, Skeleton } from '@heroui/react';

interface Props {
    loading: boolean;
    eventStats: {
        ongoing: number;
        completed: number;
        pending: number;
    };
}

const StatusOverview = ({ loading, eventStats }: Props) => {
    const total =
        eventStats.ongoing + eventStats.completed + eventStats.pending || 1;

    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-7 bg-[#7B122F] rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
                    Event Status Overview
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                          <Card
                              key={index}
                              className="relative overflow-hidden rounded-2xl bg-white/65 backdrop-blur-sm border border-white/90
                shadow-[0_0_0_1.5px_rgba(255,255,255,0.75),0_16px_36px_rgba(0,0,0,0.16)]"
                          >
                              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1.5 ring-white/70" />
                              <CardBody className="p-6 space-y-4">
                                  <Skeleton className="w-2/3 h-6 rounded-lg" />
                                  <Skeleton className="w-1/3 h-10 rounded-lg" />
                                  <Skeleton className="w-full h-3 rounded-full" />
                              </CardBody>
                          </Card>
                      ))
                    : [
                          {
                              name: 'Ongoing Events',
                              label: 'Currently active',
                              value: eventStats.ongoing,
                              color: 'bg-blue-500',
                              iconBg: 'bg-blue-100',
                              iconColor: 'text-blue-600',
                              icon: ClockIcon,
                          },
                          {
                              name: 'Completed Events',
                              label: 'Successfully resolved',
                              value: eventStats.completed,
                              color: 'bg-green-500',
                              iconBg: 'bg-green-100',
                              iconColor: 'text-green-600',
                              icon: CheckCircleIcon,
                          },
                          {
                              name: 'Pending Events',
                              label: 'Awaiting response',
                              value: eventStats.pending,
                              color: 'bg-amber-500',
                              iconBg: 'bg-amber-100',
                              iconColor: 'text-amber-600',
                              icon: AlertCircle,
                          },
                      ].map(
                          (
                              {
                                  name,
                                  label,
                                  value,
                                  color,
                                  iconBg,
                                  iconColor,
                                  icon: Icon,
                              },
                              index
                          ) => (
                              <Card
                                  key={index}
                                  className="relative overflow-hidden rounded-2xl bg-white/65 backdrop-blur-sm border border-white/90
                  shadow-[0_0_0_1.5px_rgba(255,255,255,0.75),0_16px_36px_rgba(0,0,0,0.16)]
                  transition-all duration-300 hover:-translate-y-1"
                              >
                                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1.5 ring-white/70" />

                                  <CardBody className="p-6">
                                      {/* Header */}
                                      <div className="flex items-center justify-between mb-4">
                                          <div className="flex items-center gap-4">
                                              <div
                                                  className={`p-3 ${iconBg} rounded-xl`}
                                              >
                                                  <Icon
                                                      className={`w-7 h-7 ${iconColor}`}
                                                  />
                                              </div>
                                              <div>
                                                  <h3 className="text-lg font-semibold text-slate-800">
                                                      {name}
                                                  </h3>
                                                  <p className="text-sm text-slate-500">
                                                      {label}
                                                  </p>
                                              </div>
                                          </div>

                                          {/* KPI number */}
                                          <div className="text-right">
                                              <div className="text-3xl font-black text-slate-900">
                                                  {value}
                                              </div>
                                              <div className="text-sm text-slate-500">
                                                  events
                                              </div>
                                          </div>
                                      </div>

                                      {/* Progress line (STRAIGHT + more visible) */}
                                      <div className="w-full h-2.5 rounded-full bg-slate-400/60 overflow-hidden">
                                          <div
                                              className="h-full rounded-full"
                                              style={{
                                                  width: `${Math.min((value / total) * 100, 100)}%`,
                                                  background:
                                                      name === 'Ongoing Events'
                                                          ? 'linear-gradient(90deg, #2563EB, #60A5FA)'
                                                          : name ===
                                                              'Completed Events'
                                                            ? 'linear-gradient(90deg, #16A34A, #4ADE80)'
                                                            : 'linear-gradient(90deg, #D97706, #FBBF24)',
                                                  boxShadow:
                                                      '0 0 8px rgba(0,0,0,0.20)',
                                              }}
                                          />
                                      </div>
                                  </CardBody>
                              </Card>
                          )
                      )}
            </div>
        </div>
    );
};

export default StatusOverview;
