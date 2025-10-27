'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Calendar as CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'; // Assuming you have a Popover component
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DateRangeFilterProps {
  selectedRange: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ selectedRange, onChange }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <div className="flex items-center gap-4">
      <h3 className="text-lg font-semibold">Performance Trends</h3>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from}
            selected={selectedRange}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
