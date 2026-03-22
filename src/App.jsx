import React, { useState, useMemo } from 'react';
import { Home, Train, Building, Bed, Euro, Calculator, Info, TrendingUp, Utensils, BarChart3, ShieldCheck } from 'lucide-react';

export default function App() {
  // Paramètres Généraux
  const [dureeAnnees, setDureeAnnees] = useState(10);
  const [joursParSemaine, setJoursParSemaine] = useState(2);
  const [semainesParAn, setSemainesParAn] = useState(43);
  const [nuitsParSemaine, setNuitsParSemaine] = useState(2);
  const [arParSemaine, setArParSemaine] = useState(1);

  // Paramètres Transport
  const [abonnementTgvMensuel, setAbonnementTgvMensuel] = useState(435);
  const [abonnementCarteLiberteAnnuel, setAbonnementCarteLiberteAnnuel] = useState(600);
  const [prixBilletCarteLiberte, setPrixBilletCarteLiberte] = useState(40);

  // Paramètres Logement
  const [prixNuitHotel, setPrixNuitHotel] = useState(130);
  const [loyerMensuel, setLoyerMensuel] = useState(700);

  // Paramètres Achat
  const [prixAchat, setPrixAchat] = useState(200000);
  const [partAchat, setPartAchat] = useState(50);
  const [apport, setApport] = useState(100000);
  const [fraisNotairePourcent, setFraisNotairePourcent] = useState(8);
  const [tauxEmprunt, setTauxEmprunt] = useState(3.5);
  const [dureeEmpruntAnnees, setDureeEmpruntAnnees] = useState(20);
  const [chargesAnnuellesAchat, setChargesAnnuellesAchat] = useState(1000);

  // Paramètres Vie & Annexes
  const [passLocalMensuel, setPassLocalMensuel] = useState(86); 
  const [budgetRepasHotelJour, setBudgetRepasHotelJour] = useState(5);
  const [budgetRepasAppartJour, setBudgetRepasAppartJour] = useState(5);
  const [taxeHabitationAnnuelle, setTaxeHabitationAnnuelle] = useState(500);
  const [chargesAnnexesMensuelles, setChargesAnnexesMensuelles] = useState(100); 

  // Paramètres Économiques
  const [inflationAnnuelle, setInflationAnnuelle] = useState(2);
  const [plusValueAnnuelle, setPlusValueAnnuelle] = useState(1);
  const [fraisInstallation, setFraisInstallation] = useState(3000);

  // Fonction pour calculer une somme avec inflation
  const calculerTotalInflate = (montantAnnuel, annees, taux) => {
    let total = 0;
    let montantCourant = montantAnnuel;
    for (let i = 0; i < annees; i++) {
      total += montantCourant;
      montantCourant *= (1 + taux / 100);
    }
    return total;
  };

  const scenarios = useMemo(() => {
    const moisTotaux = dureeAnnees * 12;
    const ratioAchat = partAchat / 100;
    const inf = inflationAnnuelle;

    const coutNavigoTotal = calculerTotalInflate(passLocalMensuel * 12, dureeAnnees, inf);
    const chargesVieTotale = calculerTotalInflate(chargesAnnexesMensuelles * 12, dureeAnnees, inf);
    const taxesTotales = calculerTotalInflate(taxeHabitationAnnuelle, dureeAnnees, inf);

    // 1. Aller & Retour quotidien (TGV MAX ACTIF)
    const coutTgvQuotidien = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const trajetsParAnTgv = joursParSemaine * 2 * semainesParAn;

    // 1b. Aller & Retour quotidien (TGV Carte Liberté)
    const coutCarteLiberteAbonnement = calculerTotalInflate(abonnementCarteLiberteAnnuel, dureeAnnees, inf);
    const coutCarteLiberteTrajetParAn = prixBilletCarteLiberte * trajetsParAnTgv;
    const coutCarteLiberteTransport = coutCarteLiberteAbonnement + calculerTotalInflate(coutCarteLiberteTrajetParAn, dureeAnnees, inf);
    
    // 2. Hôtel — l'abonnement TGV couvre les trajets (jusqu'à 250/an)
    const coutTransportHotelTotal = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const coutHotelTotal = calculerTotalInflate(prixNuitHotel * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const repasHotelTotal = calculerTotalInflate(budgetRepasHotelJour * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const trajetsParAnHebdo = arParSemaine * 2 * semainesParAn;

    // 3. Location (100% à charge car pied-à-terre personnel)
    const coutLocationTotal = calculerTotalInflate(loyerMensuel * 12, dureeAnnees, inf);
    const repasAppartTotal = calculerTotalInflate(budgetRepasAppartJour * nuitsParSemaine * semainesParAn, dureeAnnees, inf);

    // 4. Achat
    const fraisNotaireTotal = prixAchat * (fraisNotairePourcent / 100);
    const montantEmprunte = prixAchat + fraisNotaireTotal - apport;
    const rMensuel = (tauxEmprunt / 100) / 12;
    const nTotalMois = dureeEmpruntAnnees * 12;
    const mensualite = montantEmprunte * (rMensuel * Math.pow(1 + rMensuel, nTotalMois)) / (Math.pow(1 + rMensuel, nTotalMois) - 1);
    const capitalRestantDu = montantEmprunte * (Math.pow(1 + rMensuel, nTotalMois) - Math.pow(1 + rMensuel, moisTotaux)) / (Math.pow(1 + rMensuel, nTotalMois) - 1);
    
    const totalMensualites = mensualite * moisTotaux;
    const totalChargesProprio = calculerTotalInflate(chargesAnnuellesAchat, dureeAnnees, inf);
    
    // On divise par la part (ex: 50%)
    const mensuPart = totalMensualites * ratioAchat;
    const chargesProprioPart = totalChargesProprio * ratioAchat;
    const chargesViePart = chargesVieTotale * ratioAchat;
    const taxesPart = taxesTotales * ratioAchat;
    const installationPart = fraisInstallation * ratioAchat;
    const apportPart = apport * ratioAchat;
    const notairePart = fraisNotaireTotal * ratioAchat;

    const prixReventeFinal = prixAchat * Math.pow(1 + plusValueAnnuelle / 100, dureeAnnees);
    const capitalRecuperePart = (prixReventeFinal - capitalRestantDu) * ratioAchat;

    const createScenario = (id, title, icon, color, transport, base, chargesP, chargesV, tax, inst, food, notaire, app, desc, trajets) => {
      const tresorerie = transport + base + chargesP + chargesV + tax + inst + food + notaire + app;
      const coutNet = tresorerie - (id === 'achat' ? capitalRecuperePart : 0);
      return {
        id, title, icon, color, transport, base, chargesP, chargesV, tax, inst, food, notaire, app,
        tresorerie, recuperation: id === 'achat' ? capitalRecuperePart : 0,
        coutNet, trajetsParAn: trajets, desc
      };
    };

    return [
      createScenario('tgv', 'Aller & Retour quotidien (TGV MAX ACTIF)', <Train className="w-5 h-5" />, 'sky', coutTgvQuotidien + coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, "Abonnement illimité (max 250 trajets).", trajetsParAnTgv),
      createScenario('tgv-liberte', 'Aller & Retour quotidien (TGV Carte Liberté)', <Train className="w-5 h-5" />, 'teal', coutCarteLiberteTransport + coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, `Abo. ${abonnementCarteLiberteAnnuel}€/an + ${prixBilletCarteLiberte}€/trajet.`, trajetsParAnTgv),
      createScenario('hotel', 'Hôtel', <Bed className="w-5 h-5" />, 'orange', coutTransportHotelTotal + coutNavigoTotal, coutHotelTotal, 0, 0, 0, 0, repasHotelTotal, 0, 0, "A/R hebdo + Hôtel.", trajetsParAnHebdo),
      createScenario('location', 'Location', <Building className="w-5 h-5" />, 'purple', coutTransportHotelTotal + coutNavigoTotal, coutLocationTotal, 0, chargesVieTotale, taxesTotales, fraisInstallation, repasAppartTotal, 0, 0, "Loyer + A/R hebdo.", trajetsParAnHebdo),
      createScenario('achat', 'Achat', <Home className="w-5 h-5" />, 'emerald', coutTransportHotelTotal + coutNavigoTotal, mensuPart, chargesProprioPart, chargesViePart, taxesPart, installationPart, repasAppartTotal, notairePart, apportPart, `Part ${partAchat}% + Revente.`, trajetsParAnHebdo)
    ];
  }, [
    dureeAnnees, joursParSemaine, semainesParAn, nuitsParSemaine, arParSemaine,
    abonnementTgvMensuel, abonnementCarteLiberteAnnuel, prixBilletCarteLiberte, prixNuitHotel, loyerMensuel,
    prixAchat, partAchat, apport, fraisNotairePourcent, tauxEmprunt, dureeEmpruntAnnees, chargesAnnuellesAchat,
    passLocalMensuel, budgetRepasHotelJour, budgetRepasAppartJour, taxeHabitationAnnuelle, chargesAnnexesMensuelles,
    inflationAnnuelle, plusValueAnnuelle, fraisInstallation
  ]);

  const formatEuro = (amount) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);

  const maxVal = Math.max(...scenarios.map(s => s.tresorerie));

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-12xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 flex items-center justify-center gap-3">
            <Calculator className="text-indigo-600 w-10 h-10" />
            Simulateur Lille - Paris
          </h1>
          <p className="text-slate-500 font-medium italic">Analyse détaillée sur {dureeAnnees} ans</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PANNEAU DE CONFIGURATION */}
          <aside className="lg:col-span-4 space-y-6">
            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Rythme
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Durée (Ans)</label><input type="number" value={dureeAnnees} onChange={e => setDureeAnnees(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Semaines/An</label><input type="number" value={semainesParAn} onChange={e => setSemainesParAn(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Jours Paris/Sem</label><input type="number" value={joursParSemaine} onChange={e => setJoursParSemaine(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Nuits Paris/Sem</label><input type="number" value={nuitsParSemaine} onChange={e => setNuitsParSemaine(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
            </section>

            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Train className="w-4 h-4" /> Transport
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Navigo (€/mois)</label><input type="number" value={passLocalMensuel} onChange={e => setPassLocalMensuel(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
              </div>
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-sky-600 uppercase tracking-wider mb-2">TGV MAX ACTIF</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Abo. TGV MAX (€/mois)</label><input type="number" value={abonnementTgvMensuel} onChange={e => setAbonnementTgvMensuel(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-sky-500 outline-none" /></div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-wider mb-2">Carte Liberté</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Abo. (€/an)</label><input type="number" value={abonnementCarteLiberteAnnuel} onChange={e => setAbonnementCarteLiberteAnnuel(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Prix billet (€/trajet)</label><input type="number" value={prixBilletCarteLiberte} onChange={e => setPrixBilletCarteLiberte(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" /></div>
                </div>
              </div>
            </section>

            <section className="bg-amber-50 p-5 rounded-3xl shadow-sm border border-amber-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 mb-4 flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Hébergement & Vie
              </h2>

              {/* Hôtel */}
              <div>
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-2">Hôtel</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Nuit (€/j)</label><input type="number" value={prixNuitHotel} onChange={e => setPrixNuitHotel(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Repas (€/j)</label><input type="number" value={budgetRepasHotelJour} onChange={e => setBudgetRepasHotelJour(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-orange-400 outline-none" /></div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-3 pt-3 border-t border-amber-100">
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-wider mb-2">Location</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Loyer (€/mois)</label><input type="number" value={loyerMensuel} onChange={e => setLoyerMensuel(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Repas (€/j)</label><input type="number" value={budgetRepasAppartJour} onChange={e => setBudgetRepasAppartJour(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Élec/Web/Assur (€/mois)</label><input type="number" value={chargesAnnexesMensuelles} onChange={e => setChargesAnnexesMensuelles(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-amber-700 uppercase">Taxe Hab/Fonc (€/an)</label><input type="number" value={taxeHabitationAnnuelle} onChange={e => setTaxeHabitationAnnuelle(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" /></div>
                  <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-amber-700 uppercase">Frais install. (Meubles)</label><input type="number" value={fraisInstallation} onChange={e => setFraisInstallation(Number(e.target.value))} className="w-full p-2 bg-white/50 border-none rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" /></div>
                </div>
              </div>
            </section>

            <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Paramètres Achat
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Prix (€)</label><input type="number" value={prixAchat} onChange={e => setPrixAchat(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Votre Part (%)</label><input type="number" value={partAchat} onChange={e => setPartAchat(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Apport Total (€)</label><input type="number" value={apport} onChange={e => setApport(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Notaire (%)</label><input type="number" value={fraisNotairePourcent} onChange={e => setFraisNotairePourcent(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Taux Prêt (%)</label><input type="number" step="0.1" value={tauxEmprunt} onChange={e => setTauxEmprunt(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Durée Prêt (Ans)</label><input type="number" value={dureeEmpruntAnnees} onChange={e => setDureeEmpruntAnnees(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                  <div className="space-y-1 col-span-2"><label className="text-[10px] font-bold text-slate-500 uppercase">Charges Co-pro (€/an)</label><input type="number" value={chargesAnnuellesAchat} onChange={e => setChargesAnnuellesAchat(Number(e.target.value))} className="w-full p-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
                </div>
              </div>
            </section>
            
            <section className="bg-indigo-900 text-white p-5 rounded-3xl shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-indigo-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Économie
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-[10px] font-bold text-indigo-300 uppercase">Inflation (/an %)</label><input type="number" step="0.1" value={inflationAnnuelle} onChange={e => setInflationAnnuelle(Number(e.target.value))} className="w-full p-2 bg-indigo-800 border-none rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-400" /></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-indigo-300 uppercase">Plus-value Immo (%)</label><input type="number" step="0.1" value={plusValueAnnuelle} onChange={e => setPlusValueAnnuelle(Number(e.target.value))} className="w-full p-2 bg-indigo-800 border-none rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-400" /></div>
              </div>
            </section>
          </aside>

          {/* RÉSULTATS */}
          <main className="lg:col-span-8 space-y-6">
            
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <BarChart3 className="text-indigo-600 w-5 h-5" /> Synthèse Graphique des Coûts
                </h2>
                
                {/* NOUVELLE LÉGENDE COMPLÈTE */}
                <div className="flex flex-wrap gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-sky-500 rounded-sm shadow-sm"></div> 
                    Transport
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-indigo-500 rounded-sm shadow-sm"></div> 
                    Hébergement & Frais
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-amber-500 rounded-sm shadow-sm"></div> 
                    Nourriture
                  </div>
                  <div className="flex items-center gap-1.5 ml-2 pl-2 border-l-2 border-slate-200">
                    <div className="w-3 h-3 bg-indigo-400 relative overflow-hidden rounded-sm shadow-sm">
                      <div className="absolute inset-0 bg-white/60" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.6) 2px, rgba(255,255,255,0.6) 4px)' }}></div>
                    </div> 
                    <span className="text-emerald-700">Capital récupéré (Achat)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {scenarios.map(s => {
                  const totalBarWidth = (s.tresorerie / maxVal) * 100;
                  return (
                    <div key={`chart-${s.id}`} className="space-y-2">
                      <div className="flex justify-between items-end mb-1">
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-slate-100 rounded-xl">{s.icon}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{s.title}</span>
                             <span className="text-[10px] font-bold text-slate-400">
                               {s.trajetsParAn} trajets / an
                               {s.id === 'tgv' && s.trajetsParAn > 250 && ' ⚠️ (Forfait MAX de 250 trajets dépassé)'}
                               {s.id === 'tgv-liberte' && ` × ${formatEuro(prixBilletCarteLiberte)}/trajet`}
                             </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Coût Net :</span>
                          <span className="text-lg font-black text-slate-900">{formatEuro(s.coutNet)}</span>
                        </div>
                      </div>
                      <div className="relative h-7 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                        <div className="flex h-full transition-all duration-1000 ease-out" style={{ width: `${totalBarWidth}%` }}>
                          <div className="bg-sky-500 h-full border-r border-white/20" style={{ width: `${(s.transport / s.tresorerie) * 100}%` }}></div>
                          <div className="bg-indigo-500 h-full border-r border-white/20 relative" style={{ width: `${((s.base + s.chargesP + s.chargesV + s.tax + s.inst + s.notaire + s.app) / s.tresorerie) * 100}%` }}>
                            {s.id === 'achat' && (
                              <div className="absolute top-0 right-0 h-full bg-white/40 backdrop-blur-[1px]" style={{ width: `${(s.recuperation / (s.base + s.chargesP + s.chargesV + s.tax + s.inst + s.notaire + s.app)) * 100}%`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)' }}></div>
                            )}
                          </div>
                          <div className="bg-amber-500 h-full" style={{ width: `${(s.food / s.tresorerie) * 100}%` }}></div>
                        </div>
                      </div>
                      
                      {s.id === 'achat' && (
                        <div className="flex justify-end mt-1">
                          <p className="text-[10px] text-emerald-600 font-bold italic leading-none">
                            * À la revente, vous récupérez {formatEuro(s.recuperation)} (zone hachurée).
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[850px] border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-5 text-xs font-black uppercase tracking-widest opacity-50">Détails des Critères</th>
                    {scenarios.map(s => <th key={s.id} className="p-5 text-center font-black text-sm">{s.title}</th>)}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-400 pl-6 uppercase text-[10px]">Trajets TGV / an</td>
                    {scenarios.map(s => (
                       <td key={`tj-${s.id}`} className="p-3 text-center">
                         <span className="px-2 py-1 rounded-md font-bold text-[11px] bg-sky-100 text-sky-700">
                           {s.trajetsParAn}
                         </span>
                       </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50"><td className="p-3 font-bold text-slate-400 pl-6 uppercase text-[10px]">Transport</td>{scenarios.map(s => <td key={`t-${s.id}`} className="p-3 text-center">{formatEuro(s.transport)}</td>)}</tr>
                  
                  <tr><td className="p-3 font-bold text-slate-600 pl-6">Loyer / Mensualités (Votre part)</td>{scenarios.map(s => <td key={`b-${s.id}`} className="p-3 text-center">{s.base > 0 ? formatEuro(s.base) : '-'}</td>)}</tr>
                  
                  {/* CHARGES CACHÉES RÉVÉLÉES */}
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6 flex items-center gap-2">Charges Co-pro / Entretien <Info className="w-3 h-3 opacity-50" /></td>
                    {scenarios.map(s => <td key={`cp-${s.id}`} className="p-3 text-center font-medium">{s.chargesP > 0 ? formatEuro(s.chargesP) : '-'}</td>)}
                  </tr>
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6">Charges de vie (Elec/Web/Assur)</td>
                    {scenarios.map(s => <td key={`cv-${s.id}`} className="p-3 text-center font-medium">{s.chargesV > 0 ? formatEuro(s.chargesV) : '-'}</td>)}
                  </tr>
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6">Taxes (Habitation / Foncière)</td>
                    {scenarios.map(s => <td key={`tx-${s.id}`} className="p-3 text-center font-medium">{s.tax > 0 ? formatEuro(s.tax) : '-'}</td>)}
                  </tr>

                  <tr className="bg-amber-50/20 text-amber-700">
                    <td className="p-3 font-bold pl-6">Nourriture sur place</td>
                    {scenarios.map(s => <td key={`fd-${s.id}`} className="p-3 text-center">{s.food > 0 ? formatEuro(s.food) : '-'}</td>)}
                  </tr>

                  <tr><td className="p-3 font-bold text-emerald-700 pl-6">Notaire + Apport Initial</td>{scenarios.map(s => <td key={`ap-${s.id}`} className="p-3 text-center">{s.notaire + s.app > 0 ? formatEuro(s.notaire + s.app) : '-'}</td>)}</tr>

                  <tr className="bg-indigo-900 text-white"><td className="p-5 font-black uppercase text-xs tracking-widest pl-6">Coût Net Réel</td>{scenarios.map(s => <td key={`cn-${s.id}`} className="p-5 text-center font-black text-xl">{formatEuro(s.coutNet)}</td>)}</tr>
                  <tr className="bg-slate-800 text-slate-300"><td className="p-3 text-xs font-bold pl-6">Soit par an (Lissé)</td>{scenarios.map(s => <td key={`ca-${s.id}`} className="p-3 text-center font-bold">{formatEuro(s.coutNet / dureeAnnees)}</td>)}</tr>
                </tbody>
              </table>
            </div>

            {/* NOUVEAU TABLEAU : DÉTAILS LISSÉS PAR MOIS */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[850px] border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-5 text-xs font-black uppercase tracking-widest opacity-80">Détails Lissés par Mois</th>
                    {scenarios.map(s => <th key={`m-${s.id}`} className="p-5 text-center font-black text-sm">{s.title}</th>)}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-400 pl-6 uppercase text-[10px]">Trajets TGV / mois</td>
                    {scenarios.map(s => (
                      <td key={`mtj-${s.id}`} className="p-3 text-center font-medium">
                        {Math.round(s.trajetsParAn / 12)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50/50"><td className="p-3 font-bold text-slate-400 pl-6 uppercase text-[10px]">Transport / mois</td>{scenarios.map(s => <td key={`mt-${s.id}`} className="p-3 text-center">{formatEuro(s.transport / (dureeAnnees * 12))}</td>)}</tr>
                  
                  <tr><td className="p-3 font-bold text-slate-600 pl-6">Loyer / Mensualités (Votre part)</td>{scenarios.map(s => <td key={`mb-${s.id}`} className="p-3 text-center">{s.base > 0 ? formatEuro(s.base / (dureeAnnees * 12)) : '-'}</td>)}</tr>
                  
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6 flex items-center gap-2">Charges Co-pro / Entretien <Info className="w-3 h-3 opacity-50" /></td>
                    {scenarios.map(s => <td key={`mcp-${s.id}`} className="p-3 text-center font-medium">{s.chargesP > 0 ? formatEuro(s.chargesP / (dureeAnnees * 12)) : '-'}</td>)}
                  </tr>
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6">Charges de vie (Elec/Web/Assur)</td>
                    {scenarios.map(s => <td key={`mcv-${s.id}`} className="p-3 text-center font-medium">{s.chargesV > 0 ? formatEuro(s.chargesV / (dureeAnnees * 12)) : '-'}</td>)}
                  </tr>
                  <tr className="bg-indigo-50/30 text-indigo-900">
                    <td className="p-3 font-bold pl-6">Taxes (Habitation / Foncière)</td>
                    {scenarios.map(s => <td key={`mtx-${s.id}`} className="p-3 text-center font-medium">{s.tax > 0 ? formatEuro(s.tax / (dureeAnnees * 12)) : '-'}</td>)}
                  </tr>

                  <tr className="bg-amber-50/20 text-amber-700">
                    <td className="p-3 font-bold pl-6">Nourriture sur place / mois</td>
                    {scenarios.map(s => <td key={`mfd-${s.id}`} className="p-3 text-center">{s.food > 0 ? formatEuro(s.food / (dureeAnnees * 12)) : '-'}</td>)}
                  </tr>

                  <tr><td className="p-3 font-bold text-emerald-700 pl-6">Notaire + Apport Initial (Lissé)</td>{scenarios.map(s => <td key={`map-${s.id}`} className="p-3 text-center">{s.notaire + s.app > 0 ? formatEuro((s.notaire + s.app) / (dureeAnnees * 12)) : '-'}</td>)}</tr>

                  <tr className="bg-indigo-900 text-white"><td className="p-5 font-black uppercase text-xs tracking-widest pl-6">Coût Net Mensuel</td>{scenarios.map(s => <td key={`mcn-${s.id}`} className="p-5 text-center font-black text-xl">{formatEuro(s.coutNet / (dureeAnnees * 12))}</td>)}</tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 text-blue-800 text-xs flex gap-4">
              <Info className="w-5 h-5 flex-shrink-0" />
              <p>
                <strong>Focus Charges :</strong> Le simulateur intègre désormais les charges de copropriété (pour l'achat), les charges de vie (électricité, internet, assurance) et les taxes locales. Pour l'achat à deux, ces frais sont bien divisés par deux, contrairement à la location personnelle.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}