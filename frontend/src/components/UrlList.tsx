import React, { useEffect, useState } from 'react';
import { getAllUrls, type UrlItem, UrlStatus } from '../api';

interface Props {
  onViewContent: (id: string) => void;
  refreshTrigger: number;
}

export const UrlList: React.FC<Props> = ({ onViewContent, refreshTrigger }) => {
  const [urls, setUrls] = useState<UrlItem[]>([]);

  const fetchUrls = async () => {
    try {
      const response = await getAllUrls();
      console.log('Fetched URLs:', response.data);
      setUrls(response.data);
    } catch (error) {
      console.error('Failed to fetch URLs', error);
    }
  };

  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  return (
    <div className="url-list">
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
            <th>Last Update</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item) => (
            <tr key={item._id}>
              <td>{item.url}</td>
              <td>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </td>
              <td>{new Date(item.updatedAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => onViewContent(item._id)}
                  disabled={item.status !== UrlStatus.SUCCESS}
                >
                  View Content
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
