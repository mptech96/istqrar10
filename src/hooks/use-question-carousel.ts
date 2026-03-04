"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/types/question";
import { useGetVisitQuestionsQuery } from "@/services/api/visits";

export interface UseQuestionCarouselReturn {
  currentQuestion: Question | null;
  currentIndex: number;
  allQuestions: Question[];
  totalQuestions: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  goNext: () => void;
  goPrev: () => void;
  goTo: (index: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  progress: number;
  direction: "next" | "prev";
}

export function useQuestionCarousel(visitId: number): UseQuestionCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const fetchedPages = useRef<Set<number>>(new Set());
  const prevQuestionsLength = useRef(0);

  const { data, isLoading, isFetching } = useGetVisitQuestionsQuery({
    id: visitId,
    page: currentPage,
    per_page: 15,
  });

  // Merge fetched questions into allQuestions
  // KEY FIX: Use data.meta.current_page (from the API response) as the guard,
  // NOT the currentPage state. This prevents the race condition where stale data
  // from a previous page gets processed under the new page's key.
  useEffect(() => {
    if (data?.data && data?.meta) {
      const responsePage = data.meta.current_page;
      if (!fetchedPages.current.has(responsePage)) {
        fetchedPages.current.add(responsePage);
        setAllQuestions((prev) => {
          const existingIds = new Set(prev.map((q) => q.id));
          const newQuestions = data.data.filter(
            (q: Question) => !existingIds.has(q.id)
          );
          if (newQuestions.length === 0) return prev;
          return [...prev, ...newQuestions];
        });
      }
      setTotalQuestions(data.meta.total);
      setLastPage(data.meta.last_page);
    }
  }, [data]);

  // Prefetch next page when user reaches last 2 questions of loaded data
  useEffect(() => {
    if (
      allQuestions.length > 0 &&
      currentIndex >= allQuestions.length - 2 &&
      currentPage < lastPage &&
      !isFetching
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentIndex, allQuestions.length, currentPage, lastPage, isFetching]);

  // Auto-advance: when new questions load and user was stuck at the boundary
  useEffect(() => {
    if (allQuestions.length > prevQuestionsLength.current && prevQuestionsLength.current > 0) {
      const wasAtBoundary = currentIndex === prevQuestionsLength.current - 1;
      prevQuestionsLength.current = allQuestions.length;
      if (wasAtBoundary) {
        setDirection("next");
        setCurrentIndex((prev) => prev + 1);
      }
    } else {
      prevQuestionsLength.current = allQuestions.length;
    }
  }, [allQuestions.length, currentIndex]);

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next < allQuestions.length) {
        return next;
      }
      return prev; // Stay put — data will load and auto-advance will kick in
    });
  }, [allQuestions.length]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goTo = useCallback((index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(Math.max(0, Math.min(index, allQuestions.length - 1)));
  }, [allQuestions.length, currentIndex]);

  const currentQuestion = allQuestions[currentIndex] ?? null;
  const hasNext = currentIndex < totalQuestions - 1;
  const hasPrev = currentIndex > 0;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;

  return {
    currentQuestion,
    currentIndex,
    allQuestions,
    totalQuestions,
    isLoading: isLoading && allQuestions.length === 0,
    isLoadingMore: isFetching && allQuestions.length > 0,
    goNext,
    goPrev,
    goTo,
    hasNext,
    hasPrev,
    progress,
    direction,
  };
}
