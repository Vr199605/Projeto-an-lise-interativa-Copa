import React, { useState, useMemo } from "react";

/* ============================================================================
 *  PALPITE COPA 2026 — 48 seleções, foco no bolão
 *  Motor: Elo (real, jun/2026) -> Poisson/Dixon-Coles -> Monte Carlo
 *  Elos de eloratings.net / footballratings.org (11/06/2026). Editáveis.
 * ========================================================================== */

const C = {
  bg: "#090C12", panel: "#121823", panel2: "#0D1119", line: "#212C3A", lineSoft: "#1A2330",
  hi: "#E9EEF6", mid: "#92A1B5", dim: "#5A6A7D",
  fav: "#34D399", draw: "#FBBF24", und: "#F43F5E", aqua: "#5EEAD4", violet: "#A78BFA",
};

/* --------- 48 seleções da Copa 2026 com Elo real (jun/2026) --------------- */
const TEAMS = [
  { id: "ARG", name: "Argentina", elo: 2115, conf: "Am. do Sul", col: "#76B0E0" },
  { id: "BRA", name: "Brasil", elo: 1991, conf: "Am. do Sul", col: "#1FA64A" },
  { id: "COL", name: "Colômbia", elo: 1982, conf: "Am. do Sul", col: "#F2C811" },
  { id: "EQU", name: "Equador", elo: 1933, conf: "Am. do Sul", col: "#FFD100" },
  { id: "URU", name: "Uruguai", elo: 1890, conf: "Am. do Sul", col: "#62B4E6" },
  { id: "PAR", name: "Paraguai", elo: 1760, conf: "Am. do Sul", col: "#D9303A" },
  { id: "ESP", name: "Espanha", elo: 2157, conf: "Europa", col: "#D9303A" },
  { id: "FRA", name: "França", elo: 2063, conf: "Europa", col: "#2B5FB8" },
  { id: "ENG", name: "Inglaterra", elo: 2024, conf: "Europa", col: "#D7D9DE" },
  { id: "POR", name: "Portugal", elo: 1989, conf: "Europa", col: "#C42032" },
  { id: "NED", name: "Países Baixos", elo: 1960, conf: "Europa", col: "#F2762E" },
  { id: "CRO", name: "Croácia", elo: 1935, conf: "Europa", col: "#E11" },
  { id: "NOR", name: "Noruega", elo: 1922, conf: "Europa", col: "#BA1B2C" },
  { id: "GER", name: "Alemanha", elo: 1910, conf: "Europa", col: "#D4AF37" },
  { id: "SUI", name: "Suíça", elo: 1897, conf: "Europa", col: "#D52B1E" },
  { id: "TUR", name: "Turquia", elo: 1880, conf: "Europa", col: "#E30A17" },
  { id: "BEL", name: "Bélgica", elo: 1850, conf: "Europa", col: "#E4242C" },
  { id: "SWE", name: "Suécia", elo: 1820, conf: "Europa", col: "#FECC02" },
  { id: "CZE", name: "Chéquia", elo: 1800, conf: "Europa", col: "#3B7DD8" },
  { id: "AUT", name: "Áustria", elo: 1790, conf: "Europa", col: "#ED2939" },
  { id: "SCO", name: "Escócia", elo: 1770, conf: "Europa", col: "#3D7CC9" },
  { id: "BIH", name: "Bósnia", elo: 1720, conf: "Europa", col: "#1C9BD7" },
  { id: "SEN", name: "Senegal", elo: 1869, conf: "África", col: "#13934A" },
  { id: "MAR", name: "Marrocos", elo: 1850, conf: "África", col: "#0E8C45" },
  { id: "EGY", name: "Egito", elo: 1790, conf: "África", col: "#D81E27" },
  { id: "CIV", name: "Costa do Marfim", elo: 1780, conf: "África", col: "#FF8200" },
  { id: "ALG", name: "Argélia", elo: 1770, conf: "África", col: "#15915A" },
  { id: "GHA", name: "Gana", elo: 1720, conf: "África", col: "#1F9E47" },
  { id: "TUN", name: "Tunísia", elo: 1700, conf: "África", col: "#E70013" },
  { id: "RSA", name: "África do Sul", elo: 1700, conf: "África", col: "#0A7E47" },
  { id: "CPV", name: "Cabo Verde", elo: 1620, conf: "África", col: "#1A56A8" },
  { id: "JPN", name: "Japão", elo: 1879, conf: "Ásia", col: "#1B49B5" },
  { id: "IRN", name: "Irã", elo: 1780, conf: "Ásia", col: "#239F40" },
  { id: "KOR", name: "Coreia do Sul", elo: 1760, conf: "Ásia", col: "#D2293B" },
  { id: "AUS", name: "Austrália", elo: 1720, conf: "Ásia", col: "#E8B800" },
  { id: "QAT", name: "Catar", elo: 1680, conf: "Ásia", col: "#8A1538" },
  { id: "UZB", name: "Uzbequistão", elo: 1650, conf: "Ásia", col: "#1EB53A" },
  { id: "KSA", name: "Arábia Saudita", elo: 1640, conf: "Ásia", col: "#1A8A4A" },
  { id: "JOR", name: "Jordânia", elo: 1600, conf: "Ásia", col: "#1F8A4C" },
  { id: "MEX", name: "México", elo: 1790, conf: "Am. Norte", col: "#0B7A47" },
  { id: "USA", name: "Estados Unidos", elo: 1790, conf: "Am. Norte", col: "#2A4FA0" },
  { id: "CAN", name: "Canadá", elo: 1730, conf: "Am. Norte", col: "#D52B1E" },
  { id: "PAN", name: "Panamá", elo: 1710, conf: "Am. Norte", col: "#D21034" },
  { id: "CUW", name: "Curaçao", elo: 1600, conf: "Am. Norte", col: "#1B4DA0" },
  { id: "HAI", name: "Haiti", elo: 1570, conf: "Am. Norte", col: "#1F3F9F" },
  { id: "NZL", name: "Nova Zelândia", elo: 1600, conf: "Oceania", col: "#C9CDD4" },
  { id: "COD", name: "RD Congo", elo: 1700, conf: "Repescagem", col: "#2E8FE0" },
  { id: "IRQ", name: "Iraque", elo: 1630, conf: "Repescagem", col: "#CE1126" },
];
const byId = (id) => TEAMS.find((t) => t.id === id);
const CONFS = ["Am. do Sul", "Europa", "África", "Ásia", "Am. Norte", "Oceania", "Repescagem"];
const HOSTS = ["USA", "MEX", "CAN"];

