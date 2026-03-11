import React from "react";
import { Library } from "../components/library/Library";

interface LibraryPageProps {
  className?: string;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({ className = "" }) => {
  return <Library className={className} />;
};
