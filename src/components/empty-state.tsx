const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onActionClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center text-center p-8 w-full max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-100">
      <div className="mb-6 p-4 bg-gray-50 rounded-full">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-base text-gray-600 mb-6">{description}</p>
      {actionText && (
        <button
          onClick={onActionClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
