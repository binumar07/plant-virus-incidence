import React, { useState, useCallback, useMemo } from 'react';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsTable } from './icons/ResultsTable';

import type { CalculationResult } from './types';

function App() {
  const [plotNumber, setPlotNumber] = useState('');
  const [stand, setStand] = useState('');
  const [severity, setSeverity] = useState('');
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [errors, setErrors] = useState<{ plotNumber?: string; stand?: string; severity?: string }>({});
  const [sortConfig, setSortConfig] = useState<{ key: keyof CalculationResult; direction: 'ascending' | 'descending' } | null>(null);
  const [editingResultId, setEditingResultId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSetPlotNumber = (value: string) => {
    setPlotNumber(value);
    if (errors.plotNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.plotNumber;
        return newErrors;
      });
    }
  };

  const handleSetStand = (value: string) => {
    setStand(value);
    if (errors.stand) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.stand;
        return newErrors;
      });
    }
  };

  const handleSetSeverity = (value: string) => {
    setSeverity(value);
    if (errors.severity) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.severity;
        return newErrors;
      });
    }
  };

  const clearForm = useCallback(() => {
    setPlotNumber('');
    setStand('');
    setSeverity('');
    setErrors({});
  }, []);

  const handleCalculate = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors: { plotNumber?: string; stand?: string; severity?: string } = {};
    const plotNumVal = parseFloat(plotNumber);
    const standNum = parseFloat(stand);
    const severityNum = parseFloat(severity);

    if (!plotNumber.trim() || isNaN(plotNumVal) || plotNumVal <= 0) {
      validationErrors.plotNumber = "Plot number must be a positive number.";
    }
    if (isNaN(standNum) || standNum <= 0) {
      validationErrors.stand = "Stand must be a positive number.";
    }
    if (isNaN(severityNum) || severityNum < 0 || severityNum > 5) {
      validationErrors.severity = "Severity must be between 0 and 5.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const diseasedPlant = (standNum / 5) * severityNum;
    const incidence = (diseasedPlant / standNum) * 100;

    if (editingResultId !== null) {
      // Update existing result
      setResults(prevResults =>
        prevResults.map(result =>
          result.id === editingResultId
            ? { ...result, plotNumber: plotNumber.trim(), stand: standNum, severity: severityNum, diseasedPlant, incidence }
            : result
        )
      );
      setEditingResultId(null);
    } else {
      // Create new result
      const newResult: CalculationResult = {
        id: Date.now(),
        plotNumber: plotNumber.trim(),
        stand: standNum,
        severity: severityNum,
        diseasedPlant,
        incidence,
      };
      setResults(prevResults => [...prevResults, newResult]);
    }
    
    clearForm();

  }, [plotNumber, stand, severity, editingResultId, clearForm]);
  
  const requestSort = (key: keyof CalculationResult) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleClearHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all calculation history? This action cannot be undone.")) {
      setResults([]);
      setEditingResultId(null);
      clearForm();
    }
  }, [clearForm]);

  const handleEditClick = useCallback((id: number) => {
    const resultToEdit = results.find(result => result.id === id);
    if (resultToEdit) {
      setEditingResultId(id);
      setPlotNumber(String(resultToEdit.plotNumber));
      setStand(String(resultToEdit.stand));
      setSeverity(String(resultToEdit.severity));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [results]);

  const handleCancelEdit = useCallback(() => {
    setEditingResultId(null);
    clearForm();
  }, [clearForm]);

  const handleDeleteResult = useCallback((id: number) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      setResults(prevResults => prevResults.filter(result => result.id !== id));
      setEditingResultId(prevId => {
        if (prevId === id) {
          clearForm();
          return null;
        }
        return prevId;
      });
    }
  }, [clearForm]);

  const sortedAndFilteredResults = useMemo(() => {
    const filteredResults = results.filter(result => {
        const term = searchTerm.toLowerCase();
        return (
            result.plotNumber.toString().toLowerCase().includes(term)
        );
    });

    const sortableItems = [...filteredResults];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortConfig.direction === 'ascending' ? valA - valB : valB - a;
        }
        if (String(valA) < String(valB)) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (String(valA) > String(valB)) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig, searchTerm]);

  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Plant Disease Incidence Calculator
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Input your field data to calculate disease metrics.
          </p>
        </header>

        <main className="space-y-8">
          <CalculatorForm
            plotNumber={plotNumber}
            setPlotNumber={handleSetPlotNumber}
            stand={stand}
            setStand={handleSetStand}
            severity={severity}
            setSeverity={handleSetSeverity}
            onCalculate={handleCalculate}
            errors={errors}
            isEditing={editingResultId !== null}
            onCancelEdit={handleCancelEdit}
          />
          <ResultsTable 
            latestResult={latestResult}
            results={sortedAndFilteredResults}
            requestSort={requestSort}
            sortConfig={sortConfig}
            onClearHistory={handleClearHistory}
            onEdit={handleEditClick}
            onDelete={handleDeleteResult}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            hasHistory={results.length > 0}
           />
        </main>
        
        <footer className="text-center mt-16 text-sm text-slate-500 dark:text-slate-400">
            <p>&copy; {new Date().getFullYear()} Plant Disease Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
