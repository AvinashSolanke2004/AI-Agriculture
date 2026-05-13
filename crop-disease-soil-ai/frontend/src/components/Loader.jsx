function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="spinner mb-6" />
      <p className="text-primary-700 font-medium text-lg animate-pulse">{message}</p>
    </div>
  );
}

export default Loader;
