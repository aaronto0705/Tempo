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
          <iframe 
            title="Canva Presentation"
            src="https://www.canva.com/design/DAF_PGq_yas/CKpQipIO2cTjwIqwfplQxw/view"
            width="100%" 
            height="600px" 
            frameborder="0" 
            allowfullscreen
          />
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
