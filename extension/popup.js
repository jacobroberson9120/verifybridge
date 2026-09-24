const ui = {
  en: {
    messageTab: 'Email message', linkTab: 'Page link', optIn: 'YOU CHOOSE WHAT TO SCAN',
    messageTitle: 'Check selected email text', messageHelp: 'In Gmail or Outlook, highlight the message text you want checked. VerifyBridge reads it only after you press the button.',
    scanSelection: 'Scan selected text', currentPage: 'CURRENT PAGE', waiting: 'Waiting to check this page…', scanLink: 'Check this page link',
    noticed: 'What we noticed', privacy: 'Nothing is scanned automatically. Checks run locally after you choose Scan; selected message text is not saved or sent.',
    fullCheck: 'Open full VerifyBridge', finePrint: 'A warning signal, not a verdict. Verify important requests through an official site or phone number you find yourself.',
    selectFirst: 'Highlight text in an open Gmail or Outlook message, then try again.', unsupportedMail: 'Open Gmail or Outlook before scanning selected message text.',
    pageUnsupported: 'Open a regular web page first.', high: 'High risk signal', caution: 'Caution signal', low: 'Low risk signal',
    highAdvice: 'Pause. Do not pay, sign in, or share a code until you verify independently.', cautionAdvice: 'This deserves a closer look through an official source.', lowAdvice: 'Few common warning signs were found. This does not prove it is safe.'
  },
  es: {
    messageTab: 'Mensaje de correo', linkTab: 'Enlace de página', optIn: 'TÚ ELIGES QUÉ REVISAR',
    messageTitle: 'Revisa el texto seleccionado', messageHelp: 'En Gmail u Outlook, selecciona el texto que quieres revisar. VerifyBridge solo lo lee después de presionar el botón.',
    scanSelection: 'Revisar texto seleccionado', currentPage: 'PÁGINA ACTUAL', waiting: 'Esperando para revisar esta página…', scanLink: 'Revisar enlace de esta página',
    noticed: 'Lo que notamos', privacy: 'Nada se revisa automáticamente. El análisis local comienza cuando eliges Revisar; el texto no se guarda ni se envía.',
    fullCheck: 'Abrir VerifyBridge completo', finePrint: 'Es una señal de advertencia, no un veredicto. Verifica solicitudes importantes mediante una fuente oficial.',
    selectFirst: 'Selecciona texto en un mensaje abierto de Gmail u Outlook e inténtalo de nuevo.', unsupportedMail: 'Abre Gmail u Outlook antes de revisar texto seleccionado.',
    pageUnsupported: 'Primero abre una página web normal.', high: 'Señal de riesgo alto', caution: 'Señal de precaución', low: 'Señal de riesgo bajo',
    highAdvice: 'Detente. No pagues, inicies sesión ni compartas códigos hasta verificar por separado.', cautionAdvice: 'Esto merece una revisión mediante una fuente oficial.', lowAdvice: 'Se encontraron pocas señales comunes. Esto no demuestra que sea seguro.'
  }
};

let language = 'en';
const $ = selector => document.querySelector(selector);
const result = $('#result');
const reasons = $('#reasons');
const reasonList = reasons.querySelector('ul');
const domain = $('#domain');
const status = $('#selection-status');

function text(key) { return ui[language][key]; }
function setLanguage(value) {
  language = Object.hasOwn(ui, value) ? value : 'en';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-copy]').forEach(element => { element.textContent = text(element.dataset.copy); });
  result.hidden = true;
  reasons.hidden = true;
  status.textContent = '';
}

function setMode(mode) {
  const messageMode = mode === 'message';
  $('#message-panel').hidden = !messageMode;
  $('#link-panel').hidden = messageMode;
  $('#message-tab').classList.toggle('active', messageMode);
  $('#link-tab').classList.toggle('active', !messageMode);
  result.hidden = true;
  reasons.hidden = true;
  status.textContent = '';
}

