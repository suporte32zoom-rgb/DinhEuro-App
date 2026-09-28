import { useState, useEffect, useCallback, useMemo } from "react";
import { PriceAlert, MarketAsset } from "../types";
import { ALL_ASSETS } from "../data/marketData";

const STORAGE_KEY = "dinheuro_price_alerts";
const DISMISSED_KEY = "dinheuro_dismissed_alerts";

export function usePriceAlerts() {
  // Initialize alerts from localStorage or provide initial realistic defaults
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load price alerts from localStorage:", e);
    }
    // Initial sample targets
    return [
      {
        id: "alert-eurbrl-1",
        symbol: "EURBRL",
        name: "Euro Comercial / Real Brasileiro",
        currency: "BRL",
        targetPrice: 6.28,
        condition: "above",
        initialPrice: 6.245,
        active: true,
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        triggered: false,
        notes: "Meta de câmbio para remessa comercial ao Brasil",
      },
      {
        id: "alert-petr4-1",
        symbol: "PETR4",
        name: "Petróleo Brasileiro S.A. Petrobras",
        currency: "BRL",
        targetPrice: 38.50,
        condition: "above",
        initialPrice: 37.85,
        active: true,
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        triggered: false,
        notes: "Gatilho de realização parcial de lucros",
      },
      {
        id: "alert-btc-1",
        symbol: "BTCBRL",
        name: "Bitcoin / Real",
        currency: "BRL",
        targetPrice: 550000,
        condition: "above",
        initialPrice: 542000,
        active: true,
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        triggered: false,
        notes: "Gatilho institucional de rompimento",
      },
    ];
  });

  // Track dismissed notifications during current session
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem(DISMISSED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Live prices registry (can be simulated or updated)
  const [simulatedPrices, setSimulatedPrices] = useState<Record<string, number>>({});

  // Helper to get current price of any symbol
  const getAssetCurrentPrice = useCallback((symbol: string): { price: number; asset?: MarketAsset } => {
    if (simulatedPrices[symbol] !== undefined) {
      const asset = ALL_ASSETS.find((a) => a.symbol === symbol);
      return { price: simulatedPrices[symbol], asset };
    }
    const asset = ALL_ASSETS.find((a) => a.symbol === symbol);
    return { price: asset ? asset.price : 0, asset };
  }, [simulatedPrices]);

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    } catch (e) {
      console.warn("Failed to persist price alerts:", e);
    }
  }, [alerts]);

  // Persist dismissed IDs to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissedIds));
    } catch (e) {
      console.warn("Failed to persist dismissed alerts:", e);
    }
  }, [dismissedIds]);

  // Evaluate price triggers
  const checkTriggers = useCallback(() => {
    setAlerts((currentAlerts) => {
      let hasChanges = false;
      const updated = currentAlerts.map((alert) => {
        if (!alert.active || alert.triggered) return alert;

        const { price } = getAssetCurrentPrice(alert.symbol);
        if (price <= 0) return alert;

        let isTriggered = false;
        if (alert.condition === "above" && price >= alert.targetPrice) {
          isTriggered = true;
        } else if (alert.condition === "below" && price <= alert.targetPrice) {
          isTriggered = true;
        }

        if (isTriggered) {
          hasChanges = true;
          return {
            ...alert,
            triggered: true,
            triggeredAt: new Date().toISOString(),
            triggeredPrice: price,
          };
        }
        return alert;
      });

      return hasChanges ? updated : currentAlerts;
    });
  }, [getAssetCurrentPrice]);

  // Run trigger checks whenever simulated prices or initial state changes
  useEffect(() => {
    checkTriggers();
  }, [simulatedPrices, checkTriggers]);

  // Add new price target alert
  const addAlert = useCallback(
    (
      symbol: string,
      targetPrice: number,
      condition: "above" | "below",
      notes?: string
    ) => {
      const asset = ALL_ASSETS.find((a) => a.symbol === symbol);
      const currentPrice = asset ? asset.price : targetPrice;

      const newAlert: PriceAlert = {
        id: `alert-${symbol}-${Date.now()}`,
        symbol,
        name: asset ? asset.name : symbol,
        currency: asset ? asset.currency : "BRL",
        targetPrice,
        condition,
        initialPrice: currentPrice,
        active: true,
        createdAt: new Date().toISOString(),
        triggered: false,
        notes: notes?.trim() || undefined,
      };

      setAlerts((prev) => [newAlert, ...prev]);

      // Immediate check in case the target is already reached
      setTimeout(() => checkTriggers(), 50);
      return newAlert;
    },
    [checkTriggers]
  );

  // Remove alert
  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setDismissedIds((prev) => prev.filter((dismissedId) => dismissedId !== id));
  }, []);

  // Toggle active status
  const toggleAlertActive = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  }, []);

  // Reset a triggered alert to active
  const resetAlert = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              triggered: false,
              triggeredAt: undefined,
              triggeredPrice: undefined,
              active: true,
            }
          : a
      )
    );
    setDismissedIds((prev) => prev.filter((dismissedId) => dismissedId !== id));
  }, []);

  // Dismiss notification toast for a specific alert
  const dismissNotification = useCallback((id: string) => {
    setDismissedIds((prev) => [...prev, id]);
  }, []);

  // Dismiss all currently triggered notifications
  const dismissAllNotifications = useCallback(() => {
    const triggeredIds = alerts.filter((a) => a.triggered).map((a) => a.id);
    setDismissedIds((prev) => Array.from(new Set([...prev, ...triggeredIds])));
  }, [alerts]);

  // Simulate price shift or manual trigger for instant interactive testing
  const triggerAlertManually = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const { price } = getAssetCurrentPrice(a.symbol);
          return {
            ...a,
            active: true,
            triggered: true,
            triggeredAt: new Date().toISOString(),
            triggeredPrice: a.targetPrice || price,
          };
        }
        return a;
      })
    );
    // Remove from dismissed so notification pops up
    setDismissedIds((prev) => prev.filter((dismissedId) => dismissedId !== id));
  }, [getAssetCurrentPrice]);

  // Simulate market price move (e.g. test button in UI)
  const simulatePriceChange = useCallback(
    (symbol: string, newPrice: number) => {
      setSimulatedPrices((prev) => ({ ...prev, [symbol]: newPrice }));
    },
    []
  );

  const resetSimulatedPrices = useCallback(() => {
    setSimulatedPrices({});
  }, []);

  // Unread / visible triggered alerts that should show in the banner/toast
  const activeTriggeredAlerts = useMemo(() => {
    return alerts.filter(
      (alert) => alert.triggered && !dismissedIds.includes(alert.id)
    );
  }, [alerts, dismissedIds]);

  const totalTriggeredCount = useMemo(() => {
    return alerts.filter((alert) => alert.triggered).length;
  }, [alerts]);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter((alert) => alert.active && !alert.triggered).length;
  }, [alerts]);

  return {
    alerts,
    activeTriggeredAlerts,
    totalTriggeredCount,
    activeAlertsCount,
    addAlert,
    removeAlert,
    toggleAlertActive,
    resetAlert,
    dismissNotification,
    dismissAllNotifications,
    triggerAlertManually,
    simulatePriceChange,
    resetSimulatedPrices,
    getAssetCurrentPrice,
  };
}
