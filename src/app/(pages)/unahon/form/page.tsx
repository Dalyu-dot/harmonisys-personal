import Header from '@/components/Header';
import UnahonForm from '@/components/unahon/UnahonForm';
import { auth } from '@/lib/auth';
import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';

import { TriangleAlert, UserIcon, MailIcon } from 'lucide-react';

const UnahonPage = async () => {
    const session = await auth();

    return (
        <div>
            <Header session={session} />
            {(session?.user.role === 'RESPONDER' ||
                session?.user.role === 'ADMIN') &&
            session?.user.mhpssLevel ? (
                <UnahonForm
                    session={session}
                    isViewOnly={false}
                    isReassessment={false}
                />
            ) : (
                <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md mx-auto">
                        <Card className="max-w-md">
                            <CardHeader className="flex flex-col items-center pb-0 pt-8">
                                <div className="flex items-center justify-center w-16 h-16 bg-warning-100 rounded-full mb-4">
                                    <TriangleAlert className="w-8 h-8 text-warning-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    Access Restricted
                                </h2>
                                <Chip color="warning" variant="flat" size="sm">
                                    Competency Assessment Required
                                </Chip>
                            </CardHeader>

                            <CardBody className="px-6 py-6">
                                <p className="text-default-600 text-center mb-6">
                                    You cannot access the Unahon form at this
                                    time due to your current competency level
                                    assessment.
                                </p>

                                <Card className="bg-primary-50 border-primary-200">
                                    <CardBody className="p-4">
                                        <div className="flex items-start">
                                            <UserIcon className="w-5 h-5 text-primary-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-sm font-medium text-primary-800 mb-1">
                                                    Assessment Required
                                                </h3>
                                                <p className="text-sm text-primary-700">
                                                    Your competency level needs
                                                    to be assessed before you
                                                    can access this form. Please
                                                    contact an administrator for
                                                    evaluation.
                                                </p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>

                                <Divider className="my-4" />

                                <div className="space-y-4">
                                    <div className="flex items-center text-sm text-default-600">
                                        <MailIcon className="w-4 h-4 mr-2" />
                                        <span>
                                            Contact your administrator for
                                            assistance
                                        </span>
                                    </div>

                                    <div className="text-xs text-default-500">
                                        <p className="font-medium mb-2">
                                            What you can do:
                                        </p>
                                        <ul className="space-y-1 list-disc list-inside ml-2">
                                            <li>
                                                Reach out to your system
                                                administrator
                                            </li>
                                            <li>
                                                Request a competency assessment
                                            </li>
                                            <li>
                                                Check back after your assessment
                                                is complete
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnahonPage;
