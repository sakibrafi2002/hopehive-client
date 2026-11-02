import { LuRefreshCw, LuTriangleAlert } from "react-icons/lu";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center rounded-box border border-error/30 bg-error/5 px-6 py-12 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-2xl text-error">
        <LuTriangleAlert />
      </div>
      <h2 className="text-xl font-semibold">We could not load this right now</h2>
      <p className="mt-2 text-base-content/70">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary mt-6">
          <LuRefreshCw /> Try again
        </button>
      )}
    </div>
  );
}
