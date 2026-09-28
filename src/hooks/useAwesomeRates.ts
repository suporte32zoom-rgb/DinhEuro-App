import { useState, useEffect, useCallback, useRef } from "react";
import { 
  fetchAwesomeRates, 
  NormalizedQuote, 
  AwesomeApiResponse, 
  AwesomeRatesResult 
} from "../services/awesomeApi";
import { ALL_ASSETS } from "../data/marketData";

export function useAwesomeRates(onPriceUpdate?: (symbol: string, price: number) => void) {
  const [quotes, setQuotes] = useState<Record<string, NormalizedQuote>>({});
  const [raw, setRaw] = useState<AwesomeApiResponse>({});
  const [lastCreateDate, setLastCreateDate] = useState<string>("");
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [source, setSource] = useState<string>("awesomeapi_direct");
  const [secondsUntilNextPoll, setSecondsUntilNextPoll] = useState<number>(30);

  const countdownTimerRef = useRef<any>(null);
  const pollTimerRef = useRef<any>(null);

  // Sync data into ALL_ASSETS
  const syncToAllAssets = useCallback((newQuotes: Record<string, NormalizedQuote>) => {
    for (const [key, quote] of Object.entries(newQuotes)) {
      const asset = ALL_ASSETS.find((a) => a.symbol === key);
      if (asset) {
        asset.price = quote.bid;
        asset.change = quote.change;
        asset.changePercent = quote.changePercent;
        if (quote.high > 0) asset.high = quote.high;
        if (quote.low > 0) asset.low = quote.low;

        // Push new value to sparkline if different
        if (asset.sparkline && asset.sparkline.length > 0) {
          const lastSpark = asset.sparkline[asset.sparkline.length - 1];
          if (lastSpark !== quote.bid) {
            asset.sparkline = [...asset.sparkline.slice(-6), quote.bid];
          }
        }

        // Notify price alert evaluator if callback provided
        if (onPriceUpdate) {
          onPriceUpdate(asset.symbol, quote.bid);
        }
      }
    }

    // Also update EUR/USD cross rate if EURBRL and USDBRL exist
    if (newQuotes.EURBRL && newQuotes.USDBRL && newQuotes.USDBRL.bid > 0) {
      const crossEurUsd = newQuotes.EURBRL.bid / newQuotes.USDBRL.bid;
      const eurusdAsset = ALL_ASSETS.find((a) => a.symbol === "EURUSD");
      if (eurusdAsset) {
        eurusdAsset.price = Number(crossEurUsd.toFixed(4));
        if (onPriceUpdate) onPriceUpdate("EURUSD", eurusdAsset.price);
      }
    }
  }, [onPriceUpdate]);

  // Main fetch execution
  const executeFetch = useCallback(async (isManual: boolean = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const result: AwesomeRatesResult = await fetchAwesomeRates();
      setQuotes(result.quotes);
      setRaw(result.raw);
      setLastCreateDate(result.lastCreateDate);
      setLastFetchTime(result.lastFetchTime);
      setSource(result.source);
      syncToAllAssets(result.quotes);
    } catch (e) {
      console.warn("AwesomeAPI sync notice:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setSecondsUntilNextPoll(30);
    }
  }, [syncToAllAssets]);

  // Initial fetch and 30s polling cycle
  useEffect(() => {
    executeFetch(false);

    // 30 seconds main polling interval
    pollTimerRef.current = setInterval(() => {
      executeFetch(false);
    }, 30000);

    // 1-second countdown ticker
    countdownTimerRef.current = setInterval(() => {
      setSecondsUntilNextPoll((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [executeFetch]);

  // Manual refresh trigger
  const refresh = useCallback(() => {
    executeFetch(true);
  }, [executeFetch]);

  return {
    quotes,
    raw,
    lastCreateDate,
    lastFetchTime,
    isLoading,
    isRefreshing,
    source,
    secondsUntilNextPoll,
    refresh,
  };
}
