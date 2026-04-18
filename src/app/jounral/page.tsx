'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_JOURNAL_QUESTIONS } from '@/features/journal';
import type { JournalEntryWithParsedQuestions } from '@/features/journal';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntryWithParsedQuestions[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // TODO: Get userId from auth context/session
  // For now, using a placeholder
  useEffect(() => {
    // Replace this with actual auth context
    const tempUserId = localStorage.getItem('userId') || 'user-123';
    setUserId(tempUserId);
    fetchEntries(tempUserId);
  }, []);

  const fetchEntries = async (uid: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal/entries', {
        headers: {
          'x-user-id': uid,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }

      const data = await response.json();
      setEntries(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !userId) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/journal/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to create entry');
      }

      const data = await response.json();
      setEntries([data.data, ...entries]);
      setContent('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/journal/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Journal</h1>
          <p className="text-gray-600">Reflect, write, and grow</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* New Entry Form */}
        <form onSubmit={handleCreateEntry} className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">New Entry</h2>

          {/* Journal Questions */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm font-semibold text-gray-700 mb-2">Todays Questions</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {DEFAULT_JOURNAL_QUESTIONS.map((question, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-blue-500 mr-2">{idx + 1}.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={loading}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
        </form>

        {/* Entries List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Past Entries ({entries.length})
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No entries yet. Start by writing your first entry!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
