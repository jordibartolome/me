import React from "react";
import { DateTime } from "luxon";

interface ICreateDateTextOptions {
  endDate?: DateTime;
  showMonth?: boolean;
  showEndDate?: boolean;
}

const TODAY = "today";
export function createDateText(
  startDate: DateTime,
  { endDate, showMonth = true, showEndDate = true }: ICreateDateTextOptions = {}
): string {
  let end = TODAY;
  let result = `${startDate.year}`;
  if (showMonth) {
    if (endDate) {
      end = `${endDate.monthLong} ${endDate.year}`;
    }

    result = `${startDate.monthLong} ${startDate.year}`;
  } else {
    if (endDate) {
      end = `${endDate.year}`;
    }
  }

  if (showEndDate) {
    result = `${result} - ${end}`;
  }

  return result;
}

export function createPositionText(
  name: string,
  place: string,
  city?: string
): JSX.Element {
  let result: JSX.Element = (
    <>
      <span className="important">{name}</span> at{" "}
      <span className="important">{place}</span>
    </>
  );

  if (city) {
    result = (
      <>
        {result} in <span>{city}</span>
      </>
    );
  }

  return result;
}
