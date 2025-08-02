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
    <div className="flex flex-col items-center text-center p-6 w-full max-w-sm mx-auto">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <button
        onClick={onActionClick}
        className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition">
        {actionText}
      </button>
    </div>
  );
};

export default EmptyState;
