import React from "react";

interface OrientationToggleProps {
  onCameraToggle: () => void;
}

const OrientationToggle: React.FC<OrientationToggleProps> = ({
  onCameraToggle,
}) => {
  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
      <button
        onClick={onCameraToggle}
        className="bg-white bg-opacity-70 p-3 rounded-full"
        aria-label="Toggle orientation"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  );
};

export default OrientationToggle;