function inspectUrl(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase();
  const findings = [];
  let score = 5;
  const add = (points, en, es) => { score += points; findings.push(language === 'es' ? es : en); };
  const numeric = host.split('.').length === 4 && host.split('.').every(part => /^\d+$/.test(part));
  if (url.protocol !== 'https:') add(18, 'The page does not use HTTPS.', 'La página no usa HTTPS.');
  if (value.includes('@')) add(28, 'An @ symbol may hide the destination.', 'Un símbolo @ puede ocultar el destino.');
  if (numeric) add(25, 'The link uses a numeric address.', 'El enlace usa una dirección numérica.');
  if (host.includes('xn--')) add(25, 'Encoded characters may imitate a familiar domain.', 'Caracteres codificados pueden imitar un dominio conocido.');
  if (['.zip','.mov','.top','.xyz','.click','.live','.gq','.tk'].some(tld => host.endsWith(tld))) add(18, 'The domain ending deserves extra caution.', 'La terminación del dominio merece precaución.');
  if (/(login|signin|verify|secure|account|password|wallet|invoice|payment|gift|crypto|support)/i.test(value)) add(14, 'The address contains login or payment pressure words.', 'La dirección contiene palabras de acceso o pago.');
  if (['bit.ly','tinyurl.com','t.co','rb.gy','shorturl.at'].includes(host)) add(16, 'A shortened link hides the final destination.', 'Un enlace corto oculta el destino final.');
  return { score: Math.min(score, 95), findings, host };
}

function inspectMessage(value) {
  const findings = [];
  let score = 5;
  const add = (points, en, es) => { score += points; findings.push(language === 'es' ? es : en); };
  if (/(urgent|immediately|act now|hoy|ahora|inmediatamente|última oportunidad)/i.test(value)) add(18, 'The message pressures you to act quickly.', 'El mensaje te presiona para actuar rápidamente.');
  if (/(gift card|bitcoin|crypto|wire transfer|zelle|tarjeta de regalo|transferencia|criptomoneda)/i.test(value)) add(28, 'It requests a payment method often used in scams.', 'Solicita un método de pago usado con frecuencia en estafas.');
  if (/(password|verification code|security code|contraseña|código de verificación|código de seguridad)/i.test(value)) add(30, 'It asks for a password or verification code.', 'Solicita una contraseña o código de verificación.');
  if (/(arrest|deport|suspend|close your account|arresto|deportación|suspender|cerrar su cuenta)/i.test(value)) add(24, 'It uses a threat to create pressure.', 'Usa una amenaza para crear presión.');
  if (/(click|tap|open).{0,20}(link|below)|haz clic|abre el enlace/i.test(value)) add(14, 'It urges you to open a link.', 'Te pide abrir un enlace.');
  return { score: Math.min(score, 95), findings };
}

function show(scan) {
  const level = scan.score >= 55 ? 'high' : scan.score >= 20 ? 'caution' : 'low';
  result.className = `result ${level}`;
  result.replaceChildren();
  const score = document.createElement('div');
  score.className = 'score';
  score.append(document.createTextNode(String(scan.score)));
  const small = document.createElement('small'); small.textContent = '/100'; score.append(small);
  const copy = document.createElement('div');
  const strong = document.createElement('strong'); strong.textContent = text(level);
  const advice = document.createElement('p'); advice.textContent = text(`${level}Advice`);
  copy.append(strong, advice); result.append(score, copy); result.hidden = false;
  reasonList.replaceChildren(...scan.findings.map(value => { const item = document.createElement('li'); item.textContent = value; return item; }));
  reasons.hidden = scan.findings.length === 0;
}

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

$('#scan-selection').addEventListener('click', async () => {
  const tab = await activeTab();
  const allowed = /^https:\/\/(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com)\//i.test(tab?.url || '');
  if (!allowed) { status.textContent = text('unsupportedMail'); return; }
  const [{ result: selected = '' } = {}] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.getSelection()?.toString().trim() || '' });
  if (!selected) { status.textContent = text('selectFirst'); return; }
  status.textContent = '';
  show(inspectMessage(selected.slice(0, 10000)));
});

$('#scan-link').addEventListener('click', async () => {
  const tab = await activeTab();
  if (!tab?.url || !/^https?:/i.test(tab.url)) { domain.textContent = text('pageUnsupported'); return; }
  const scan = inspectUrl(tab.url); domain.textContent = scan.host; show(scan);
});

$('#message-tab').addEventListener('click', () => setMode('message'));
$('#link-tab').addEventListener('click', () => setMode('link'));
$('#language').addEventListener('change', event => setLanguage(event.target.value));
setLanguage('en');
