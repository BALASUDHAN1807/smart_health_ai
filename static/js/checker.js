'use strict';

// ── Symptom list ────────────────────────────────────────────────────────────
const SYMPTOMS = [
  "Headache","Fever","Cough","Sore throat","Fatigue","Nausea",
  "Vomiting","Diarrhoea","Chest pain","Shortness of breath",
  "Back pain","Abdominal pain","Dizziness","Runny nose","Muscle aches",
  "Loss of appetite","Joint pain","Skin rash","Chills","Night sweats",
  "Eye redness","Ear pain","Swollen lymph nodes","Heart palpitations",
  "Blurred vision","Difficulty swallowing","Frequent urination","Anxiety",
];

const selected = new Set();

// ── Build chips ─────────────────────────────────────────────────────────────
(function buildChips() {
  const grid = document.getElementById('chips-grid');
  SYMPTOMS.forEach(sym => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.textContent = sym;
    btn.onclick = () => toggleChip(sym, btn);
    grid.appendChild(btn);
  });
})();

function toggleChip(sym, btn) {
  if (selected.has(sym)) {
    selected.delete(sym);
    btn.classList.remove('active');
  } else {
    selected.add(sym);
    btn.classList.add('active');
  }
  renderTags();
}

// ── Custom symptom ──────────────────────────────────────────────────────────
function addCustom() {
  const inp = document.getElementById('custom-input');
  const val = inp.value.trim();
  if (!val) return;
  selected.add(val);
  inp.value = '';
  renderTags();
}

document.getElementById('custom-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addCustom();
});

// ── Tags ────────────────────────────────────────────────────────────────────
function renderTags() {
  const row   = document.getElementById('tags-row');
  const group = document.getElementById('selected-group');
  const count = document.getElementById('sel-count');

  row.innerHTML = '';
  count.textContent = selected.size;
  group.style.display = selected.size ? 'block' : 'none';

  selected.forEach(sym => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${sym} <button class="tag-remove" title="Remove">×</button>`;
    tag.querySelector('button').onclick = () => {
      selected.delete(sym);
      // Deactivate chip if it exists
      document.querySelectorAll('.chip').forEach(c => {
        if (c.textContent === sym) c.classList.remove('active');
      });
      renderTags();
    };
    row.appendChild(tag);
  });
}

// ── Analyze ─────────────────────────────────────────────────────────────────
async function analyze() {
  if (selected.size === 0) {
    alert('Please select or add at least one symptom.');
    return;
  }

  const profile = {
    age:        document.getElementById('age').value.trim()        || 'Not specified',
    sex:        document.getElementById('sex').value               || 'Not specified',
    severity:   document.getElementById('severity').value.trim()   || 'Not specified',
    duration:   document.getElementById('duration').value.trim()   || 'Not specified',
    conditions: document.getElementById('conditions').value.trim() || 'None',
    medications:document.getElementById('medications').value.trim()|| 'None',
  };

  setLoading(true);
  hideResults();

  try {
    const res = await fetch('/api/analyze', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ symptoms: [...selected], profile }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    renderResults(data);
  } catch (err) {
    alert('Analysis failed: ' + err.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(on) {
  const btn    = document.getElementById('analyze-btn');
  const text   = document.getElementById('btn-text');
  const loader = document.getElementById('btn-loader');
  btn.disabled    = on;
  text.style.display   = on ? 'none'   : 'inline';
  loader.style.display = on ? 'inline' : 'none';
}

// ── Render results ───────────────────────────────────────────────────────────
const URGENCY_META = {
  ROUTINE:    { icon: '✅', label: 'Routine — No Immediate Concern' },
  MONITOR:    { icon: '⚡', label: 'Monitor — Keep an Eye on Symptoms' },
  SEE_DOCTOR: { icon: '🏥', label: 'See a Doctor Soon' },
  EMERGENCY:  { icon: '🚨', label: 'EMERGENCY — Seek Immediate Care!' },
};

function renderResults(d) {
  document.getElementById('empty-state').style.display = 'none';
  document.getElementById('results').style.display     = 'block';

  // Urgency
  const u    = d.urgency || 'ROUTINE';
  const meta = URGENCY_META[u] || URGENCY_META.ROUTINE;
  const banner = document.getElementById('urgency-banner');
  banner.className = `urgency-banner urgency-${u}`;
  document.getElementById('urgency-icon').textContent   = meta.icon;
  document.getElementById('urgency-label').textContent  = meta.label;
  document.getElementById('urgency-reason').textContent = d.urgency_reason || '';

  // Summary
  document.getElementById('r-summary').textContent = d.summary || '';

  // Conditions
  const condEl = document.getElementById('r-conditions');
  condEl.innerHTML = '';
  (d.conditions || []).forEach(c => {
    const card = document.createElement('div');
    card.className = 'condition-card';
    const tags = (c.symptoms_matched || []).map(s =>
      `<span class="condition-tag">${s}</span>`).join('');
    card.innerHTML = `
      <div class="condition-left">
        <div class="condition-name">${c.name}</div>
        <div class="condition-desc">${c.description}</div>
        ${tags ? `<div class="condition-tags">${tags}</div>` : ''}
      </div>
      <span class="likelihood-badge lh-${c.likelihood}">${c.likelihood}</span>
    `;
    condEl.appendChild(card);
  });

  // Self-care
  const sc = document.getElementById('r-selfcare');
  sc.innerHTML = '';
  (d.self_care || []).forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    sc.appendChild(li);
  });

  // Warnings
  const wl = document.getElementById('r-warnings');
  wl.innerHTML = '';
  (d.warning_signs || []).forEach(w => {
    const li = document.createElement('li');
    li.textContent = w;
    wl.appendChild(li);
  });

  // Next steps
  document.getElementById('r-nextsteps').textContent  = d.next_steps  || '';
  document.getElementById('r-disclaimer').textContent = d.disclaimer  || '';

  // Scroll into view on mobile
  document.getElementById('panel-right').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
  document.getElementById('empty-state').style.display = 'flex';
  document.getElementById('results').style.display     = 'none';
}

// ── Reset ───────────────────────────────────────────────────────────────────
function resetForm() {
  selected.clear();
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  renderTags();
  ['age','sex','severity','duration','conditions','medications','custom-input']
    .forEach(id => { const el = document.getElementById(id); if(el) el.value = ''; });
  hideResults();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
