type LoadingSpinnerProps = {
  message?: string;
};

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center lg:justify-center mt-12 lg:mt-0 min-h-screen h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-green-500"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
