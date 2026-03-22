import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    setValue(prev => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  };
  return [value, setStored];
}

function Tooltip({ text, T }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);

  const show = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.top + window.scrollY, left: r.left + window.scrollX });
    }
    setVisible(true);
  };
  const hide = () => setVisible(false);

  // Fermer si scroll ou resize
  useEffect(() => {
    if (!visible) return;
    const close = () => setVisible(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [visible]);

  const TOOLTIP_W = 224; // w-56 = 14rem = 224px
  // On calcule la position après rendu en utilisant la ref du bouton
  // La bulle apparaît à gauche du bouton si elle dépasse à droite, sinon à droite
  const leftPos = pos.left + 8; // légèrement à droite du bouton par défaut
  const adjustedLeft = Math.min(leftPos, window.innerWidth - TOOLTIP_W - 12);

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => visible ? hide() : show()}
        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition ${T.isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {visible && ReactDOM.createPortal(
        <span
          style={{ position: 'absolute', top: pos.top - 8, left: adjustedLeft, transform: 'translateY(-100%)', width: TOOLTIP_W }}
          className={`z-[9999] rounded-lg px-3 py-2 text-[11px] leading-relaxed shadow-xl pointer-events-none ${T.isDark ? 'bg-slate-700 text-slate-200 border border-slate-600' : 'bg-white text-slate-700 border border-slate-200'}`}
        >
          {text}
        </span>,
        document.body
      )}
    </span>
  );
}

