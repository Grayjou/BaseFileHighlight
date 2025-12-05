// This file should NOT be highlighted (default color)
// It imports from a local module

import React from 'react';
import { DataFetcher } from './base_file';

export function App() {
  return (
    <div className="app">
      <header>
        <h1>My Application</h1>
      </header>
      <main>
        <DataFetcher />
      </main>
    </div>
  );
}
