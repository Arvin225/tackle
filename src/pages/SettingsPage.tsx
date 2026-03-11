import React from "react";
import { Settings } from "../components/settings/Settings";

interface SettingsPageProps {
  className?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ className = "" }) => {
  return <Settings className={className} />;
};
