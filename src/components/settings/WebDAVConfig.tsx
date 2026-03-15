import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useWebDAV } from "../../hooks/useWebDAV";
import { useAppStore } from "../../store/useAppStore";
import { Server, Wifi, CheckCircle, XCircle, Trash2, AlertCircle, Info } from "lucide-react";

interface WebDAVConfigProps {
  className?: string;
}

export const WebDAVConfig: React.FC<WebDAVConfigProps> = ({ className = "" }) => {
  const navigate = useNavigate();
  const { connected, savedConfig, saveConnection, testConnection, deleteConnection, error } =
    useWebDAV();
  const { setWebDAVConfigured } = useAppStore();

  const [config, setConfig] = useState({
    serverUrl: savedConfig?.serverUrl || "",
    username: savedConfig?.username || "",
    password: "",
    token: savedConfig?.token || "",
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Update config when savedConfig changes
  useEffect(() => {
    setConfig({
      serverUrl: savedConfig?.serverUrl || "",
      username: savedConfig?.username || "",
      password: savedConfig?.password || "",
      token: savedConfig?.token || "",
    });
  }, [savedConfig]);

  // Check for changes
  useEffect(() => {
    const hasChanges =
      config.serverUrl !== (savedConfig?.serverUrl || "") ||
      config.username !== (savedConfig?.username || "") ||
      config.token !== (savedConfig?.token || "");
    setHasChanges(hasChanges);
  }, [config, savedConfig]);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleSave = async () => {
    try {
      await saveConnection(config);
      setWebDAVConfigured(true);
      setTestResult("success");

      // Auto-navigate to home page after successful configuration
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setTestResult("error");
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const success = await testConnection(config);
      setTestResult(success ? "success" : "error");
    } catch (err) {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  };

  const handleDelete = async () => {
    await deleteConnection();
    setWebDAVConfigured(false);
    setTestResult(null);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-white mb-2">
              WebDAV Configuration
            </h3>
            <p className="text-[#86868b] dark:text-[#8e8e93]">
              Connect to your WebDAV server to access your music library
            </p>
          </div>

          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              connected && savedConfig
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                : savedConfig
                  ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}
          >
            {connected && savedConfig ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Connected</span>
              </>
            ) : savedConfig ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Configured (Not Connected)</span>
              </>
            ) : (
              <>
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">Not Configured</span>
              </>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={e => e.preventDefault()} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="serverUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Server URL
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Server className="w-4 h-4" />
            </div>
            <input
              id="serverUrl"
              name="serverUrl"
              type="url"
              autoComplete="url"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="https://example.com/webdav"
              value={config.serverUrl}
              onChange={e => handleChange("serverUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="username"
              value={config.username}
              onChange={e => handleChange("username", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
              value={config.password}
              onChange={e => handleChange("password", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="token"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Token (Optional)
          </label>
          <input
            id="token"
            name="token"
            type="text"
            autoComplete="off"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            placeholder="Bearer token"
            value={config.token}
            onChange={e => handleChange("token", e.target.value)}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Some WebDAV servers require a token instead of username/password
          </p>
        </div>
      </form>

      {/* Help and Guidance Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-[#007aff]" />
          <h4 className="font-medium text-[#1d1d1f] dark:text-white">Configuration Help</h4>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">What is WebDAV?</p>
            <p>
              WebDAV (Web Distributed Authoring and Versioning) is a protocol that allows you to
              access files on a remote server as if they were local files.
            </p>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">Recommended WebDAV Servers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <a
                  href="https://alist.nn.ci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#007aff] hover:underline"
                >
                  AList
                </a>{" "}
                - Simple file list program supporting multiple storage
              </li>
              <li>
                <a
                  href="https://nextcloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#007aff] hover:underline"
                >
                  Nextcloud
                </a>{" "}
                - Self-hosted productivity platform
              </li>
              <li>
                <a
                  href="https://owncloud.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#007aff] hover:underline"
                >
                  ownCloud
                </a>{" "}
                - Open source file sync and share
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">Configuration Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Always use HTTPS for secure connections</li>
              <li>Test connection before saving</li>
              <li>Keep your credentials secure</li>
              <li>Contact your server administrator if you need help</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="primary"
          onClick={handleTest}
          isLoading={testing}
          disabled={!config.serverUrl}
        >
          <Wifi className="w-4 h-4" />
          Test Connection
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          Save Configuration
        </Button>

        {savedConfig?.serverUrl && (
          <Button variant="danger" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        )}
      </div>

      {testResult === "success" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">
              Configuration saved successfully! Redirecting to home page...
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>You will be redirected in a few seconds</span>
            <button onClick={() => navigate("/")} className="text-[#007aff] hover:underline">
              Go now →
            </button>
          </div>
        </div>
      )}

      {testResult === "error" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span className="text-sm">
              Connection test failed. Please check your configuration.
            </span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 px-1">
            <p className="font-medium mb-1">Troubleshooting tips:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Verify your server URL is correct</li>
              <li>Check your username and password</li>
              <li>Ensure the server supports WebDAV protocol</li>
              <li>Try using HTTPS if available</li>
            </ul>
          </div>
        </div>
      )}

      {error && testResult !== "error" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 px-1">
            <p>If this error persists, try clearing your browser storage or contact support.</p>
          </div>
        </div>
      )}
    </div>
  );
};
