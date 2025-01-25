"use client"
import { useState } from 'react';

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Resume
          </label>
          <textarea
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </div>

      {analysis && (
        <div className="mt-8 space-y-6 bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-center">
              Overall Score: {analysis.overallScore}%
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold">Skills Match</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-green-600">Matched Skills</h4>
                  <ul className="list-disc pl-5">
                    {analysis.skills.matched.map((skill: string) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-red-600">Missing Skills</h4>
                  <ul className="list-disc pl-5">
                    {analysis.skills.missing.map((skill: string) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold">Recommendations</h3>
              <ul className="list-disc pl-5">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 