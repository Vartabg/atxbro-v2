"use client";
import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import benefitsData from './vetnavBenefitsDatabase.json';

export default function VetNav() {
 const [currentView, setCurrentView] = useState('main');
 const [filters, setFilters] = useState({
   state: '',
   category: '',
   eligibility: '',
   searchTerm: ''
 });

 useEffect(() => {
   // Set dynamic viewport height for iOS
   function setVh() {
     const vh = window.innerHeight * 0.01;
     document.documentElement.style.setProperty('--vh', `${vh}px`);
   }
   window.addEventListener('resize', setVh);
   setVh();
   
   return () => window.removeEventListener('resize', setVh);
 }, []);

 const categories = ['Education', 'Housing', 'Financial', 'Recreation', 'Other'];
 const states = [...new Set(benefitsData.map(b => b.state))].sort();
 const eligibilityTypes = [...new Set(benefitsData.flatMap(b => b.eligibility))].sort();

 const filteredBenefits = useMemo(() => {
   return benefitsData.filter(benefit => {
     return (!filters.state || benefit.state === filters.state) &&
            (!filters.category || benefit.category === filters.category) &&
            (!filters.eligibility || benefit.eligibility.includes(filters.eligibility)) &&
            (!filters.searchTerm || 
             benefit.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
             benefit.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
             benefit.tags.some(tag => tag.includes(filters.searchTerm.toLowerCase()))
            );
   });
 }, [filters]);

 const toTitleCase = (str) => {
   const exceptions = ['and', 'or', 'but', 'for', 'nor', 'so', 'yet', 'a', 'an', 'the', 'as', 'at', 'by', 'in', 'of', 'on', 'to', 'up', 'with', 'from'];
   return str.toLowerCase().split(' ').map((word, index) => {
     if (index === 0 || !exceptions.includes(word)) {
       return word.charAt(0).toUpperCase() + word.slice(1);
     }
     return word;
   }).join(' ');
 };

 const mythBusters = [
   {
     myth: "I Make Too Much Money to Be Eligible",
     fact: "Income Only Affects Certain Benefits Like VA Pension. Most VA Healthcare and Disability Compensation Don't Have Income Limits."
   },
   {
     myth: "I've Been Out Too Long to Apply", 
     fact: "Most VA Benefits Have No Time Limit. You Can Apply Years After Discharge."
   },
   {
     myth: "I Never Deployed So I'm Not Eligible",
     fact: "Deployment is Not Required for Most VA Benefits. Service-Connected Disabilities from Training Injuries Also Qualify."
   },
   {
     myth: "VA Healthcare is Only for Combat Veterans",
     fact: "All Eligible Veterans Can Access VA Healthcare Regardless of Combat Experience."
   }
 ];

 const MainMenu = () => (
   <div className="ios-container">
     <div className="ios-content">
       <div className="text-center mb-8">
         <h1 className="text-3xl font-bold mb-4">
           Veterans Benefits Finder
         </h1>
         <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
           {benefitsData.length} Benefits Across All 50 States
         </div>
       </div>
       
       <div className="w-full max-w-sm mx-auto space-y-4">
         <button
           onClick={() => setCurrentView('search')}
           className="w-full bg-gradient-to-br from-blue-600 to-teal-500 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
         >
           <div className="text-4xl mb-3">🔍</div>
           <h3 className="text-xl font-bold mb-2">Find Benefits</h3>
           <p className="text-blue-100 text-sm">Search through 789 state and federal benefits</p>
         </button>

         <button
           onClick={() => setCurrentView('categories')}
           className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
         >
           <div className="text-4xl mb-3">📋</div>
           <h3 className="text-xl font-bold mb-2">Browse Categories</h3>
           <p className="text-purple-100 text-sm">Explore by Education, Housing, Financial, Recreation</p>
         </button>

         <button
           onClick={() => setCurrentView('states')}
           className="w-full bg-gradient-to-br from-green-600 to-emerald-500 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
         >
           <div className="text-4xl mb-3">🗺️</div>
           <h3 className="text-xl font-bold mb-2">By State</h3>
           <p className="text-green-100 text-sm">Find benefits specific to your state</p>
         </button>

         <button
           onClick={() => setCurrentView('myths')}
           className="w-full bg-gradient-to-br from-amber-600 to-yellow-500 p-6 rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl"
         >
           <div className="text-4xl mb-3">💡</div>
           <h3 className="text-xl font-bold mb-2">Myth Busters</h3>
           <p className="text-amber-100 text-sm">Common misconceptions about veteran benefits</p>
         </button>
       </div>

       <div className="mt-8 w-full max-w-sm mx-auto bg-blue-600 text-white p-4 rounded-lg text-center">
         <strong className="text-sm">Need Immediate Help?</strong><br />
         <span className="text-sm">Veterans Crisis Line: 988, Press 1 | Text: 838255</span>
       </div>
     </div>
   </div>
 );

 const SearchView = () => (
   <div className="ios-container">
     <div className="ios-content">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold">Search Benefits</h2>
         <button
           onClick={() => setCurrentView('main')}
           className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
         >
           ← Menu
         </button>
       </div>
       
       <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6">
         <div className="space-y-3">
           <select 
             value={filters.state} 
             onChange={(e) => setFilters({...filters, state: e.target.value})}
             className="w-full p-3 rounded-lg bg-white/20 text-white border-0 text-sm"
           >
             <option value="" className="text-black">All States</option>
             {states.map(state => (
               <option key={state} value={state} className="text-black">{state}</option>
             ))}
           </select>
           
           <select 
             value={filters.category} 
             onChange={(e) => setFilters({...filters, category: e.target.value})}
             className="w-full p-3 rounded-lg bg-white/20 text-white border-0 text-sm"
           >
             <option value="" className="text-black">All Categories</option>
             {categories.map(cat => (
               <option key={cat} value={cat} className="text-black">{cat}</option>
             ))}
           </select>

           <select 
             value={filters.eligibility} 
             onChange={(e) => setFilters({...filters, eligibility: e.target.value})}
             className="w-full p-3 rounded-lg bg-white/20 text-white border-0 text-sm"
           >
             <option value="" className="text-black">All Eligibility</option>
             {eligibilityTypes.map(type => (
               <option key={type} value={type} className="text-black">{toTitleCase(type)}</option>
             ))}
           </select>

           <input
             type="text"
             placeholder="Search Benefits..."
             value={filters.searchTerm}
             onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
             className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border-0 text-sm"
           />
         </div>
         
         <div className="text-center mt-4">
           <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
             {filteredBenefits.length} Benefits Found
           </span>
         </div>
       </div>

       <div className="ios-scrollable">
         {filteredBenefits.slice(0, 50).map((benefit) => (
           <div key={benefit.id} className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-3">
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-bold text-blue-200 flex-1 pr-2">{toTitleCase(benefit.title)}</h3>
               <span className="bg-blue-600 px-2 py-1 rounded text-xs flex-shrink-0">{benefit.state}</span>
             </div>
             <p className="text-white/90 mb-3 text-sm">{toTitleCase(benefit.description)}</p>
             <div className="flex flex-wrap gap-1 mb-3">
               <span className="bg-green-600 px-2 py-1 rounded text-xs">{benefit.category}</span>
               {benefit.eligibility.map(req => (
                 <span key={req} className="bg-amber-600 px-2 py-1 rounded text-xs">{toTitleCase(req)}</span>
               ))}
             </div>
             <div className="flex gap-2">
               <button className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm flex-1">
                 Learn More
               </button>
               <button className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-white text-sm flex-1">
                 Apply Now
               </button>
             </div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );

 const CategoriesView = () => (
   <div className="ios-container">
     <div className="ios-content">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold">Browse by Category</h2>
         <button
           onClick={() => setCurrentView('main')}
           className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
         >
           ← Menu
         </button>
       </div>
       
       <div className="ios-scrollable">
         {categories.map(category => {
           const categoryBenefits = benefitsData.filter(b => b.category === category);
           return (
             <button
               key={category}
               onClick={() => {
                 setFilters({...filters, category: category});
                 setCurrentView('search');
               }}
               className="w-full bg-gradient-to-br from-blue-600/80 to-purple-600/80 p-5 rounded-xl hover:scale-105 transition-all duration-300 text-left mb-4"
             >
               <h3 className="text-xl font-bold mb-2">{category}</h3>
               <p className="text-blue-100 mb-2 text-sm">{categoryBenefits.length} benefits available</p>
               <div className="text-xs text-blue-200">
                 {categoryBenefits.slice(0, 3).map(b => b.state).filter((state, index, arr) => arr.indexOf(state) === index).join(', ')}
                 {categoryBenefits.length > 3 && '...'}
               </div>
             </button>
           );
         })}
       </div>
     </div>
   </div>
 );

 const StatesView = () => (
   <div className="ios-container">
     <div className="ios-content">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold">Browse by State</h2>
         <button
           onClick={() => setCurrentView('main')}
           className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
         >
           ← Menu
         </button>
       </div>
       
       <div className="ios-scrollable">
         <div className="grid grid-cols-2 gap-3">
           {states.map(state => {
             const stateBenefits = benefitsData.filter(b => b.state === state);
             return (
               <button
                 key={state}
                 onClick={() => {
                   setFilters({...filters, state: state});
                   setCurrentView('search');
                 }}
                 className="bg-gradient-to-br from-green-600/80 to-blue-600/80 p-4 rounded-xl hover:scale-105 transition-all duration-300 text-center"
               >
                 <div className="text-lg font-bold mb-1">{state}</div>
                 <div className="text-xs text-green-100">{stateBenefits.length} benefits</div>
               </button>
             );
           })}
         </div>
       </div>
     </div>
   </div>
 );

 const MythsView = () => (
   <div className="ios-container">
     <div className="ios-content">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-bold">Myth Busters</h2>
         <button
           onClick={() => setCurrentView('main')}
           className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm"
         >
           ← Menu
         </button>
       </div>
       
       <div className="ios-scrollable">
         {mythBusters.map((myth, index) => (
           <div key={index} className="bg-gradient-to-r from-amber-500/20 to-green-500/20 p-4 rounded-lg border-l-4 border-yellow-500 mb-4">
             <div className="font-semibold text-amber-200 mb-2 text-sm">❌ Myth: {myth.myth}</div>
             <div className="text-green-200 text-sm">✅ Fact: {myth.fact}</div>
           </div>
         ))}
       </div>
     </div>
   </div>
 );

 return (
   <>
     <Head>
       <meta
         name="viewport"
         content="width=device-width, initial-scale=1, viewport-fit=cover"
       />
     </Head>
     <div className="ios-wrapper">
       {currentView === 'main' && <MainMenu />}
       {currentView === 'search' && <SearchView />}
       {currentView === 'categories' && <CategoriesView />}
       {currentView === 'states' && <StatesView />}
       {currentView === 'myths' && <MythsView />}
     </div>
     <style jsx global>{`
       :root {
         --vh: 100vh;
       }
       
       html, body {
         margin: 0;
         padding: 0;
         height: -webkit-fill-available;
         touch-action: manipulation;
       }
       
       .ios-wrapper {
         position: fixed;
         top: env(safe-area-inset-top);
         left: env(safe-area-inset-left);
         right: env(safe-area-inset-right);
         bottom: env(safe-area-inset-bottom);
         background: linear-gradient(to bottom right, #1e3a8a, #1e40af, #0f766e);
         color: white;
         overflow-y: scroll;
         -webkit-overflow-scrolling: touch;
         overscroll-behavior: contain;
         height: calc(var(--vh) * 100 - env(safe-area-inset-top) - env(safe-area-inset-bottom));
       }
       
       .ios-container {
         padding: 1rem;
         min-height: 100%;
       }
       
       .ios-content {
         padding-bottom: 2rem;
       }
       
       .ios-scrollable {
         overflow-y: scroll;
         -webkit-overflow-scrolling: touch;
         overscroll-behavior: contain;
         max-height: 60vh;
         padding-bottom: 1rem;
       }
     `}</style>
   </>
 );
}
