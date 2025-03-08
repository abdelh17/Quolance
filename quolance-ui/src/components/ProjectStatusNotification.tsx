'use client';

import {useRouter} from 'next/navigation';
import React, {useState} from 'react';
import {PiCheckCircleBold, PiClockCountdownBold, PiXCircleBold} from 'react-icons/pi';

interface ProjectEvaluationResult {
    projectId: string;
    approved: boolean;
    confidenceScore: number;
    reason: string;
    flags: string[];
    requiresManualReview: boolean;
}

interface ProjectStatusNotificationProps {
    evaluationResult: ProjectEvaluationResult;
}

const ProjectStatusNotification: React.FC<ProjectStatusNotificationProps> = ({ evaluationResult }) => {
    const router = useRouter();
    const [showNotification] = useState(true);

    const getStatusIcon = () => {
        if (evaluationResult.approved) {
            return <PiCheckCircleBold className="text-green-500 text-4xl" />;
        } else if (evaluationResult.requiresManualReview) {
            return <PiClockCountdownBold className="text-amber-500 text-4xl" />;
        } else {
            return <PiXCircleBold className="text-red-500 text-4xl" />;
        }
    };

    const getStatusTitle = () => {
        if (evaluationResult.approved) {
            return "Project Approved";
        } else if (evaluationResult.requiresManualReview) {
            return "Project Under Review";
        } else {
            return "Project Rejected";
        }
    };

    const getStatusMessage = () => {
        if (evaluationResult.approved) {
            return "Your project has been approved and is now live. Freelancers can start bidding on your project.";
        } else if (evaluationResult.requiresManualReview) {
            return "Your project is pending approval. Our team will review it shortly and notify you once it's approved.";
        } else {
            return `Your project was not approved. Reason: ${evaluationResult.reason}`;
        }
    };

    const handleDashboardClick = () => router.push('/dashboard');
    const handleViewProjectClick = () => router.push(`/projects/${evaluationResult.projectId}`);

    if (!showNotification) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg">
                <div className="flex flex-col items-center text-center">
                    {getStatusIcon()}
                    <h2 className="text-2xl font-bold mt-4">{getStatusTitle()}</h2>
                    <p className="text-n500 mt-2 mb-6">{getStatusMessage()}</p>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={handleDashboardClick}
                            className="bg-b300 hover:bg-b400 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300"
                        >
                            Go to Dashboard
                        </button>

                        {(evaluationResult.approved || evaluationResult.requiresManualReview) && (
                            <button
                                onClick={handleViewProjectClick}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-300"
                            >
                                View Project
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatusNotification;
