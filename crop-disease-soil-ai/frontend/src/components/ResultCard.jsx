function ResultCard({ title, children, colorVariant = 'default' }) {
  const borderColors = {
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    red: 'border-l-red-500',
    default: 'border-l-primary-500'
  };

  const bgColors = {
    green: 'bg-green-50/50',
    yellow: 'bg-yellow-50/50',
    red: 'bg-red-50/50',
    default: 'bg-white'
  };

  return (
    <div
      className={`rounded-xl border border-gray-100 shadow-sm ${bgColors[colorVariant]} border-l-4 ${borderColors[colorVariant]} p-6 animate-fade-in card-hover`}
    >
      {title && (
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          {colorVariant === 'green' && <span className="w-2.5 h-2.5 rounded-full bg-green-500" />}
          {colorVariant === 'yellow' && <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />}
          {colorVariant === 'red' && <span className="w-2.5 h-2.5 rounded-full bg-red-500" />}
          {colorVariant === 'default' && <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
          {title}
        </h3>
      )}
      <div>{children}</div>
    </div>
  );
}

export default ResultCard;
