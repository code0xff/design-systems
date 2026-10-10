/* 화면 한 벌을 시스템마다 한 번씩 복제해 나란히 세운다.
   마크업은 <template> 하나뿐이고, 칸마다 바뀌는 것은 data-ds와 data-scheme 두 글자다. */

const SYSTEMS = [
  {
    id: 'graphite',
    name: 'Graphite',
    schemes: ['dark', 'light'],
    preferred: 'dark',
    status: 'tint',
    mark: 'icon',
    note: '색 없음 · JetBrains Mono',
    swatch: ['#050505', '#fafafa'],
    line: '휘도만으로 위계를 만든다. 성공도 실패도 색이 아니라 밝기와 낱말로 말한다.',
  },
  {
    id: 'slate',
    name: 'Slate',
    schemes: ['light', 'dark'],
    preferred: 'light',
    status: 'tint',
    mark: 'dot',
    note: '보라 악센트 하나 · Wanted Sans',
    swatch: ['#faf9fb', '#6d5bd0'],
    line: '라일락이 도는 중성색 위에 상태색과 보라 악센트 하나. 누르는 것은 모두 알약이다.',
  },
  {
    id: 'charcoal',
    name: 'Charcoal',
    schemes: ['dark', 'light'],
    preferred: 'dark',
    status: 'outline',
    mark: 'icon',
    note: '외곽선만 · 역할 토큰',
    swatch: ['#050505', '#cfcfd6'],
    line: 'Graphite의 사다리를 역할 토큰으로 읽는다. 버튼은 채우지 않고 선으로만 선다.',
  },
  {
    id: 'injective',
    name: 'Injective',
    schemes: ['dark'],
    preferred: 'dark',
    status: 'outline',
    mark: 'icon',
    note: '다크 한 벌뿐',
    swatch: ['#121212', '#4d3dff'],
    line: 'Charcoal의 구조에 Injective의 브랜드. 쥐고 있는 것은 모두 Ocean으로 채운다.',
  },
  {
    id: 'agent-browser',
    name: 'NightBrowser',
    schemes: ['light', 'dark'],
    preferred: 'light',
    status: 'outline',
    mark: 'icon',
    note: '모노크롬 · 글자 역할 둘',
    swatch: ['#f4f4f3', '#171719'],
    line: '둥근 모서리의 모노크롬 작업대. 글자 역할이 text와 muted 둘뿐이다.',
  },
  {
    id: 'lumen',
    name: 'Lumen',
    schemes: ['light', 'dark'],
    preferred: 'light',
    status: 'outline',
    mark: 'icon',
    note: '두 값뿐 · Manrope',
    swatch: ['#ffffff', '#000000'],
    line: '순백과 순흑 두 값뿐. 위계는 크기와 자간이 만들고, 강조는 반전 하나로만 한다.',
  },
];

const SWATCH_KEYS = [
  '--bg',
  '--surface',
  '--subtle',
  '--line',
  '--line-strong',
  '--ink-faint',
  '--ink-soft',
  '--ink',
  '--accent',
  '--ok',
  '--warn',
  '--danger',
];

const FACT_KEYS = [
  ['본문', '--body-size'],
  ['행간', '--body-leading'],
  ['라벨 자간', '--label-track'],
  ['버튼 높이', '--h-md'],
  ['입력 높이', '--field-h'],
  ['컨트롤 반경', '--r-ctl'],
  ['카드 반경', '--r-card'],
  ['제목 굵기', '--head-weight'],
];

const SCHEMES = ['light', 'dark', 'system'];
const SCHEME_LABEL = { light: '밝게', dark: '어둡게', system: '시스템' };
const SCHEME_ICON = { light: '☀', dark: '☾', system: '◐' };

const state = {
  mode: 'single',
  selected: ['slate'],
  scheme: 'system',
};

/* ── 상태 ─────────────────────────────────────────────────────────────────── */

function readState() {
  const params = new URLSearchParams(location.hash.slice(1));
  const mode = params.get('mode');
  if (mode === 'single' || mode === 'compare') state.mode = mode;

  const ids = (params.get('ds') || '').split(',').filter((id) => SYSTEMS.some((s) => s.id === id));
  if (ids.length > 0) state.selected = ids;

  let scheme = params.get('scheme');
  if (!SCHEMES.includes(scheme)) {
    try {
      scheme = localStorage.getItem('chrome-scheme');
    } catch (e) {
      scheme = null;
    }
  }
  if (SCHEMES.includes(scheme)) state.scheme = scheme;

  if (state.mode === 'single') state.selected = state.selected.slice(0, 1);
  if (state.selected.length === 0) state.selected = ['slate'];
}

function writeState() {
  const params = new URLSearchParams();
  params.set('mode', state.mode);
  params.set('ds', state.selected.join(','));
  params.set('scheme', state.scheme);
  // 히스토리를 쌓지 않는다 — 칩 몇 번 누른 뒤 뒤로 가기가 스무 번이 되면 안 된다.
  history.replaceState(null, '', '#' + params.toString());
  try {
    localStorage.setItem('chrome-scheme', state.scheme);
  } catch (e) {}
}

function darkNow() {
  if (state.scheme === 'system') return matchMedia('(prefers-color-scheme: dark)').matches;
  return state.scheme === 'dark';
}

/* 고른 표시 방식을 시스템이 가진 것 중에서 고른다. 다크 한 벌뿐인 테마는 밝게를 골라도 어둡다. */
function schemeFor(system) {
  const want = darkNow() ? 'dark' : 'light';
  return system.schemes.includes(want) ? want : system.preferred;
}

