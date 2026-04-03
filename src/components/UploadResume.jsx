import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './Layout';
import { Upload, Sparkles, FileText, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/clerk-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const UploadResume = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!isLoaded) return toast.error('Signing you in… please try again in a moment.');
    if (!isSignedIn) return toast.error('You must be logged in to analyze your resume.');
    if (!file) return toast.error("Please upload your resume.");
    if (!jobDescription.trim()) return toast.error("Please provide a target job description.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      // Do not set Content-Type manually with FormData — axios must add the multipart boundary.
      const response = await axios.post(`${API_BASE}/api/analyze`, formData);
      if (response.data.success) {
         toast.success("Analysis complete!");
         navigate('/analysis', { state: { analysisData: response.data.data, jobDescription } });
      } else {
         toast.error(response.data.message || 'Analysis could not be completed.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Upload your professional story.</h1>
          <p style={{ fontSize: '1.125rem' }}>Let our AI curator deconstruct your experience and reveal<br/>the path to your next career milestone.</p>
        </div>
        
        <div className="flex gap-8">
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* The Dropzone */}
            <div 
              style={{ 
                padding: '6rem 2rem', 
                border: isHovered ? '2px dashed var(--primary-color)' : '2px dashed #CBD5E1',
                backgroundColor: isHovered ? 'var(--sidebar-active-bg)' : 'var(--surface-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '24px',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} accept=".pdf,application/pdf" />
              
              {!file ? (
                <>
                  <div style={{ background: '#F1F5F9', padding: '1.5rem', borderRadius: '16px', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                    <Upload size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Drag and drop your resume here</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>Supported format: PDF (Max 5MB)</p>
                  
                  <button type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="btn btn-primary" style={{ minWidth: '200px', padding: '1rem', fontSize: '1rem', borderRadius: '12px' }}>
                    <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>+</span> Select Files
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <div style={{ background: 'var(--sidebar-active-bg)', padding: '1.5rem', borderRadius: '16px', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
                    <FileText size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{file.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="btn" style={{ background: '#FEE2E2', color: '#EF4444', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                    Remove File
                  </button>
                </div>
              )}
            </div>

            {/* Target Job Settings & Submission */}
            <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
               <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Target Job Profile</h3>
               <textarea 
                 placeholder="e.g. Senior Data Analyst focusing on Python and SQL..."
                 value={jobDescription}
                 onChange={e => setJobDescription(e.target.value)}
                 style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-light)', minHeight: '120px', resize: 'vertical', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}
               />
               <button 
                 type="button"
                 onClick={handleAnalyze} 
                 disabled={isLoading || !isLoaded || !isSignedIn || !file || !jobDescription.trim()}
                 className="btn btn-primary flex justify-center items-center gap-2" 
                 style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', borderRadius: '12px', opacity: (isLoading || !isLoaded || !isSignedIn || !file || !jobDescription.trim()) ? 0.7 : 1, transition: 'all 0.2s ease' }}
               >
                 {isLoading && <span className="animate-spin" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>}
                 {isLoading ? 'Generating AI Insights...' : 'Analyze Resume'}
               </button>
            </div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="card" style={{ background: '#FAFAFA', border: 'none', padding: '1.5rem', borderRadius: '24px' }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                  <Sparkles size={16} color="var(--primary-color)" /> AI INSIGHTS
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Last analyzed resume:</div>
                <div style={{ fontWeight: 600, color: 'var(--primary-color)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Product_Designer_2024.pdf</div>
                
                <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', marginBottom: '0.5rem' }}>
                  <div style={{ width: '55%', height: '100%', background: 'var(--primary-color)', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>Analysis completion: 55%</div>
             </div>

             <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '240px', background: '#E2E8F0' }}>
               <div style={{ position: 'absolute', inset: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)' }}>
                 <div style={{ color: 'white', fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.25rem' }}>Curator's Tip</div>
                 <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.875rem', lineHeight: 1.4 }}>Keywords matter. We scan for over 5,000+ industry-specific competencies.</div>
               </div>
             </div>
          </div>
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: '4rem', padding: '0 1rem' }}>
           <div className="flex gap-8">
             <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)'}}>
               <span style={{ color: 'var(--primary-color)' }}>✓</span> ATS Optimized
             </div>
             <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)'}}>
               <span style={{ color: 'var(--primary-color)' }}>🔒</span> Private & Encrypted
             </div>
           </div>
           
           <div className="flex items-center" style={{ background: '#EEF2FF', padding: '0.25rem 0.5rem', borderRadius: '24px' }}>
             <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-color)', padding: '0 0.5rem' }}>12K+</span>
           </div>
        </div>

      </div>
    </Layout>
  );
};
