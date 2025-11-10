
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface GeminiQueryProps {
  query: string;
  setQuery: (value: string) => void;
  geminiResponse: string;
  isLoading: boolean;
  onAskGemini: (e: React.FormEvent) => void;
}

export const GeminiQuery: React.FC<GeminiQueryProps> = ({
  query,
  setQuery,
  geminiResponse,
  isLoading,
  onAskGemini,
}) => {
  return (
    <div className="mt-8">
      <div className="relative p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="absolute -top-3 -left-3 bg-indigo-500 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-lg flex items-center gap-1">
          <SparklesIcon className="w-4 h-4" />
          Thinking Mode
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analyze Your Data</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Ask a complex question about your data or plant pathology in general. Gemini will use its advanced reasoning to provide an insightful analysis.
        </p>
        <form onSubmit={onAskGemini}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Based on the results, is there a correlation between stand density and disease incidence? What could be the potential causes?'"
            className="w-full h-28 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-50 resize-y"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query}
            className="mt-4 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
               'Ask Gemini'
            )}
          </button>
        </form>
      </div>

      {(isLoading || geminiResponse) && (
        <div className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Gemini's Analysis</h3>
          {isLoading && !geminiResponse ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                  <svg className="animate-spin mx-auto h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">Thinking...</p>
              </div>
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                {geminiResponse}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