/* ── 그리기 ───────────────────────────────────────────────────────────────── */

function swatchMarkup(system) {
  return `<i style="background:${system.swatch[0]}"></i><i style="background:${system.swatch[1]}"></i>
          <i style="background:${system.swatch[1]}"></i><i style="background:${system.swatch[0]}"></i>`;
}

function renderChips() {
  const host = document.getElementById('chips');
  host.innerHTML = '';
  for (const system of SYSTEMS) {
    const on = state.selected.includes(system.id);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.setAttribute('aria-pressed', String(on));
    button.dataset.id = system.id;
    button.innerHTML =
      `<span class="chip__swatch" aria-hidden="true">${swatchMarkup(system)}</span>` +
      system.name;
    button.addEventListener('click', () => pick(system.id));
    host.appendChild(button);
  }

  document.getElementById('chips-hint').textContent =
    state.mode === 'single'
      ? '하나 고르면 그 시스템으로 전부 다시 그린다.'
      : `나란히 세울 시스템을 고른다 · ${state.selected.length}개 선택됨`;
}

function pick(id) {
  if (state.mode === 'single') {
    state.selected = [id];
  } else if (state.selected.includes(id)) {
    // 마지막 하나는 끄지 않는다 — 빈 화면은 비교가 아니다.
    if (state.selected.length > 1) state.selected = state.selected.filter((x) => x !== id);
  } else {
    state.selected = SYSTEMS.filter((s) => state.selected.includes(s.id) || s.id === id).map(
      (s) => s.id,
    );
  }
  render();
}

function fillFoundations(frame, system) {
  const style = getComputedStyle(frame);

  const swatches = frame.querySelector('[data-swatches]');
  if (swatches !== null) {
    swatches.innerHTML = SWATCH_KEYS.map((key) => {
      const value = style.getPropertyValue(key).trim();
      if (value === '') return '';
      return `<div class="ds-sw"><i style="background:${value}"></i><span title="${key}: ${value}">${key.slice(2)}</span></div>`;
    }).join('');
  }

  const facts = frame.querySelector('[data-facts]');
  if (facts !== null) {
    facts.innerHTML = FACT_KEYS.map(([label, key]) => {
      let value = style.getPropertyValue(key).trim();
      if (value === '') value = style.getPropertyValue('--h-md').trim();
      return `<dt>${label}</dt><dd>${value}</dd>`;
    }).join('');
  }
}

function buildFrame(system, screen) {
  const frame = document.createElement('article');
  frame.className = 'frame';

  const scheme = schemeFor(system);
  const forced = scheme !== (darkNow() ? 'dark' : 'light');

  const bar = document.createElement('div');
  bar.className = 'frame__bar';
  bar.innerHTML =
    `<span class="chip__swatch" aria-hidden="true">${swatchMarkup(system)}</span>` +
    `<span class="frame__name">${system.name}</span>` +
    `<span class="frame__note">${scheme}${forced ? ' · 한 벌뿐' : ''}</span>`;
  frame.appendChild(bar);

  const body = document.createElement('div');
  body.className = 'ds';
  body.dataset.ds = system.id;
  body.dataset.scheme = scheme;
  body.dataset.status = system.status;
  body.dataset.mark = system.mark;
  body.appendChild(document.getElementById('tpl-' + screen).content.cloneNode(true));
  frame.appendChild(body);

  return { frame, body };
}

function render() {
  document.documentElement.dataset.chrome = darkNow() ? 'dark' : 'light';

  for (const button of document.querySelectorAll('[data-mode]')) {
    button.setAttribute('aria-pressed', String(button.dataset.mode === state.mode));
  }
  document.getElementById('scheme-label').textContent = SCHEME_LABEL[state.scheme];
  document.getElementById('scheme-icon').textContent = SCHEME_ICON[state.scheme];
  document
    .getElementById('scheme')
    .setAttribute(
      'aria-label',
      `표시 방식: ${SCHEME_LABEL[state.scheme]} — 누르면 ${
        SCHEME_LABEL[SCHEMES[(SCHEMES.indexOf(state.scheme) + 1) % SCHEMES.length]]
      }`,
    );

  renderChips();

  const chosen = SYSTEMS.filter((s) => state.selected.includes(s.id));

  for (const grid of document.querySelectorAll('[data-screen]')) {
    grid.innerHTML = '';
    for (const system of chosen) {
      const { frame, body } = buildFrame(system, grid.dataset.screen);
      grid.appendChild(frame);
      if (grid.dataset.screen === 'foundations') fillFoundations(body, system);
    }
  }

  document.getElementById('foot-note').textContent =
    chosen.length === 1
      ? `${chosen[0].name} — ${chosen[0].line}`
      : chosen.map((s) => s.name).join(' · ') + ' 를 나란히 두고 보는 중.';

  writeState();
}

/* ── 붙이기 ───────────────────────────────────────────────────────────────── */

for (const button of document.querySelectorAll('[data-mode]')) {
  button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    if (state.mode === 'single') {
      state.selected = state.selected.slice(0, 1);
    } else if (state.selected.length === 1) {
      // 나란히로 넘어오면 비교할 짝이 있어야 한다.
      state.selected = SYSTEMS.slice(0, 3).map((s) => s.id);
    }
    render();
  });
}

document.getElementById('scheme').addEventListener('click', () => {
  state.scheme = SCHEMES[(SCHEMES.indexOf(state.scheme) + 1) % SCHEMES.length];
  render();
});

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.scheme === 'system') render();
});

readState();
render();
