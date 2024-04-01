import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('whoWeAre');

  return (
    <div className="App">
      <header className="text-white p-4 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#add8e6' }}>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center">
            <span className="text-black mr-2">Tempo</span>
            <button
              className={`btn btn-link text-black ${activeTab === 'whoWeAre' ? 'active' : ''}`}
              onClick={() => setActiveTab('whoWeAre')}
            >
              Who We Are
            </button>
            <button
              className={`btn btn-link text-black ${activeTab === 'aboutTempo' ? 'active' : ''}`}
              onClick={() => setActiveTab('aboutTempo')}
            >
              About Tempo
            </button>
          </div>
        </div>
        <img src="/tempo_logo.png" alt="Project Logo" style={{ width: '60px', height: 'auto' }} />
      </header>

      <main className="container mt-4">
        {activeTab === 'whoWeAre' && (
          <section id="who-we-are">
            <h1 className="text-center" style={{ color: '#39807F', marginBottom: '20px' }}>Tempo</h1>
            <h2 className="text-center" style={{ marginBottom: '10px' }}>Who We Are</h2>
            <div className="d-flex justify-content-center">
              <div className="circle bg-primary text-white d-flex align-items-center justify-content-center">
                <span>LDV</span>
              </div>
              <div className="circle bg-primary text-white d-flex align-items-center justify-content-center">
                <span>CS</span>
              </div>
              <div className="circle bg-primary text-white d-flex align-items-center justify-content-center">
                <span>AT</span>
              </div>
              <div className="circle bg-primary text-white d-flex align-items-center justify-content-center">
                <span>AG</span>
              </div>
            </div>
            <div className="text-center mt-3 border p-3" style={{ fontSize: '1.2em' }}>
              <p style={{ fontSize: '1.5em' }}><strong>Lea De Vylder</strong> (Founder)</p>
              <p style={{ fontSize: '1.5em' }}><strong>Carina Sanborn</strong></p>
              <p style={{ fontSize: '1.5em' }}><strong>Aaron To</strong></p>
              <p style={{ fontSize: '1.5em' }}><strong>Aditya Ganesh</strong></p>
            </div>
          </section>
        )}

        {activeTab === 'aboutTempo' && (
          <section id="about-tempo">
            <h2 className="text-center">About Tempo</h2>
            <div className="container mt-4">
              <div className="card p-4">
                <p className="card-text">
                At Tempo, we aim to enhance runners' journeys by providing them with the perfect music to elevate their performance and enjoyment. Try Tempo today to never miss a beat while running!
                </p>
              </div>
              <div className="embed-responsive embed-responsive-16by9 mt-4">
                <iframe 
                  className="embed-responsive-item"
                  title="Canva Presentation"
                  src="https://www.canva.com/design/DAF_PGq_yas/CKpQipIO2cTjwIqwfplQxw/view?embed" 
                  allowfullscreen="allowfullscreen" 
                  allow="fullscreen"
                />
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
