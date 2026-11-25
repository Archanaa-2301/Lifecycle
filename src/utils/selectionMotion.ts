export type SelectionFlightOptions = {
  title: string;
  subtitle?: string;
  imageSrc?: string;
  targetElement?: HTMLElement | null;
  target?: { left: number; top: number; width?: number; height?: number };
  targetLabel?: string;
  duration?: number;
  onComplete?: () => void;
};

let styleInstalled = false;

function installStyles() {
  if (styleInstalled || document.getElementById('lifex-selection-motion-styles')) return;
  const style = document.createElement('style');
  style.id = 'lifex-selection-motion-styles';
  style.textContent = `
    .lifex-flight-root{position:fixed;inset:0;z-index:100000;pointer-events:none;overflow:hidden;background:radial-gradient(circle at var(--flight-x) var(--flight-y),rgba(46,129,255,.16),rgba(13,43,91,.055) 34%,rgba(13,43,91,0) 72%);backdrop-filter:blur(1.5px)}
    .lifex-flight-path{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
    .lifex-flight-path path{fill:none;stroke:#1680ff;stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 0 7px rgba(20,119,255,.8));stroke-dasharray:1200;stroke-dashoffset:1200}
    .lifex-flight-token{position:fixed;z-index:2;display:flex;align-items:center;gap:12px;min-width:190px;max-width:260px;height:76px;padding:10px 15px;border:1px solid rgba(255,255,255,.96);border-radius:17px;background:linear-gradient(135deg,#fff 0%,#edf5ff 100%);box-shadow:0 18px 55px rgba(13,75,176,.28),0 0 0 5px rgba(51,132,255,.14);color:#142b54;transform-origin:center center;will-change:transform,opacity;}
    .lifex-flight-token:after{content:'';position:absolute;inset:-5px;border:2px solid rgba(28,126,255,.42);border-radius:21px;animation:lifexTokenHalo .85s ease-out infinite;}
    .lifex-flight-token img{width:55px;height:48px;object-fit:contain;flex:none;background:#fff;border-radius:10px;padding:3px}
    .lifex-flight-token-copy{min-width:0;display:flex;flex-direction:column;gap:4px}
    .lifex-flight-token-copy strong{font:800 15px/1.15 Inter,Arial,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .lifex-flight-token-copy small{font:800 8px/1.2 Inter,Arial,sans-serif;letter-spacing:.13em;color:#0871ee}
    .lifex-flight-destination{position:fixed;z-index:1;min-height:72px;display:flex;flex-direction:column;justify-content:center;gap:5px;padding:10px 15px;border:1px solid #8bb9ff;border-radius:16px;background:rgba(255,255,255,.97);box-shadow:0 12px 38px rgba(16,80,177,.19);color:#142b54;opacity:0;transform:translateX(-14px) scale(.94)}
    .lifex-flight-destination small{font:900 8px Inter,Arial,sans-serif;letter-spacing:.16em;color:#04a4c5}
    .lifex-flight-destination strong{font:800 14px Inter,Arial,sans-serif}
    .lifex-flight-target-ring{position:fixed;z-index:3;width:42px;height:42px;border:3px solid #1680ff;border-radius:50%;box-shadow:0 0 0 8px rgba(22,128,255,.12),0 0 30px rgba(22,128,255,.6);opacity:0;transform:translate(-50%,-50%) scale(.25)}
    .lifex-selection-source-active{position:relative!important;z-index:4!important;animation:lifexSourceCommit .8s cubic-bezier(.16,.8,.2,1) both!important;border-color:#086bfa!important;box-shadow:0 0 0 5px rgba(30,119,255,.18),0 18px 36px rgba(13,88,205,.22)!important}
    .lifex-selection-target-pulse{position:relative!important;z-index:4!important;animation:lifexTargetLand .95s cubic-bezier(.16,.8,.2,1) both!important}
    @keyframes lifexTokenHalo{0%{opacity:.75;transform:scale(.96)}100%{opacity:0;transform:scale(1.18)}}
    @keyframes lifexSourceCommit{0%{filter:brightness(1)}35%{filter:brightness(1.08)}100%{filter:brightness(1)}}
    @keyframes lifexTargetLand{0%{box-shadow:0 0 0 0 rgba(24,120,255,0)}35%{box-shadow:0 0 0 8px rgba(24,120,255,.18),0 15px 32px rgba(24,95,210,.16)}100%{box-shadow:0 0 0 3px rgba(24,120,255,.08)}}
    @media(prefers-reduced-motion:reduce){.lifex-flight-root{backdrop-filter:none}.lifex-flight-token:after{animation:none}}
  `;
  document.head.appendChild(style);
  styleInstalled = true;
}

