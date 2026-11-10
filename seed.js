const L = require('./logic.js');
const W = 'WEEKEND', A = 'WEEKDAY_0600', B = 'WEEKDAY_1000', C = 'WEEKDAY_1930';
const raw = [
  ['류연희', '아녜스', ['COMMENTATOR'], [W, B]],
  ['이승호', '요셉', ['READER'], [W, C], 'm3'],
  ['홍채원', '마리아', ['READER', 'COMMENTATOR'], [W, C], 'm2'],
  ['김도윤', '바오로', ['COMMENTATOR'], [A, B]],
  ['박서연', '루치아', ['READER'], [W, A]],
  ['정민준', '베드로', ['READER'], [W, B, C]],
  ['최지아', '데레사', ['COMMENTATOR', 'READER'], [W]],
  ['강하준', '안드레아', ['READER'], [A, C]],
  ['윤서아', '세실리아', ['COMMENTATOR'], [W, C]],
  ['조예준', '미카엘', ['READER'], [W, B], 'm11'],
  ['장하은', '안나', ['READER'], [W, B], 'm10'],
  ['임건우', '프란치스코', ['COMMENTATOR'], [W, A, B]],
  ['한지유', '클라라', ['READER'], [B, C]],
  ['오시우', '라파엘', ['COMMENTATOR', 'READER'], [W, C]],
  ['서수아', '모니카', ['READER'], [W, A, B]],
  ['신주원', '토마스', ['COMMENTATOR'], [B, C]],
  ['권다은', '엘리사벳', ['READER'], [W, A]],
  ['황지호', '야고보', ['READER'], [W, C]],
  ['안유나', '카타리나', ['COMMENTATOR'], [W, A]],
  ['송현우', '다니엘', ['READER'], [B]],
  ['전채아', '율리아', ['READER', 'COMMENTATOR'], [W, B, C]],
  ['홍준서', '스테파노', ['COMMENTATOR'], [W, C], 'm23'],
  ['고은서', '헬레나', ['READER'], [W, C], 'm22'],
  ['문태윤', '시몬', ['READER'], [A, B, C]],
  ['양소율', '가타리나', ['COMMENTATOR'], [W, B]],
  ['배민재', '마태오', ['READER'], [W, A, B]]
];
const members = raw.map((r, i) => ({ id: 'm' + (i + 1), name: r[0], baptismalName: r[1], roles: r[2], availability: r[3], spouseId: r[4] || null,
  active: true, memo: '예시 데이터', absences: [], sample: true }));
members[0].absences = ['2026-12-20', '2026-12-27'];
members[5].absences = ['2026-12-24', '2026-12-25', '2026-12-26'];

const T = L.DEFAULT_TEMPLATES;
const nov = L.generateMonth(2026, 11, T, [], 'add').masses;
const novA = L.assignMonth({ masses: nov, members, mode: 'all', trials: 50, seed: 7 });
const dec = L.generateMonth(2026, 12, T, [], 'add').masses;
const decA = L.assignMonth({ masses: dec, members, prevMasses: novA.masses, mode: 'all', trials: 50, seed: 11 });

function check(ms) {
  const byId = Object.fromEntries(members.map(m => [m.id, m]));
  let bad = 0;
  const day = {};
  for (const x of ms) {
    const ids = L.positionsOf(x).map(p => x[p.field]).filter(Boolean);
    for (const p of L.positionsOf(x)) { const id = x[p.field]; if (!id) continue; const m = byId[id];
      if (!m.roles.includes(p.role) || !m.availability.includes(x.slot) || m.absences.includes(x.date)) { bad++; console.log('BAD', x.date, x.time, p.label, m.name); }
      const k = id + x.date; if (day[k]) { bad++; console.log('DOUBLE', x.date, m.name); } day[k] = 1;
      if (m.spouseId && !ids.includes(m.spouseId)) { bad++; console.log('COUPLE', x.date, x.time, m.name); }
    }
  }
  return bad;
}
for (const [n, r] of [['11월', novA], ['12월', decA]]) {
  console.log(n, 'masses', r.masses.length, 'unfilled', r.stats.unfilled.length, 'min/max/mean', r.stats.min, r.stats.max, r.stats.mean.toFixed(1), 'std', r.stats.std.toFixed(2), 'repeats', r.stats.repeats, 'violations', check(r.masses));
}
const nameOf = id => members.find(m => m.id === id)?.name;
console.log(decA.masses.filter(m => m.date === '2026-12-06').map(m => L.massLine(m, nameOf)).join('\n'));
console.log(decA.stats.unfilled.slice(0, 10));
const t0 = Date.now(); L.assignMonth({ masses: dec, members, mode: 'all', trials: 50 }); console.log('ms', Date.now() - t0);

