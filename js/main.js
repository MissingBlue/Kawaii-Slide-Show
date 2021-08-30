//todo: フォーカスポイント機能*延期ないし中止: 仮に実装する場合、任意の数設定できるようにする。
let profileName;
const
customElementTagNames = [ 'c-is', 'c-ii' ],
definesCustomElements = tagNames => new Promise((rs, rj) => {
	
	const whenDefined = () => {
				
				const	tagName = tagNames.shift();
				
				(tagName !== undefined && typeof tagName !== 'string') ?
					rj(new TypeError('A type of tagName must be string.')) :
					tagName ?	customElements.whenDefined(tagName).then(whenDefined).catch(xError) :
									rs();
				
			},
			xError = error => rj(error);
	
	Array.isArray(tagNames) || (tagNames = [ tagNames ]), whenDefined();
	
}),
boot = cfg => {
	
	try {
		
		if (!cfg || typeof cfg !== 'object') throw new TypeError('The setting data must be type "object".');
		
		if (!cfg.profile || typeof cfg.profile !== 'object')
			throw new TypeError('The profile data must be type "object".');
		
		if (typeof (profileName = ''+cfg.profileName.trim()) !== 'string')
			throw new TypeError('The profileName must be "string"');
		
		profileName[profileName.length - 1] === '*' &&
			(profileName = profileName.slice(0,-1), document.body.classList.add('dev'));
		
		if (!(profileName in cfg.profile)) throw new Error(`There are no profile such "${profileName}"`);
		
	} catch (error) {
		
		alert(error);
		return;
		
	}
	
	const css = document.createElement('link');
	let k;
	
	for (k in cfg.profile[profileName]) cfg[k] = cfg.profile[profileName][k];
	
	css.rel = 'stylesheet',
	css.href = `css/${profileName}.css`,
	document.head.appendChild(css),
	
	defineCustomElements(CHTMLImageSeq, CHTMLImageSeqItem),
	
	definesCustomElements(customElementTagNames).then(() => init(cfg)).catch(xError);
	
},
init = cfg => {
	
	const	dur = parseInt(cfg.dur),
			tdur = parseFloat(cfg.transition_dur),
			pos = parseInt(cfg.position),
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
	
	'app_width' in cfg && !isNaN(parseInt(cfg.app_width)) &&
		(appNode.style.setProperty('width', cfg.app_width, 'important')),
	'app_height' in cfg && !isNaN(parseInt(cfg.app_height)) &&
		(appNode.style.setProperty('height', cfg.app_height, 'important')),
	
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
	
	body.classList.add(`f${isNaN(pos) ? 3 : Math.min(Math.max(pos, 0), 9)}`),
	
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
xError = error => (console.error(error), alert(error)),

eventOnce = { once: true },

setCSSV = (element, name, value) => element.style.setProperty(`--${name}`, value),
getCSSV = (element, name) => element.style.getPropertyValue(`--${name}`);

settingsAvailable.then(settings => addEventListener('load', () => boot(settings), eventOnce)).catch(xError);