import React from 'react';
import type { CalculationResult } from '../types';

interface SortIndicatorProps {
  direction: 'ascending' | 'descending' | null;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({ direction }) => {
  if (!direction) return null;
  return (
    <span className="ml-1 text-slate-500 dark:text-slate-400">
      {direction === 'ascending' ? '▲' : '▼'}
    </span>
  );
};


interface ResultsTableProps {
  latestResult: CalculationResult | null;
  results: CalculationResult[];
  requestSort: (key: keyof CalculationResult) => void;
  sortConfig: { key: keyof CalculationResult; direction: 'ascending' | 'descending' } | null;
  onClearHistory: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  hasHistory: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ latestResult, results, requestSort, sortConfig, onClearHistory, onEdit, onDelete, searchTerm, onSearchChange, hasHistory }) => {
  const getSortDirection = (key: keyof CalculationResult) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction;
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'Plot Number',
      'Stand',
      'Severity',
      'Diseased Plant',
      'Incidence (%)'
    ];
    
    const csvRows = results.map(row => 
      [
        `"${String(row.plotNumber).replace(/"/g, '""')}"`, // Handle quotes in plot number
        row.stand,
        row.severity,
        row.diseasedPlant.toFixed(2),
        row.incidence.toFixed(2)
      ].join(',')
    );

    const csvString = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'plant_disease_calculation_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mt-8">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Latest Result</h2>
        {!latestResult ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">Perform a calculation to see the result here.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Plot Number</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50 truncate">{latestResult.plotNumber}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Stand</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{latestResult.stand}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Severity</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{latestResult.severity}</p>
              </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Diseased Plant</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">{latestResult.diseasedPlant.toFixed(2)}</p>
              </div>
               <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg col-span-2 sm:col-span-4">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Incidence (%)</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{latestResult.incidence.toFixed(2)}%</p>
              </div>
          </div>
        )}
      </div>

      {hasHistory && (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Calculation History</h2>
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                    type="text"
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-50 text-sm"
                    aria-label="Search calculation history"
                />
                <button
                    onClick={handleExportCSV}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 text-sm"
                >
                    Export CSV
                </button>
                <button
                    onClick={onClearHistory}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 text-sm"
                >
                    Clear All
                </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 uppercase">
                <tr>
                  {([
                    { key: 'plotNumber', label: 'Plot Number' },
                    { key: 'stand', label: 'Stand' },
                    { key: 'severity', label: 'Severity' },
                    { key: 'diseasedPlant', label: 'Diseased Plant' },
                    { key: 'incidence', label: 'Incidence (%)' },
                  ] as { key: keyof CalculationResult; label: string }[]).map(({ key, label }) => (
                     <th key={key} scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort(key)}>
                        {label}
                        <SortIndicator direction={getSortDirection(key)} />
                    </th>
                  ))}
                   <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((item) => (
                    <tr key={item.id} className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.plotNumber}</td>
                      <td className="px-6 py-4">{item.stand}</td>
                      <td className="px-6 py-4">{item.severity}</td>
                      <td className="px-6 py-4">{item.diseasedPlant.toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400">{item.incidence.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => onEdit(item.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">Edit</button>
                          <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                            No matching results found.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
