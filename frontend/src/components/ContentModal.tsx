import React, { useEffect, useState } from 'react';
import { getUrlContent } from '../api';

interface Props {
  urlId: string | null;
  onClose: () => void;
}

export const ContentModal: React.FC<Props> = ({ urlId, onClose }) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlId) {
      setLoading(true);
      getUrlContent(urlId)
        .then((res) => setContent(res.data.content || 'No content'))
        .catch((err) => {
          console.error(err);
          setContent('Failed to load content');
        })
        .finally(() => setLoading(false));
    } else {
      setContent(null);
    }
  }, [urlId]);

  if (!urlId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>URL Content</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <pre className="content-preview">{content}</pre>
        )}
      </div>
    </div>
  );
};
