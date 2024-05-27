import { useState, useEffect } from "react";
import { match } from "ts-pattern";
import { timeUntilNext, type TemporalPeriod } from "./functions";

export function useDateResetsEvery(updateType: TemporalPeriod) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const delay = timeUntilNext(updateType);
    const updateDate = () => setDate(new Date());

    let timeoutId = setTimeout(() => updateDate(), delay);

    return () => clearTimeout(timeoutId);
  }, [updateType, date]);

  return date;
}
