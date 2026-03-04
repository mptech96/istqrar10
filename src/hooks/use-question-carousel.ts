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

  const { data, isLoading, isFetching } = useGetVisitQuestionsQuery({
    id: visitId,
    page: currentPage,
    per_page: 15,
  });

  // Merge fetched questions into allQuestions (deduplicate by id)
  useEffect(() => {
    if (data?.data && !fetchedPages.current.has(currentPage)) {
      fetchedPages.current.add(currentPage);
      setAllQuestions((prev) => {
        const existingIds = new Set(prev.map((q) => q.id));
        const newQuestions = data.data.filter(
          (q: Question) => !existingIds.has(q.id)
        );
        return [...prev, ...newQuestions];
      });
    }
    if (data?.meta) {
      setTotalQuestions(data.meta.total);
      setLastPage(data.meta.last_page);
    }
  }, [data, currentPage]);

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

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrentIndex((prev) => {
      const next = prev + 1;
      // Allow going up to allQuestions.length - 1, or if more pages exist, allow going further
      if (next < allQuestions.length) {
        return next;
      }
      // If we're at the end but more questions exist on the server
      if (next < totalQuestions) {
        return next; // The prefetch effect will load more
      }
      return prev;
    });
  }, [allQuestions.length, totalQuestions]);

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
