import React from 'react';

export default function Home() {
  return (
    <main style={{fontFamily:'system-ui', padding:24}}>
      <h1>AutoShipTech Dashboard</h1>
      <p>This is a minimal shell. Add auth and booking tables next.</p>
      <h3>Your Widget Embed</h3>
      <pre style={{whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:8}}>
{`<div id="autoshiptech-calculator"></div>
<script async src="https://widget.autoshiptech.com/v1/loader.js"
  data-publishable-key="AST-PUB-TEST-123"
  data-primary-color="#6D28D9"
  data-logo-url="https://autoshiptech.com/logo.svg">
</script>`}
      </pre>
    </main>
  );
}
