import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { useUser } from '@clerk/clerk-react';
import { Check, CheckCircle2, Lock, ExternalLink, RefreshCw, Map, Zap, Target, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export const Roadmap = () => {
  const location = useLocation();
  const { user } = useUser();
  const isPremium = user?.unsafeMetadata?.isPremium || user?.publicMetadata?.isPremium || false;
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error('Failed to load payment gateway. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_SXv1gd5JfNU9an',
      amount: 499 * 100, // Amount in paise
      currency: 'INR',
      name: 'Skill Gap Pro',
      description: 'Unlock personalized AI Roadmaps',
      handler: async function (response) {
        // Frontend-only upgrade
        try {
          await user.update({ unsafeMetadata: { isPremium: true } });
          toast.success('🎉 Welcome to Pro! Roadmap Unlocked!', { duration: 4000 });
          // Note: The UI will automatically re-render because user instance updates.
        } catch (err) {
          toast.error('Payment verified but failed to update profile. Please contact support.');
        } 
      },
      prefill: {
        name: user?.firstName || 'Guest',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
      theme: { color: '#4F46E5' },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
      toast.error('Payment failed: ' + response.error.description);
    });
    rzp.open();
    setIsProcessing(false);
  };

  // For demo, we are skipping the strict gate if they reach here from Analysis.
  if (!isPremium && !location.state?.roadmapData) {
    return (
      <Layout>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', background: 'var(--sidebar-active-bg)', color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
               <Zap size={32} />
            </div>
            <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unlock Your Professional Trajectory</h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>You have discovered a skills gap, now bridge it. Upgrade to Pro to access our AI-generated learning syllabus specifically curtailed to your resume weaknesses.</p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
            
            {/* Features Breakdown */}
            <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
               <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Why upgrade?</h3>
               
               <div className="flex items-start gap-4">
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Hyper-Personalized Curriculum</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>A week-by-week timeline focusing ONLY on your exact missing skills. No generic bootcamps, just what you need to land the job.</p>
                  </div>
               </div>

               <div className="flex items-start gap-4" style={{ marginTop: '0.5rem' }}>
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Curated Resource Vault</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Our AI scrapes the internet to compile the highest-rated tutorials, articles, and documentation so you don't have to search.</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4" style={{ marginTop: '0.5rem' }}>
                  <div style={{ marginTop: '0.25rem', background: '#D1FAE5', color: '#059669', padding: '0.25rem', borderRadius: '50%' }}><Check size={16} strokeWidth={3} /></div>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>Adaptive Pacing</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Check off milestones and click recalibrate if you fall behind. The roadmap adjusts its deadlines dynamically alongside your schedule.</p>
                  </div>
               </div>
            </div>

            {/* Pricing Card */}
            <div style={{ flex: '1 1 350px', background: 'var(--bg-color)', padding: '0.5rem', borderRadius: '28px', border: '1px solid var(--border-light)' }}>
               <div style={{ background: 'linear-gradient(180deg, white 0%, #FAFAFA 100%)', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid var(--border-color)', boxShadow: '0 12px 24px -10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                 <div style={{ fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--primary-color)', marginBottom: '1rem', textTransform: 'uppercase' }}>Lifetime Access</div>
                 <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.5rem' }}>
                   ₹499<span style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-tertiary)' }}>.00</span>
                 </div>
                 <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>One time payment. Infinite roadmaps.</p>

                 <button 
                   onClick={handleUpgrade}
                   disabled={isProcessing}
                   className="btn flex items-center justify-center gap-2" 
                   style={{ 
                     background: 'var(--primary-color)', 
                     color: 'white', 
                     width: '100%', 
                     padding: '1rem', 
                     fontSize: '1rem', 
                     fontWeight: 600, 
                     borderRadius: '12px',
                     boxShadow: '0 4px 14px rgba(79, 70, 229, 0.39)',
                     transition: 'all 0.2s',
                     opacity: isProcessing ? 0.7 : 1
                   }}
                 >
                   {isProcessing ? 'Connecting...' : 'Upgrade Now'} <ArrowRight size={18} />
                 </button>
                 
                 <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Lock size={12} /> Secure Checkout powered by Razorpay
                 </div>
               </div>
            </div>

          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        
        <div className="flex justify-between items-end" style={{ marginBottom: '4rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>My Paths › <span style={{color: 'var(--primary-color)', fontWeight: 600}}>AI Mastery</span></div>
            <h1 style={{ fontSize: '2.5rem', margin: '0', letterSpacing: '-0.02em' }}>AI Mastery Roadmap</h1>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1rem' }}>Your curated journey to Deep Learning expertise.</p>
          </div>
          <div className="flex items-center gap-4">
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Level 3 of 8</div>
            <div className="flex gap-1">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} style={{ width: '16px', height: '6px', borderRadius: '3px', background: i <= 3 ? 'var(--primary-color)' : 'var(--border-light)' }}></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: '4rem' }}>
          {/* Vertical Track */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '2rem', width: '2px', background: 'var(--border-light)' }}></div>
          <div style={{ position: 'absolute', top: 0, height: '45%', left: '2rem', width: '2px', background: 'var(--primary-color)' }}></div>

          {/* Node 1: Completed */}
          <div style={{ position: 'relative', marginBottom: '4rem' }}>
            <div style={{ position: 'absolute', left: '-3.7rem', top: '0', background: 'var(--primary-color)', color: 'white', width: '3.5rem', height: '3.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: 'var(--shadow-md)' }}>
              <Check size={24} strokeWidth={3} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Week 1</div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Python for Data Science</h3>
                <p style={{ maxWidth: '600px' }}>Fundamental data structures, NumPy arrays, and Pandas dataframes for pre-processing machine learning datasets.</p>
              </div>
              <span className="pill" style={{ background: '#EEF2FF', color: 'var(--primary-color)' }}>COMPLETED</span>
            </div>

            <div className="flex gap-8" style={{ marginTop: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>RESOURCE VAULT</div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}><CheckCircle2 size={16} /> Python Essentials (YT)</div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', fontWeight: 500 }}><CheckCircle2 size={16} /> Pandas Documentation</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>MILESTONES</div>
                <div className="flex flex-col gap-3 text-secondary" style={{ fontSize: '0.875rem' }}>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--primary-color)' }}>✓</span> Matrix Math with NumPy</div>
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}><span style={{ color: 'var(--primary-color)' }}>✓</span> Exploratory Data Analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Node 2: Active */}
          <div className="card" style={{ position: 'relative', marginBottom: '4rem', padding: '2rem', borderLeft: '4px solid var(--primary-color)', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}>
            <div style={{ position: 'absolute', left: '-3.8rem', top: '1.5rem', background: 'var(--primary-color)', color: 'white', width: '3.5rem', height: '3.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: 'var(--shadow-md)', fontWeight: 800, fontSize: '1.125rem' }}>
              W3
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>Week 3</div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Foundations of Neural Networks</h3>
                <p style={{ maxWidth: '600px' }}>Understanding the "brain" of AI. We dive into the architecture of neurons, weight optimization, and the core mathematical principles of learning.</p>
              </div>
              <span className="pill" style={{ background: '#F3E8FF', color: '#9333EA' }}>ACTIVE FOCUS</span>
            </div>

            <div className="flex gap-6 mt-6" style={{ marginTop: '2rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1rem' }}>CURATED RESOURCES</div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid var(--border-light)' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>▶</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Backpropagation Explained</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>3Blue1Brown Series • 18 min</div>
                      </div>
                    </div>
                    <ExternalLink size={16} color="var(--primary-color)" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid var(--border-light)' }}>
                    <div className="flex items-center gap-3">
                      <div style={{ background: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>📄</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Perceptrons & Logic Gates</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Interactive Documentation</div>
                      </div>
                    </div>
                    <ExternalLink size={16} color="var(--primary-color)" />
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, background: '#FAFAFA', padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>PROGRESS CHECKLIST</div>
                <div className="flex flex-col gap-3">
                  {['Understanding the Sigmoid Function', 'Implementing Backpropagation', 'Multi-Layer Perceptrons (MLP)', 'Loss Functions & Gradient Descent'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: i === 0 ? 'var(--primary-color)' : 'white', border: i === 0 ? 'none' : '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {i === 0 && <Check size={14} color="white" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '0.875rem', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Node 3: Locked */}
          <div style={{ position: 'relative', opacity: 0.5 }}>
            <div style={{ position: 'absolute', left: '-3.5rem', top: '0', background: '#F1F5F9', color: 'var(--text-tertiary)', width: '3rem', height: '3rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, border: '1px solid var(--border-color)' }}>
              <Lock size={20} />
            </div>
            
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Week 4</div>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0' }}>Convolutional Neural Networks (CNN)</h3>
              <p style={{ maxWidth: '600px' }}>Unlocking the power of Computer Vision. Learn how AI sees images through kernels, pooling, and feature extraction.</p>
              
              <div className="flex gap-4" style={{ marginTop: '1.5rem' }}>
                <div style={{ height: '8px', width: '100px', background: 'var(--border-light)', borderRadius: '4px' }}></div>
                <div style={{ height: '8px', width: '100px', background: 'var(--border-light)', borderRadius: '4px' }}></div>
                <div style={{ height: '8px', width: '100px', background: 'var(--border-light)', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Global Bottom Element */}
        <div style={{ background: '#FAFAFA', borderRadius: '24px', padding: '3rem', marginTop: '6rem', textAlign: 'center', border: '1px solid var(--border-light)' }}>
          <Sparkles color="var(--primary-color)" size={32} style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', display: 'inline-block', marginBottom: '0.5rem' }}>Feeling overwhelmed?</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto 2rem auto', fontSize: '1rem' }}>Our AI can adjust your pace based on your recent activity and quiz scores. Recalibrate to find your optimal learning flow.</p>
          <button className="btn btn-primary flex gap-2 items-center" style={{ margin: '0 auto', fontSize: '1rem', padding: '0.75rem 1.5rem' }}>
            <RefreshCw size={18} /> Recalibrate My Journey
          </button>
        </div>

      </div>
    </Layout>
  );
};

const Sparkles = ({size, color, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path d="M12 22C12 22 12 14 20 12C12 10 12 2 12 2C12 2 12 10 4 12C12 14 12 22 12 22Z" fill={color}/>
    <path d="M5 6C5 6 5 4 8 3C5 2 5 0 5 0C5 0 5 2 2 3C5 4 5 6 5 6Z" fill={color}/>
    <path d="M19 8C19 8 19 6 22 5C19 4 19 2 19 2C19 2 19 4 16 5C19 6 19 8 19 8Z" fill={color}/>
  </svg>
)
