import { useEffect, useState } from "react";

const useOneSignal = (userId) => {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.__ONESIGNAL_INITIALIZED__) {
      setLoading(false);
      return;
    }

    window.__ONESIGNAL_INITIALIZED__ = true;
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: "175d666a-7dbe-4c49-9546-18c8c5fc720e",
          safari_web_id:
            "web.onesignal.auto.2a0b8f88-f61f-4cbf-954f-aff96911a546",
          notifyButton: {
            enable: false,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        const optedIn =
          await OneSignal.User.PushSubscription.optedIn;

        setSubscribed(optedIn);
      } catch (err) {
        console.error("OneSignal init failed:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    window.OneSignalDeferred =
      window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.login(userId.toString());

        console.log(
          "OneSignal External ID:",
          userId
        );
      } catch (err) {
        console.error("OneSignal login failed:", err);
      }
    });
  }, [userId]);

  const subscribe = async () => {
    return new Promise((resolve, reject) => {
      window.OneSignalDeferred.push(async (OneSignal) => {
        try {
          await OneSignal.Notifications.requestPermission();

          if (
            !(await OneSignal.User.PushSubscription.optedIn)
          ) {
            await OneSignal.User.PushSubscription.optIn();
          }

          const subscriptionId =
            await OneSignal.User.PushSubscription.id;

          setSubscribed(true);

          resolve(subscriptionId);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  return {
    subscribed,
    loading,
    subscribe,
  };
};

export default useOneSignal;