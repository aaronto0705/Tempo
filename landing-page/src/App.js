import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Project Name</h1>
        <img src="/tempo_logo.png" alt="Project Logo" />
      </header>

      <main>
        <section id="about">
          <h2>About Us</h2>
          <p>Here you can provide information about your project and team members.</p>
          <ul>
            <li>Lea De Vylder</li>
            <li>Aaron To</li>
            <li>Carina Sanborn</li>
            <li>Aditya Ganesh</li>
          </ul>
        </section>

        <section id="pitch-deck">
          <h2>Pitch Deck</h2>
          <div dangerouslySetInnerHTML={{__html: `
            <div style="position: relative; width: 100%; height: 0; padding-top: 56.2500%;
             padding-bottom: 0; box-shadow: 0 2px 8px 0 rgba(63,69,81,0.16); margin-top: 1.6em; margin-bottom: 0.9em; overflow: hidden;
             border-radius: 8px; will-change: transform;">
              <iframe loading="lazy" style="position: absolute; width: 100%; height: 100%; top: 0; left: 0; border: none; padding: 0;margin: 0;"
                src="https://www.canva.com/design/DAF_PGq_yas/CKpQipIO2cTjwIqwfplQxw/view?embed" allowfullscreen="allowfullscreen" allow="fullscreen">
              </iframe>
            </div>
          `}} />
        </section>

        <section id="elevator-pitch">
          <h2>Elevator Pitch</h2>
          <p>Two sentence elevator pitch goes here.</p>
        </section>
      </main>
    </div>
  );
}

export default App;
