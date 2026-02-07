"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { stopLoading } from "@/features/loading-slice";
import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store";

const Loader = () => {
  const { isLoading, message } = useAppSelector(
    (state) => state.loading,
  );
  const dispatch = useAppDispatch();
  const closeLoader = () => {
    dispatch(stopLoading());
  };

  return (
    <Dialog open={isLoading} onOpenChange={closeLoader}>
      <DialogContent
        showCloseButton={false}
        className="fixed z-[9999] flex  max-w-none flex-col items-center justify-center gap-4 bg-black/50 backdrop-blur-sm border-none shadow-none rounded-none m-0 p-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <DialogTitle className="sr-only">
          Spinner
        </DialogTitle>
        <Spinner className="size-12 text-primary animate-spin" />
        {message && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse text-center">
            {message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Loader;
