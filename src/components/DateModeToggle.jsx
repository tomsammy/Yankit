import React from 'react';
    import { Button } from '@/components/ui/button';
    import { CalendarDays, CalendarRange } from 'lucide-react';

    const DateModeToggle = ({ mode, onModeChange, disabled }) => {
      const modes = [
        { value: 'specific', label: 'Specific Date', icon: <CalendarDays className="mr-2 h-4 w-4" /> },
        { value: 'month', label: 'Entire Month', icon: <CalendarRange className="mr-2 h-4 w-4" /> },
      ];

      return (
        <div className="flex items-center gap-2 mb-2">
          {modes.map((m) => (
            <Button
              key={m.value}
              type="button"
              variant={mode === m.value ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onModeChange(m.value)}
              disabled={disabled}
              className="flex-1 text-xs sm:text-sm dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 data-[state=active]:dark:bg-primary data-[state=active]:dark:text-primary-foreground"
            >
              {m.icon}
              {m.label}
            </Button>
          ))}
        </div>
      );
    };

    export default DateModeToggle;