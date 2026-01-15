export function getRangeOfTime(timeRange: number) {
  const ONE_SECOND = 1_000;
  const ONE_MINUTE = 60 * ONE_SECOND;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;
  const ONE_WEEK = 7 * ONE_DAY;
  const ONE_MONTH = 30 * ONE_DAY;
  const ONE_YEAR = 52 * ONE_WEEK;

  // Calculate the timerage into years, months, weeks, days, hours, minutes, and seconds
  const years = Math.floor(timeRange / ONE_YEAR);
  const months = Math.floor(
    years > 0
      ? (timeRange % (years * ONE_YEAR)) / ONE_MONTH
      : timeRange / ONE_MONTH
  );
  const weeks = Math.floor(
    months > 0
      ? (timeRange % (months * ONE_MONTH)) / ONE_WEEK
      : timeRange / ONE_WEEK
  );
  const days = Math.floor(
    weeks > 0 ? (timeRange % (weeks * ONE_WEEK)) / ONE_DAY : timeRange / ONE_DAY
  );
  const hours = Math.floor(
    days > 0 ? (timeRange % (days * ONE_DAY)) / ONE_HOUR : timeRange / ONE_HOUR
  );
  const minutes = Math.floor(
    hours > 0
      ? (timeRange % (hours * ONE_HOUR)) / ONE_MINUTE
      : timeRange / ONE_MINUTE
  );
  const seconds = Math.floor(
    minutes > 0
      ? (timeRange % (minutes * ONE_MINUTE)) / ONE_SECOND
      : timeRange / ONE_SECOND
  );

  return {
    years: years,
    months: months,
    weeks: weeks,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

export const calcAge = (isoDate:string) => {
      const date = new Date(isoDate.split("T")[0]);
      const partsOfDateStr = isoDate.split("T")[1].split(":");
      date.setHours(
        parseInt(partsOfDateStr[0]),
        parseInt(partsOfDateStr[1]),
        parseFloat(partsOfDateStr[2].slice(0, 4))
      );

      const age = getRangeOfTime(Date.now() - date.valueOf());

      return `${
          age.years > 0
            ? age.years + " years ago"
            : age.months > 0
            ? age.months + "months ago"
            : age.weeks > 0
            ? age.weeks + " weeks ago"
            : age.days > 0
            ? age.days + " days ago"
            : age.hours > 0
            ? age.hours + " hours ago"
            : age.minutes > 0
            ? age.minutes + " minutes ago"
            : "now"
        }`
      
    };