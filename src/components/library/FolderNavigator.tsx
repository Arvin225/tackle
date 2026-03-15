import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Folder } from "lucide-react";

interface FolderNavigatorProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  className?: string;
}

const FolderNavigator: React.FC<FolderNavigatorProps> = ({
  currentPath,
  onPathChange,
  className = "",
}) => {
  const [currentPathIndex, setCurrentPathIndex] = useState<number>(0);

  const pathParts = currentPath.split("/").filter(Boolean);

  const handleNavigateBack = () => {
    if (currentPathIndex > 0) {
      const newPath = pathParts.slice(0, currentPathIndex).join("/");
      setCurrentPathIndex(currentPathIndex - 1);
      onPathChange(newPath);
    }
  };

  const handleNavigateUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length > 0) {
      const newPath = parts.slice(0, -1).join("/");
      setCurrentPathIndex(parts.length - 2);
      onPathChange(newPath);
    }
  };

  const handleNavigateToIndex = (index: number) => {
    const newPath = pathParts.slice(0, index + 1).join("/");
    setCurrentPathIndex(index);
    onPathChange(newPath);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-4 p-2 rounded-lg bg-[#f5f5f7] dark:bg-[#2c2c2e]">
        <button
          onClick={handleNavigateBack}
          disabled={currentPathIndex === 0}
          className="p-1.5 rounded hover:bg-[#e5e5e7] dark:hover:bg-[#3a3a3c] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
        </button>

        <button
          onClick={handleNavigateUp}
          className="p-1.5 rounded hover:bg-[#e5e5e7] dark:hover:bg-[#3a3a3c]"
        >
          <ChevronRight className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
        </button>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {pathParts.map((part, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleNavigateToIndex(index)}
                className={`px-2 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                  index === currentPathIndex
                    ? "bg-[#007aff] text-white"
                    : "hover:bg-[#e5e5e7] dark:hover:bg-[#3a3a3c]"
                }`}
              >
                {part}
              </button>
              {index < pathParts.length - 1 && (
                <ChevronRight className="w-3 h-3 text-[#aeaeb2] dark:text-[#636366]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Folder list */}
      <div className="space-y-1">
        <div className="text-xs font-semibold text-[#86868b] dark:text-[#8e8e93] px-2 py-1">
          Folders
        </div>
        {/* Example folder structure - in real implementation, this would come from WebDAV */}
        {["Music", "Playlists", "Albums", "Artists"].map(folder => (
          <button
            key={folder}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors text-left"
          >
            <Folder className="w-4 h-4 text-[#007aff]" />
            <span className="text-sm text-[#1d1d1f] dark:text-white">{folder}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FolderNavigator;
