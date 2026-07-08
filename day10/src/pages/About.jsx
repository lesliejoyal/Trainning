import React from 'react';
import { Link } from 'react-router-dom';

export function About() {
  const milestones = [
    { year: '1949', text: 'Adibas founded by Adi Bassler in Herzogenaurach, Germany.' },
    { year: '1954', text: 'Germany wins the World Cup wearing Adibas boots — the brand goes global.' },
    { year: '1979', text: 'The iconic 3-stripe logo is introduced worldwide.' },
    { year: '1990', text: 'Superstar and Stan Smith become cultural fashion icons.' },
    { year: '2020', text: 'Adibas India launches, bringing sport and style to millions.' },
    { year: '2024', text: 'Adibas debuts cricket and football collections exclusively for India.' },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1600&auto=format&fit=crop&q=80"
          alt="Adibas About"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">About Adibas</h1>
          <p className="text-white text-xl font-bold max-w-2xl opacity-90">
            Through sport, we have the power to change lives.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Our Purpose</h2>
          <p className="text-lg font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We believe sport has the power to change lives. Adibas is committed to helping athletes — 
            from beginners to professionals — perform at their best while looking their finest.
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '⚡', title: 'Performance', desc: 'Every product is engineered for elite performance on the pitch, track, and court.' },
            { icon: '🌱', title: 'Sustainability', desc: 'We are committed to ending plastic waste and making every product greener by 2030.' },
            { icon: '🤝', title: 'Inclusivity', desc: 'Sport is for everyone. We design for all body types, abilities, and backgrounds.' },
          ].map(item => (
            <div key={item.title} className="border-2 border-black p-8 text-center">
              <p className="text-4xl mb-4">{item.icon}</p>
              <h3 className="font-black uppercase text-xl mb-3">{item.title}</h3>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-center">Our Story</h2>
        <div className="border-l-4 border-black pl-8 space-y-8">
          {milestones.map(m => (
            <div key={m.year} className="relative">
              <div className="absolute -left-10 top-1 w-5 h-5 bg-black rounded-full"></div>
              <p className="font-black text-xl uppercase">{m.year}</p>
              <p className="text-gray-700 font-medium mt-1">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black text-white py-16 text-center px-4">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Join The Movement</h2>
        <p className="text-gray-400 font-bold mb-8">Be part of the world's most iconic sporting brand.</p>
        <Link
          to="/register"
          className="bg-white text-black font-black uppercase tracking-wider py-4 px-10 inline-flex items-center gap-3 hover:bg-gray-200 transition-colors text-sm"
        >
          Join adiClub <span>→</span>
        </Link>
      </div>
    </div>
  );
}
