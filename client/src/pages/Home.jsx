import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Marketing home page for Verzio. Inspired by the Brainvine landing page, this
 * page highlights key features such as Wolleys (AI co‑workers), the Workflow
 * Builder, Style Tones, Feeds and Teams. It includes a hero section and
 * call‑to‑action buttons for sign‑up and exploring the app. Styling uses
 * Tailwind for simplicity.
 */
function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Stop met losse AI‑tools die je tijd verspillen
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Gebruik Verzio – jouw complete AI‑ecosysteem dat wél werkt. Onze content tools en
            intelligente agents automatiseren je werk, denken strategisch mee en creëren
            content die écht converteert. Van tekst tot beeld en geluid – alles in één. Maximaal
            resultaat, minimale moeite.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <Link
              to="/signup"
              className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-md shadow hover:bg-gray-100"
            >
              Gratis uitproberen
            </Link>
            <Link
              to="/login"
              className="bg-indigo-700 text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-indigo-800"
            >
              Inloggen
            </Link>
          </div>
        </div>
      </header>
      {/* Feature sections */}
      <main className="flex-1 bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-16">
          {/* Wolleys */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Maak kennis met Wolleys – jouw AI co‑workers</h2>
              <p className="text-gray-700 mb-4">
                Geen kant‑en‑klare tool beschikbaar? Maak een Wolley – een AI co‑worker die je
                aanpast aan je specifieke wensen en de unieke cultuur van je bedrijf. Geef
                instructies en bestanden en je Wolley doet de rest.
              </p>
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Aan de slag met Wolleys →
              </Link>
            </div>
            <div className="flex-1">
              {/* Placeholder illustration */}
              <div className="bg-white rounded-lg shadow p-8 h-64 flex items-center justify-center text-center">
                <span className="text-gray-400">Illustratie van Wolleys</span>
              </div>
            </div>
          </section>
          {/* Workflow Builder */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="order-2 md:order-1 flex-1">
              {/* Placeholder illustration */}
              <div className="bg-white rounded-lg shadow p-8 h-64 flex items-center justify-center text-center">
                <span className="text-gray-400">Illustratie van Workflow Builder</span>
              </div>
            </div>
            <div className="order-1 md:order-2 flex-1">
              <h2 className="text-2xl font-bold mb-2">Bouw je eigen Agent Workflows</h2>
              <p className="text-gray-700 mb-4">
                Koppel AI‑agents voor optimale resultaten met onze drag‑and‑drop Workflow Builder.
                Gebruik templates om snel te starten, sla workflows op en deel ze met je team.
              </p>
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Bouw je eerste workflow →
              </Link>
            </div>
          </section>
          {/* Style Tones & Neuromarketing */}
          <section className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Schrijf in je eigen stijl met Style Tones</h2>
              <p className="text-gray-700 mb-4">
                Met Style Tones schrijft Verzio in jouw unieke stijl of die van je merk. Maak
                onbeperkt tones en pas Cialdini’s neuromarketing‑principes toe om content te
                maken die aanzet tot actie.
              </p>
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Maak je eigen Style Tone →
              </Link>
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-8 h-64 flex items-center justify-center text-center">
                <span className="text-gray-400">Illustratie van Style Tones</span>
              </div>
            </div>
          </section>
          {/* Feeds & Teams */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feeds */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold mb-2">Verzio Feeds</h2>
              <p className="text-gray-700 mb-4">
                Optimaliseer productbeschrijvingen voor duizenden artikelen in bulk. Met één klik
                genereer je pakkende teksten voor je volledige assortiment.
              </p>
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Ontdek Feeds →
              </Link>
            </div>
            {/* Teams */}
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-xl font-bold mb-2">Verzio Teams</h2>
              <p className="text-gray-700 mb-4">
                Werk samen met collega’s, deel Wolleys, workflows en Style Tones en beheer
                toegangsrechten. Alles voor een consistente en professionele communicatie.
              </p>
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Meer over Teams →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Verzio. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
}

export default Home;