import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RENDER_BATCH_SIZE } from "../utils/constants";

type UseProgressiveListOptions = {
  batchSize?: number;
  rootMargin?: string;
};

export const useProgressiveList = <T>(
  items: T[],
  {
    batchSize = RENDER_BATCH_SIZE,
    rootMargin = "200px 0px",
  }: UseProgressiveListOptions = {},
) => {
  const [visibleItemCount, setVisibleItemCount] = useState(batchSize);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(
    () => items.slice(0, visibleItemCount),
    [items, visibleItemCount],
  );
  const hasMoreItems = visibleItemCount < items.length;
  const hiddenItemsCount = Math.max(items.length - visibleItems.length, 0);

  const resetVisibleItems = useCallback(() => {
    setVisibleItemCount(batchSize);
  }, [batchSize]);

  useEffect(() => {
    const listContainer = listContainerRef.current;
    const loadMoreTrigger = loadMoreTriggerRef.current;

    if (!listContainer || !loadMoreTrigger || !hasMoreItems) {
      return;
    }

    const isListContainerScrollable =
      listContainer.scrollHeight > listContainer.clientHeight;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setVisibleItemCount((currentCount) =>
          Math.min(currentCount + batchSize, items.length),
        );
      },
      {
        root: isListContainerScrollable ? listContainer : null,
        rootMargin,
      },
    );

    observer.observe(loadMoreTrigger);

    return () => observer.disconnect();
  }, [batchSize, hasMoreItems, items.length, rootMargin, visibleItemCount]);

  return {
    visibleItems,
    hasMoreItems,
    hiddenItemsCount,
    listContainerRef,
    loadMoreTriggerRef,
    resetVisibleItems,
  };
};
