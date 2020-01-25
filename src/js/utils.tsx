import React, { Component } from "react";
import { DateTime } from "luxon";

interface ICreateDateTextOptions {
  endDate?: DateTime;
  showMonth?: boolean;
}

const TODAY = "today";
export function createDateText(
  startDate: DateTime,
  { endDate, showMonth = true }: ICreateDateTextOptions = {}
): string {
  let end = TODAY;
  if (showMonth) {
    if (endDate) {
      end = `${endDate.monthLong} ${endDate.year}`;
    }

    return `${startDate.monthLong} ${startDate.year} - ${end}`;
  }

  if (endDate) {
    end = `${endDate.year}`;
  }

  return `${startDate.year} - ${end}`;
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
