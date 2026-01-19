'use client';

import { useParams } from 'next/navigation';

export default function ResultsPage() {
  const params = useParams();
  const responseId = params.responseId;

  return (
    <div>
      <h1>Results & AI Explanation</h1>
      <p>Response ID: {responseId}</p>
      {/* Results and AI explanation component */}
    </div>
  );
}
