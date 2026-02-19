import type { JSX } from 'react';
import { SurveyForm } from '@/components/survey/SurveyForm/SurveyForm';
import surveyJson from '../../../resources/survey_schemas/wellbeing_surveyv1.json';
import { Navbar, Footer } from '@/components/ui/navigation';

export default function ScreeningPage(): JSX.Element {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <div className="max-w-4xl mx-auto p-6">
          <SurveyForm survey={surveyJson as any} />
        </div>
      </main>
      <Footer />
    </>
  );
}
