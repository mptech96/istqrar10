"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Question } from "@/types/question";
import { useGetVisitQuestionsQuery } from "@/services/api/visits";

export interface UseQuestionCarouselReturn {
  currentQuestions: Question[];
  currentPageIndex: number;
  allQuestions: Question[];
  totalQuestions: number;
  totalPages: number;
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

export function useQuestionCarousel(
  visitId: number,
): UseQuestionCarouselReturn {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const fetchedPages = useRef<Set<number>>(new Set());
  const prevQuestionsLength = useRef(0);

  const QUESTIONS_PER_PAGE = 10;

  const { data, isLoading, isFetching } = useGetVisitQuestionsQuery({
    id: visitId,
    page: currentPage,
    per_page: 30, // Fetch 3 "pages" at once to stay ahead
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

  // Prefetch next page when user reaches last page of loaded data
  useEffect(() => {
    const questionsNeeded = (currentPageIndex + 1) * QUESTIONS_PER_PAGE;
    if (
      allQuestions.length > 0 &&
      allQuestions.length < totalQuestions &&
      allQuestions.length - questionsNeeded <= QUESTIONS_PER_PAGE &&
      currentPage < lastPage &&
      !isFetching
    ) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [
    currentPageIndex,
    allQuestions.length,
    totalQuestions,
    currentPage,
    lastPage,
    isFetching,
    QUESTIONS_PER_PAGE,
  ]);

  // Auto-advance: when new questions load and user was stuck at the boundary
  useEffect(() => {
    if (
      allQuestions.length > prevQuestionsLength.current &&
      prevQuestionsLength.current > 0
    ) {
      const questionsBefore = prevQuestionsLength.current;
      const wasAtBoundary =
        (currentPageIndex + 1) * QUESTIONS_PER_PAGE > questionsBefore;

      prevQuestionsLength.current = allQuestions.length;

      if (wasAtBoundary) {
        setDirection("next");
        // No auto-advance needed usually for pages unless we want to force jump
      }
    } else {
      prevQuestionsLength.current = allQuestions.length;
    }
  }, [allQuestions.length, currentPageIndex, QUESTIONS_PER_PAGE]);

  const goNext = useCallback(() => {
    setDirection("next");
    setCurrentPageIndex((prev) => {
      const next = prev + 1;
      const totalPagesPossible = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
      if (next < totalPagesPossible) {
        // Only allow if we have the data loaded for the next page
        if ((next + 1) * QUESTIONS_PER_PAGE <= allQuestions.length || allQuestions.length === totalQuestions) {
          return next;
        }
      }
      return prev;
    });
  }, [allQuestions.length, totalQuestions, QUESTIONS_PER_PAGE]);

  const goPrev = useCallback(() => {
    setDirection("prev");
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentPageIndex ? "next" : "prev");
      const totalPagesPossible = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
      const safeIndex = Math.max(0, Math.min(index, totalPagesPossible - 1));

      // Only allow if we have the data
      if ((safeIndex + 1) * QUESTIONS_PER_PAGE <= allQuestions.length || allQuestions.length === totalQuestions) {
        setCurrentPageIndex(safeIndex);
      }
    },
    [allQuestions.length, totalQuestions, QUESTIONS_PER_PAGE, currentPageIndex],
  );

  const currentQuestions = allQuestions.slice(
    currentPageIndex * QUESTIONS_PER_PAGE,
    (currentPageIndex + 1) * QUESTIONS_PER_PAGE,
  );
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const hasNext = (currentPageIndex + 1) * QUESTIONS_PER_PAGE < totalQuestions;
  const hasPrev = currentPageIndex > 0;
  const progress =
    totalQuestions > 0
      ? (Math.min((currentPageIndex + 1) * QUESTIONS_PER_PAGE, totalQuestions) /
          totalQuestions) *
        100
      : 0;

  return {
    currentQuestions,
    currentPageIndex,
    allQuestions,
    totalQuestions,
    totalPages,
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
