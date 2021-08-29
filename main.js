const
init = () => {
	
	const	cfg = { ...SETTINGS },
			dur = parseInt(cfg.dur),
			tdur = parseFloat(cfg.transition_dur),
			files = cfg.files,
			filesLength = files.length,
			totalDur = dur * filesLength,
			
			is = document.createElement('c-is'),
			iss = [],
			
			body = document.body,
			appNode = document.getElementById('app'),
			frameNode = document.getElementById('frame'),
			textNode = document.getElementById('text'),
			screenNode = document.getElementById('screen'),
			
			iteratedAnimation = event => {
					
					const	elapse = event.elapsedTime,
							index = (elapse - totalDur * (elapse / totalDur | 0)) / totalDur * filesLength | 0,
							lastIndex = index - 1 < 0 ? filesLength - 1 : index - 1,
							lw = getCSSV(appNode, `image-seq-whole-${lastIndex}-width`),
							lh = getCSSV(appNode, `image-seq-whole-${lastIndex}-height`),
							w = getCSSV(appNode, `image-seq-whole-${index}-width`),
							h = getCSSV(appNode, `image-seq-whole-${index}-height`),
							mh = getCSSV(appNode, 'image-seq-max-height'),
							lc = parseInt(lh) / parseInt(mh), c = parseInt(h) / parseInt(mh),
							cc = 1.1;
					
					files[index].text_a ? (textNode.dataset.textA = files[index].text_a) : delete textNode.dataset.textA,
					files[index].text_b ? (textNode.dataset.textB = files[index].text_b) : delete textNode.dataset.textB,
					
					// https://css-tricks.com/restart-css-animation/#update-another-javascript-method-to-restart-a-css-animation
					appNode.dataset.current = '';
					void frameNode.offsetWidth;
					appNode.dataset.current = typeof files[index].label === 'string' ? files[index].label : '',
					
					setCSSV(body, 'last-bgi', getCSSV(appNode, `image-seq-whole-${lastIndex}-url`)),
					setCSSV(body, 'last-width', lw),
					setCSSV(body, 'last-height', lh),
					setCSSV(body, 'last-raw-width', parseInt(lw)),
					setCSSV(body, 'last-raw-height', parseInt(lh)),
					setCSSV(body, 'last-correction', lc + (1 - lc) / cc),
					setCSSV(body, 'bgi', getCSSV(appNode, `image-seq-whole-${index}-url`)),
					setCSSV(body, 'width', w),
					setCSSV(body, 'height', h);
					setCSSV(body, 'raw-width', parseInt(w)),
					setCSSV(body, 'raw-height', parseInt(h)),
					setCSSV(body, 'correction', c + (1 - c) / cc);
					
				};
	let i,i0;
	
	document.documentElement.style.setProperty('--a-duration', `${Number.isNaN(dur) ? 5 : dur}s`),
	
	i = -1;
	while (document.styleSheets[++i]) {
		i0 = -1;
		while (document.styleSheets[i].cssRules[++i0]) {
			if (
				!(document.styleSheets[i].cssRules[i0] instanceof CSSKeyframesRule) ||
				document.styleSheets[i].cssRules[i0].name !== 'transition'
			) continue;
			document.styleSheets[i].cssRules[i0].cssRules[1].keyText =
				`${Math.max(0, Math.min((isNaN(tdur) ? 0.04 : tdur) * 100, 100))}%`;
			break;
		}
		if (document.styleSheets[i].cssRules[i0]) break;
	}
	
	is.ifor = 'app',
	is.setAttribute('cvar', cfg.cssvar),
	
	is.addEventListener('updated-all', event => (
			frameNode.addEventListener('animationstart', iteratedAnimation, eventOnce),
			frameNode.addEventListener('animationiteration', iteratedAnimation),
			body.classList.add('initialized')
		), eventOnce),
	
	i = -1;
	while (++i < filesLength)	typeof files[i] === 'string' && (files[i] = { file_path: files[i] }),
										(iss[i] = document.createElement('c-ii')).src = files[i].file_path;
	
	is.append(...iss),
	
	body.appendChild(is);
	
},

eventOnce = { once: true },

setCSSV = (element, name, value) => element.style.setProperty(`--${name}`, value),
getCSSV = (element, name) => element.style.getPropertyValue(`--${name}`),

boot = () =>	(
						defineCustomElements(CHTMLImageSeq, CHTMLImageSeqItem),
						customElements.whenDefined('c-is').then(() => customElements.whenDefined('c-ii')).then(init).
							catch(error => (alert(error), console.error(error)))
					);

addEventListener('load', boot, eventOnce);