import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Library, ListMusic, Settings, Music, Menu, X } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  requiresWebDAV?: boolean;
}

interface NavigationBarProps {
  className?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ className = "" }) => {
  const webdavConfigured = useAppStore(state => state.webdavConfigured);
  const currentView = useAppStore(state => state.currentView);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-5 h-5" />,
      path: "/",
    },
    {
      id: "library",
      label: "Library",
      icon: <Library className="w-5 h-5" />,
      path: "/library",
      requiresWebDAV: true,
    },
    {
      id: "playlists",
      label: "Playlists",
      icon: <ListMusic className="w-5 h-5" />,
      path: "/playlists",
      requiresWebDAV: true,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/settings",
    },
  ];

  const handleNavigation = (itemId: string) => {
    useAppStore.getState().setCurrentView(itemId);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigation = (itemId: string) => {
    handleNavigation(itemId);
    setMobileMenuOpen(false);
  };

  const isItemDisabled = (item: NavigationItem) => {
    return item.requiresWebDAV && !webdavConfigured;
  };

  return (
    <nav
      className={`bg-white dark:bg-[#1c1c1e] border-b border-[#e5e5e7] dark:border-[#2c2c2e] ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Music className="w-8 h-8 text-[#007aff]" />
              <span className="text-xl font-semibold text-[#1d1d1f] dark:text-white">
                Cloud Player
              </span>
            </div>
          </div>

          {/* Desktop Navigation (md and up) */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map(item => {
              const disabled = isItemDisabled(item);
              return (
                <NavLink
                  key={item.id}
                  to={disabled ? "/" : item.path}
                  onClick={e => {
                    if (disabled) {
                      e.preventDefault();
                    } else {
                      handleNavigation(item.id);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!disabled) {
                        handleNavigation(item.id);
                      }
                    }
                  }}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 dark:focus:ring-offset-white
                    ${
                      disabled
                        ? "text-[#8e8e93] dark:text-[#636366] cursor-not-allowed opacity-60"
                        : isActive || currentView === item.id
                          ? "bg-[#007aff]/10 text-[#007aff] dark:bg-[#0a84ff]/20 dark:text-[#0a84ff]"
                          : "text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]"
                    }
                  `}
                  aria-disabled={disabled}
                  aria-current={currentView === item.id ? "page" : undefined}
                  title={disabled ? "Configure WebDAV first" : undefined}
                  tabIndex={disabled ? -1 : 0}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {disabled && (
                    <span className="ml-1 text-xs text-[#ff3b30] dark:text-[#ff453a]">*</span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* WebDAV Status Indicator and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* WebDAV Status - hidden on mobile, shown on tablet and up */}
            <div className="hidden sm:flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${webdavConfigured ? "bg-green-500" : "bg-red-500"}`}
              />
              <span className="text-sm text-[#8e8e93] dark:text-[#8e8e93]">
                {webdavConfigured ? "Connected" : "Not Configured"}
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 dark:focus:ring-offset-[#1c1c1e]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (sm and down) */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-[#e5e5e7] dark:border-[#2c2c2e]"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map(item => {
                const disabled = isItemDisabled(item);
                return (
                  <NavLink
                    key={item.id}
                    to={disabled ? "/" : item.path}
                    onClick={e => {
                      if (disabled) {
                        e.preventDefault();
                      } else {
                        handleMobileNavigation(item.id);
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!disabled) {
                          handleMobileNavigation(item.id);
                        }
                      }
                    }}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium
                      focus:outline-none focus:ring-2 focus:ring-[#007aff] focus:ring-offset-2 dark:focus:ring-offset-[#1c1c1e]
                      ${
                        disabled
                          ? "text-[#8e8e93] dark:text-[#636366] cursor-not-allowed opacity-60"
                          : currentView === item.id
                            ? "bg-[#007aff]/10 text-[#007aff] dark:bg-[#0a84ff]/20 dark:text-[#0a84ff]"
                            : "text-[#1d1d1f] dark:text-white hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]"
                      }
                    `}
                    aria-disabled={disabled}
                    aria-current={currentView === item.id ? "page" : undefined}
                    role="menuitem"
                    tabIndex={disabled ? -1 : 0}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {disabled && (
                      <span className="ml-auto text-xs text-[#ff3b30] dark:text-[#ff453a]">
                        Requires WebDAV
                      </span>
                    )}
                  </NavLink>
                );
              })}

              {/* Mobile WebDAV Status */}
              <div className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${webdavConfigured ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm text-[#8e8e93] dark:text-[#8e8e93]">
                    WebDAV: {webdavConfigured ? "Connected" : "Not Configured"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
