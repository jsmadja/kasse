import React, { useState, useMemo } from 'react';
import { Home, Train, Building, Bed, Calculator, Info, TrendingUp, Utensils, BarChart3, ShieldCheck, ChevronDown, Sun, Moon } from 'lucide-react';

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  const setStored = (next) => {
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [value, setStored];
}

function Field({ label, children, T }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-[10px] font-bold uppercase tracking-widest ${T.label}`}>{label}</label>
      {children}
    </div>
  );
}

function Select({ value, onChange, options, T }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition appearance-none cursor-pointer ${T.input}`}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Input({ value, onChange, step, T }) {
  return (
    <input
      type="number"
      step={step}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${T.input}`}
    />
  );
}

function SectionCard({ title, icon, accent = 'indigo', children, defaultOpen = true, T }) {
  const [open, setOpen] = useState(defaultOpen);
  const accents = {
    indigo: 'text-indigo-400',
    sky:    'text-sky-400',
    orange: 'text-orange-400',
    purple: 'text-purple-400',
    emerald:'text-emerald-400',
    teal:   'text-teal-400',
    amber:  'text-amber-400',
  };
  return (
    <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-5 py-4 transition ${T.cardHover}`}
      >
        <span className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${accents[accent]}`}>
          {icon} {title}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
}

function SubGroup({ label, color, T }) {
  const colorsDark = {
    sky:    'text-sky-400 border-sky-900',
    teal:   'text-teal-400 border-teal-900',
    orange: 'text-orange-400 border-orange-900',
    purple: 'text-purple-400 border-purple-900',
    emerald:'text-emerald-400 border-emerald-900',
  };
  const colorsLight = {
    sky:    'text-sky-600 border-sky-200',
    teal:   'text-teal-600 border-teal-200',
    orange: 'text-orange-600 border-orange-200',
    purple: 'text-purple-600 border-purple-200',
    emerald:'text-emerald-600 border-emerald-200',
  };
  const colors = T.isDark ? colorsDark : colorsLight;
  return (
    <p className={`text-[10px] font-black uppercase tracking-widest pt-3 border-t ${colors[color]}`}>
      {label}
    </p>
  );
}

const SCENARIO_COLORS_DARK = {
  tgv:        { bg: 'bg-sky-500',    text: 'text-sky-400',    light: 'bg-sky-900/40',    border: 'border-sky-700',   badge: 'bg-sky-900 text-sky-300' },
  'tgv-liberte': { bg: 'bg-teal-500', text: 'text-teal-400', light: 'bg-teal-900/40',   border: 'border-teal-700',  badge: 'bg-teal-900 text-teal-300' },
  hotel:      { bg: 'bg-orange-500', text: 'text-orange-400', light: 'bg-orange-900/40', border: 'border-orange-700',badge: 'bg-orange-900 text-orange-300' },
  location:   { bg: 'bg-purple-500', text: 'text-purple-400', light: 'bg-purple-900/40', border: 'border-purple-700',badge: 'bg-purple-900 text-purple-300' },
  achat:      { bg: 'bg-emerald-500',text: 'text-emerald-400',light: 'bg-emerald-900/40',border: 'border-emerald-700',badge: 'bg-emerald-900 text-emerald-300' },
};

const SCENARIO_COLORS_LIGHT = {
  tgv:        { bg: 'bg-sky-500',    text: 'text-sky-700',    light: 'bg-sky-50',    border: 'border-sky-300',   badge: 'bg-sky-100 text-sky-700' },
  'tgv-liberte': { bg: 'bg-teal-500', text: 'text-teal-700', light: 'bg-teal-50',   border: 'border-teal-300',  badge: 'bg-teal-100 text-teal-700' },
  hotel:      { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-300',badge: 'bg-orange-100 text-orange-700' },
  location:   { bg: 'bg-purple-500', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-300',badge: 'bg-purple-100 text-purple-700' },
  achat:      { bg: 'bg-emerald-500',text: 'text-emerald-700',light: 'bg-emerald-50',border: 'border-emerald-300',badge: 'bg-emerald-100 text-emerald-700' },
};

export default function App() {
  // Theme
  const [dark, setDark] = useLocalStorage('theme', true);

  const T = dark ? {
    isDark: true,
    page:         'bg-slate-950 text-slate-100',
    header:       'bg-slate-950/80 border-slate-800',
    card:         'bg-slate-900 border-slate-800',
    cardHover:    'hover:bg-slate-800/60',
    input:        'bg-slate-800 border-slate-700 text-white',
    label:        'text-slate-400',
    chevron:      'text-slate-500',
    rowAlt:       'bg-slate-800/20',
    rowIndigo:    'bg-indigo-950/30',
    rowAmber:     'bg-amber-950/20',
    rowEmerald:   'bg-emerald-950/20',
    rowTotal:     'border-slate-700',
    rowTotalAlt:  'bg-slate-800/40',
    divider:      'divide-slate-800/60',
    border:       'border-slate-800',
    textPrimary:  'text-white',
    textSecondary:'text-slate-300',
    textMuted:    'text-slate-400',
    textFaint:    'text-slate-500',
    textFaintest: 'text-slate-600',
    barBg:        'bg-slate-800',
    legendBorder: 'border-slate-700',
    note:         'bg-slate-900 border-slate-800 text-slate-400',
    noteIcon:     'text-indigo-400',
    noteLabel:    'text-slate-300',
    inactiveFilter:'bg-slate-800 text-slate-500 border-slate-700 opacity-50',
    tableHeader:  'text-slate-500',
    amberRow:     'text-amber-500/80',
    emeraldRow:   'text-emerald-500/80',
    infoIcon:     'text-slate-600',
    chartLegend:  'text-slate-400',
    capitalText:  'text-emerald-400',
  } : {
    isDark: false,
    page:         'bg-slate-100 text-slate-900',
    header:       'bg-white/90 border-slate-200',
    card:         'bg-white border-slate-200',
    cardHover:    'hover:bg-slate-50',
    input:        'bg-white border-slate-300 text-slate-900',
    label:        'text-slate-500',
    chevron:      'text-slate-400',
    rowAlt:       'bg-slate-50',
    rowIndigo:    'bg-indigo-50/50',
    rowAmber:     'bg-amber-50/50',
    rowEmerald:   'bg-emerald-50/50',
    rowTotal:     'border-slate-300',
    rowTotalAlt:  'bg-slate-100',
    divider:      'divide-slate-200',
    border:       'border-slate-200',
    textPrimary:  'text-slate-900',
    textSecondary:'text-slate-700',
    textMuted:    'text-slate-500',
    textFaint:    'text-slate-400',
    textFaintest: 'text-slate-300',
    barBg:        'bg-slate-200',
    legendBorder: 'border-slate-300',
    note:         'bg-blue-50 border-blue-100 text-blue-800',
    noteIcon:     'text-blue-500',
    noteLabel:    'text-blue-900',
    inactiveFilter:'bg-slate-100 text-slate-400 border-slate-200 opacity-60',
    tableHeader:  'text-slate-400',
    amberRow:     'text-amber-700',
    emeraldRow:   'text-emerald-700',
    infoIcon:     'text-slate-400',
    chartLegend:  'text-slate-500',
    capitalText:  'text-emerald-600',
  };

  const SCENARIO_COLORS = dark ? SCENARIO_COLORS_DARK : SCENARIO_COLORS_LIGHT;

  // Paramètres Généraux
  const [dureeAnnees, setDureeAnnees] = useLocalStorage('dureeAnnees', 10);
  const [joursParSemaine, setJoursParSemaine] = useLocalStorage('joursParSemaine', 2);
  const [semainesParAn, setSemainesParAn] = useLocalStorage('semainesParAn', 43);
  const [nuitsParSemaine, setNuitsParSemaine] = useLocalStorage('nuitsParSemaine', 2);
  const [arParSemaine, setArParSemaine] = useLocalStorage('arParSemaine', 1);

  // Paramètres Transport
  const [abonnementTgvMensuel, setAbonnementTgvMensuel] = useLocalStorage('abonnementTgvMensuel', 435);
  const [abonnementCarteLiberteAnnuel, setAbonnementCarteLiberteAnnuel] = useLocalStorage('abonnementCarteLiberteAnnuel', 600);
  const [prixBilletCarteLiberte, setPrixBilletCarteLiberte] = useLocalStorage('prixBilletCarteLiberte', 40);

  // Paramètres Logement
  const [prixNuitHotel, setPrixNuitHotel] = useLocalStorage('prixNuitHotel', 130);
  const [loyerMensuel, setLoyerMensuel] = useLocalStorage('loyerMensuel', 700);

  // Paramètres Achat
  const [prixAchat, setPrixAchat] = useLocalStorage('prixAchat', 200000);
  const [partAchat, setPartAchat] = useLocalStorage('partAchat', 50);
  const [apport, setApport] = useLocalStorage('apport', 100000);
  const [fraisNotairePourcent, setFraisNotairePourcent] = useLocalStorage('fraisNotairePourcent', 8);
  const [tauxEmprunt, setTauxEmprunt] = useLocalStorage('tauxEmprunt', 3.5);
  const [dureeEmpruntAnnees, setDureeEmpruntAnnees] = useLocalStorage('dureeEmpruntAnnees', 20);
  const [chargesAnnuellesAchat, setChargesAnnuellesAchat] = useLocalStorage('chargesAnnuellesAchat', 1000);

  // Paramètres Vie & Annexes
  const [passLocalMensuel, setPassLocalMensuel] = useLocalStorage('passLocalMensuel', 86);
  const [budgetRepasHotelJour, setBudgetRepasHotelJour] = useLocalStorage('budgetRepasHotelJour', 5);
  const [budgetRepasAppartJour, setBudgetRepasAppartJour] = useLocalStorage('budgetRepasAppartJour', 5);
  const [taxeHabitationAnnuelle, setTaxeHabitationAnnuelle] = useLocalStorage('taxeHabitationAnnuelle', 500);
  const [chargesAnnexesMensuelles, setChargesAnnexesMensuelles] = useLocalStorage('chargesAnnexesMensuelles', 100);

  // Paramètres Économiques
  const [inflationAnnuelle, setInflationAnnuelle] = useLocalStorage('inflationAnnuelle', 2);
  const [plusValueAnnuelle, setPlusValueAnnuelle] = useLocalStorage('plusValueAnnuelle', 1);
  const [fraisInstallation, setFraisInstallation] = useLocalStorage('fraisInstallation', 3000);

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

    const coutTgvQuotidien = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const trajetsParAnTgv = joursParSemaine * 2 * semainesParAn;

    const coutCarteLiberteAbonnement = calculerTotalInflate(abonnementCarteLiberteAnnuel, dureeAnnees, inf);
    const coutCarteLiberteTrajetParAn = prixBilletCarteLiberte * trajetsParAnTgv;
    const coutCarteLiberteTransport = coutCarteLiberteAbonnement + calculerTotalInflate(coutCarteLiberteTrajetParAn, dureeAnnees, inf);

    const coutTransportHotelTotal = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const coutHotelTotal = calculerTotalInflate(prixNuitHotel * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const repasHotelTotal = calculerTotalInflate(budgetRepasHotelJour * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const trajetsParAnHebdo = arParSemaine * 2 * semainesParAn;

    const coutLocationTotal = calculerTotalInflate(loyerMensuel * 12, dureeAnnees, inf);
    const repasAppartTotal = calculerTotalInflate(budgetRepasAppartJour * nuitsParSemaine * semainesParAn, dureeAnnees, inf);

    const fraisNotaireTotal = prixAchat * (fraisNotairePourcent / 100);
    const montantEmprunte = prixAchat + fraisNotaireTotal - apport;
    const rMensuel = (tauxEmprunt / 100) / 12;
    const nTotalMois = dureeEmpruntAnnees * 12;
    const mensualite = montantEmprunte * (rMensuel * Math.pow(1 + rMensuel, nTotalMois)) / (Math.pow(1 + rMensuel, nTotalMois) - 1);
    const capitalRestantDu = montantEmprunte * (Math.pow(1 + rMensuel, nTotalMois) - Math.pow(1 + rMensuel, moisTotaux)) / (Math.pow(1 + rMensuel, nTotalMois) - 1);

    const totalMensualites = mensualite * moisTotaux;
    const totalChargesProprio = calculerTotalInflate(chargesAnnuellesAchat, dureeAnnees, inf);

    const mensuPart = totalMensualites * ratioAchat;
    const chargesProprioPart = totalChargesProprio * ratioAchat;
    const chargesViePart = chargesVieTotale * ratioAchat;
    const taxesPart = taxesTotales * ratioAchat;
    const installationPart = fraisInstallation * ratioAchat;
    const apportPart = apport * ratioAchat;
    const notairePart = fraisNotaireTotal * ratioAchat;

    const prixReventeFinal = prixAchat * Math.pow(1 + plusValueAnnuelle / 100, dureeAnnees);
    const capitalRecuperePart = (prixReventeFinal - capitalRestantDu) * ratioAchat;

    const createScenario = (id, title, icon, color, transportAbonnement, transportBillets, transportNavigo, base, chargesP, chargesV, tax, inst, food, notaire, app, desc, trajets) => {
      const transport = transportAbonnement + transportBillets + transportNavigo;
      const tresorerie = transport + base + chargesP + chargesV + tax + inst + food + notaire + app;
      const coutNet = tresorerie - (id === 'achat' ? capitalRecuperePart : 0);
      return {
        id, title, icon, color, transport, transportAbonnement, transportBillets, transportNavigo,
        base, chargesP, chargesV, tax, inst, food, notaire, app,
        tresorerie, recuperation: id === 'achat' ? capitalRecuperePart : 0,
        coutNet, trajetsParAn: trajets, desc
      };
    };

    return [
      createScenario('tgv',         'TGV Quotidien (MAX ACTIF)',    <Train className="w-4 h-4" />, 'sky',     coutTgvQuotidien,              0,                                                            coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, "Abonnement illimité (max 250 trajets).", trajetsParAnTgv),
      createScenario('tgv-liberte', 'TGV Quotidien (Carte Liberté)',<Train className="w-4 h-4" />, 'teal',    coutCarteLiberteAbonnement,    calculerTotalInflate(coutCarteLiberteTrajetParAn, dureeAnnees, inf), coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, `Abo. ${abonnementCarteLiberteAnnuel}€/an + ${prixBilletCarteLiberte}€/trajet.`, trajetsParAnTgv),
      createScenario('hotel',       'Hôtel',                        <Bed className="w-4 h-4" />,   'orange',  coutTransportHotelTotal,       0,                                                            coutNavigoTotal, coutHotelTotal, 0, 0, 0, 0, repasHotelTotal, 0, 0, "A/R hebdo + Hôtel.", trajetsParAnHebdo),
      createScenario('location',    'Location',                     <Building className="w-4 h-4" />,'purple', coutTransportHotelTotal,       0,                                                            coutNavigoTotal, coutLocationTotal, 0, chargesVieTotale, taxesTotales, fraisInstallation, repasAppartTotal, 0, 0, "Loyer + A/R hebdo.", trajetsParAnHebdo),
      createScenario('achat',       'Achat',                        <Home className="w-4 h-4" />,  'emerald', coutTransportHotelTotal,       0,                                                            coutNavigoTotal, mensuPart, chargesProprioPart, chargesViePart, taxesPart, installationPart, repasAppartTotal, notairePart, apportPart, `Part ${partAchat}% + Revente.`, trajetsParAnHebdo),
    ];
  }, [
    dureeAnnees, joursParSemaine, semainesParAn, nuitsParSemaine, arParSemaine,
    abonnementTgvMensuel, abonnementCarteLiberteAnnuel, prixBilletCarteLiberte, prixNuitHotel, loyerMensuel,
    prixAchat, partAchat, apport, fraisNotairePourcent, tauxEmprunt, dureeEmpruntAnnees, chargesAnnuellesAchat,
    passLocalMensuel, budgetRepasHotelJour, budgetRepasAppartJour, taxeHabitationAnnuelle, chargesAnnexesMensuelles,
    inflationAnnuelle, plusValueAnnuelle, fraisInstallation
  ]);

  const fmt = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
  const fmtDec = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // Gros montants (totaux pluriannuels) → "135 k€" ou "1,2 M€"
  const formatEuro = (amount) => {
    const abs = Math.abs(amount);
    if (abs >= 1_000_000) return `${fmtDec.format(amount / 1_000_000)} M€`;
    if (abs >= 10_000)    return `${fmt.format(Math.round(amount / 1000))} k€`;
    return `${fmt.format(Math.round(amount))} €`;
  };

  // Petits montants (mensualités, prix unitaires) → toujours en € entier
  const formatEuroExact = (amount) => `${fmt.format(Math.round(amount))} €`;

  const [activeIds, setActiveIds] = useState(() => new Set(scenarios.map(s => s.id)));
  const [chartOpen, setChartOpen] = useState(true);
  const [detailOpen, setDetailOpen] = useState(true);
  const [annuelOpen, setAnnuelOpen] = useState(true);
  const [mensuelOpen, setMensuelOpen] = useState(true);
  const toggleScenario = (id) => {
    setActiveIds(prev => {
      if (prev.size === 1 && prev.has(id)) return prev;
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleScenarios = scenarios.filter(s => activeIds.has(s.id));
  const maxVal = Math.max(...visibleScenarios.map(s => s.tresorerie));
  const best = visibleScenarios.reduce((a, b) => a.coutNet < b.coutNet ? a : b);

  return (
    <div className={`min-h-screen font-sans ${T.page}`}>

      {/* HEADER */}
      <header className={`border-b backdrop-blur sticky top-0 z-10 ${T.header}`}>
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className={`text-base font-black leading-none ${T.textPrimary}`}>Simulateur Lille — Paris</h1>
              <p className={`text-[11px] mt-0.5 ${T.textFaint}`}>Analyse comparative sur {dureeAnnees} ans</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {scenarios.map(s => {
              const c = SCENARIO_COLORS[s.id];
              const isActive = activeIds.has(s.id);
              const isBest = isActive && s.id === best.id;
              return (
                <button
                  key={s.id}
                  onClick={() => toggleScenario(s.id)}
                  className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    isActive
                      ? `${c.light} ${c.text} ${c.border} ${isBest ? 'ring-2 ring-offset-1 ' + (dark ? 'ring-offset-slate-950' : 'ring-offset-white') + ' ' + c.border : ''}`
                      : T.inactiveFilter
                  }`}
                >
                  {s.icon}
                  <span className="hidden xl:inline">{s.title}</span>
                  {isBest && <span className="ml-1 text-[9px] font-black uppercase tracking-wider opacity-70">Optimal</span>}
                </button>
              );
            })}
            {/* Theme toggle */}
            <button
              onClick={() => setDark(d => !d)}
              className={`ml-2 w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${T.card} ${T.cardHover}`}
              title={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {dark
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4 text-indigo-500" />
              }
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 xl:px-16 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* ── PANNEAU DE CONFIGURATION ── */}
          <aside className="xl:col-span-3 space-y-4">

            <SectionCard title="Rythme" icon={<Calculator className="w-3.5 h-3.5" />} accent="indigo" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Durée (ans)" T={T}>
                  <Select value={dureeAnnees} onChange={e => setDureeAnnees(Number(e.target.value))} options={[1,2,3,4,5,6,7,8,9,10,12,15,20,25,30].map(v => ({ value: v, label: `${v} ans` }))} T={T} />
                </Field>
                <Field label="Semaines / an" T={T}>
                  <Select value={semainesParAn} onChange={e => setSemainesParAn(Number(e.target.value))} options={Array.from({length: 52}, (_, i) => i + 1).map(v => ({ value: v, label: `${v} sem.` }))} T={T} />
                </Field>
                <Field label="Jours Paris / sem" T={T}>
                  <Select value={joursParSemaine} onChange={e => setJoursParSemaine(Number(e.target.value))} options={[1,2,3,4,5].map(v => ({ value: v, label: `${v} jour${v > 1 ? 's' : ''}` }))} T={T} />
                </Field>
                <Field label="Nuits Paris / sem" T={T}>
                  <Select value={nuitsParSemaine} onChange={e => setNuitsParSemaine(Number(e.target.value))} options={[0,1,2,3,4,5,6].map(v => ({ value: v, label: v === 0 ? 'Aucune' : `${v} nuit${v > 1 ? 's' : ''}` }))} T={T} />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Transport" icon={<Train className="w-3.5 h-3.5" />} accent="sky" T={T}>
              <Field label="Navigo (€ / mois)" T={T}><Input value={passLocalMensuel} onChange={e => setPassLocalMensuel(Number(e.target.value))} T={T} /></Field>
              <SubGroup label="TGV MAX ACTIF" color="sky" T={T} />
              <Field label="Abonnement (€ / mois)" T={T}><Input value={abonnementTgvMensuel} onChange={e => setAbonnementTgvMensuel(Number(e.target.value))} T={T} /></Field>
              <SubGroup label="Carte Liberté" color="teal" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Abonnement (€ / an)" T={T}><Input value={abonnementCarteLiberteAnnuel} onChange={e => setAbonnementCarteLiberteAnnuel(Number(e.target.value))} T={T} /></Field>
                <Field label="Billet (€ / trajet)" T={T}><Input value={prixBilletCarteLiberte} onChange={e => setPrixBilletCarteLiberte(Number(e.target.value))} T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Hébergement & Vie" icon={<Utensils className="w-3.5 h-3.5" />} accent="orange" T={T}>
              <SubGroup label="Hôtel" color="orange" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nuit (€ / j)" T={T}><Input value={prixNuitHotel} onChange={e => setPrixNuitHotel(Number(e.target.value))} T={T} /></Field>
                <Field label="Repas (€ / j)" T={T}><Input value={budgetRepasHotelJour} onChange={e => setBudgetRepasHotelJour(Number(e.target.value))} T={T} /></Field>
              </div>
              <SubGroup label="Location" color="purple" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Loyer (€ / mois)" T={T}><Input value={loyerMensuel} onChange={e => setLoyerMensuel(Number(e.target.value))} T={T} /></Field>
                <Field label="Repas (€ / j)" T={T}><Input value={budgetRepasAppartJour} onChange={e => setBudgetRepasAppartJour(Number(e.target.value))} T={T} /></Field>
                <Field label="Élec / Web / Assur (€/mois)" T={T}><Input value={chargesAnnexesMensuelles} onChange={e => setChargesAnnexesMensuelles(Number(e.target.value))} T={T} /></Field>
                <Field label="Taxe Hab / Fonc (€/an)" T={T}><Input value={taxeHabitationAnnuelle} onChange={e => setTaxeHabitationAnnuelle(Number(e.target.value))} T={T} /></Field>
                <Field label="Frais installation (€)" T={T}><Input value={fraisInstallation} onChange={e => setFraisInstallation(Number(e.target.value))} T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Achat" icon={<ShieldCheck className="w-3.5 h-3.5" />} accent="emerald" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix (€)" T={T}><Input value={prixAchat} onChange={e => setPrixAchat(Number(e.target.value))} T={T} /></Field>
                <Field label="Votre part (%)" T={T}><Input value={partAchat} onChange={e => setPartAchat(Number(e.target.value))} T={T} /></Field>
                <Field label="Apport total (€)" T={T}><Input value={apport} onChange={e => setApport(Number(e.target.value))} T={T} /></Field>
                <Field label="Frais notaire (%)" T={T}><Input value={fraisNotairePourcent} onChange={e => setFraisNotairePourcent(Number(e.target.value))} T={T} /></Field>
                <Field label="Taux prêt (%)" T={T}><Input step="0.1" value={tauxEmprunt} onChange={e => setTauxEmprunt(Number(e.target.value))} T={T} /></Field>
                <Field label="Durée prêt (ans)" T={T}><Input value={dureeEmpruntAnnees} onChange={e => setDureeEmpruntAnnees(Number(e.target.value))} T={T} /></Field>
                <Field label="Charges co-pro (€/an)" T={T}><Input value={chargesAnnuellesAchat} onChange={e => setChargesAnnuellesAchat(Number(e.target.value))} T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Économie" icon={<TrendingUp className="w-3.5 h-3.5" />} accent="amber" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Inflation / an (%)" T={T}><Input step="0.1" value={inflationAnnuelle} onChange={e => setInflationAnnuelle(Number(e.target.value))} T={T} /></Field>
                <Field label="Plus-value immo (%)" T={T}><Input step="0.1" value={plusValueAnnuelle} onChange={e => setPlusValueAnnuelle(Number(e.target.value))} T={T} /></Field>
              </div>
            </SectionCard>

          </aside>

          {/* ── RÉSULTATS ── */}
          <main className="xl:col-span-9 space-y-8">

            {/* CARTES RÉSUMÉ */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              {visibleScenarios.map(s => {
                const c = SCENARIO_COLORS[s.id];
                const isBest = s.id === best.id;
                return (
                  <div key={`card-${s.id}`} className={`relative rounded-2xl p-4 border ${T.card} ${c.border} ${isBest ? 'ring-2 ' + c.border : ''}`}>
                    {isBest && (
                      <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${c.badge}`}>
                        Optimal
                      </span>
                    )}
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${c.bg} bg-opacity-20`}>
                      <span className={c.text}>{s.icon}</span>
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider leading-tight mb-1 ${T.textMuted}`}>{s.title}</p>
                    <p className={`text-xl font-black ${c.text}`}>{formatEuro(s.coutNet)}</p>
                    <p className={`text-[10px] mt-0.5 ${T.textFaint}`}>{formatEuro(s.coutNet / dureeAnnees)} / an</p>
                  </div>
                );
              })}
            </div>

            {/* GRAPHIQUE */}
            {/* GRAPHIQUE */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setChartOpen(o => !o)}
                className={`w-full flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition ${T.cardHover}`}
              >
                <h2 className={`text-sm font-black flex items-center gap-2 ${T.textPrimary}`}>
                  <BarChart3 className="w-4 h-4 text-indigo-400" /> Synthèse des coûts
                </h2>
                <div className="flex items-center gap-4">
                  <div className={`flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider ${T.chartLegend}`}>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block"></span>Transport</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 inline-block"></span>Hébergement & Frais</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span>Nourriture</span>
                    <span className={`flex items-center gap-1.5 pl-3 border-l ${T.legendBorder}`}>
                      <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400 inline-block relative overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)' }}></span>
                      <span className={T.capitalText}>Capital récupéré</span>
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${T.chevron} ${chartOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {chartOpen && <div className="px-6 pb-6 space-y-5">
                {visibleScenarios.map(s => {
                  const c = SCENARIO_COLORS[s.id];
                  const totalBarWidth = (s.tresorerie / maxVal) * 100;
                  const isBest = s.id === best.id;
                  return (
                    <div key={`chart-${s.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.bg} bg-opacity-15`}>
                            <span className={c.text}>{s.icon}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${T.textPrimary}`}>{s.title}</span>
                              {isBest && <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${c.badge}`}>Optimal</span>}
                            </div>
                            <span className={`text-[10px] ${T.textFaint}`}>
                              {s.trajetsParAn} trajets / an
                              {s.id === 'tgv' && s.trajetsParAn > 250 && <span className="text-amber-400 ml-1">⚠ Forfait MAX de 250 dépassé</span>}
                              {s.id === 'tgv-liberte' && <span className="ml-1">× {formatEuroExact(prixBilletCarteLiberte)}/trajet</span>}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-black ${c.text}`}>{formatEuro(s.coutNet)}</span>
                          <p className={`text-[10px] ${T.textFaint}`}>{formatEuroExact(s.coutNet / (dureeAnnees * 12))} / mois</p>
                        </div>
                      </div>
                      <div className={`relative h-6 w-full rounded-lg overflow-hidden ${T.barBg}`}>
                        <div className="flex h-full transition-all duration-700 ease-out" style={{ width: `${totalBarWidth}%` }}>
                          <div className="bg-sky-500 h-full" style={{ width: `${(s.transport / s.tresorerie) * 100}%` }}></div>
                          <div className="bg-indigo-500 h-full relative" style={{ width: `${((s.base + s.chargesP + s.chargesV + s.tax + s.inst + s.notaire + s.app) / s.tresorerie) * 100}%` }}>
                            {s.id === 'achat' && (
                              <div className="absolute top-0 right-0 h-full" style={{ width: `${(s.recuperation / (s.base + s.chargesP + s.chargesV + s.tax + s.inst + s.notaire + s.app)) * 100}%`, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.15), rgba(255,255,255,0.15) 3px, transparent 3px, transparent 7px)' }}></div>
                            )}
                          </div>
                          <div className="bg-amber-500 h-full" style={{ width: `${(s.food / s.tresorerie) * 100}%` }}></div>
                        </div>
                      </div>
                      {s.id === 'achat' && (
                        <p className={`text-[10px] mt-1 text-right ${T.capitalText}`}>
                          Capital récupéré à la revente : {formatEuro(s.recuperation)} (zone hachurée)
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>}
            </div>

            {/* TABLEAU TOTAL */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setDetailOpen(o => !o)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${T.cardHover}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${T.textPrimary}`}>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Détail des coûts
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${detailOpen ? 'rotate-180' : ''}`} />
              </button>
              {detailOpen && <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                <thead>
                  <tr className={`border-b ${T.border}`}>
                    <th className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest ${T.tableHeader}`}></th>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <th key={s.id} className="px-4 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${c.badge}`}>
                            {s.icon} {s.title}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className={`divide-y ${T.divider} text-sm`}>
                  {/* Trajets */}
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Trajets TGV / an</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <td key={`tj-${s.id}`} className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${c.badge}`}>{s.trajetsParAn}</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Transport (total)</td>
                    {visibleScenarios.map(s => <td key={`t-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{formatEuro(s.transport)}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Abonnement TGV</td>
                    {visibleScenarios.map(s => <td key={`tab-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportAbonnement > 0 ? formatEuro(s.transportAbonnement) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Billets (à l'unité)</td>
                    {visibleScenarios.map(s => <td key={`tbi-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportBillets > 0 ? formatEuro(s.transportBillets) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Navigo</td>
                    {visibleScenarios.map(s => <td key={`tnav-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{formatEuro(s.transportNavigo)}</td>)}
                  </tr>
                  {/* Hébergement */}
                  <tr>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Loyer / Mensualités</td>
                    {visibleScenarios.map(s => <td key={`b-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.base > 0 ? formatEuro(s.base) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium flex items-center gap-1.5 ${T.textMuted}`}>Charges co-pro / entretien <Info className={`w-3 h-3 ${T.infoIcon}`} /></td>
                    {visibleScenarios.map(s => <td key={`cp-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesP > 0 ? formatEuro(s.chargesP) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Charges de vie (Élec / Web / Assur)</td>
                    {visibleScenarios.map(s => <td key={`cv-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesV > 0 ? formatEuro(s.chargesV) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Taxes (Habitation / Foncière)</td>
                    {visibleScenarios.map(s => <td key={`tx-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.tax > 0 ? formatEuro(s.tax) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAmber}>
                    <td className={`px-5 py-3 font-medium ${T.amberRow}`}>Nourriture sur place</td>
                    {visibleScenarios.map(s => <td key={`fd-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.food > 0 ? formatEuro(s.food) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Notaire + Apport initial</td>
                    {visibleScenarios.map(s => <td key={`ap-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.notaire + s.app > 0 ? formatEuro(s.notaire + s.app) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  {/* Total */}
                  <tr className={`border-t-2 ${T.rowTotal}`}>
                    <td className={`px-5 py-4 text-xs font-black uppercase tracking-widest ${T.textPrimary}`}>Coût net réel</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return <td key={`cn-${s.id}`} className={`px-4 py-4 text-center text-xl font-black ${c.text}`}>{formatEuro(s.coutNet)}</td>;
                    })}
                  </tr>
                  <tr className={T.rowTotalAlt}>
                    <td className={`px-5 py-3 text-xs ${T.textFaint}`}>Soit par an (lissé)</td>
                    {visibleScenarios.map(s => <td key={`ca-${s.id}`} className={`px-4 py-3 text-center text-sm font-bold ${T.textSecondary}`}>{formatEuro(s.coutNet / dureeAnnees)}</td>)}
                  </tr>
                </tbody>
              </table>
              </div>}
            </div>

            {/* TABLEAU ANNUEL */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setAnnuelOpen(o => !o)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${T.cardHover}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${T.textPrimary}`}>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Coûts lissés / an
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${annuelOpen ? 'rotate-180' : ''}`} />
              </button>
              {annuelOpen && <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                <thead>
                  <tr className={`border-b ${T.border}`}>
                    <th className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest ${T.tableHeader}`}></th>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <th key={`a-${s.id}`} className="px-4 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${c.badge}`}>
                            {s.icon} {s.title}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className={`divide-y ${T.divider} text-sm`}>
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Trajets TGV / an</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <td key={`atj-${s.id}`} className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${c.badge}`}>{s.trajetsParAn}</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Transport / an (total)</td>
                    {visibleScenarios.map(s => <td key={`at-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{formatEuroExact(s.transport / dureeAnnees)}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Abonnement TGV</td>
                    {visibleScenarios.map(s => <td key={`atab-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportAbonnement > 0 ? formatEuroExact(s.transportAbonnement / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Billets (à l'unité)</td>
                    {visibleScenarios.map(s => <td key={`atbi-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportBillets > 0 ? formatEuroExact(s.transportBillets / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Navigo</td>
                    {visibleScenarios.map(s => <td key={`atnav-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{formatEuroExact(s.transportNavigo / dureeAnnees)}</td>)}
                  </tr>
                  <tr>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Loyer / Mensualités</td>
                    {visibleScenarios.map(s => <td key={`ab-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.base > 0 ? formatEuroExact(s.base / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium flex items-center gap-1.5 ${T.textMuted}`}>Charges co-pro / entretien <Info className={`w-3 h-3 ${T.infoIcon}`} /></td>
                    {visibleScenarios.map(s => <td key={`acp-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesP > 0 ? formatEuroExact(s.chargesP / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Charges de vie (Élec / Web / Assur)</td>
                    {visibleScenarios.map(s => <td key={`acv-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesV > 0 ? formatEuroExact(s.chargesV / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Taxes (Habitation / Foncière)</td>
                    {visibleScenarios.map(s => <td key={`atx-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.tax > 0 ? formatEuroExact(s.tax / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAmber}>
                    <td className={`px-5 py-3 font-medium ${T.amberRow}`}>Nourriture sur place</td>
                    {visibleScenarios.map(s => <td key={`afd-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.food > 0 ? formatEuroExact(s.food / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Notaire + Apport (lissé)</td>
                    {visibleScenarios.map(s => <td key={`aap-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.notaire + s.app > 0 ? formatEuroExact((s.notaire + s.app) / dureeAnnees) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={`border-t-2 ${T.rowTotal}`}>
                    <td className={`px-5 py-4 text-xs font-black uppercase tracking-widest ${T.textPrimary}`}>Coût net annuel</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return <td key={`acn-${s.id}`} className={`px-4 py-4 text-center text-xl font-black ${c.text}`}>{formatEuroExact(s.coutNet / dureeAnnees)}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
              </div>}
            </div>

            {/* TABLEAU MENSUEL */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setMensuelOpen(o => !o)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${T.cardHover}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${T.textPrimary}`}>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Coûts lissés / mois
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${mensuelOpen ? 'rotate-180' : ''}`} />
              </button>
              {mensuelOpen && <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                <thead>
                  <tr className={`border-b ${T.border}`}>
                    <th className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest ${T.tableHeader}`}></th>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <th key={`m-${s.id}`} className="px-4 py-4 text-center">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black ${c.badge}`}>
                            {s.icon} {s.title}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className={`divide-y ${T.divider} text-sm`}>
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Trajets TGV / mois</td>
                    {visibleScenarios.map(s => <td key={`mtj-${s.id}`} className={`px-4 py-3 text-center font-medium ${T.textSecondary}`}>{Math.round(s.trajetsParAn / 12)}</td>)}
                  </tr>
                   <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Transport / mois (total)</td>
                    {visibleScenarios.map(s => <td key={`mt-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{formatEuroExact(s.transport / (dureeAnnees * 12))}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Abonnement TGV</td>
                    {visibleScenarios.map(s => <td key={`mtab-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportAbonnement > 0 ? formatEuroExact(s.transportAbonnement / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Billets (à l'unité)</td>
                    {visibleScenarios.map(s => <td key={`mtbi-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportBillets > 0 ? formatEuroExact(s.transportBillets / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Navigo</td>
                    {visibleScenarios.map(s => <td key={`mtnav-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{formatEuroExact(s.transportNavigo / (dureeAnnees * 12))}</td>)}
                  </tr>
                  <tr>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Loyer / Mensualités</td>
                    {visibleScenarios.map(s => <td key={`mb-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.base > 0 ? formatEuroExact(s.base / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium flex items-center gap-1.5 ${T.textMuted}`}>Charges co-pro / entretien <Info className={`w-3 h-3 ${T.infoIcon}`} /></td>
                    {visibleScenarios.map(s => <td key={`mcp-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesP > 0 ? formatEuroExact(s.chargesP / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Charges de vie (Élec / Web / Assur)</td>
                    {visibleScenarios.map(s => <td key={`mcv-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesV > 0 ? formatEuroExact(s.chargesV / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Taxes (Habitation / Foncière)</td>
                    {visibleScenarios.map(s => <td key={`mtx-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.tax > 0 ? formatEuroExact(s.tax / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAmber}>
                    <td className={`px-5 py-3 font-medium ${T.amberRow}`}>Nourriture sur place</td>
                    {visibleScenarios.map(s => <td key={`mfd-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.food > 0 ? formatEuroExact(s.food / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Notaire + Apport (lissé)</td>
                    {visibleScenarios.map(s => <td key={`map-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.notaire + s.app > 0 ? formatEuroExact((s.notaire + s.app) / (dureeAnnees * 12)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={`border-t-2 ${T.rowTotal}`}>
                    <td className={`px-5 py-4 text-xs font-black uppercase tracking-widest ${T.textPrimary}`}>Coût net mensuel</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return <td key={`mcn-${s.id}`} className={`px-4 py-4 text-center text-xl font-black ${c.text}`}>{formatEuroExact(s.coutNet / (dureeAnnees * 12))}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
              </div>}
            </div>

            {/* NOTE */}
            <div className={`flex gap-3 rounded-2xl p-5 text-xs border ${T.note}`}>
              <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${T.noteIcon}`} />
              <p>
                <span className={`font-semibold ${T.noteLabel}`}>Focus charges :</span> Le simulateur intègre les charges de copropriété (achat), les charges de vie (électricité, internet, assurance) et les taxes locales. Pour l'achat à deux, ces frais sont divisés selon votre part, contrairement à la location personnelle à 100 %.
              </p>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
