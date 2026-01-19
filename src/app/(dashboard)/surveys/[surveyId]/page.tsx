'use client';

import { useParams } from 'next/navigation';

export default function TakeSurveyPage() {
  const params = useParams();
  const surveyId = params.surveyId;

  return (
    <div>
      <h1>Take Survey</h1>
      <p>Survey ID: {surveyId}</p>
      {/* Survey form component */}
    </div>
  );
}
