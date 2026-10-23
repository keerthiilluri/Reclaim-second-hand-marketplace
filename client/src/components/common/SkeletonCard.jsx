import React from 'react';

export default function SkeletonCard() {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3' }} />
      <div style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ width: '40%', height: '14px' }} />
          <div className="skeleton" style={{ width: '25%', height: '14px' }} />
        </div>
        <div className="skeleton" style={{ width: '90%', height: '20px' }} />
        <div className="skeleton" style={{ width: '60%', height: '16px' }} />
        <div style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '35%', height: '24px' }} />
          <div className="skeleton" style={{ width: '25%', height: '20px' }} />
        </div>
      </div>
    </div>
  );
}
