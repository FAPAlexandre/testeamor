/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TimeDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

/**
 * Calculates calendar-accurate duration between start date and now.
 */
export function calculateRelationshipDuration(startDateStr: string): TimeDuration {
  const start = new Date(startDateStr);
  const now = new Date();

  // If start is in the future, fallback gracefully
  if (isNaN(start.getTime()) || start > now) {
    return {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalDays: 0,
    };
  }

  const diffMs = now.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    // Get days in previous month
    const prevMonthLastDay = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthLastDay;
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
    totalDays: Math.max(0, totalDays),
  };
}

/**
 * Format date in natural Brazilian Portuguese (e.g., "15 de agosto de 2024")
 */
export function formatPortugueseDate(dateStr: string): string {
  if (!dateStr) return '';
  // Handles "YYYY-MM-DD" or ISO strings
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format short date (e.g., "15/08/2024")
 */
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('pt-BR');
}
