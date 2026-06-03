import { Card, CardBody, Skeleton } from '@heroui/react';
import { Calendar, Clock, MapPin, Target, Users } from 'lucide-react';
import { Incident } from '@/types';

const RecentIncidents: React.FC<{
    teamIncidents: Incident[];
    loading?: boolean;
}> = ({ teamIncidents, loading = false }) => {
    const formatDate = (date: string | Date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-700" />
                <h2 className="text-xl font-semibold text-gray-900">
                    Recent Incidents
                </h2>
            </div>

            <div className="space-y-4">
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                          <Card
                              key={index}
                              className="border border-rose-100 shadow-sm"
                          >
                              <CardBody className="p-5">
                                  <Skeleton className="w-72 h-6 rounded-lg mb-3">
                                      <div className="h-6"></div>
                                  </Skeleton>
                                  <Skeleton className="w-full h-4 rounded-lg mb-2">
                                      <div className="h-4"></div>
                                  </Skeleton>
                                  <Skeleton className="w-5/6 h-4 rounded-lg mb-4">
                                      <div className="h-4"></div>
                                  </Skeleton>

                                  <div className="flex flex-wrap gap-4">
                                      {Array.from({ length: 4 }).map((_, i) => (
                                          <div
                                              key={i}
                                              className="flex items-center gap-2"
                                          >
                                              <Skeleton className="w-4 h-4 rounded">
                                                  <div className="h-4"></div>
                                              </Skeleton>
                                              <Skeleton className="w-24 h-4 rounded">
                                                  <div className="h-4"></div>
                                              </Skeleton>
                                          </div>
                                      ))}
                                  </div>
                              </CardBody>
                          </Card>
                      ))
                    : teamIncidents
                          .sort(
                              (a, b) =>
                                  new Date(b.createdAt).getTime() -
                                  new Date(a.createdAt).getTime()
                          )
                          .slice(0, 10)
                          .map((incident) => (
                              <Card
                                  key={incident.id}
                                  className="border border-rose-100 shadow-sm hover:shadow-md transition-shadow"
                              >
                                  <CardBody className="p-5">
                                      <div className="mb-3">
                                          <h3 className="text-base font-semibold text-gray-900 leading-snug">
                                              {incident.summary}
                                          </h3>
                                      </div>

                                      <p className="mb-5 text-sm leading-7 text-gray-600 text-justify">
                                          {incident.description}
                                      </p>

                                      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-2 text-sm text-gray-500">
                                          <div className="flex items-center gap-2 whitespace-nowrap">
                                              <MapPin className="w-4 h-4 text-rose-600" />
                                              <span>{incident.location}</span>
                                          </div>

                                          <div className="flex items-center gap-2 whitespace-nowrap">
                                              <Calendar className="w-4 h-4 text-rose-600" />
                                              <span>
                                                  {formatDate(incident.date)}
                                              </span>
                                          </div>

                                          <div className="flex items-center gap-2 whitespace-nowrap">
                                              <Target className="w-4 h-4 text-rose-600" />
                                              <span>{incident.category}</span>
                                          </div>

                                          <div className="flex items-center gap-2 whitespace-nowrap">
                                              <Users className="w-4 h-4 text-rose-600" />
                                              <span>
                                                  {incident.reporter ||
                                                      'Unknown'}
                                              </span>
                                          </div>
                                      </div>
                                  </CardBody>
                              </Card>
                          ))}
            </div>
        </div>
    );
};

export default RecentIncidents;
