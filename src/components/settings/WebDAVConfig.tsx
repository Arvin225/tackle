import React, { useState } from "react";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { useWebDAV } from "../../hooks/useWebDAV";
import { Server, Wifi, CheckCircle, XCircle } from "lucide-react";
import { useSettingsStore } from "../../store/useSettingsStore";

interface WebDAVConfigProps {
  className?: string;
}

export const WebDAVConfig: React.FC<WebDAVConfigProps> = ({ className = "" }) => {
  const { connection, saveConnection, testConnection } = useWebDAV();
  const [config, setConfig] = useState({
    url: connection.url || "",
    username: connection.username || "",
    password: connection.password || "",
    token: connection.token || "",
  });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(
      config.url !== (connection.url || "") ||
        config.username !== (connection.username || "") ||
        config.password !== (connection.password || "") ||
        config.token !== (connection.token || "")
    );
  }, [config, connection]);

  const handleChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  const handleSave = async () => {
    try {
      await saveConnection(config);
      setTestResult("success");
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      console.error("Failed to save connection:", error);
      setTestResult("error");
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      await testConnection(config);
      setTestResult("success");
    } catch (error) {
      console.error("Connection test failed:", error);
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  };

  const isConnected = !!connection.url && !connection.error;

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Server className="w-6 h-6 text-[#007aff]" />
          <h2 className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
            WebDAV Connection
          </h2>
        </div>

        {isConnected && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Connected successfully</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Server URL
          </label>
          <Input
            type="text"
            value={config.url}
            onChange={e => handleChange("url", e.target.value)}
            placeholder="https://your-server.com/remote.php/webdav/"
            disabled={isConnected}
          />
          <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">
            Full URL to WebDAV server
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Username (optional)
          </label>
          <Input
            type="text"
            value={config.username}
            onChange={e => handleChange("username", e.target.value)}
            placeholder="your-username"
            disabled={isConnected}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Password (optional)
          </label>
          <Input
            type="password"
            value={config.password}
            onChange={e => handleChange("password", e.target.value)}
            placeholder="••••••••"
            disabled={isConnected}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] dark:text-white mb-2">
            Token (optional)
          </label>
          <Input
            type="text"
            value={config.token}
            onChange={e => handleChange("token", e.target.value)}
            placeholder="your-token"
            disabled={isConnected}
          />
          <p className="text-xs text-[#86868b] dark:text-[#8e8e93] mt-1">
            Alternative to username/password
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            onClick={handleTest}
            isLoading={testing}
            disabled={!config.url || !hasChanges}
          >
            <Wifi className="w-4 h-4 mr-2" />
            Test Connection
          </Button>

          <Button
            variant={hasChanges ? "primary" : "secondary"}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Configuration
          </Button>
        </div>
      </div>

      {testResult === "success" && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm">Connection test successful</span>
        </div>
      )}

      {testResult === "error" && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <XCircle className="w-5 h-5" />
          <span className="text-sm">Connection test failed. Please check your configuration.</span>
        </div>
      )}
    </div>
  );
};