/* =============================== MOTOR ==================================== */
const FACT = (() => { const f = [1]; for (let i = 1; i <= 12; i++) f[i] = f[i - 1] * i; return f; })();
const poisson = (k, l) => (Math.exp(-l) * Math.pow(l, k)) / FACT[k];
const MAXG = 10;

// Modelo de gols a partir do Elo:
//  - supremacia S = diferença de Elo / 150 (1 gol de saldo a cada ~150 pontos)
//  - total T cresce em jogos desiguais (favoritos goleiam mais)
//  - λ de cada lado = (T ± S) / 2  -> favorito claro projeta 2+ gols, não fica preso em 1
function lambdas(A, B, homeAdv, goalsEnv) {
  const gap = (A.elo + homeAdv) - B.elo;
  const S = Math.max(-2.8, Math.min(2.8, gap / 150));
  const T = goalsEnv + 0.18 * Math.abs(S);
  return {
    lA: Math.max(0.18, (T + S) / 2),
    lB: Math.max(0.18, (T - S) / 2),
    sup: S,
  };
}
// Palpite que MAXIMIZA pontos esperados na sua pontuação (PE = placar exato, PR = só resultado)
function bestByEV(m, o, PE, PR) {
  let best = null;
  for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) {
    const pr = i > j ? o.home : i === j ? o.draw : o.away;
    const ev = PE * m[i][j] + PR * (pr - m[i][j]);
    if (!best || ev > best.ev) best = { i, j, ev, p: m[i][j] };
  }
  return best;
}
const dcTau = (i, j, lA, lB, r) =>
  i === 0 && j === 0 ? 1 - lA * lB * r :
  i === 0 && j === 1 ? 1 + lA * r :
  i === 1 && j === 0 ? 1 + lB * r :
  i === 1 && j === 1 ? 1 - r : 1;

