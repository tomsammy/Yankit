import React from 'react';

    export const OrDivider = ({ text = "Or connect with" }) => (
      <div className="my-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300/70 dark:border-slate-600/70" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background/80 dark:bg-slate-800/50 text-muted-foreground dark:text-slate-400 rounded-md backdrop-blur-sm">
              {text}
            </span>
          </div>
        </div>
      </div>
    );
    OrDivider.displayName = 'OrDivider';