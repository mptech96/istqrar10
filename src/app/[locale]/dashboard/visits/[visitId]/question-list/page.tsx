"use client";
import Header from "@/components/dashboard/header/header";
import { Card, CardContent } from "@/components/ui/card";
import { useGetVisitQuestionsQuery } from "@/services/api/visits";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { VisitAnswersForm } from "@/components/dashboard/visits/answer-visit-questionnaire-form";
import { useLoader } from "@/hooks/use-loader";

const QuestionList = () => {
  const { start, stop } = useLoader();
  const { visitId } = useParams();
  const { data, isLoading } = useGetVisitQuestionsQuery(
    Number(visitId),
  );

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);
  return (
    <section>
      <Header
        title="Answer Questionnaire"
        description="Answer the questionnaire to complete the visit"
      />
      <div>
        <Card>
          <CardContent>
            <VisitAnswersForm
              questions={data?.data || []}
              visitId={Number(visitId)}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default QuestionList;
