//src/pages/NotFound.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-4 text-slate-200">404</h1>
          <p className="text-xl text-slate-400 mb-8">This page doesn't exist</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-medium rounded transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </Layout>
  );
};
