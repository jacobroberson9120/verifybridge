const domainEl = document.querySelector('#domain');
const resultEl = document.querySelector('#result');
const reasonsEl = document.querySelector('#reasons');
const reasonsList = reasonsEl.querySelector('ul');

function inspectUrl(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  const reasons = [];
  let score = 5;
  const add = (points, text) => { score += points; reasons.push(text); };
  const numericAddress = host.split('.').length === 4 && host.split('.').every(part => /^[0-9]+$/.test(part));
  if (url.protocol !== 'https:') add(18, 'This page does not use a secure HTTPS connection.');
  if (value.includes('@')) add(28, 'The address uses an @ symbol, which can hide the real destination.');
  if (numericAddress) add(25, 'The link uses a numeric address instead of a named website.');
  if (host.includes('xn--')) add(25, 'The domain uses encoded characters that can imitate a familiar name.');
  if (['.zip','.mov','.top','.xyz','.click','.live','.shop','.country','.gq','.tk'].some(tld => host.endsWith(tld))) add(18, 'This domain ending is commonly used in short-lived scam campaigns.');
  if (/(login|signin|verify|secure|account|password|wallet|invoice|payment|gift|crypto|support)/i.test(value)) add(14, 'The address includes words often used to pressure people into logging in or paying.');
  if ((host.match(/-/g) || []).length >= 3) add(7, 'The domain has an unusually high number of hyphens.');
  if (value.length > 110) add(8, 'The address is unusually long and harder to verify.');
  if (['bit.ly','tinyurl.com','t.co','rb.gy','shorturl.at'].includes(host)) add(16, 'This is a shortened link, so the final destination is hidden.');
  score = Math.min(score, 95);
  return { score, reasons, host };
}

chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
  const page = tabs[0];
  if (!page?.url || !/^https?:/i.test(page.url)) {
    domainEl.textContent = 'This page cannot be checked';
    resultEl.className = 'result caution';
    resultEl.innerHTML = '<div class="score">—</div><div><strong>Open a regular website first</strong><p>VerifyBridge can check web addresses that begin with http or https.</p></div>';
    return;
  }
  const scan = inspectUrl(page.url);
  domainEl.textContent = scan.host;
  const level = scan.score >= 55 ? 'high' : scan.score >= 20 ? 'caution' : 'low';
  const label = level === 'high' ? 'High risk signal' : level === 'caution' ? 'Caution signal' : 'Low risk signal';
  const advice = level === 'high' ? 'Do not sign in, pay, or share a code from this page.' : level === 'caution' ? 'Pause and verify through an official site or known phone number.' : 'Few common structural warning signs were found.';
  resultEl.className = 'result ' + level;
  resultEl.innerHTML = '<div class="score">' + scan.score + '<small>/100</small></div><div><strong>' + label + '</strong><p>' + advice + '</p></div>';
  if (scan.reasons.length) {
    reasonsList.replaceChildren(...scan.reasons.map(reason => { const item = document.createElement('li'); item.textContent = reason; return item; }));
    reasonsEl.hidden = false;
  }
});
