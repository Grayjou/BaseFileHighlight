// This file should be HIGHLIGHTED (mint green by default)
// It only imports external packages

import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

export function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/data')
      .then(response => setData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Data Fetcher</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
