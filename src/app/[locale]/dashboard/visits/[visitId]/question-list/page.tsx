import Header from "@/components/dashboard/header/header";
import { Card, CardContent } from "@/components/ui/card";
import { VisitAnswersForm } from "@/components/dashboard/visits/answer-visit-questionnaire-form";

const QuestionList = () => {
  return (
    <section className="flex flex-col gap-6">
      <Header
        title="Answer Questionnaire"
        description="Answer the questionnaire to complete the visit"
      />
      <div>
        <Card>
          <CardContent>
            <VisitAnswersForm />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuestionList;
