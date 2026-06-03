import { IRSdb } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

interface Location {
    id: string;
    locationCode: string;
    locationName: string;
    isActive: boolean;
    locationDescription: string;
}
export interface Event {
    id: string;
    eventName: string;
    eventDescription: string;
    factSheet: string;
    status: string;
    eventStarted: boolean;
    eventDate: Date;
    scenarioID: string;
    locationID: string;
    categoryID: string;
    incidentCommanderID: string;
    liaisonOfficerID: string;
    publicInformationOfficerID: string;
    safetySecurityOfficerID: string;
    location: Location;
}

export async function GET() {
    try {
        const eventsRef = collection(IRSdb, 'events');
        const snapshot = await getDocs(eventsRef);

        if (snapshot.empty) {
            return NextResponse.json(
                { message: 'No events found', data: null },
                { status: 200 }
            );
        }

        const events = await Promise.all(
            snapshot.docs.map(async (eventDoc) => {
                const eventData = eventDoc.data();
                let category;
                let location;
                let scenario;

                if (eventData['categoryID']) {
                    const categoryDocRef = doc(
                        IRSdb,
                        'event-categories',
                        String(eventData['categoryID'])
                    );
                    const categorySnap = await getDoc(categoryDocRef);

                    if (categorySnap.exists()) {
                        category = {
                            id: categorySnap.id,
                            ...categorySnap.data(),
                        };
                    }
                }

                if (eventData['locationID']) {
                    const locationDocRef = doc(
                        IRSdb,
                        'event-locations',
                        String(eventData['locationID'])
                    );
                    const locationSnap = await getDoc(locationDocRef);

                    if (locationSnap.exists()) {
                        location = {
                            id: locationSnap.id,
                            ...locationSnap.data(),
                        };
                    }
                }

                if (eventData['scenarioID']) {
                    const scenarioDocRef = doc(
                        IRSdb,
                        'event-scenarios',
                        String(eventData['scenarioID'])
                    );
                    const scenarioSnap = await getDoc(scenarioDocRef);

                    if (scenarioSnap.exists()) {
                        scenario = {
                            id: scenarioSnap.id,
                            ...scenarioSnap.data(),
                        };
                    }
                }

                const data = {
                    ...eventData,
                    category,
                    location,
                    scenario,
                };

                return {
                    id: eventDoc.id,
                    ...data,
                };
            })
        );

        return NextResponse.json(
            { message: 'Ok', data: events },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { message: 'Internal server error', data: null },
            { status: 500 }
        );
    }
}