function Field({ label, tooltip, children, T }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${T.label}`}>
        {label}
        {tooltip && <Tooltip text={tooltip} T={T} />}
      </label>
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

function Input({ value, onChange, step, suffix, T }) {
  if (!suffix) {
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
  return (
    <div className={`flex items-center rounded-lg border text-sm font-medium overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition ${T.input}`}>
      <input
        type="number"
        step={step}
        value={value}
        onChange={onChange}
        className="flex-1 min-w-0 px-3 py-2 bg-transparent focus:outline-none"
      />
      <span className={`px-2 py-2 text-xs font-bold select-none ${T.textFaint}`}>{suffix}</span>
    </div>
  );
}

function SectionCard({ title, icon, accent = 'indigo', children, defaultOpen = true, storageKey, T }) {
  const [open, setOpen] = storageKey ? useLocalStorage(storageKey, defaultOpen) : useState(defaultOpen);
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
  const [taxeHabitationLocationAnnuelle, setTaxeHabitationLocationAnnuelle] = useLocalStorage('taxeHabitationLocationAnnuelle', 500);
  const [taxeHabitationAchatAnnuelle, setTaxeHabitationAchatAnnuelle] = useLocalStorage('taxeHabitationAchatAnnuelle', 500);
  const [chargesAnnexesLocationMensuelles, setChargesAnnexesLocationMensuelles] = useLocalStorage('chargesAnnexesLocationMensuelles', 100);
  const [chargesAnnexesAchatMensuelles, setChargesAnnexesAchatMensuelles] = useLocalStorage('chargesAnnexesAchatMensuelles', 100);

  // Paramètres Économiques
  const [inflationAnnuelle, setInflationAnnuelle] = useLocalStorage('inflationAnnuelle', 2);
  const [plusValueAnnuelle, setPlusValueAnnuelle] = useLocalStorage('plusValueAnnuelle', 1);
  const [fraisInstallation, setFraisInstallation] = useLocalStorage('fraisInstallation', 3000);
  const [fraisAgenceRevente, setFraisAgenceRevente] = useLocalStorage('fraisAgenceRevente', 5);
  const [fraisDiagnostics, setFraisDiagnostics] = useLocalStorage('fraisDiagnostics', 1000);
  const [travauxAchat, setTravauxAchat] = useLocalStorage('travauxAchat', 0);
  const [travauxRevente, setTravauxRevente] = useLocalStorage('travauxRevente', 0);
  const [dureeDetentionAnnees, setDureeDetentionAnnees] = useLocalStorage('dureeDetentionAnnees', 20);

  // Paramètres Location après pendularité
  const [loyerPercuMensuel, setLoyerPercuMensuel] = useLocalStorage('loyerPercuMensuel', 700);
  const [assurancePNOMensuelle, setAssurancePNOMensuelle] = useLocalStorage('assurancePNOMensuelle', 20);
  const [fraisGestionLocative, setFraisGestionLocative] = useLocalStorage('fraisGestionLocative', 8);
  const [vacanceLocative, setVacanceLocative] = useLocalStorage('vacanceLocative', 5);
  const [tmi, setTmi] = useLocalStorage('tmi', 30);

  // Paramètres Frais réels (défiscalisation salarié)
  const [salaireBrutAnnuel, setSalaireBrutAnnuel] = useLocalStorage('salaireBrutAnnuel', 80000);
  const [doubleResidenceDeductible, setDoubleResidenceDeductible] = useLocalStorage('doubleResidenceDeductible', true);

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
    const chargesVieTotaleLocation = calculerTotalInflate(chargesAnnexesLocationMensuelles * 12, dureeAnnees, inf);
    const chargesVieTotaleAchat = calculerTotalInflate(chargesAnnexesAchatMensuelles * 12, dureeAnnees, inf);
    const taxesTotalesLocation = calculerTotalInflate(taxeHabitationLocationAnnuelle, dureeAnnees, inf);
    const taxesTotalesAchat = calculerTotalInflate(taxeHabitationAchatAnnuelle, dureeAnnees, inf);

    const coutTgvQuotidien = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const arParSemaine = joursParSemaine - nuitsParSemaine;

    const trajetsParAnTgv = arParSemaine * 2 * semainesParAn;

    const coutCarteLiberteAbonnement = calculerTotalInflate(abonnementCarteLiberteAnnuel, dureeAnnees, inf);
    const coutCarteLiberteTrajetParAn = prixBilletCarteLiberte * trajetsParAnTgv;
    const coutCarteLiberteTransport = coutCarteLiberteAbonnement + calculerTotalInflate(coutCarteLiberteTrajetParAn, dureeAnnees, inf);

    const coutTransportHotelTotal = calculerTotalInflate(abonnementTgvMensuel * 12, dureeAnnees, inf);
    const coutHotelTotal = calculerTotalInflate(prixNuitHotel * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const repasHotelTotal = calculerTotalInflate(budgetRepasHotelJour * nuitsParSemaine * semainesParAn, dureeAnnees, inf);
    const trajetsParAnHebdo = trajetsParAnTgv;

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
    const chargesViePart = chargesVieTotaleAchat * ratioAchat;
    const taxesPart = taxesTotalesAchat * ratioAchat;
    const installationPart = fraisInstallation * ratioAchat;
    const travauxAchatPart = travauxAchat * ratioAchat;
    const apportPart = apport * ratioAchat;
    const notairePart = fraisNotaireTotal * ratioAchat;

    const prixReventeFinal = prixAchat * Math.pow(1 + plusValueAnnuelle / 100, dureeDetentionAnnees);

    // Frais de revente
    const fraisAgenceMontant = prixReventeFinal * (fraisAgenceRevente / 100);

    // Capital restant dû au moment de la revente (basé sur dureeDetentionAnnees)
    const moisDetention = dureeDetentionAnnees * 12;
    const capitalRestantDuRevente = montantEmprunte * (Math.pow(1 + rMensuel, nTotalMois) - Math.pow(1 + rMensuel, Math.min(moisDetention, nTotalMois))) / (Math.pow(1 + rMensuel, nTotalMois) - 1);

    // Impôt sur plus-value résidence secondaire
    const plusValueBrute = Math.max(0, prixReventeFinal - prixAchat - fraisNotaireTotal);
    // Abattement IR : 0% années 1-5, 6%/an années 6-21, 4% année 22, exo à partir 22 ans
    const abattementIR = (() => {
      if (dureeDetentionAnnees >= 22) return 1;
      if (dureeDetentionAnnees <= 5) return 0;
      const annees6a21 = Math.min(dureeDetentionAnnees, 21) - 5;
      const annee22 = dureeDetentionAnnees === 22 ? 1 : 0;
      return Math.min(annees6a21 * 0.06 + annee22 * 0.04, 1);
    })();
    // Abattement PS : 0% années 1-5, 1,65%/an années 6-21, 1,60% année 22, 9%/an années 23-30, exo 30 ans
    const abattementPS = (() => {
      if (dureeDetentionAnnees >= 30) return 1;
      if (dureeDetentionAnnees <= 5) return 0;
      const annees6a21 = Math.min(dureeDetentionAnnees, 21) - 5;
      const annee22 = dureeDetentionAnnees >= 22 ? 1 : 0;
      const annees23a30 = dureeDetentionAnnees >= 23 ? Math.min(dureeDetentionAnnees, 30) - 22 : 0;
      return Math.min(annees6a21 * 0.0165 + annee22 * 0.016 + annees23a30 * 0.09, 1);
    })();
    const plusValueImposableIR = plusValueBrute * (1 - abattementIR);
    const plusValueImposablePS = plusValueBrute * (1 - abattementPS);
    const impotPlusValue = plusValueImposableIR * 0.19 + plusValueImposablePS * 0.172;

    const fraisReventeTotal = (fraisAgenceMontant + impotPlusValue + fraisDiagnostics + travauxRevente) * ratioAchat;

    // Revenus locatifs sur la période entre fin de pendularité et revente
    const dureeLocationAnnees = Math.max(0, dureeDetentionAnnees - dureeAnnees);
    // Loyer brut annuel avec taux d'occupation et inflation, à partir de l'année dureeAnnees
    let revenusBrutsTotal = 0;
    let assurancePNOTotal = 0;
    let loyerCourant = loyerPercuMensuel * 12 * Math.pow(1 + inf / 100, dureeAnnees); // loyer indexé au début de la mise en location
    let pnoCourant = assurancePNOMensuelle * 12 * Math.pow(1 + inf / 100, dureeAnnees);
    for (let i = 0; i < dureeLocationAnnees; i++) {
      revenusBrutsTotal += loyerCourant * (1 - vacanceLocative / 100);
      assurancePNOTotal += pnoCourant;
      loyerCourant *= (1 + inf / 100);
      pnoCourant *= (1 + inf / 100);
    }
    // Frais gestion locative
    const fraisGestionTotal = revenusBrutsTotal * (fraisGestionLocative / 100);
    // Revenus nets avant impôt (loyers bruts - frais gestion - PNO)
    const revenusNetsAvantImpot = revenusBrutsTotal - fraisGestionTotal - assurancePNOTotal;
    // Micro-foncier : abattement 30%, puis TMI + 17,2% PS sur 70%
    const revenusImposables = revenusNetsAvantImpot * 0.70;
    const impotRevenusLocatifs = revenusImposables * ((tmi + 17.2) / 100);
    // Revenus nets après impôt (part propriétaire)
    const revenusLocatifsNets = (revenusNetsAvantImpot - impotRevenusLocatifs) * ratioAchat;

    const capitalRecuperePart = (prixReventeFinal - capitalRestantDuRevente - fraisAgenceMontant - impotPlusValue - fraisDiagnostics - travauxRevente) * ratioAchat;

    const createScenario = (id, title, icon, color, transportAbonnement, transportBillets, transportNavigo, base, chargesP, chargesV, tax, inst, food, notaire, app, desc, trajets, available = true) => {
      const transport = transportAbonnement + transportBillets + transportNavigo;
      const tresorerie = transport + base + chargesP + chargesV + tax + inst + food + notaire + app;
      const coutNet = tresorerie
        - (id === 'achat' ? capitalRecuperePart : 0)
        - (id === 'achat' ? revenusLocatifsNets : 0);
      return {
        id, title, icon, color, transport, transportAbonnement, transportBillets, transportNavigo,
        base, chargesP, chargesV, tax, inst, food, notaire, app,
        tresorerie, recuperation: id === 'achat' ? capitalRecuperePart : 0,
        prixRevente: id === 'achat' ? prixReventeFinal : 0,
        fraisRevente: id === 'achat' ? fraisReventeTotal : 0,
        fraisAgence: id === 'achat' ? fraisAgenceMontant * ratioAchat : 0,
        impotPlusValue: id === 'achat' ? impotPlusValue * ratioAchat : 0,
        diagnostics: id === 'achat' ? fraisDiagnostics * ratioAchat : 0,
        travauxRevente: id === 'achat' ? travauxRevente * ratioAchat : 0,
        travauxAchat: id === 'achat' ? travauxAchatPart : 0,
        abattementIR: id === 'achat' ? abattementIR : 0,
        abattementPS: id === 'achat' ? abattementPS : 0,
        plusValueBrute: id === 'achat' ? plusValueBrute : 0,
        // Revenus locatifs (scénario achat uniquement)
        revenusLocatifsNets: id === 'achat' ? revenusLocatifsNets : 0,
        revenusBrutsTotal: id === 'achat' ? revenusBrutsTotal * ratioAchat : 0,
        fraisGestionTotal: id === 'achat' ? fraisGestionTotal * ratioAchat : 0,
        assurancePNOTotal: id === 'achat' ? assurancePNOTotal * ratioAchat : 0,
        impotRevenusLocatifs: id === 'achat' ? impotRevenusLocatifs * ratioAchat : 0,
        coutNet, trajetsParAn: trajets, desc, available
      };
    };

    // ── Frais réels déductibles par scénario (régime salarié) ──
    // Abattement forfaitaire 10% plafonné à 14 171 € (barème 2024)
    const PLAFOND_ABATTEMENT_10 = 14171;
    const abattementForfaitaireAn = Math.min(salaireBrutAnnuel * 0.10, PLAFOND_ABATTEMENT_10);

    // Transport déductible annuel (A/R domicile-travail) — 1ère année, non inflaté
    const navigoAn = passLocalMensuel * 12;
    const tgvAboAn = abonnementTgvMensuel * 12;
    const liberteAboAn = abonnementCarteLiberteAnnuel;
    const liberteBilletsAn = prixBilletCarteLiberte * trajetsParAnTgv;

    // Hébergement déductible (double résidence)
    const hotelAn = prixNuitHotel * nuitsParSemaine * semainesParAn;
    const loyerAn = loyerMensuel * 12;
    const fraisNotaireCalc = prixAchat * (fraisNotairePourcent / 100);
    const montantEmprunteCalc = prixAchat + fraisNotaireCalc - apport;
    const rMensuelCalc = (tauxEmprunt / 100) / 12;
    const nTotalMoisCalc = dureeEmpruntAnnees * 12;
    const mensualiteCalc = montantEmprunteCalc * (rMensuelCalc * Math.pow(1 + rMensuelCalc, nTotalMoisCalc)) / (Math.pow(1 + rMensuelCalc, nTotalMoisCalc) - 1);
    const mensualitesAn = mensualiteCalc * 12 * (partAchat / 100);

    // Repas déductibles (surcoût lié à l'éloignement du domicile fiscal)
    const repasHotelAn = budgetRepasHotelJour * nuitsParSemaine * semainesParAn;
    const repasAppartAn = budgetRepasAppartJour * nuitsParSemaine * semainesParAn;

    const calcFraisReels = (transportAn, hebergementAn, repasAn) => {
      const totalAn = transportAn + hebergementAn + repasAn;
      const gainAn = Math.max(0, totalAn - abattementForfaitaireAn);
      const economieAn = gainAn * (tmi / 100);
      const totalDuree = totalAn * dureeAnnees;
      const gainDuree = Math.max(0, totalDuree - abattementForfaitaireAn * dureeAnnees);
      const economieDuree = gainDuree * (tmi / 100);
      return { transportAn, hebergementAn, repasAn, totalAn, abattementForfaitaireAn, gainAn, economieAn, totalDuree, gainDuree, economieDuree };
    };

    const fraisReelsMap = {
      'tgv':         calcFraisReels(tgvAboAn + navigoAn,               0,                                      0),
      'tgv-liberte': calcFraisReels(liberteAboAn + liberteBilletsAn + navigoAn, 0,                             0),
      'hotel':       calcFraisReels(tgvAboAn + navigoAn,               doubleResidenceDeductible ? hotelAn : 0,      repasHotelAn),
      'location':    calcFraisReels(tgvAboAn + navigoAn,               doubleResidenceDeductible ? loyerAn : 0,      repasAppartAn),
      'achat':       calcFraisReels(tgvAboAn + navigoAn,               doubleResidenceDeductible ? mensualitesAn : 0, repasAppartAn),
    };

    return [
      createScenario('tgv',         'TGV Quotidien (MAX ACTIF)',    <Train className="w-4 h-4" />, 'sky',     coutTgvQuotidien,              0,                                                            coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, "Abonnement illimité (max 250 trajets).", trajetsParAnTgv),
      createScenario('tgv-liberte', 'TGV Quotidien (Carte Liberté)',<Train className="w-4 h-4" />, 'teal',    coutCarteLiberteAbonnement,    calculerTotalInflate(coutCarteLiberteTrajetParAn, dureeAnnees, inf), coutNavigoTotal, 0, 0, 0, 0, 0, 0, 0, 0, `Abo. ${abonnementCarteLiberteAnnuel}€/an + ${prixBilletCarteLiberte}€/trajet.`, trajetsParAnTgv),
      createScenario('hotel',       'Hôtel',                        <Bed className="w-4 h-4" />,   'orange',  coutTransportHotelTotal,       0,                                                            coutNavigoTotal, coutHotelTotal, 0, 0, 0, 0, repasHotelTotal, 0, 0, "A/R hebdo + Hôtel.", trajetsParAnHebdo, nuitsParSemaine > 0),
      createScenario('location',    'Location',                     <Building className="w-4 h-4" />,'purple', coutTransportHotelTotal,       0,                                                            coutNavigoTotal, coutLocationTotal, 0, chargesVieTotaleLocation, taxesTotalesLocation, fraisInstallation, repasAppartTotal, 0, 0, "Loyer + A/R hebdo.", trajetsParAnHebdo, nuitsParSemaine > 0),
      createScenario('achat',       'Achat',                        <Home className="w-4 h-4" />,  'emerald', coutTransportHotelTotal,       0,                                                            coutNavigoTotal, mensuPart, chargesProprioPart, chargesViePart, taxesPart, installationPart, repasAppartTotal, notairePart + travauxAchatPart, apportPart, `Part ${partAchat}% + Revente.`, trajetsParAnHebdo, nuitsParSemaine > 0),
    ].map(s => ({ ...s, fraisReels: fraisReelsMap[s.id] }));
  }, [
    dureeAnnees, joursParSemaine, semainesParAn, nuitsParSemaine,
    abonnementTgvMensuel, abonnementCarteLiberteAnnuel, prixBilletCarteLiberte, prixNuitHotel, loyerMensuel,
    prixAchat, partAchat, apport, fraisNotairePourcent, tauxEmprunt, dureeEmpruntAnnees, chargesAnnuellesAchat,
    passLocalMensuel, budgetRepasHotelJour, budgetRepasAppartJour, taxeHabitationLocationAnnuelle, taxeHabitationAchatAnnuelle, chargesAnnexesLocationMensuelles, chargesAnnexesAchatMensuelles,
    inflationAnnuelle, plusValueAnnuelle, fraisInstallation, fraisAgenceRevente, fraisDiagnostics, travauxAchat, travauxRevente, dureeDetentionAnnees,
    loyerPercuMensuel, assurancePNOMensuelle, fraisGestionLocative, vacanceLocative, tmi,
    salaireBrutAnnuel, doubleResidenceDeductible,
  ]);

  const arParSemaineCalc = joursParSemaine - nuitsParSemaine;

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

  const [activeIds, setActiveIds] = useLocalStorage('activeFilters', scenarios.map(s => s.id));
  const activeSet = new Set(activeIds);
  const [chartOpen, setChartOpen] = useLocalStorage('accordionChart', true);
  const [detailOpen, setDetailOpen] = useLocalStorage('accordionDetail', true);
  const [annuelOpen, setAnnuelOpen] = useLocalStorage('accordionAnnuel', true);
  const [mensuelOpen, setMensuelOpen] = useLocalStorage('accordionMensuel', true);
  const [semaineOpen, setSemaineOpen] = useLocalStorage('accordionSemaine', true);
  const [fraisReelsOpen, setFraisReelsOpen] = useLocalStorage('accordionFraisReels', true);
  const toggleScenario = (id) => {
    setActiveIds(prev => {
      const prevArr = Array.isArray(prev) ? prev : Array.from(prev);
      if (prevArr.length === 1 && prevArr.includes(id)) return prevArr;
      return prevArr.includes(id) ? prevArr.filter(x => x !== id) : [...prevArr, id];
    });
  };

  const visibleScenarios = scenarios.filter(s => s.available && activeSet.has(s.id));
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
              const isActive = activeSet.has(s.id);
              const isBest = isActive && s.available && s.id === best.id;
              if (!s.available) return null;
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
          <aside className="xl:col-span-3 space-y-4 xl:sticky xl:top-20 xl:self-start xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">

            <SectionCard title="Rythme" icon={<Calculator className="w-3.5 h-3.5" />} accent="indigo" storageKey="sectionRythme" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Durée (ans)" T={T}>
                  <Select value={dureeAnnees} onChange={e => setDureeAnnees(Number(e.target.value))} options={[1,2,3,4,5,6,7,8,9,10,12,15,20,25,30].map(v => ({ value: v, label: `${v} ans` }))} T={T} />
                </Field>
                <Field label="Semaines / an" T={T}>
                  <Select value={semainesParAn} onChange={e => setSemainesParAn(Number(e.target.value))} options={Array.from({length: 52}, (_, i) => i + 1).map(v => ({ value: v, label: `${v} sem.` }))} T={T} />
                </Field>
                <Field label="Jours Paris / sem" T={T}>
                  <Select value={joursParSemaine} onChange={e => {
                    const jours = Number(e.target.value);
                    setJoursParSemaine(jours);
                    if (nuitsParSemaine >= jours) setNuitsParSemaine(jours - 1);
                  }} options={[1,2,3].map(v => ({ value: v, label: `${v} jour${v > 1 ? 's' : ''}` }))} T={T} />
                </Field>
                <Field label="Nuits Paris / sem" T={T}>
                  <Select value={nuitsParSemaine} onChange={e => setNuitsParSemaine(Number(e.target.value))} options={Array.from({length: joursParSemaine}, (_, i) => i).map(v => ({ value: v, label: v === 0 ? 'Aucune' : `${v} nuit${v > 1 ? 's' : ''}` }))} T={T} />
                </Field>
              </div>
              <div className={`mt-1 rounded-lg px-3 py-2 text-[11px] flex items-center justify-between ${T.rowAlt}`}>
                <span className={T.textFaint}>A/R TGV / semaine (calculé)</span>
                <span className={`font-black text-indigo-400`}>{arParSemaineCalc} A/R</span>
              </div>
            </SectionCard>

            <SectionCard title="Transport" icon={<Train className="w-3.5 h-3.5" />} accent="sky" storageKey="sectionTransport" T={T}>
              <Field label="Navigo" T={T}><Input value={passLocalMensuel} onChange={e => setPassLocalMensuel(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
              <SubGroup label="TGV MAX ACTIF" color="sky" T={T} />
              <Field label="Abonnement" T={T}><Input value={abonnementTgvMensuel} onChange={e => setAbonnementTgvMensuel(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
              <SubGroup label="Carte Liberté" color="teal" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Abonnement" T={T}><Input value={abonnementCarteLiberteAnnuel} onChange={e => setAbonnementCarteLiberteAnnuel(Number(e.target.value))} suffix="€/an" T={T} /></Field>
                <Field label="Billet" T={T}><Input value={prixBilletCarteLiberte} onChange={e => setPrixBilletCarteLiberte(Number(e.target.value))} suffix="€/trajet" T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Hébergement & Vie" icon={<Utensils className="w-3.5 h-3.5" />} accent="orange" storageKey="sectionHebergement" T={T}>
              <SubGroup label="Hôtel" color="orange" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nuit" T={T}><Input value={prixNuitHotel} onChange={e => setPrixNuitHotel(Number(e.target.value))} suffix="€/j" T={T} /></Field>
                <Field label="Repas" T={T}><Input value={budgetRepasHotelJour} onChange={e => setBudgetRepasHotelJour(Number(e.target.value))} suffix="€/j" T={T} /></Field>
              </div>
              <SubGroup label="Location" color="purple" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Loyer" T={T}><Input value={loyerMensuel} onChange={e => setLoyerMensuel(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
                <Field label="Repas" T={T}><Input value={budgetRepasAppartJour} onChange={e => setBudgetRepasAppartJour(Number(e.target.value))} suffix="€/j" T={T} /></Field>
                <Field label="Élec / Web / Assur" T={T}><Input value={chargesAnnexesLocationMensuelles} onChange={e => setChargesAnnexesLocationMensuelles(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
                <Field label="Taxe Hab / Fonc" tooltip="Taxe d'habitation (si applicable) et taxe foncière annuelle sur le logement parisien." T={T}><Input value={taxeHabitationLocationAnnuelle} onChange={e => setTaxeHabitationLocationAnnuelle(Number(e.target.value))} suffix="€/an" T={T} /></Field>
                <Field label="Frais installation" T={T}><Input value={fraisInstallation} onChange={e => setFraisInstallation(Number(e.target.value))} suffix="€" T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Achat" icon={<ShieldCheck className="w-3.5 h-3.5" />} accent="emerald" storageKey="sectionAchat" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prix" T={T}><Input value={prixAchat} onChange={e => setPrixAchat(Number(e.target.value))} suffix="€" T={T} /></Field>
                <Field label="Votre part" T={T}><Input value={partAchat} onChange={e => setPartAchat(Number(e.target.value))} suffix="%" T={T} /></Field>
                <Field label="Apport total" T={T}><Input value={apport} onChange={e => setApport(Number(e.target.value))} suffix="€" T={T} /></Field>
                <Field label="Frais notaire" T={T}><Input value={fraisNotairePourcent} onChange={e => setFraisNotairePourcent(Number(e.target.value))} suffix="%" T={T} /></Field>
                <Field label="Taux prêt" T={T}><Input step="0.1" value={tauxEmprunt} onChange={e => setTauxEmprunt(Number(e.target.value))} suffix="%" T={T} /></Field>
                <Field label="Durée prêt" T={T}>
                  <Select value={dureeEmpruntAnnees} onChange={e => setDureeEmpruntAnnees(Number(e.target.value))} options={[5,7,10,12,15,20,25,30].map(v => ({ value: v, label: `${v} ans` }))} T={T} />
                </Field>
                <Field label="Charges co-pro" tooltip="Charges de copropriété annuelles : entretien des parties communes, gardien, syndic, travaux votés en AG." T={T}><Input value={chargesAnnuellesAchat} onChange={e => setChargesAnnuellesAchat(Number(e.target.value))} suffix="€/an" T={T} /></Field>
                <Field label="Élec / Web / Assur" T={T}><Input value={chargesAnnexesAchatMensuelles} onChange={e => setChargesAnnexesAchatMensuelles(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
                <Field label="Taxe Hab / Fonc" tooltip="Taxe d'habitation (si applicable) et taxe foncière annuelle sur le bien acheté." T={T}><Input value={taxeHabitationAchatAnnuelle} onChange={e => setTaxeHabitationAchatAnnuelle(Number(e.target.value))} suffix="€/an" T={T} /></Field>
                <Field label="Travaux à l'achat" T={T}><Input value={travauxAchat} onChange={e => setTravauxAchat(Number(e.target.value))} suffix="€" T={T} /></Field>
              </div>
              <SubGroup label="Mise en location" color="teal" T={T} />
              <p className={`text-[10px] -mt-2 ${T.textFaint}`}>
                {dureeDetentionAnnees > dureeAnnees
                  ? `Entre la fin de pendularité (${dureeAnnees} ans) et la revente (${dureeDetentionAnnees} ans) — ${dureeDetentionAnnees - dureeAnnees} an${dureeDetentionAnnees - dureeAnnees > 1 ? 's' : ''} de location.`
                  : `Aucune période de location (revente ≤ fin de pendularité).`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Loyer perçu" T={T}><Input value={loyerPercuMensuel} onChange={e => setLoyerPercuMensuel(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
                <Field label="Assurance PNO" tooltip="Assurance Propriétaire Non Occupant : obligatoire en copropriété, elle couvre les dommages causés au bien ou aux tiers quand le logement est vide ou loué." T={T}><Input value={assurancePNOMensuelle} onChange={e => setAssurancePNOMensuelle(Number(e.target.value))} suffix="€/mois" T={T} /></Field>
                <Field label="Frais gestion" tooltip="Commission prélevée par une agence pour gérer la location à ta place : recherche de locataires, encaissement des loyers, gestion des problèmes. Mettre 0% si tu gères toi-même." T={T}><Input step="0.5" value={fraisGestionLocative} onChange={e => setFraisGestionLocative(Number(e.target.value))} suffix="%" T={T} /></Field>
                <Field label="Vacance locative" tooltip="Pourcentage du temps annuel où le bien est inoccupé entre deux locataires. Réduit le loyer effectivement perçu. Typiquement 2-5% pour Paris." T={T}><Input step="1" value={vacanceLocative} onChange={e => setVacanceLocative(Number(e.target.value))} suffix="%" T={T} /></Field>
              </div>
              <SubGroup label="Revente" color="emerald" T={T} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Revente dans" T={T}>
                  <Select value={dureeDetentionAnnees} onChange={e => setDureeDetentionAnnees(Number(e.target.value))} options={[5,8,10,12,15,18,20,22,25,30].map(v => ({ value: v, label: `${v} ans` }))} T={T} />
                </Field>
                <Field label="Plus-value / an" T={T}><Input step="0.1" value={plusValueAnnuelle} onChange={e => setPlusValueAnnuelle(Number(e.target.value))} suffix="%/an" T={T} /></Field>
                <Field label="Frais agence" T={T}><Input step="0.5" value={fraisAgenceRevente} onChange={e => setFraisAgenceRevente(Number(e.target.value))} suffix="%" T={T} /></Field>
                <Field label="Diagnostics" tooltip="Diagnostics immobiliers obligatoires à la vente : DPE, amiante, électricité, gaz, etc. Comptez 500-1 500 € selon la surface et l'ancienneté du bien." T={T}><Input value={fraisDiagnostics} onChange={e => setFraisDiagnostics(Number(e.target.value))} suffix="€" T={T} /></Field>
                <Field label="Travaux avant revente" T={T}><Input value={travauxRevente} onChange={e => setTravauxRevente(Number(e.target.value))} suffix="€" T={T} /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Économie & Fiscalité" icon={<TrendingUp className="w-3.5 h-3.5" />} accent="amber" storageKey="sectionEconomie" T={T}>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Inflation" T={T}><Input step="0.1" value={inflationAnnuelle} onChange={e => setInflationAnnuelle(Number(e.target.value))} suffix="%/an" T={T} /></Field>
              </div>
              <SubGroup label="Frais réels (salarié)" color="amber" T={T} />
              <p className={`text-[10px] -mt-2 ${T.textFaint}`}>Calcul de l'économie d'impôt si tu optes pour les frais réels plutôt que l'abattement forfaitaire 10%.</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Salaire brut" T={T}><Input value={salaireBrutAnnuel} onChange={e => setSalaireBrutAnnuel(Number(e.target.value))} suffix="€/an" T={T} /></Field>
                <Field label="TMI" tooltip="Taux Marginal d'Imposition : le taux auquel est imposé le dernier euro de tes revenus. Tranches 2024 : 0%, 11%, 30%, 41%, 45%. Utilisé pour calculer l'impôt sur les revenus locatifs et l'économie liée aux frais réels." T={T}>
                  <Select value={tmi} onChange={e => setTmi(Number(e.target.value))} options={[0, 11, 30, 41, 45].map(v => ({ value: v, label: `${v} %` }))} T={T} />
                </Field>
              </div>
              <div className={`flex items-center justify-between rounded-lg px-3 py-2 mt-1 ${T.rowAlt}`}>
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${T.label}`}>Double résidence déductible</span>
                  <span className={`text-[10px] ${T.textFaint}`}>Loyer / hôtel / mensualités inclus dans les frais réels</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDoubleResidenceDeductible(v => !v)}
                  className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors ${doubleResidenceDeductible ? 'bg-amber-500' : (T.isDark ? 'bg-slate-700' : 'bg-slate-300')}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full shadow transition-transform ${doubleResidenceDeductible ? 'translate-x-5 bg-white' : 'translate-x-0.5 bg-white'}`} />
                </button>
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
                          Revente dans {dureeDetentionAnnees} ans : {formatEuro(s.prixRevente)} — Frais ({formatEuro(s.fraisRevente)}) — Capital net récupéré (part {partAchat}%) : {formatEuro(s.recuperation)}
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
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Notaire + Apport + Travaux achat</td>
                    {visibleScenarios.map(s => <td key={`ap-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.notaire + s.app > 0 ? formatEuro(s.notaire + s.app) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Notaire + Apport</td>
                    {visibleScenarios.map(s => <td key={`notapp-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.notaire + s.app - s.travauxAchat > 0 ? formatEuro(s.notaire + s.app - s.travauxAchat) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Travaux à l'achat</td>
                    {visibleScenarios.map(s => <td key={`trav-achat-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.travauxAchat > 0 ? formatEuro(s.travauxAchat) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.capitalText}`}>Prix de revente estimé</td>
                    {visibleScenarios.map(s => <td key={`rv-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.capitalText}`}>{s.prixRevente > 0 ? formatEuro(s.prixRevente) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Frais de revente (total)</td>
                    {visibleScenarios.map(s => <td key={`frt-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{s.fraisRevente > 0 ? formatEuro(-s.fraisRevente) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Frais d'agence ({fraisAgenceRevente}%)</td>
                    {visibleScenarios.map(s => <td key={`fra-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.fraisAgence > 0 ? formatEuro(-s.fraisAgence) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Impôt plus-value{visibleScenarios.find(s => s.id === 'achat') ? ` (abatt. IR ${Math.round(visibleScenarios.find(s => s.id === 'achat').abattementIR * 100)}% / PS ${Math.round(visibleScenarios.find(s => s.id === 'achat').abattementPS * 100)}%)` : ''}</td>
                    {visibleScenarios.map(s => <td key={`ipv-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.impotPlusValue > 0 ? formatEuro(-s.impotPlusValue) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Diagnostics</td>
                    {visibleScenarios.map(s => <td key={`diag-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.diagnostics > 0 ? formatEuro(-s.diagnostics) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Travaux avant revente</td>
                    {visibleScenarios.map(s => <td key={`trav-rev-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.travauxRevente > 0 ? formatEuro(-s.travauxRevente) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.capitalText}`}>Capital net récupéré</td>
                    {visibleScenarios.map(s => <td key={`cnr-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.capitalText}`}>{s.recuperation > 0 ? formatEuro(s.recuperation) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.capitalText}`}>Revenus locatifs nets</td>
                    {visibleScenarios.map(s => <td key={`rln-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.capitalText}`}>{s.revenusLocatifsNets > 0 ? formatEuro(s.revenusLocatifsNets) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Loyers bruts perçus</td>
                    {visibleScenarios.map(s => <td key={`rlb-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.revenusBrutsTotal > 0 ? formatEuro(s.revenusBrutsTotal) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Frais de gestion</td>
                    {visibleScenarios.map(s => <td key={`rfg-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.fraisGestionTotal > 0 ? formatEuro(-s.fraisGestionTotal) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Assurance PNO</td>
                    {visibleScenarios.map(s => <td key={`rpno-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.assurancePNOTotal > 0 ? formatEuro(-s.assurancePNOTotal) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Impôt (micro-foncier, TMI {tmi}%)</td>
                    {visibleScenarios.map(s => <td key={`ril-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.impotRevenusLocatifs > 0 ? formatEuro(-s.impotRevenusLocatifs) : <span className={T.textFaintest}>—</span>}</td>)}
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

            {/* TABLEAU HEBDOMADAIRE */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setSemaineOpen(o => !o)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${T.cardHover}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${T.textPrimary}`}>
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Coûts lissés / semaine
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${semaineOpen ? 'rotate-180' : ''}`} />
              </button>
              {semaineOpen && <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                <thead>
                  <tr className={`border-b ${T.border}`}>
                    <th className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest ${T.tableHeader}`}></th>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return (
                        <th key={`sw-${s.id}`} className="px-4 py-4 text-center">
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
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Trajets TGV / semaine</td>
                    {visibleScenarios.map(s => <td key={`swtj-${s.id}`} className={`px-4 py-3 text-center font-medium ${T.textSecondary}`}>{Math.round(s.trajetsParAn / semainesParAn)}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Transport / semaine (total)</td>
                    {visibleScenarios.map(s => <td key={`swt-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{formatEuroExact(s.transport / (dureeAnnees * semainesParAn))}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Abonnement TGV</td>
                    {visibleScenarios.map(s => <td key={`swtab-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportAbonnement > 0 ? formatEuroExact(s.transportAbonnement / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Billets (à l'unité)</td>
                    {visibleScenarios.map(s => <td key={`swtbi-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.transportBillets > 0 ? formatEuroExact(s.transportBillets / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAlt}>
                    <td className={`px-8 py-2 text-[10px] ${T.textFaint}`}>↳ Navigo</td>
                    {visibleScenarios.map(s => <td key={`swtnav-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{formatEuroExact(s.transportNavigo / (dureeAnnees * semainesParAn))}</td>)}
                  </tr>
                  <tr>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Loyer / Mensualités</td>
                    {visibleScenarios.map(s => <td key={`swb-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.base > 0 ? formatEuroExact(s.base / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium flex items-center gap-1.5 ${T.textMuted}`}>Charges co-pro / entretien <Info className={`w-3 h-3 ${T.infoIcon}`} /></td>
                    {visibleScenarios.map(s => <td key={`swcp-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesP > 0 ? formatEuroExact(s.chargesP / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Charges de vie (Élec / Web / Assur)</td>
                    {visibleScenarios.map(s => <td key={`swcv-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.chargesV > 0 ? formatEuroExact(s.chargesV / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowIndigo}>
                    <td className={`px-5 py-3 font-medium ${T.textMuted}`}>Taxes (Habitation / Foncière)</td>
                    {visibleScenarios.map(s => <td key={`swtx-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.tax > 0 ? formatEuroExact(s.tax / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowAmber}>
                    <td className={`px-5 py-3 font-medium ${T.amberRow}`}>Nourriture sur place</td>
                    {visibleScenarios.map(s => <td key={`swfd-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.food > 0 ? formatEuroExact(s.food / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={T.rowEmerald}>
                    <td className={`px-5 py-3 font-medium ${T.emeraldRow}`}>Notaire + Apport (lissé)</td>
                    {visibleScenarios.map(s => <td key={`swap-${s.id}`} className={`px-4 py-3 text-center ${T.textSecondary}`}>{s.notaire + s.app > 0 ? formatEuroExact((s.notaire + s.app) / (dureeAnnees * semainesParAn)) : <span className={T.textFaintest}>—</span>}</td>)}
                  </tr>
                  <tr className={`border-t-2 ${T.rowTotal}`}>
                    <td className={`px-5 py-4 text-xs font-black uppercase tracking-widest ${T.textPrimary}`}>Coût net / semaine</td>
                    {visibleScenarios.map(s => {
                      const c = SCENARIO_COLORS[s.id];
                      return <td key={`swcn-${s.id}`} className={`px-4 py-4 text-center text-xl font-black ${c.text}`}>{formatEuroExact(s.coutNet / (dureeAnnees * semainesParAn))}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
              </div>}
            </div>

            {/* DÉFISCALISATION FRAIS RÉELS */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <button
                onClick={() => setFraisReelsOpen(o => !o)}
                className={`w-full flex items-center justify-between px-6 py-4 transition ${T.cardHover}`}
              >
                <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 text-amber-400`}>
                  <TrendingUp className="w-3.5 h-3.5" /> Défiscalisation — Frais réels (salarié)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${T.chevron} ${fraisReelsOpen ? 'rotate-180' : ''}`} />
              </button>
              {fraisReelsOpen && <div className="px-6 pb-6 space-y-5">

                {/* Explication */}
                <p className={`text-xs leading-relaxed ${T.textSecondary}`}>
                  En tant que salarié, tu peux déduire tes frais professionnels réels au lieu de l'abattement forfaitaire de 10%
                  (plafonné à {formatEuroExact(Math.min(salaireBrutAnnuel * 0.10, 14171))}/an sur ton salaire de {formatEuroExact(salaireBrutAnnuel)}).
                  Les frais de double résidence, de transport domicile-travail et de repas sont déductibles.
                  Chaque euro supplémentaire au-delà du forfait te fait économiser {tmi}% d'impôt (ton TMI).
                </p>

                {/* Tableau comparatif */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse" style={{ minWidth: '600px' }}>
                    <thead>
                      <tr className={`border-b ${T.border}`}>
                        <th className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest ${T.tableHeader}`}></th>
                        {visibleScenarios.map(s => {
                          const c = SCENARIO_COLORS[s.id];
                          return (
                            <th key={`fr-${s.id}`} className="px-4 py-3 text-center">
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
                        <td className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Transport déductible / an</td>
                        {visibleScenarios.map(s => <td key={`frt-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{formatEuroExact(s.fraisReels.transportAn)}</td>)}
                      </tr>
                      <tr>
                        <td className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>
                          Double résidence / an
                          {!doubleResidenceDeductible && <span className={`ml-2 normal-case font-normal ${T.isDark ? 'text-amber-500/70' : 'text-amber-600/80'}`}>(désactivé)</span>}
                        </td>
                        {visibleScenarios.map(s => (
                          <td key={`frh-${s.id}`} className={`px-4 py-2 text-center text-xs`}>
                            {!doubleResidenceDeductible
                              ? <span className={T.textFaintest}>—</span>
                              : s.fraisReels.hebergementAn > 0 ? formatEuroExact(s.fraisReels.hebergementAn) : <span className={T.textFaintest}>—</span>}
                          </td>
                        ))}
                      </tr>
                      <tr className={T.rowAmber}>
                        <td className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider ${T.textFaint}`}>Repas déductibles / an</td>
                        {visibleScenarios.map(s => <td key={`frr-${s.id}`} className={`px-4 py-2 text-center text-xs ${T.textMuted}`}>{s.fraisReels.repasAn > 0 ? formatEuroExact(s.fraisReels.repasAn) : <span className={T.textFaintest}>—</span>}</td>)}
                      </tr>
                      <tr className={T.rowAlt}>
                        <td className={`px-4 py-3 font-medium ${T.textMuted}`}>Total frais réels / an</td>
                        {visibleScenarios.map(s => <td key={`frtot-${s.id}`} className={`px-4 py-3 text-center font-bold ${T.textSecondary}`}>{formatEuroExact(s.fraisReels.totalAn)}</td>)}
                      </tr>
                      <tr>
                        <td className={`px-4 py-3 font-medium ${T.textMuted}`}>Abattement forfaitaire 10%</td>
                        {visibleScenarios.map(s => <td key={`frforf-${s.id}`} className={`px-4 py-3 text-center ${T.textFaint}`}>−{formatEuroExact(s.fraisReels.abattementForfaitaireAn)}</td>)}
                      </tr>
                      <tr className={T.rowAlt}>
                        <td className={`px-4 py-3 font-medium ${T.textMuted}`}>Gain déductible supplémentaire / an</td>
                        {visibleScenarios.map(s => {
                          const c = SCENARIO_COLORS[s.id];
                          return <td key={`frgain-${s.id}`} className={`px-4 py-3 text-center font-bold ${s.fraisReels.gainAn > 0 ? c.text : T.textFaintest}`}>
                            {s.fraisReels.gainAn > 0 ? `+${formatEuroExact(s.fraisReels.gainAn)}` : '—'}
                          </td>;
                        })}
                      </tr>
                      <tr className={`border-t-2 ${T.rowTotal}`}>
                        <td className={`px-4 py-4 font-medium text-amber-400`}>Économie d'impôt / an (TMI {tmi}%)</td>
                        {visibleScenarios.map(s => {
                          const c = SCENARIO_COLORS[s.id];
                          return <td key={`freco-${s.id}`} className={`px-4 py-4 text-center font-bold ${s.fraisReels.economieAn > 0 ? 'text-amber-400' : T.textFaintest}`}>
                            {s.fraisReels.economieAn > 0 ? `+${formatEuroExact(s.fraisReels.economieAn)}` : '—'}
                          </td>;
                        })}
                      </tr>
                      <tr className={T.rowTotalAlt}>
                        <td className={`px-4 py-3 text-xs ${T.textFaint}`}>Sur {dureeAnnees} ans (cumulé)</td>
                        {visibleScenarios.map(s => <td key={`frecod-${s.id}`} className={`px-4 py-3 text-center text-sm font-bold ${s.fraisReels.economieDuree > 0 ? 'text-amber-400' : T.textFaintest}`}>
                          {s.fraisReels.economieDuree > 0 ? `+${formatEuro(s.fraisReels.economieDuree)}` : '—'}
                        </td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={`flex gap-3 rounded-xl p-4 text-xs border ${T.note}`}>
                  <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${T.noteIcon}`} />
                  <p>
                    <span className={`font-semibold ${T.noteLabel}`}>Règles fiscales :</span> Les frais de double résidence (loyer, hôtel, mensualités) sont déductibles si le logement sur Paris est justifié par des contraintes professionnelles et que tu conserves ta résidence principale à Lille. Le transport domicile-travail est déductible pour son montant réel sans plafond spécifique, mais doit être justifié. Les repas professionnels sont déductibles au réel. Ces montants s'imputent sur le revenu imposable catégorie traitements et salaires. Consulte un expert-comptable ou un conseiller fiscal pour valider ta situation.
                  </p>
                </div>
              </div>}
            </div>

            {/* NOTE */}
            <div className={`flex gap-3 rounded-2xl p-5 text-xs border ${T.note}`}>
              <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${T.noteIcon}`} />
              <p>
                <span className={`font-semibold ${T.noteLabel}`}>Focus charges :</span> Le simulateur intègre les charges de copropriété (achat), les charges de vie (électricité, internet, assurance) et les taxes locales. Pour l'achat à deux, ces frais sont divisés selon votre part, contrairement à la location personnelle à 100 %. Le scénario Achat inclut également, si applicable, les revenus locatifs nets perçus entre la fin de la pendularité et la revente (régime micro-foncier : abattement 30%, puis TMI + 17,2% prélèvements sociaux sur 70%).
              </p>
            </div>

            {/* STRATÉGIE ACHAT → LOCATION → REVENTE */}
            <div className={`rounded-2xl border overflow-hidden ${T.card}`}>
              <div className="px-6 py-5 space-y-6">
                <div>
                  <h2 className={`text-sm font-black uppercase tracking-widest mb-1 text-emerald-400`}>La stratégie Achat → Location → Revente</h2>
                  <p className={`text-xs leading-relaxed ${T.textSecondary}`}>
                    Cette stratégie consiste à acheter un appartement à Paris pour y dormir pendant ta période de pendularité, puis à le mettre en location une fois que tu n'en as plus besoin au quotidien, et enfin à le revendre après plusieurs années. L'idée centrale : transformer un coût subi (se loger à Paris) en un investissement qui travaille pour toi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const achat = scenarios.find(s => s.id === 'achat');
                    if (!achat) return null;
                    const ratioAchat = partAchat / 100;
                    const fraisNotaireTotal = prixAchat * (fraisNotairePourcent / 100);
                    const montantEmprunte = prixAchat + fraisNotaireTotal - apport;
                    const rMensuel = (tauxEmprunt / 100) / 12;
                    const nTotalMois = dureeEmpruntAnnees * 12;
                    const mensualite = montantEmprunte * (rMensuel * Math.pow(1 + rMensuel, nTotalMois)) / (Math.pow(1 + rMensuel, nTotalMois) - 1);
                    const moisTotaux = dureeAnnees * 12;
                    const capitalRembourse = montantEmprunte - (montantEmprunte * (Math.pow(1 + rMensuel, nTotalMois) - Math.pow(1 + rMensuel, moisTotaux)) / (Math.pow(1 + rMensuel, nTotalMois) - 1));
                    const dureeLocation = Math.max(0, dureeDetentionAnnees - dureeAnnees);
                    const loyerMoyenMensuel = loyerPercuMensuel * (1 - vacanceLocative / 100);
                    return (<>
                  {/* Phase 1 */}
                  <div className={`rounded-xl p-4 border ${T.card} border-emerald-700/40`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Phase 1 — Pendularité</p>
                    <p className={`text-xs leading-relaxed mb-3 ${T.textSecondary}`}>
                      Tu rembourses ton emprunt tout en habitant le bien pendant {dureeAnnees} ans. Chaque euro de mensualité construit du capital au lieu de partir à fonds perdus.
                    </p>
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Mensualité (part {partAchat}%)</span>
                        <span className={`font-black text-emerald-400`}>{formatEuroExact(mensualite * ratioAchat)} / mois</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Capital remboursé en {dureeAnnees} ans</span>
                        <span className={`font-black text-emerald-400`}>{formatEuro(capitalRembourse * ratioAchat)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Apport + frais notaire engagés</span>
                        <span className={`font-black ${T.textSecondary}`}>{formatEuro((apport + fraisNotaireTotal) * ratioAchat)}</span>
                      </div>
                    </div>
                  </div>
                  {/* Phase 2 */}
                  <div className={`rounded-xl p-4 border ${T.card} border-emerald-700/40`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Phase 2 — Location</p>
                    <p className={`text-xs leading-relaxed mb-3 ${T.textSecondary}`}>
                      {dureeLocation > 0
                        ? `Pendant ${dureeLocation} an${dureeLocation > 1 ? 's' : ''}, le bien est loué. Le locataire rembourse l'emprunt à ta place, et tu perçois un revenu net après impôt.`
                        : `Aucune période de location avec les paramètres actuels (revente = fin de pendularité).`}
                    </p>
                    {dureeLocation > 0 && <div className="space-y-2">
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Loyer moyen perçu (part {partAchat}%)</span>
                        <span className={`font-black text-emerald-400`}>{formatEuroExact(loyerMoyenMensuel * ratioAchat)} / mois</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Revenus locatifs nets sur {dureeLocation} ans</span>
                        <span className={`font-black text-emerald-400`}>{formatEuro(achat.revenusLocatifsNets)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Dont impôt payé (TMI {tmi}%, micro-foncier)</span>
                        <span className={`font-black ${T.textSecondary}`}>−{formatEuro(achat.impotRevenusLocatifs)}</span>
                      </div>
                    </div>}
                  </div>
                  {/* Phase 3 */}
                  <div className={`rounded-xl p-4 border ${T.card} border-emerald-700/40`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Phase 3 — Revente</p>
                    <p className={`text-xs leading-relaxed mb-3 ${T.textSecondary}`}>
                      Après {dureeDetentionAnnees} ans de détention, tu vends le bien. La plus-value est imposable avec des abattements ({Math.round(achat.abattementIR * 100)}% IR, {Math.round(achat.abattementPS * 100)}% PS selon la durée de détention).
                    </p>
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Prix de vente estimé</span>
                        <span className={`font-black text-emerald-400`}>{formatEuro(achat.prixRevente)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Frais de revente (agence, impôt, diag.)</span>
                        <span className={`font-black ${T.textSecondary}`}>−{formatEuro(achat.fraisRevente)}</span>
                      </div>
                      <div className={`flex justify-between items-center text-xs rounded-lg px-3 py-2 ${T.rowAlt}`}>
                        <span className={T.textFaint}>Capital net récupéré (part {partAchat}%)</span>
                        <span className={`font-black text-emerald-400`}>{formatEuro(achat.recuperation)}</span>
                      </div>
                    </div>
                  </div>
                  </>);
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Avantages */}
                  <div className={`rounded-xl p-4 border ${T.card} ${T.isDark ? 'border-emerald-800/50 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/50'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Avantages</p>
                    <ul className={`text-xs space-y-2 ${T.textSecondary}`}>
                      <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">+</span>Les mensualités construisent un patrimoine au lieu de « partir à fonds perdus »</li>
                      <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">+</span>La plus-value immobilière parisienne peut significativement améliorer le bilan final</li>
                      <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">+</span>Les loyers perçus réduisent le coût net réel de toute la stratégie</li>
                      <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">+</span>En cas d'achat à deux, les charges sont mutualisées et le coût par personne diminue</li>
                      <li className="flex gap-2"><span className="text-emerald-400 font-bold flex-shrink-0">+</span>Détenir un bien à Paris offre une option de retour (mutation, changement de vie)</li>
                    </ul>
                  </div>
                  {/* Inconvénients */}
                  <div className={`rounded-xl p-4 border ${T.card} ${T.isDark ? 'border-amber-800/50 bg-amber-950/20' : 'border-amber-200 bg-amber-50/50'}`}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">Risques & contraintes</p>
                    <ul className={`text-xs space-y-2 ${T.textSecondary}`}>
                      <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">−</span>L'apport initial et les frais de notaire immobilisent un capital important dès le départ</li>
                      <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">−</span>La gestion locative demande du temps ou des frais d'agence (vacance, impayés, travaux)</li>
                      <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">−</span>La plus-value est fiscalisée si la détention est inférieure à 22 ans (IR) ou 30 ans (PS)</li>
                      <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">−</span>Le marché immobilier parisien peut stagner ou baisser — la plus-value n'est pas garantie</li>
                      <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">−</span>Revendre un bien occupé peut être complexe et nécessite de respecter les droits du locataire</li>
                    </ul>
                  </div>
                </div>

                <p className={`text-[11px] leading-relaxed ${T.textFaint}`}>
                  Ce simulateur modélise tous ces paramètres : durée de pendularité, durée de détention, loyer perçu, vacance locative, frais de gestion, assurance PNO, fiscalité des revenus locatifs (micro-foncier), et fiscalité de la plus-value avec abattements légaux. Les chiffres affichés sont des estimations basées sur les hypothèses renseignées — ils ne constituent pas un conseil en investissement.
                </p>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}