export function runSelectionFlight(source: HTMLElement, options: SelectionFlightOptions) {
  if (typeof document === 'undefined' || !source) { options.onComplete?.(); return; }
  installStyles();
  const duration = options.duration ?? 1050;
  const sourceRect = source.getBoundingClientRect();
  const targetRect = options.targetElement?.getBoundingClientRect();
  const fallback = options.target ?? { left: 28, top: Math.round(window.innerHeight * .43), width: 246, height: 76 };
  const destination = targetRect && targetRect.width > 0 && targetRect.height > 0
    ? { left: targetRect.left, top: targetRect.top, width: targetRect.width, height: targetRect.height }
    : fallback;
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const endX = destination.left + destination.width / 2;
  const endY = destination.top + destination.height / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  source.classList.add('lifex-selection-source-active');
  if (options.targetElement) options.targetElement.classList.add('lifex-selection-target-pulse');

  const root = document.createElement('div');
  root.className = 'lifex-flight-root';
  root.style.setProperty('--flight-x', `${startX}px`);
  root.style.setProperty('--flight-y', `${startY}px`);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'lifex-flight-path');
  svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'lifex-flight-arrowhead');
  marker.setAttribute('markerWidth', '12');
  marker.setAttribute('markerHeight', '12');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '5');
  marker.setAttribute('orient', 'auto');
  marker.setAttribute('markerUnits', 'userSpaceOnUse');
  const arrowHead = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowHead.setAttribute('d', 'M 1 1 L 10 5 L 1 9');
  arrowHead.setAttribute('fill', 'none');
  arrowHead.setAttribute('stroke', '#1680ff');
  arrowHead.setAttribute('stroke-width', '2.5');
  arrowHead.setAttribute('stroke-linecap', 'round');
  arrowHead.setAttribute('stroke-linejoin', 'round');
  marker.appendChild(arrowHead);
  defs.appendChild(marker);
  svg.appendChild(defs);
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const bend = Math.max(65, Math.min(190, Math.abs(dx) * .18));
  path.setAttribute('d', `M ${startX} ${startY} C ${startX + dx * .28} ${startY - bend} ${startX + dx * .76} ${endY - bend * .35} ${endX} ${endY}`);
  path.setAttribute('marker-end', 'url(#lifex-flight-arrowhead)');
  svg.appendChild(path);
  root.appendChild(svg);

  if (!options.targetElement) {
    const destinationCard = document.createElement('div');
    destinationCard.className = 'lifex-flight-destination';
    destinationCard.style.left = `${destination.left}px`;
    destinationCard.style.top = `${destination.top}px`;
    destinationCard.style.width = `${destination.width ?? 246}px`;
    destinationCard.style.height = `${destination.height ?? 76}px`;
    const eyebrow = document.createElement('small');
    eyebrow.textContent = options.targetLabel ?? 'SELECTION HIERARCHY';
    const heading = document.createElement('strong');
    heading.textContent = options.title;
    destinationCard.append(eyebrow, heading);
    root.appendChild(destinationCard);
    if (!reduced) destinationCard.animate([
      { opacity: 0, transform: 'translateX(-14px) scale(.94)' },
      { opacity: 1, transform: 'translateX(0) scale(1.025)', offset: .72 },
      { opacity: 1, transform: 'translateX(0) scale(1)' },
    ], { duration: duration * .62, delay: duration * .28, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'forwards' });
  }

  const token = document.createElement('div');
  token.className = 'lifex-flight-token';
  token.style.left = `${startX - 105}px`;
  token.style.top = `${startY - 38}px`;
  const image = document.createElement('img');
  if (options.imageSrc) image.src = options.imageSrc;
  image.alt = '';
  const copy = document.createElement('span');
  copy.className = 'lifex-flight-token-copy';
  const title = document.createElement('strong');
  title.textContent = options.title;
  const subtitle = document.createElement('small');
  subtitle.textContent = options.subtitle ?? 'SELECTED';
  copy.append(title, subtitle);
  token.append(image, copy);
  root.appendChild(token);

  const ring = document.createElement('div');
  ring.className = 'lifex-flight-target-ring';
  ring.style.left = `${endX}px`;
  ring.style.top = `${endY}px`;
  root.appendChild(ring);
  document.body.appendChild(root);

  if (reduced) {
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
    window.setTimeout(finish, 180);
  } else {
    path.animate([{ strokeDashoffset: 1200, opacity: .4 }, { strokeDashoffset: 0, opacity: 1 }], { duration: duration * .86, easing: 'ease-in-out', fill: 'forwards' });
    token.animate([
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 0, offset: 0 },
      { transform: 'translate3d(0,0,0) scale(1)', opacity: 1, offset: .12 },
      { transform: `translate3d(${dx * .46}px,${dy * .46 - bend * .32}px,0) scale(.84)`, opacity: 1, offset: .58 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(.62)`, opacity: .96, offset: .9 },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(.3)`, opacity: 0, offset: 1 },
    ], { duration, easing: 'cubic-bezier(.18,.78,.18,1)', fill: 'forwards' });
    ring.animate([
      { opacity: 0, transform: 'translate(-50%,-50%) scale(.25)' },
      { opacity: 1, transform: 'translate(-50%,-50%) scale(1.1)', offset: .72 },
      { opacity: 0, transform: 'translate(-50%,-50%) scale(1.8)' },
    ], { duration: duration * .5, delay: duration * .48, easing: 'ease-out', fill: 'forwards' });
    window.setTimeout(finish, duration + 40);
  }

  function finish() {
    source.classList.remove('lifex-selection-source-active');
    options.targetElement?.classList.remove('lifex-selection-target-pulse');
    root.remove();
    options.onComplete?.();
  }
}
