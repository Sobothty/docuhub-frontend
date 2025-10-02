'use client';

import { useGetPapersWithPaginationQuery } from '@/feature/apiSlice/paperApi';
import { useEffect, useState } from 'react';

export default function ApiTest() {
  const { data, isLoading, error, isError, isSuccess } = useGetPapersWithPaginationQuery({ page: '0', size: '5' });
  const [browserTest, setBrowserTest] = useState<any>(null);
  const [browserError, setBrowserError] = useState<string | null>(null);

  console.log('🔍 API Test - Full State:', {
    data,
    isLoading,
    error,
    isError,
    isSuccess
  });

  // Test direct browser fetch
  useEffect(() => {
    const testBrowserFetch = async () => {
      try {
        console.log('🌐 Testing direct browser fetch...');
        const response = await fetch('https://api.docuhub.me/api/v1/papers/published?page=0&size=3', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Browser fetch successful:', data);
        setBrowserTest(data);
      } catch (err: any) {
        console.error('❌ Browser fetch failed:', err);
        setBrowserError(err.message);
      }
    };

    testBrowserFetch();
  }, []);

  return (
    <div style={{ padding: '20px', border: '2px solid blue', margin: '20px', backgroundColor: '#f0f8ff' }} suppressHydrationWarning>
      <h2>🔬 API Debug Component</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>RTK Query Status:</h3>
          <p><strong>Loading:</strong> <span style={{color: isLoading ? 'orange' : 'green'}}>{isLoading ? 'Yes' : 'No'}</span></p>
          <p><strong>Success:</strong> <span style={{color: isSuccess ? 'green' : 'red'}}>{isSuccess ? 'Yes' : 'No'}</span></p>
          <p><strong>Error:</strong> <span style={{color: isError ? 'red' : 'green'}}>{isError ? 'Yes' : 'No'}</span></p>
          <p><strong>Data:</strong> {data ? `${data.papers?.content?.length || 0} papers` : 'None'}</p>
          
          {error && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              <strong>Error Details:</strong>
              <pre style={{ fontSize: '12px', background: '#ffe6e6', padding: '10px' }}>
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div>
          <h3>Direct Browser Fetch:</h3>
          <p><strong>Status:</strong> <span style={{color: browserTest ? 'green' : browserError ? 'red' : 'orange'}}>
            {browserTest ? 'Success' : browserError ? 'Failed' : 'Testing...'}
          </span></p>
          <p><strong>Data:</strong> {browserTest ? `${browserTest.papers?.content?.length || 0} papers` : 'None'}</p>
          
          {browserError && (
            <div style={{ color: 'red', fontSize: '12px' }}>
              <strong>Error:</strong> {browserError}
            </div>
          )}
        </div>
      </div>
      
      {(data?.papers?.content || browserTest?.papers?.content) && (
        <div style={{ marginTop: '20px' }}>
          <h3>📋 Papers Found:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {(data?.papers?.content || browserTest?.papers?.content)?.slice(0, 3).map((paper: any) => (
              <div key={paper.uuid} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                <strong>{paper.title}</strong><br/>
                <small>Status: {paper.status} | Author: {paper.authorUuid.slice(0, 8)}...</small>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }} suppressHydrationWarning>
        <strong>Environment Check:</strong><br/>
        Base URL: {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}<br/>
        Node ENV: {process.env.NODE_ENV}<br/>
        Timestamp: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