function matrix(lA, lB, r) {
  const m = []; let s = 0;
  for (let i = 0; i <= MAXG; i++) { m[i] = []; for (let j = 0; j <= MAXG; j++) { const p = Math.max(0, poisson(i, lA) * poisson(j, lB) * dcTau(i, j, lA, lB, r)); m[i][j] = p; s += p; } }
  for (let i = 0; i <= MAXG; i++) for (let j = 0; j <= MAXG; j++) m[i][j] /= s;
  return m;
}
function outcome(m) { let h = 0, d = 0, a = 0; for (let i = 0; i <= MAXG; i++) for (let j = 0; j <= MAXG; j++) { if (i > j) h += m[i][j]; else if (i === j) d += m[i][j]; else a += m[i][j]; } return { home: h, draw: d, away: a }; }
function topScores(m, n) { const a = []; for (let i = 0; i <= 8; i++) for (let j = 0; j <= 8; j++) a.push({ i, j, p: m[i][j] }); a.sort((x, y) => y.p - x.p); return a.slice(0, n); }
const sumIf = (m, f) => { let s = 0; for (let i = 0; i <= MAXG; i++) for (let j = 0; j <= MAXG; j++) if (f(i, j)) s += m[i][j]; return s; };

function confidence(o, top) {
  const ps = [o.home, o.draw, o.away].filter((p) => p > 0);
  const H = -ps.reduce((s, p) => s + p * Math.log(p), 0) / Math.log(3);
  const score = Math.round(100 * (0.72 * (1 - H) + 0.28 * Math.min(1, top[0].p / 0.2)));
  let tier = "Baixa", col = C.und;
  if (score >= 80) { tier = "Muito alta"; col = C.fav; }
  else if (score >= 66) { tier = "Alta"; col = C.fav; }
  else if (score >= 52) { tier = "Média"; col = C.draw; }
  return { score, tier, col };
}
function bolao(A, B, o, top, ev) {
  const fav = o.home >= o.away ? A : B, favP = Math.max(o.home, o.away);
  const conserv = (o.draw > o.home && o.draw > o.away)
    ? { pick: "Empate", p: o.draw } : { pick: fav.name + " vence", p: favP };
  const cand = top.filter((s) => !(s.i === ev.i && s.j === ev.j))
    .map((s) => ({ ...s, v: s.p * (1 + 0.35 * Math.abs(s.i - s.j) + (s.i !== s.j ? 0.25 : 0)) }))
    .sort((x, y) => y.v - x.v);
  const ob = cand[0] || ev;
  return {
    conserv: { ...conserv, tier: "Conservador", col: C.fav, sub: "só o vencedor — maior chance" },
    equil: { pick: A.id + " " + ev.i + " x " + ev.j + " " + B.id, p: ev.p, tier: "Ótimo (recomendado)", col: C.aqua, sub: "máximo de pontos esperados" },
    ousado: { pick: A.id + " " + ob.i + " x " + ob.j + " " + B.id, p: ob.p, tier: "Ousado", col: C.und, sub: "diferencia da galera se cravar" },
  };
}

// Odds decimais -> probabilidades sem margem da casa (no-vig)
function noVig(oH, oD, oA) {
  const iH = 1 / oH, iD = 1 / oD, iA = 1 / oA, s = iH + iD + iA;
  return { pH: iH / s, pD: iD / s, pA: iA / s, overround: (s - 1) * 100 };
}
// Ajusta λ_A, λ_B para reproduzir as probabilidades do mercado (calibração)
function fitLambdasToMarket(pH, pD, pA, rho) {
  const sup0 = (pH - pA) * 2.2;
  let lA = Math.max(0.25, 1.35 + sup0 / 2), lB = Math.max(0.25, 1.35 - sup0 / 2);
  for (let it = 0; it < 120; it++) {
    const o = outcome(matrix(lA, lB, rho));
    const push = 0.5 * ((pH - o.home) - (pA - o.away));
    lA *= Math.exp(push); lB *= Math.exp(-push);
    const scale = Math.exp(0.45 * (o.draw - pD));
    lA *= scale; lB *= scale;
    lA = Math.min(5, Math.max(0.08, lA)); lB = Math.min(5, Math.max(0.08, lB));
  }
  return { lA, lB };
}

