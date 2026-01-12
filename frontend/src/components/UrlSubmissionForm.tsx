import React, { useState } from 'react';
import { submitUrls } from '../api';

interface Props {
  onSuccess: () => void;
}

export const UrlSubmissionForm: React.FC<Props> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    if (urls.includes(trimmedInput)) {
      alert('URL already exists in the list');
      return;
    }

    setUrls((prev) => [...prev, trimmedInput]);
    setInput('');
  };

  const handleRemove = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (urls.length === 0) return;

    setLoading(true);
    try {
      await submitUrls(urls);
      setUrls([]);
      setInput('');
      onSuccess();
    } catch (error) {
      console.error('Failed to submit URLs', error);
      alert('Failed to submit URLs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submission-form">
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd(e);
            }
          }}
        />
        <button type="button" onClick={handleAdd}>
          +
        </button>
      </div>

      {urls.length > 0 && (
        <div className="url-preview-list">
          {urls.map((url, index) => (
            <div key={index} className="url-preview-item">
              <span>{url}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemove(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading || urls.length === 0}>
        {loading ? 'Submitting...' : 'Submit All'}
      </button>
    </div>
  );
};
