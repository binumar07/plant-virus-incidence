import React from 'react';

interface CalculatorFormProps {
  plotNumber: string;
  setPlotNumber: (value: string) => void;
  stand: string;
  setStand: (value: string) => void;
  severity: string;
  setSeverity: (value: string) => void;
  onCalculate: (e: React.FormEvent) => void;
  errors: { plotNumber?: string; stand?: string; severity?: string };
  isEditing: boolean;
  onCancelEdit: () => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  plotNumber,
  setPlotNumber,
  stand,
  setStand,
  severity,
  setSeverity,
  onCalculate,
  errors,
  isEditing,
  onCancelEdit,
}) => {
  const plotNumberError = errors.plotNumber;
  const standError = errors.stand;
  const severityError = errors.severity;
  
  const inputBaseClasses = "w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-slate-900 dark:text-slate-50";
  const inputNormalClasses = "border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500";
  const inputErrorClasses = "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={onCalculate} className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">{isEditing ? 'Edit Calculation' : 'New Calculation'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label htmlFor="plotNumber" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Plot Number
          </label>
          <input
            type="number"
            id="plotNumber"
            value={plotNumber}
            onChange={(e) => setPlotNumber(e.target.value)}
            placeholder="e.g., 101"
            className={`${inputBaseClasses} ${plotNumberError ? inputErrorClasses : inputNormalClasses}`}
            required
            step="1"
            min="1"
            aria-invalid={!!plotNumberError}
            aria-describedby={plotNumberError ? "plot-error" : undefined}
          />
          {plotNumberError && <p id="plot-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{plotNumberError}</p>}
        </div>
        <div>
          <label htmlFor="stand" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Stand
          </label>
          <input
            type="number"
            id="stand"
            value={stand}
            onChange={(e) => setStand(e.target.value)}
            placeholder="e.g., 100"
            className={`${inputBaseClasses} ${standError ? inputErrorClasses : inputNormalClasses} no-spinner`}
            required
            step="any"
            aria-invalid={!!standError}
            aria-describedby={standError ? "stand-error" : undefined}
          />
          {standError && <p id="stand-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{standError}</p>}
        </div>
        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Severity
          </label>
          <input
            type="number"
            id="severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            placeholder="0-5"
            className={`${inputBaseClasses} ${severityError ? inputErrorClasses : inputNormalClasses} no-spinner`}
            required
            step="any"
            min="0"
            max="5"
            aria-invalid={!!severityError}
            aria-describedby={severityError ? "severity-error" : undefined}
          />
          {severityError && <p id="severity-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{severityError}</p>}
        </div>
        <div className="flex flex-col gap-2">
            <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
            {isEditing ? 'Update Result' : 'Calculate'}
            </button>
            {isEditing && (
            <button
                type="button"
                onClick={onCancelEdit}
                className="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold py-2 px-4 rounded-md shadow-md hover:bg-slate-300 dark:hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
            >
                Cancel
            </button>
            )}
        </div>
      </div>
    </form>
  );
};