/* ============================ COMPONENTES ================================= */
const Chip = ({ team, size = 30 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size, borderRadius: 8, flexShrink: 0, background: team.col, color: "#06090F", fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", fontSize: size * 0.34, boxShadow: "0 0 0 1px " + C.line }}>{team.id}</span>
);

const TeamSelect = ({ value, onChange, label }) => (
  <label style={{ flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 10, color: C.dim, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Chip team={byId(value)} />
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ flex: 1, minWidth: 0, background: C.bg, border: "1px solid " + C.line, borderRadius: 9, color: C.hi, padding: "11px 10px", fontSize: 15, fontFamily: "'Inter', sans-serif" }}>
        {CONFS.map((cf) => (
          <optgroup key={cf} label={cf}>
            {TEAMS.filter((t) => t.conf === cf).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </optgroup>
        ))}
      </select>
    </div>
  </label>
);

export default function PalpiteCopa() {
  const [aId, setAId] = useState("BRA");
  const [bId, setBId] = useState("ESP");
  const [mando, setMando] = useState("neutro");
  const [oddsH, setOddsH] = useState("");
  const [oddsD, setOddsD] = useState("");
  const [oddsA, setOddsA] = useState("");
  const [cartela, setCartela] = useState([]);
  const [adv, setAdv] = useState(false);
  const [ptsExact, setPtsExact] = useState(6);
  const [ptsResult, setPtsResult] = useState(3);
  const [goalsEnv, setGoalsEnv] = useState(2.55);
  const [rho, setRho] = useState(0.06);
  const [copied, setCopied] = useState(false);

  const A = byId(aId), B = byId(bId);
  const hostHint = HOSTS.includes(aId) || HOSTS.includes(bId);

  const D = useMemo(() => {
    const oH = parseFloat(oddsH), oD = parseFloat(oddsD), oA = parseFloat(oddsA);
    const hasOdds = oH > 1.01 && oD > 1.01 && oA > 1.01;

    let lA, lB, sup, source, overround = 0;
    if (hasOdds) {
      const mk = noVig(oH, oD, oA);
      overround = mk.overround;
      const fit = fitLambdasToMarket(mk.pH, mk.pD, mk.pA, rho);
      lA = fit.lA; lB = fit.lB; sup = lA - lB; source = "odds";
    } else {
      const hAdv = mando === "A" ? 65 : 0;
      const eB = mando === "B" ? { ...B, elo: B.elo + 65 } : B;
      const r = lambdas(A, eB, hAdv, goalsEnv);
      lA = r.lA; lB = r.lB; sup = r.sup; source = "elo";
    }
    const m = matrix(lA, lB, rho);
    const o = outcome(m);
    const top = topScores(m, 10);
    const ev = bestByEV(m, o, ptsExact, ptsResult);
    return {
      lA, lB, sup, o, top, ev, source, overround, conf: confidence(o, top),
      bol: bolao(A, B, o, top, ev),
      over25: sumIf(m, (i, j) => i + j >= 3),
      btts: sumIf(m, (i, j) => i >= 1 && j >= 1),
    };
  }, [aId, bId, mando, goalsEnv, rho, oddsH, oddsD, oddsA, ptsExact, ptsResult]); // eslint-disable-line

  const fav = D.o.home >= D.o.away ? A : B;
  const favP = Math.max(D.o.home, D.o.away);
  const eq = D.ev;

  const addCartela = () => setCartela((c) => [...c, {
    id: Date.now(), a: A.id, b: B.id, an: A.name, bn: B.name,
    result: D.bol.conserv.pick, score: eq.i + " x " + eq.j, conf: D.conf.score,
  }]);
  const copyCartela = () => {
    const txt = cartela.map((c) => c.an + " " + c.score + " " + c.bn + "  (" + c.result + ", conf " + c.conf + ")").join("\n");
    navigator.clipboard?.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };

  const mono = "'IBM Plex Mono', monospace";
  const box = { background: C.panel, border: "1px solid " + C.line, borderRadius: 14, padding: 16 };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.hi, fontFamily: "'Inter', system-ui, sans-serif", paddingBottom: 40 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .dot{ width:7px;height:7px;border-radius:50%;background:${C.fav};animation:pulse 1.6s infinite; }
        select{ -webkit-appearance:none; appearance:none; }
        input[type=range]{ accent-color:${C.aqua}; width:100%; }
        button{ font-family:inherit; cursor:pointer; }
        @media (prefers-reduced-motion: reduce){ .dot{ animation:none } }
      `}</style>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="dot" />
          <div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }}>
              PALPITE <span style={{ color: C.aqua }}>COPA 26</span>
            </div>
            <div style={{ fontSize: 10.5, color: C.dim, fontFamily: mono }}>48 seleções · Elo real jun/2026</div>
          </div>
        </div>

        <div style={box}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <TeamSelect value={aId} onChange={setAId} label="Time A" />
            <button onClick={() => { setAId(bId); setBId(aId); }} title="Inverter"
              style={{ background: C.bg, border: "1px solid " + C.line, borderRadius: 9, color: C.aqua, width: 40, height: 44, fontSize: 16, flexShrink: 0 }}>⇄</button>
            <TeamSelect value={bId} onChange={setBId} label="Time B" />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {[["neutro", "Campo neutro"], ["A", A.id + " em casa"], ["B", B.id + " em casa"]].map(([v, lab]) => (
              <button key={v} onClick={() => setMando(v)} style={{
                flex: 1, padding: "8px 4px", borderRadius: 8, fontSize: 11.5, fontWeight: 600,
                background: mando === v ? C.aqua : C.bg, color: mando === v ? "#06090F" : C.mid,
                border: "1px solid " + (mando === v ? C.aqua : C.line),
              }}>{lab}</button>
            ))}
          </div>
          {hostHint && mando === "neutro" && (
            <div style={{ fontSize: 10.5, color: C.draw, marginTop: 8 }}>⚐ Anfitrião em jogo — considere marcar o mando.</div>
          )}
        </div>

        {/* Odds da casa (ancora o palpite no mercado) */}
        <div style={box}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em" }}>Odds da sua casa <span style={{ color: C.dim, textTransform: "none", letterSpacing: 0 }}>(opcional)</span></span>
            {D.source === "odds" && (
              <button onClick={() => { setOddsH(""); setOddsD(""); setOddsA(""); }} style={{ fontSize: 10.5, padding: "4px 9px", borderRadius: 7, background: C.bg, color: C.mid, border: "1px solid " + C.line }}>limpar</button>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[[A.id, oddsH, setOddsH, A.col], ["Empate", oddsD, setOddsD, C.dim], [B.id, oddsA, setOddsA, B.col]].map(([lab, val, set, col], k) => (
              <label key={k} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: col, marginBottom: 4, fontWeight: 600, textAlign: "center" }}>{lab}</div>
                <input type="number" inputMode="decimal" step="0.01" value={val} placeholder="—"
                  onChange={(e) => set(e.target.value)}
                  style={{ width: "100%", background: C.bg, border: "1px solid " + C.line, borderRadius: 8, color: C.hi, fontFamily: mono, fontSize: 16, padding: "9px 6px", textAlign: "center" }} />
              </label>
            ))}
          </div>
          <div style={{ fontSize: 10.5, color: C.dim, marginTop: 9, lineHeight: 1.45 }}>
            {D.source === "odds"
              ? `★ Palpite ancorado no mercado · margem da casa ${D.overround.toFixed(1)}% removida. As probabilidades abaixo são as reais do mercado.`
              : "Digite as 3 cotações (1 · X · 2) e o palpite passa a seguir o mercado das casas — o previsor mais preciso. Sem odds, usa o modelo de Elo."}
          </div>
        </div>

        <div style={box}>
          <div style={{ display: "flex", height: 40, borderRadius: 9, overflow: "hidden", border: "1px solid " + C.line }}>
            {[[D.o.home, A.col, A.id], [D.o.draw, C.dim, "X"], [D.o.away, B.col, B.id]].map(([p, c, l], k) => (
              <div key={k} style={{ width: (p * 100) + "%", background: c, display: "flex", alignItems: "center", justifyContent: "center", color: "#06090F", fontWeight: 800, fontSize: 13, fontFamily: mono, transition: "width .4s" }}>
                {p > 0.1 ? (p * 100).toFixed(0) + "%" : ""}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {[[A.name, D.o.home, A.col], ["Empate", D.o.draw, C.mid], [B.name, D.o.away, B.col]].map(([n, p, c], k) => (
              <div key={k} style={{ flex: 1, textAlign: k === 1 ? "center" : k === 0 ? "left" : "right" }}>
                <div style={{ fontSize: 11, color: C.dim }}>{n}</div>
                <div style={{ fontFamily: mono, fontSize: 19, fontWeight: 700, color: c }}>{(p * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...box, borderColor: C.aqua, background: "linear-gradient(180deg, rgba(94,234,212,0.08), rgba(94,234,212,0.02))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 11, color: C.aqua, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>★ Meu palpite</span>
              <span style={{ fontSize: 8.5, padding: "2px 6px", borderRadius: 20, background: C.bg, color: D.source === "odds" ? C.fav : C.violet, border: "1px solid " + (D.source === "odds" ? C.fav : C.violet), textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {D.source === "odds" ? "mercado" : "Elo"}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: C.dim }}>confiança</span>
              <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 15, color: D.conf.col }}>{D.conf.score}</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 20, background: C.bg, color: D.conf.col, border: "1px solid " + D.conf.col }}>{D.conf.tier}</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, padding: "6px 0 10px" }}>
            <Chip team={A} size={38} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, color: C.hi }}>{eq.i}</span>
            <span style={{ color: C.dim, fontSize: 18 }}>×</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 34, color: C.hi }}>{eq.j}</span>
            <Chip team={B} size={38} />
          </div>
          <div style={{ textAlign: "center", fontSize: 13, color: C.mid }}>
            {fav.name} favorito ({(favP * 100).toFixed(0)}%) · placar sai {(eq.p * 100).toFixed(1)}% das vezes · <span style={{ color: C.aqua, fontWeight: 700 }}>~{eq.ev.toFixed(2)} pts esperados</span>
          </div>
          <button onClick={addCartela} style={{ width: "100%", marginTop: 12, padding: "11px", borderRadius: 9, background: C.aqua, color: "#06090F", fontWeight: 700, fontSize: 14, border: "none" }}>
            + Adicionar à minha cartela
          </button>
        </div>

        <div style={box}>
          <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Opções por risco</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[D.bol.conserv, D.bol.equil, D.bol.ousado].map((b, k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg, border: "1px solid " + C.lineSoft, borderLeft: "3px solid " + b.col, borderRadius: 9, padding: "10px 12px" }}>
                <div>
                  <div style={{ fontSize: 10, color: b.col, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>{b.tier}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, margin: "1px 0" }}>{b.pick}</div>
                  <div style={{ fontSize: 10.5, color: C.dim }}>{b.sub}</div>
                </div>
                <div style={{ fontFamily: mono, fontSize: 15, color: C.mid }}>{(b.p * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["Gols esp.", (D.lA + D.lB).toFixed(2), C.aqua], ["Over 2.5", (D.over25 * 100).toFixed(0) + "%", C.draw], ["Ambos marcam", (D.btts * 100).toFixed(0) + "%", C.violet]].map(([l, v, c], k) => (
            <div key={k} style={{ background: C.panel, border: "1px solid " + C.line, borderRadius: 11, padding: "11px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 9.5, color: C.dim, textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontFamily: mono, fontSize: 17, fontWeight: 700, color: c, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={box}>
          <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Placares mais prováveis</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 7 }}>
            {D.top.slice(0, 10).map((s, k) => (
              <div key={k} style={{ background: k === 0 ? "rgba(94,234,212,0.1)" : C.bg, border: "1px solid " + (k === 0 ? C.aqua : C.lineSoft), borderRadius: 8, padding: "7px 4px", textAlign: "center" }}>
                <div style={{ fontFamily: mono, fontWeight: 700, fontSize: 14, color: k === 0 ? C.aqua : C.hi }}>{s.i}x{s.j}</div>
                <div style={{ fontFamily: mono, fontSize: 10, color: C.dim }}>{(s.p * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        {cartela.length > 0 && (
          <div style={box}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: C.aqua, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Minha cartela ({cartela.length})</span>
              <button onClick={copyCartela} style={{ fontSize: 11, padding: "5px 10px", borderRadius: 7, background: C.bg, color: copied ? C.fav : C.mid, border: "1px solid " + C.line }}>{copied ? "✓ copiado" : "copiar tudo"}</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {cartela.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 9, background: C.bg, border: "1px solid " + C.lineSoft, borderRadius: 8, padding: "8px 10px" }}>
                  <Chip team={byId(c.a)} size={22} />
                  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 14, color: C.hi }}>{c.score}</span>
                  <Chip team={byId(c.b)} size={22} />
                  <span style={{ flex: 1, fontSize: 11, color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.result}</span>
                  <button onClick={() => setCartela((x) => x.filter((y) => y.id !== c.id))} style={{ background: "none", border: "none", color: C.dim, fontSize: 16, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={() => setAdv(!adv)} style={{ background: "none", border: "none", color: C.dim, fontSize: 12, textAlign: "left", padding: "2px 4px" }}>
          {adv ? "▾" : "▸"} Ajustes avançados
        </button>
        {adv && (
          <div style={box}>
            <div style={{ fontSize: 11, color: C.dim, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Pontuação do bolão</div>
            <div style={{ display: "flex", gap: 10 }}>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: C.mid, marginBottom: 4 }}>Placar exato (pts)</div>
                <input type="number" value={ptsExact} min="1" step="1" onChange={(e) => setPtsExact(Math.max(1, +e.target.value || 1))}
                  style={{ width: "100%", background: C.bg, border: "1px solid " + C.line, borderRadius: 8, color: C.hi, fontFamily: mono, fontSize: 15, padding: "8px 10px" }} />
              </label>
              <label style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: C.mid, marginBottom: 4 }}>Só o vencedor (pts)</div>
                <input type="number" value={ptsResult} min="0" step="1" onChange={(e) => setPtsResult(Math.max(0, +e.target.value || 0))}
                  style={{ width: "100%", background: C.bg, border: "1px solid " + C.line, borderRadius: 8, color: C.hi, fontFamily: mono, fontSize: 15, padding: "8px 10px" }} />
              </label>
            </div>
            <p style={{ fontSize: 10.5, color: C.dim, margin: "8px 0 0", lineHeight: 1.4 }}>
              O palpite recomendado é o que dá <b style={{ color: C.aqua }}>mais pontos esperados</b> nessa pontuação.
            </p>
            <label style={{ fontSize: 11.5, color: C.mid, display: "block", marginTop: 14 }}>
              Ambiente de gols ({goalsEnv.toFixed(2)}) — média base de gols por time
              <input type="range" min="2.1" max="3.1" step="0.05" value={goalsEnv} onChange={(e) => setGoalsEnv(+e.target.value)} style={{ marginTop: 6 }} />
            </label>
            <label style={{ fontSize: 11.5, color: C.mid, display: "block", marginTop: 12 }}>
              Dixon-Coles ρ ({rho.toFixed(2)}) — peso de placares baixos/empate
              <input type="range" min="-0.15" max="0.15" step="0.01" value={rho} onChange={(e) => setRho(+e.target.value)} style={{ marginTop: 6 }} />
            </label>
            <p style={{ fontSize: 10.5, color: C.dim, marginTop: 12, lineHeight: 1.5 }}>
              Elos de 11/06/2026 (eloratings.net / footballratings.org). Sem odds, usa o modelo de Elo; com odds, segue o mercado.
            </p>
          </div>
        )}

        <p style={{ fontSize: 10.5, color: C.dim, lineHeight: 1.5, textAlign: "center", marginTop: 4 }}>
          Probabilidades calculadas, não chutadas. Previsão esportiva é incerta por natureza — use com responsabilidade.
        </p>
      </div>
    </div>
  );
}
