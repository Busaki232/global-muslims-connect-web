import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Hijri month names
export const HIJRI_MONTHS = [
  { arabic: 'محرم', english: 'Muharram' },
  { arabic: 'صفر', english: 'Safar' },
  { arabic: 'ربيع الأول', english: 'Rabi al-Awwal' },
  { arabic: 'ربيع الثاني', english: 'Rabi al-Thani' },
  { arabic: 'جمادى الأولى', english: 'Jumada al-Ula' },
  { arabic: 'جمادى الآخرة', english: 'Jumada al-Akhirah' },
  { arabic: 'رجب', english: 'Rajab' },
  { arabic: 'شعبان', english: "Sha'ban" },
  { arabic: 'رمضان', english: 'Ramadan' },
  { arabic: 'شوال', english: 'Shawwal' },
  { arabic: 'ذو القعدة', english: "Dhu al-Qi'dah" },
  { arabic: 'ذو الحجة', english: 'Dhu al-Hijjah' },
];

interface IslamicHoliday {
  id: string;
  name: string;
  name_arabic: string;
  hijri_month: number;
  hijri_day: number;
  description: string;
  significance: string;
  is_major_holiday: boolean;
}

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

// Simple Hijri date calculation (approximation based on lunar calendar)
// For production, consider using a more precise astronomical calculation library
export const gregorianToHijri = (date: Date): HijriDate => {
  // Islamic calendar epoch (July 16, 622 CE)
  const islamicEpoch = new Date(622, 6, 16).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;
  
  // Days since Islamic epoch
  const daysSinceEpoch = Math.floor((date.getTime() - islamicEpoch) / msPerDay);
  
  // Average lunar year is approximately 354.367 days
  const lunarYearLength = 354.367;
  const year = Math.floor(daysSinceEpoch / lunarYearLength) + 1;
  
  // Calculate remaining days in current year
  const daysIntoYear = daysSinceEpoch % lunarYearLength;
  
  // Average lunar month is approximately 29.53 days
  const lunarMonthLength = 29.53;
  const month = Math.floor(daysIntoYear / lunarMonthLength) + 1;
  const day = Math.floor(daysIntoYear % lunarMonthLength) + 1;
  
  return {
    year: year,
    month: Math.min(month, 12),
    day: Math.min(day, 30),
  };
};

export const useIslamicCalendar = () => {
  const [currentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [holidays, setHolidays] = useState<IslamicHoliday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate Hijri date
    const hijri = gregorianToHijri(currentDate);
    setHijriDate(hijri);

    // Fetch Islamic holidays
    const fetchHolidays = async () => {
      try {
        const { data, error } = await supabase
          .from('islamic_holidays')
          .select('*')
          .order('hijri_month', { ascending: true })
          .order('hijri_day', { ascending: true });

        if (error) throw error;
        setHolidays(data || []);
      } catch (error) {
        logger.error('Error fetching Islamic holidays', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, [currentDate]);

  // Get upcoming holidays (within next 60 days)
  const getUpcomingHolidays = () => {
    if (!hijriDate) return [];

    return holidays.filter((holiday) => {
      const monthDiff = holiday.hijri_month - hijriDate.month;
      const dayDiff = holiday.hijri_day - hijriDate.day;
      
      // Check if holiday is in current month and upcoming
      if (monthDiff === 0 && dayDiff >= 0) return true;
      
      // Check if holiday is in next month
      if (monthDiff === 1 || (monthDiff === -11 && hijriDate.month === 12)) return true;
      
      return false;
    }).slice(0, 5);
  };

  // Check if a given Hijri date has a holiday
  const getHolidayForDate = (month: number, day: number) => {
    return holidays.find(
      (h) => h.hijri_month === month && h.hijri_day === day
    );
  };

  return {
    currentDate,
    hijriDate,
    holidays,
    upcomingHolidays: getUpcomingHolidays(),
    loading,
    getHolidayForDate,
  };
};
