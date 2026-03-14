import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Server, Link, CheckCircle, X, HelpCircle, Check } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface SetupGuideProps {
  onDismiss?: () => void;
  onConfigure?: () => void;
  variant?: "full" | "compact";
}

export const SetupGuide: React.FC<SetupGuideProps> = ({
  onDismiss,
  onConfigure,
  variant = "full",
}) => {
  const navigate = useNavigate();
  const { setShowSetupGuide, webdavConfigured } = useAppStore();

  const handleDismiss = (permanent: boolean = false) => {
    if (permanent) {
      setShowSetupGuide(false);
    }
    onDismiss?.();
  };

  const handleConfigure = () => {
    onConfigure?.();
    // Navigate to settings page
    navigate("/settings");
  };

  const steps = [
    {
      icon: <Server className="w-5 h-5" />,
      title: "Set up WebDAV Server",
      description: "Install and configure a WebDAV server like AList, Nextcloud, or ownCloud.",
    },
    {
      icon: <Link className="w-5 h-5" />,
      title: "Get Connection Details",
      description: "Note down your server URL, username, and password.",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Configure in App",
      description: "Enter your WebDAV details in the Settings page.",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Start Listening",
      description: "Browse your music library and start playing.",
    },
  ];

  if (variant === "compact") {
    return (
      <div className="glass-card p-4 rounded-xl border border-[#007aff]/20">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#007aff]" />
            <h3 className="font-semibold text-[#1d1d1f] dark:text-white">Need help setting up?</h3>
          </div>
          <button
            onClick={() => handleDismiss()}
            className="text-[#86868b] dark:text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-[#86868b] dark:text-[#8e8e93] mb-3">
          Configure WebDAV to access your music library.
        </p>
        <button
          onClick={handleConfigure}
          className="w-full py-2 px-4 bg-[#007aff] text-white rounded-lg font-medium hover:bg-[#0062cc] transition-colors text-sm"
        >
          Setup Guide
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl border-2 border-[#007aff]/20 max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-2">
            WebDAV Setup Guide
          </h2>
          <p className="text-[#86868b] dark:text-[#8e8e93]">
            Follow these steps to connect your music library
          </p>
        </div>
        <button
          onClick={() => handleDismiss()}
          className="text-[#86868b] dark:text-[#8e8e93] hover:text-[#1d1d1f] dark:hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-[#1d1d1f] dark:text-white">Setup Progress</h3>
          <div className="text-sm text-[#86868b] dark:text-[#8e8e93]">
            {webdavConfigured ? "1/4 completed" : "0/4 completed"}
          </div>
        </div>

        <div className="relative">
          {/* Progress bar */}
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-[#007aff] transition-all duration-500"
              style={{ width: webdavConfigured ? "25%" : "0%" }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const isCompleted = index === 0 ? webdavConfigured : false;
              return (
                <div key={index} className="flex items-start gap-3 relative">
                  {/* Connection line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute left-5 top-10 w-0.5 h-16 bg-gray-200 dark:bg-gray-700" />
                  )}

                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-[#007aff]/10"
                    }`}
                  >
                    <div
                      className={
                        isCompleted ? "text-green-600 dark:text-green-400" : "text-[#007aff]"
                      }
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded ${
                          isCompleted
                            ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30"
                            : "text-[#007aff] bg-[#007aff]/10"
                        }`}
                      >
                        {isCompleted ? "Completed" : `Step ${index + 1}`}
                      </span>
                      <h3
                        className={`font-semibold ${
                          isCompleted
                            ? "text-green-700 dark:text-green-300"
                            : "text-[#1d1d1f] dark:text-white"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-[#007aff] flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-[#1d1d1f] dark:text-white mb-1">
              Need a WebDAV server?
            </h4>
            <p className="text-sm text-[#86868b] dark:text-[#8e8e93]">
              We recommend AList - a simple file list program that supports multiple storage.{" "}
              <a
                href="https://alist.nn.ci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#007aff] hover:underline"
              >
                Learn more →
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleConfigure}
          className="flex-1 py-3 px-6 bg-[#007aff] text-white rounded-lg font-medium hover:bg-[#0062cc] transition-colors flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configure WebDAV Now
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => handleDismiss(true)}
            className="py-3 px-6 text-[#86868b] dark:text-[#8e8e93] rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Don't show again
          </button>
          <button
            onClick={() => handleDismiss()}
            className="py-3 px-6 text-[#86868b] dark:text-[#8e8e93] rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
};
