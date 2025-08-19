import { useState, useEffect, useRef, Fragment } from "react";
import styles from "./Navbar.module.css";
import PropTypes from "prop-types";
import { BellIcon, Bars3Icon, ChevronDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems, Transition, Dialog, TransitionChild, DialogPanel } from "@headlessui/react";
import { ArrowLeftIcon, HomeIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { useSelector } from "react-redux";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const Navbar = ({
  title,
  actions,
  activeAction,
  onActionClick,
  actionsDropdown,
  isBackButtonEnabled = true,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const actionsWrapperRef = useRef(null);
  const actionRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const getActiveActionLabel = () => {
    if (actions && activeAction) {
      const active = actions.find((action) => action.id === activeAction);
      return active ? active.label : "Options";
    }
    return "Options";
  };

  const { currentUser } = useSelector((state) => state.auth);

  const handleTitleClick = () => {
    if (!isBackButtonEnabled) return;
    if (actionsDropdown && window.matchMedia("(max-width: 767px)").matches) return;
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/groups");
    }
  };

  // Desktop actions underline slider
  useEffect(() => {
    if (!actions || !activeAction) return;
    const el = actionRefs.current[activeAction];
    const wrapper = actionsWrapperRef.current;
    if (!el || !wrapper) return;
    const elRect = el.getBoundingClientRect();
    const wrapRect = wrapper.getBoundingClientRect();
    setSliderStyle({ left: elRect.left - wrapRect.left, width: elRect.width, opacity: 1 });
  }, [actions, activeAction]);

  useEffect(() => {
    const onResize = () => {
      if (!actions || !activeAction) return;
      const el = actionRefs.current[activeAction];
      const wrapper = actionsWrapperRef.current;
      if (!el || !wrapper) return;
      const elRect = el.getBoundingClientRect();
      const wrapRect = wrapper.getBoundingClientRect();
      setSliderStyle({ left: elRect.left - wrapRect.left, width: elRect.width, opacity: 1 });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [actions, activeAction]);

  const isPathActive = (prefix) =>
    typeof window !== "undefined" && window.location.pathname.startsWith(prefix);

  return (
    <nav
      className={`${styles.navbar} bg-gradient-to-r from-secondary/10 via-transparent to-primary/10 backdrop-blur-md shadow-md/10 dark:shadow-lg/40 border-b border-white/10`}
      aria-label="Primary navigation"
    >
      <div className="relative max-w-7xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 grid grid-cols-12 gap-3">
        {/* Left: Back + Title with centered mobile selector */}
        <div
          className={`${styles.title} col-span-8 sm:col-span-6 md:col-span-3 flex flex-col md:flex-row md:items-center gap-1 md:gap-2 ${
            isBackButtonEnabled ? "md:cursor-pointer md:hover:opacity-90 md:transition-opacity" : ""
          }`}
          onClick={handleTitleClick}
        >
          <div className="flex items-center gap-2">
            {isBackButtonEnabled && (
              <span className="hidden md:inline-flex items-center justify-center rounded-full bg-secondary/5 ring-1 ring-secondary/10 p-1">
                <ArrowLeftIcon className="w-4 h-4 text-secondary/80" />
              </span>
            )}

            <div className="min-w-0">
              <p className={`${actionsDropdown ? "hidden md:block" : ""} truncate`}>
                {title || "No title provided"}
              </p>
            </div>
          </div>

          {actionsDropdown && (
            <div
              className="md:hidden absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Menu>
                <MenuButton
                  className="flex group items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm font-semibold text-secondary hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Open actions"
                >
                  <span className="truncate max-w-[10rem]">{getActiveActionLabel()}</span>
                  <ChevronDownIcon className="size-4 transition-transform duration-150 group-data-[open]:rotate-180" />
                </MenuButton>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems
                    anchor="bottom"
                    className="w-48 z-50 origin-top rounded-xl border border-purple-400/30 bg-dark-gray p-2 text-sm text-secondary shadow-xl"
                  >
                    {actions &&
                      actions.map((action) => (
                        <MenuItem key={action.id}>
                          {({ active }) => (
                            <button
                              onClick={() => onActionClick && onActionClick(action.id)}
                              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                                active ? "bg-white/5" : "hover:bg-white/3"
                              }`}
                            >
                              <span className="flex-1 truncate">{action.label}</span>
                              {activeAction === action.id && (
                                <CheckIcon className="w-4 h-4 text-secondary opacity-90" />
                              )}
                            </button>
                          )}
                        </MenuItem>
                      ))}
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          )}
        </div>

        {/* Center: Actions (desktop) */}
        <div ref={actionsWrapperRef} className={`hidden md:flex col-span-6 justify-center relative ${styles.actionWrapper}`}>
          {actions &&
            actions.map((action) => (
              <button
                key={action.id}
                className={`${styles.action} relative cursor-pointer inline-flex items-center px-2 py-1 rounded-md text-secondary/90 hover:text-secondary transition-colors ${
                  activeAction === action.id ? styles.active : ""
                }`}
                onClick={() => onActionClick && onActionClick(action.id)}
                ref={(el) => (actionRefs.current[action.id] = el)}
              >
                <span>{action.label}</span>
              </button>
            ))}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-[0.2px] h-0.5 rounded bg-tertiary transition-all duration-200"
            style={{ left: `${sliderStyle.left}px`, width: `${sliderStyle.width}px`, opacity: sliderStyle.opacity }}
          />
        </div>

        {/* Right: Quick actions */}
        <div className="col-span-4 sm:col-span-6 md:col-span-3 flex items-center justify-end gap-2">
          {/* Notification bell */}
          <button
            type="button"
            className={`${styles.notification} relative inline-flex items-center justify-center h-9 w-9 rounded-full hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary`}
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            <span className="sr-only">Open notifications</span>
            <span className="absolute top-0 right-0 inline-block h-2 w-2 translate-x-1/4 -translate-y-1/4 rounded-full bg-tertiary ring-2 ring-dark-gray" aria-hidden="true"></span>
          </button>

          {/* Theme switcher (desktop) */}
          <ThemeSwitcher className="hidden md:flex" />

          {/* Avatar */}
          <div className={`${styles.profile} hidden sm:block justify-center `}>
            <div
              className="flex items-center justify-center rounded-full ring-1 ring-white/10 hover:ring-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              aria-label="Open profile"
            >
              <div className={styles.icon}>
                <ProfilePicture currentUser={currentUser} />
              </div>
            </div>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full bg-white/5 text-secondary hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            aria-label="Open main menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Bars3Icon className="size-5" />
          </button>
        </div>
      </div>

      {/* Mobile slide-over menu */}
      <Transition show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60] md:hidden" onClose={setMobileMenuOpen}>
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </TransitionChild>

          <div className="fixed inset-0 flex justify-end">
            <TransitionChild
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-150"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="w-[88%] max-w-sm h-full bg-dark-gray border-l border-white/10 shadow-2xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/10">
                      <ProfilePicture currentUser={currentUser} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-secondary text-sm font-semibold truncate">
                        {currentUser?.name || currentUser?.displayName || "Account"}
                      </p>
                      <p className="text-white/50 text-xs truncate">{currentUser?.email || ""}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full p-2 text-secondary hover:bg-secondary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-2 space-y-1 text-secondary">
                  <button
                    onClick={() => {
                      navigate("/groups");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full inline-flex items-center gap-3 rounded-lg px-3 py-2 text-left ${
                      isPathActive("/groups") ? "bg-white/5" : "hover:bg-white/5"
                    }`}
                  >
                    <HomeIcon className="size-4" />
                    <span className="flex-1">Home</span>
                    {isPathActive("/groups") && <CheckIcon className="w-4 h-4 text-secondary" />}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full inline-flex items-center gap-3 rounded-lg px-3 py-2 text-left ${
                      isPathActive("/settings") ? "bg-white/5" : "hover:bg-white/5"
                    }`}
                  >
                    <Cog6ToothIcon className="size-4" />
                    <span className="flex-1">Settings</span>
                    {isPathActive("/settings") && <CheckIcon className="w-4 h-4 text-secondary" />}
                  </button>
                </div>

                {actions && actions.length > 0 && (
                  <div className="mt-2 border-t border-white/10 pt-3">
                    <p className="px-1 pb-1 text-xs uppercase tracking-wide text-white/50">Actions</p>
                    <div className="space-y-1 text-secondary">
                      {actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            onActionClick && onActionClick(action.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full inline-flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-white/5 ${
                            activeAction === action.id ? "bg-white/5" : ""
                          }`}
                        >
                          <span className="flex-1 truncate">{action.label}</span>
                          {activeAction === action.id && (
                            <CheckIcon className="w-4 h-4 text-secondary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-white/40">Appearance</span>
                  <ThemeSwitcher />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </nav>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  activeAction: PropTypes.string,
  onActionClick: PropTypes.func,
  actionsDropdown: PropTypes.bool,
  isBackButtonEnabled: PropTypes.bool,
};

export default Navbar;
