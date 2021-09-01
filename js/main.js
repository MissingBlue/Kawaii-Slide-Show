//todo:	フォーカスポイント機能*延期ないし中止: 仮に実装する場合、任意の数設定できるようにする。
//			特定の画像の全面を覆いそこに任意の文字表示。
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
	
	let i,l,k,k0, profileName,css,element;
	
	try {
		
		if (!cfg || typeof cfg !== 'object') throw new TypeError('The setting data must be type "object".');
		
		if (!cfg.profile || typeof cfg.profile !== 'object')
			throw new TypeError('The profile data must be type "object".');
		
		i = -1, l = (profileName = Array.isArray(cfg.profileName) ? cfg.profileName : [ cfg.profileName ]).length;
		while (++i < l) {
			
			if (typeof (profileName[i] = ''+profileName[i].trim()) !== 'string')
				throw new TypeError('The profileName must be "string"');
			if (!(profileName[i] in cfg.profile)) throw new Error(`There are no profile such "${profileName[i]}"`);
			
			for (k in cfg.profile[profileName[i]])
				cfg[k] = k === 'files' ? [ ...cfg[k], ...cfg.profile[profileName[i]][k] ] : cfg.profile[profileName[i]][k];
			
		}
		
	} catch (error) {
		
		alert(error);
		return;
		
	}
	
	if (cfg.attr && typeof cfg.attr === 'object') {
		
		for (k in cfg.attr)
			if (element = document.querySelector(k)) for (k0 in cfg.attr[k]) element.setAttribute(k0, cfg.attr[k][k0]);
		
	}
	
	i = -1, l = (cfg.css = Array.isArray(cfg.css) ? cfg.css : [ cfg.css ]).length;
	while (++i < l) cfg.css[i] && (
												(css = document.createElement('link')).rel = 'stylesheet',
												css.href = cfg.css[i],
												document.head.appendChild(css)
											);
	
	defineCustomElements(CHTMLImageSeq, CHTMLImageSeqItem),
	definesCustomElements(customElementTagNames).then(() => init(cfg)).catch(xError);
	
},
init = async function (cfg) {
	
	const	dur = parseInt(cfg.dur),
			tdur = range(parseFloat(cfg.transition_dur), 0,1),
			trdelay = range(parseFloat(cfg.transition_reflection_delay), 0,1),
			trdur = range(parseFloat(cfg.transition_reflection), 0,1),
			pos = parseInt(cfg.position),
			files = cfg.files,
			filesLength = files.length,
			totalDur = dur * filesLength,
			
			asset = (cfg.asset && typeof cfg.asset === 'object') ? cfg.asset : {},
			resource = new Resource(cfg.resource),
			
			is = document.createElement('c-is'),
			iss = [],
			
			body = document.body,
			appNode = document.getElementById('app'),
			frameNode = document.getElementById('frame'),
			textNode = document.getElementById('text'),
			screenNode = document.getElementById('screen'),
			
			iteratedAnimation = event => {
					
					if (event.animationName !== 'interval') return;
					
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
					let i,i0,aid,rid;
					
					if (cfg.resource) {
						
						if (files[lastIndex].assets) {
							
							i = -1;
							while (aid = files[lastIndex].assets[++i]) {
								if (!Array.isArray(aid)) continue;
								i0 = -1;
								while (aid[++i0]) typeof aid[i0].exit === 'string' && aid[i0][aid[i0].exit]();
							}
							
						}
						
						if (files[index].assets) {
							
							i = -1, Array.isArray(files[index].assets) || (files[index].assets = [ files[index].assets ]);
							while (aid = files[index].assets[++i]) {
								
								if (typeof aid === 'string') {
									
									if (!asset[aid]) continue;
									
									i0 = -1;
									while (rid = asset[aid][++i0])
										typeof rid === 'string' && (rid = resource.get(rid)) && (asset[aid][i0] = rid);
									
									aid = files[index].assets[i] = asset[aid];
									
								}
								
								i0 = -1;
								while (aid[++i0]) aid[i0][aid[i0].exec]();
								
							}
							
						}
						
					}
					
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
	let i;
	
	'app_width' in cfg && !isNaN(parseInt(cfg.app_width)) &&
		(appNode.style.setProperty('width', cfg.app_width, 'important')),
	'app_height' in cfg && !isNaN(parseInt(cfg.app_height)) &&
		(appNode.style.setProperty('height', cfg.app_height, 'important')),
	
	document.documentElement.style.setProperty('--a-duration', `${Number.isNaN(dur) ? 5 : dur}s`),
	
	body.classList.add(`f${isNaN(pos) ? 3 : Math.min(Math.max(pos, 0), 9)}`),
	
	is.ifor = 'app',
	is.setAttribute('cvar', cfg.cssvar),
	
	is.addEventListener('updated-all', event => (
			
			setKeyframeText('transition', v => `${(isNaN(v) ? 0.04 : v) * 100}%`, { i: 1, v: tdur }),
			setKeyframeText(
					'frame-bg',
					(v,i, kfs) => `${v === undefined ? parseFloat(kfs[--i].keyText) + 0.1 : isNaN(v) ? 0.0 : v}%`,
					{ i: 1, v: 100 * trdelay }, { i: 2, v: 100 * (1 - trdelay) * trdur + (100 * trdelay) }, { i: 3 }
				),
			
			body.addEventListener('animationstart', iteratedAnimation, eventOnce),
			body.addEventListener('animationiteration', iteratedAnimation),
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
getCSSV = (element, name) => element.style.getPropertyValue(`--${name}`),
range = (v,min,max) => Math.min(Math.max(v, min), max),

setKeyframeText = (name, calc, ...keys) => {
	
	let i,i0,i1,i2,i3,css,rule,rule0,rule1,kf;
	
	i = -1, css = document.styleSheets;
	while (css[++i]) {
		
		i0 = -1;
		while (rule = css[i].rules[++i0]) {
			i1 = -1;
			while (rule0 = rule.styleSheet.cssRules[++i1]) {
				
				if (!(rule0 instanceof CSSKeyframesRule) || rule0.name !== name) continue;
				
				i2 = -1;
				while (keys[++i2]) {
					
					if (!(rule1 = rule0.cssRules[keys[i2].i])) continue;
					
					if ((kf = calc(keys[i2].v, keys[i2].i, rule0.cssRules)) === 'to' || range(parseInt(kf),0,100) >= 100) {
						
						i3 = keys[i2].i + 1;
						while (rule0.cssRules[i3]) rule0.deleteRule(rule0.cssRules[i3].keyText);
						
					}
					
					rule1.keyText = kf;
					
					if (!rule0.cssRules[keys[i2].i + 1]) break;
					
				}
				break;
			}
			
			if (rule0) return;
			
		}
		
	}
	
};

settingsAvailable.then(settings => addEventListener('load', () => boot(settings), eventOnce)).catch(xError);