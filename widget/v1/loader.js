(function(){
  const script = document.currentScript;
  const pubKey = script.getAttribute('data-publishable-key');
  const color  = script.getAttribute('data-primary-color') || '#6D28D9';
  const logo   = script.getAttribute('data-logo-url') || '';
  const host   = script.getAttribute('data-host') || 'https://widget.autoshiptech.com';

  const iframe = document.createElement('iframe');
  iframe.src = `${host}/v1/app.html?pk=${encodeURIComponent(pubKey)}&color=${encodeURIComponent(color)}&logo=${encodeURIComponent(logo)}`;
  iframe.style.width = '100%';
  iframe.style.border = '0';
  iframe.style.minHeight = '720px';

  const mount = document.getElementById('autoshiptech-calculator') || script.parentElement;
  mount.appendChild(iframe);

  window.addEventListener('message', (e)=>{
    if (e.data && e.data.type === 'AST:resize') iframe.style.height = e.data.height + 'px';
  });
})();