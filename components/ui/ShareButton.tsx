'use client';

import { useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareButtonProps {
  elementId: string;
  title?: string;
}

export default function ShareButton({ elementId, title = 'Climate Data Infographic' }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);

  const captureAndShare = async () => {
    setLoading(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        alert('Element not found');
        setLoading(false);
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Failed to generate image');
          setLoading(false);
          return;
        }

        if (navigator.share) {
          try {
            const file = new File([blob], `${title}.png`, { type: 'image/png' });
            await navigator.share({
              files: [file],
              title,
              text: 'Climate data visualization - SDG 13: Climate Action',
            });
          } catch (err) {
            console.error('Error sharing:', err);
            downloadImage(blob);
          }
        } else {
          downloadImage(blob);
        }
        setLoading(false);
      });
    } catch (error) {
      console.error('Error capturing element:', error);
      alert('Failed to capture infographic');
      setLoading(false);
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={captureAndShare}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 px-5 py-2 text-sm font-medium text-slate-100 backdrop-blur-lg transition-all hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300/60 ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
      aria-label="Share infographic"
    >
      {loading ? (
        <>
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin text-sky-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg className="h-4 w-4 text-sky-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15.5 2.75a.75.75 0 00-.75-.75h-3a.75.75 0 000 1.5h1.19l-3.22 3.22a.75.75 0 101.06 1.06l3.22-3.22V6a.75.75 0 001.5 0V2.75z" />
            <path d="M3 7.75A1.75 1.75 0 014.75 6h3a.75.75 0 010 1.5h-3a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-3a.75.75 0 011.5 0v3c0 .966-.784 1.75-1.75 1.75H4.75A1.75 1.75 0 013 15.75v-8z" />
          </svg>
          Share
        </>
      )}
    </button>
  );
}
