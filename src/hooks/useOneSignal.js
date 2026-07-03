import { useEffect, useState, useCallback } from "react";

// --------------------------------------------------------------------------
// Module-level shared store — all hook instances stay in sync.
// Without this, a component that subscribes on one route would leave
// another route's instance with a stale `subscribed = false`, causing the
// modal to flash open on navigation.
// --------------------------------------------------------------------------
let _subscribed = false;
let _loading = true;
const _listeners = new Set();

const _getSnapshot = () => ({ subscribed: _subscribed, loading: _loading });

const _publish = () => {
  const snap = _getSnapshot();
  _listeners.forEach((fn) => fn(snap));
};

const _subscribe = (listener) => {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
};

// --------------------------------------------------------------------------

const useOneSignal = (userId) => {
  const [state, setState] = useState(_getSnapshot);

  // Subscribe to module-level changes
  useEffect(() => _subscribe(setState), []);

  // ------------------------------------------------------------------
  //  1. Init OneSignal SDK & read subscription state
  // ------------------------------------------------------------------
  useEffect(() => {
    // Detect permanently denied permission upfront so we never show a
    // loading spinner for a browser that can never receive notifications.
    if (
      typeof Notification !== "undefined" &&
      Notification.permission === "denied"
    ) {
      _subscribed = false;
      _loading = false;
      _publish();
      return;
    }

    window.OneSignalDeferred = window.OneSignalDeferred || [];

    // Shared read logic — always reads the real subscription state and
    // resolves loading regardless of whether init was needed.
    const readAndPublish = async (OneSignal) => {
      try {
        // Wait for the push subscription to be fully loaded from storage
        // before trusting optedIn. The `id` is only set after IndexedDB
        // has been read — until then optedIn can return `false` even for
        // subscribed users (causing the modal to flash open on refresh).
        for (let i = 0; i < 10; i++) {
          try {
            const id = await OneSignal.User.PushSubscription.id;
            if (id) break;
          } catch (_) { /* id not ready yet */ }
          await new Promise((r) => setTimeout(r, 300));
        }

        const optedIn = await OneSignal.User.PushSubscription.optedIn;
        _subscribed = Boolean(optedIn);
      } catch (_) {
        _subscribed = false;
      } finally {
        _loading = false;
        _publish();
      }
    };

    if (!window.__ONESIGNAL_INITIALIZED__) {
      window.__ONESIGNAL_INITIALIZED__ = true;

      // Single callback: init → read (guarantees read never runs before
      // init completes, preventing a stale `false` subscription state).
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.init({
            appId: "175d666a-7dbe-4c49-9546-18c8c5fc720e",
            safari_web_id:
              "web.onesignal.auto.2a0b8f88-f61f-4cbf-954f-aff96911a546",
            notifyButton: { enable: false },
            allowLocalhostAsSecureOrigin: true,
          });
        } catch (err) {
          console.error("OneSignal init failed:", err);
        }

        await readAndPublish(OneSignal);
      });
    } else {
      // Already initialized — push a standalone read callback.
      window.OneSignalDeferred.push(readAndPublish);
    }
    // Intentionally no dependency array — runs once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  //  2. Link / unlink external ID
  //     Only fires after a valid PushSubscription.id exists.
  //     Reacts to userId *and* subscribed so that a first-time
  //     subscription triggers a fresh login call.
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const link = async () => {
      // Poll for a valid push subscription id (may be null right after init).
      for (let attempt = 0; attempt < 10; attempt++) {
        if (cancelled) return;

        try {
          const id = await new Promise((resolve, reject) => {
            window.OneSignalDeferred.push(async (OneSignal) => {
              try {
                resolve(await OneSignal.User.PushSubscription.id);
              } catch (e) {
                reject(e);
              }
            });
          });

          if (id) {
            if (cancelled) return;

            if (userId) {
              window.OneSignalDeferred.push(async (OneSignal) => {
                try {
                  await OneSignal.login(userId.toString());
                } catch (err) {
                  console.error("OneSignal login failed:", err);
                }
              });
            } else {
              window.OneSignalDeferred.push(async (OneSignal) => {
                try {
                  await OneSignal.logout();
                } catch (err) {
                  console.error("OneSignal logout failed:", err);
                }
              });
            }
            return; // success — stop polling
          }
        } catch (_) {
          // Subscription id not ready yet — keep polling
        }

        await new Promise((r) => setTimeout(r, 500));
      }
    };

    link();

    return () => {
      cancelled = true;
    };
  }, [userId, state.subscribed]);

  // ------------------------------------------------------------------
  //  3. Subscribe
  // ------------------------------------------------------------------
  const subscribe = useCallback(async () => {
    return new Promise((resolve, reject) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.Notifications.requestPermission();

          if (!(await OneSignal.User.PushSubscription.optedIn)) {
            await OneSignal.User.PushSubscription.optIn();
          }

          const subscriptionId = await OneSignal.User.PushSubscription.id;
          _subscribed = true;
          _publish();
          resolve(subscriptionId);
        } catch (e) {
          reject(e);
        }
      });
    });
  }, []);

  // ------------------------------------------------------------------
  //  4. Unsubscribe
  // ------------------------------------------------------------------
  const unsubscribe = useCallback(async () => {
    return new Promise((resolve, reject) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.User.PushSubscription.optOut();
          _subscribed = false;
          // Reset the dismiss flag so the modal can re-prompt if the user
          // explicitly opted out after having previously dismissed it.
          localStorage.removeItem("notification_popup_dismissed");
          _publish();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }, []);

  return {
    subscribed: state.subscribed,
    loading: state.loading,
    subscribe,
    unsubscribe,
  };
};

export default useOneSignal;