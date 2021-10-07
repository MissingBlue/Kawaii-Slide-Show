//todo	cond に自身の終了時に他の任意の cond を開始するプロパティ then の設定（親から子へ行う動作を兄弟間などでも行なえるようにする）
//			elements への <audio> ではない音声ファイルの指定。
class App {
	
	constructor (cfg) {
		
		this.files = [],
		
		this.updatedAll = () => this.prefetch(),
		
		this.available = new Promise((rs, rj) => {
			
			const	whenDefined = () => {
						
						const	ce = App.customElementConstructors[++i];
						
						ce ?	(
									customElements.define(ce.tagName, ce),
									customElements.whenDefined(ce.tagName).then(whenDefined).catch(App.xError)
								) : (this.boot(cfg), rs(this));
						
					};
			let i;
			
			i = -1, whenDefined();
			
		}); 
		
	}
	
	async boot(cfg) {
		
		if (!isObj(cfg)) throw new TypeError('The setting data must be type "object".');
		
		this.html = document.documentElement,
		this.body = document.body,
		this.appNode = document.getElementById('app'),
		this.frameNode = document.getElementById('frame'),
		this.textNode = document.getElementById('text'),
		this.screenNode = document.getElementById('screen'),
		
		App.loadProfile(this.cfg = cfg),
		App.setAttrTo(cfg.attr, App.delayedRatePlaceholderRx,undefined,App.replaceWith(cfg)),
		App.appendCSS(cfg.css, App.delayedRatePlaceholderRx,undefined,App.replaceWith(cfg)),
		
		this.dur = cfg.dur,
		this.pos = cfg.position,
		
		this.cc = 1.1,
		
		this.asset = obje(cfg.asset),
		isObj(cfg.resource) && await (this.resource = new Resource()).fetch(cfg.resource),
		
		this.order = [],
		
		this.setAppBound('app_width' in cfg ? cfg.app_width : '100%', 'app_height' in cfg ? cfg.app_height : '50%'),
		
		(this.is = document.createElement('c-is')).ifor = 'app',
		this.is.setAttribute('cvar', cfg.cssvar),
		this.is.addEventListener('updated-all', event => (
				
				this.prefetch(),
				this.transit(this.files[0], this.files[this.files.length - 1]),
				this.is.addEventListener('updated-all', this.updatedAll)
				
			), App.eventOnce),
		
		this.appendFile(...arr(cfg.files)),
		
		this.body.appendChild(this.is);
		
	}
	setAppBound(width, height = width) {
		
		this.appNode.style.setProperty('width', width, 'important'),
		this.appNode.style.setProperty('height', height, 'important');
		
	}
	appendFile(...files) {
		
		const l = files.length, iis = [], fs = this.files, tmp = this.cfg.template;
		let i,i0,i1, f, exclusive;
		
		i = -1;
		while (++i < l) if ((f = files[i]) && typeof f === 'object' && (exclusive = f.exclusive)) break;
		
		i = i0 = -1, i1 = fs.length;
		while (++i < l)
			(exclusive ? isObj(f = files[i]) && f.exclusive && f : (f = files[i] = objc(files[i], 'file_path'))) &&
				typeof f.file_path === 'string' && (
				
				(iis[++i0] = (fs[i1++] = f).ii = document.createElement('c-ii')).src = f.file_path,
				
				f.delayedReplace = new Map(), f.serial = [],
				f.assets = [ ...arr(f.assets || this.cfg.assets) ],
				
				typeof f.elements === 'string' && (f.elements = App.lazyCopy(tmp[f.elements])),
				(!f.elements || typeof f.elements !== 'object') && (f.elements = App.lazyCopy(tmp.default)),
				(f.elements = arr(f.elements)).length || (f.elements = arr(App.lazyCopy(tmp.default)))
				
			);
		
		this.is.append(...iis);
		
	}
	removeFileByIndex(...indices) {
		
		// このメソッドは想定に基づく実装で、仕様の正当性および動作は未検証。
		
		const l = indices.length;
		let i,i0, f,elms,elm;
		
		i = -1;
		while (++i < l) {
			i0 = -1, elms = (f = this.files.splice(indices[i], 1)).elms;
			while (elm = elms[++i0]) elm.$ && (elm.beginCond.clear(true), elm.endCond.clear(true), elm.$.remove());
			f.ii.remove();
		}
		
	}
	
	prefetch() {
		
		const mh = parseFloat(this.appNode.style.getPropertyValue('--image-seq-max-height')),
				appDur = this.dur,
				fs = this.files,
				feOption = {};
		let i,i0,l0, f,lf, fes,fe,elm;
		
		i = -1;
		while (f = fs[++i]) {
			
			// <c-is> から appNode に設定された CSS 変数の一部を収集。
			(f.cv = App.fetchCSSV(
							this.appNode,
							{
								[(i0 = App.CSS_VAR_PREFIX + i + '-') + 'width']: 'w',
								[i0 + 'height']: 'h',
								[i0 + 'url']: 'u'
							}
						)
			).c =	f.cv._h / mh,
			
			this.html.style.setProperty(`--a-${i}-duration`, f.dur = dbl(f.dur, appDur)),
			typeof f.id === 'string' && f.id && this.html.style.setProperty(`--a-${f.id}-duration`, f.dur),
			
			f.index = int(f.index, 0,-Infinity);
			
			// 子要素
			f.delayedReplace.clear(), f.serial.length = 0,
			i0 = -1, l0 = feOption.l = (fes = f.elements = arr(f.elements)).length;
			while ((feOption.i = ++i0) < l0) fes[i0] = this.createElements(fes[i0], f, feOption);
			
		}
		
		// この値は画像の情報を示すため、子要素へネストして設定する必要はない。
		i = -1, fs.sort((a,b) => a.index - b.index);
		while (f = fs[++i])	f.ccv =	{
													'last-bgi':
														(lf = fs[(i0 = i - 1) < 0 ? (i0 = fs.length - 1) : i0]).cv.u,
													'last-width': lf.cv.w,
													'last-height': lf.cv.h,
													'last-raw-width': lf.cv._w,
													'last-raw-height': lf.cv._h,
													'last-correction': lf.cv.c + (1 - lf.cv.c) / this.cc,
													'bgi': f.cv.u,
													'width': f.cv.w,
													'height': f.cv.h,
													'raw-width': f.cv._w,
													'raw-height': f.cv._h,
													'correction': f.cv.c + (1 - f.cv.c) / this.cc
												};
		
	}
	createElements(fe, f, option) {
		
		if (
			!(
				fe = typeof fe === 'string' ?
					App.templateNameRx.test(fe) ? App.lazyCopy(this.cfg.template[fe.slice(1,-1)]) : { tag: fe } : fe
			) ||
			typeof fe !== 'object'
		) return;
		
		fe.beginCond instanceof Condition && fe.beginCond.clear(true),
		fe.endCond instanceof Condition && fe.endCond.clear(true),
		fe.$ instanceof Node && fe.$.remoce();
		
		const elm =	fe.$ = fe.tag || !('text' in fe) ?
							document.createElement(fe.tag || 'div') : document.createTextNode(''),
				
				r = App.replace,
				
				oi = (option = obje(option)).i,
				ol = option.l,
				
				rx = option.rx instanceof RegExp ? option.rx : App.delayedRatePlaceholderRx,
				replacer = typeof option.replacer === 'function' ? option.replacer : this.createFileReplacer(f, fe),
				dict = { ...obje(option.replaceDict), i: oi, l: ol };
		let i,l,i0,l0,k, text, children,child;
		
		fe.parent = fe.parent || option.parent || true,
		fe.text && (dict.__key = 'text', text = r(fe.text, rx,dict,replacer))
		
		if (elm instanceof HTMLElement) {
			
			typeof (children = fe.children) === 'string' && App.templateNameRx.test(children) &&
				(children = App.lazyCopy(this.cfg.template[children.slice(1,-1)])),
			
			i = -1, l = (children = fe.children = arr(children)).length;
			while (++i < l) {
				
				if (typeof (child = children[i]) === 'string') {
					
					App.templateNameRx.test(child) && (
							children.splice(i--,1, ...arr(App.lazyCopy(this.cfg.template[child.slice(1,-1)]))),
							l = children.length
						);
					
					continue;
					
				} else if (child && typeof child === 'object') continue;
				
				children.splice(i--, 1), --l;
				
			}
			
			i = -1, option.l = l;
			while ((option.i = ++i) < l) (children[i] = this.createElements(children[i], f, option)).nested = fe;
			
			text === undefined || elm.insertAdjacentText
				(typeof (fe.textTo = fe.textTo || option.textTo) === 'string' ? fe.textTo : 'afterbegin', text),
			
			App.setAttr('attr', elm, fe.attr, rx,dict,replacer),
			App.setAttr('style', elm, fe.style, rx,dict,replacer);
			
		} else if (text !== undefined) elm.textContent = text;
		
		(fe.beginCond || (fe.beginCond = new Condition())).set(fe.begin, true),
		fe.beginCond.standby(f.dur, fe.$),
		fe.xBegin = this.createElementBeginning(fe, f),
		fe.pendingBegin = !fe.begin || !!fe.begin.promise,
		
		(fe.endCond || (fe.endCond = new Condition())).set(fe.end, true),
		fe.endCond.standby(f.dur, fe.$),
		fe.xEnd = this.createElementEnd(fe, f),
		fe.pendingEnd = !fe.end || !!fe.end.promise;
		//fe.pendingEnd = typeof fe.end === 'boolean' || !!fe.end.promise;
		
		return f.serial[f.serial.length] = fe;
		
	}
	createFileReplacer(f, fe) {
		
		return (result, dict, rx) => {
				
				let i,l, v,values, replace;
				
				if (typeof result[1] === 'string') {
					// !number!
					// element が表示段階になった段階で、
					// ! で囲まれた数値の値を、element が属するファイルの現在の残り表示時間に乗算し、その値で置き換える。
					
					(replace = f.delayedReplace.get(fe)) || f.delayedReplace.set(fe, replace = {}),
					dict.__key in replace || (replace[dict.__key] = {}),
					replace[dict.__key][dict.__name] = result.input;
					
					return result[0];
					
				} else if (typeof result[4] === 'string') {
					// ?number?
					// element が this.files に追加された時（あるいはそれに順ずる状態）に
					// ? で囲まれた数値の値を、element が属するファイルの表示時間に乗算し、その値で置き換える。
					
					return f.dur * parseFloat(result[4]);
					
				} else if (typeof result[6] === 'string') {
					// [[string[.string[,string,...]]]]
					// 二重角括弧で囲んだ文字列をファイルオブジェクトないしコンフィグオブジェクトのプロパティへの参照として、該当するプロパティの値で置換する。
					// 該当するプロパティがファイルオブジェクトに存在しない場合はコンフィグオブジェクトのプロパティが用いられ、それも存在しない場合は空文字列で置換する。
					// 文字列を . で区切るとネストしたプロパティにアクセスできる。
					// , で区切ると、コンマ以前のプロパティが存在しない場合の代替プロパティを任意の数指定できる。
					// 逆に言えばファイルオブジェクト、コンフィグオブジェクトのプロパティ名に . , は使えない。
					
					i = -1, l = (values = result[6].split(',')).length;
					while (++i < l)	if (
												(v = get(f, ...(replace = values[i].split('.')))) !== undefined ||
												(v = get(this.cfg, ...replace)) !== undefined
											) break;
					
					return v === undefined ? '' : v;
					
				}
				
			};
		
	}
	createElementBeginning(fe, f) {
		
		return () => {
				
				const	placeholder = f.delayedReplace.get(fe);
				
				if (placeholder) {
					
					const	rx = App.delayedRatePlaceholderRx,
							replacer = match => (f.dur - (Date.now() - f.time) / 1000) * parseFloat(match[2]);
					
					App.setAttr('style', fe.$, placeholder.style, rx,undefined,replacer),
					App.setAttr('attr', fe.$, placeholder.attr, rx,undefined,replacer);
					
				}
				
				fe.parent && this.getParent(fe,f).appendChild(fe.$);
				
			};
		
	}
	/*
	createElementEnd(fe, f) {
		return () => (fe.beginCond.executed || Promise.resolve()).then(() => this.resolveAll(fe));
	}
	*/
	createElementEnd(fe, f) {
		
		return () => {
			
			// fe.end の値が true の時、fe のすべての子要素（再帰を含む）の endCond.excuted が解決された時に、自身の endCond を解決する。
			// 以下の fe.end === true は上記の仕様の実装だが、最適化および短絡化はほぼ行なっていない。
			
			if (fe.end === true) {
				
				let i,i0;
				
				const fetchEnd = fe => {
					let i, ends = [];
					if (Array.isArray(fe.children)) {
						i = -1;
						while (fe.children[++i])
							ends = [ ...ends, fe.children[i].endCond.executed, ...fetchEnd(fe.children[i]) ];
					}
					return ends;
				},
				end = () => ++i0 >= ends.length && this.resolveAll(fe),
				ends = fetchEnd(fe);
				
				i = -1, i0 = 0;
				while (ends[++i]) ends[i].then(end);
				
			} else (fe.beginCond.executed || Promise.resolve()).then(() => this.resolveAll(fe));
			
		}
		
	}
	resolveAll(fe, when = true) {
		
		if (!fe || typeof fe !== 'object') return;
		
		if (Array.isArray(fe.children)) {
			
			const children = fe.children, l = children.length;
			let i;
			
			i = -1;
			while (children[++i]) this.resolveAll(children[i], when);
			
		}
		
		when === true ?	(fe.beginCond.resolve(), fe.endCond.resolve()) :
								fe[(when === 'begin' || when === 'end' ? when : 'begin') + 'Cond'].resolve(),
		
		fe.$.remove();
		
	}
	getParent(fe, f) {
		
		return	(fe.parent === true ? fe.nested ? fe.nested.$ : f.parent === true ? this.screenNode :
							typeof f.parent === 'string' && document.querySelector(f.parent) :
						typeof fe.parent === 'string' && document.querySelector(fe.parent)) || this.screenNode;
		
	}
	
	transited(f, lf) {
		
		const fs = this.files, li = fs.indexOf(f) + 1;
		let i,fe;
		
		i = -1;
		while (fe = f.serial[++i]) fe.$ && (fe.beginCond.reset(), fe.endCond.reset(), fe.$.remove());
		
		this.transit(fs[li === fs.length ? 0 : li], f);
		
	}
	transit(f, lf) {
		
		const	fes = f.elements,
				fl = f.serial.length,
				finished = () => ++ei === fl && this.transited(f, lf);
		let i,l,i0,l0, ei, aid,rid,ex, p,fe,xFe,sib,fel;
		
		// リソースの設定
		if (this.resource) {
			
			if (lf.assets) {
				
				const lastAssets = lf.assets = arr(lf.assets);
				
				i = -1, l = lastAssets.length;
				while (++i < l) if (Array.isArray(aid = lastAssets[i]) && (i0 = -1, l0 = aid.length))
										while (++i < l)	typeof (ex = aid[i0].exit) === 'string' &&
																	typeof (ex = aid[i0][ex]) === 'function' && ex(f, lf);
				
			}
			
			if (f.assets) {
				
				const assets = f.assets = arr(f.assets);
				
				i = -1, l = assets.length;
				while (++i < l) {
					
					if (typeof (aid = assets[i]) === 'string') {
						
						if (Array.isArray(this.asset[aid]) && (i0 = -1)) while (rid = this.asset[aid][++i0])
							typeof rid === 'string' && (rid = this.resource.get(rid)) && (this.asset[aid][i0] = rid);
						
						aid = assets[i] = this.asset[aid];
						
					}
					
					if (Array.isArray(aid) && (i0 = -1, l0 = aid.length))
						while (++i0 < l0) typeof (ex = aid[i0].exec) === 'string' &&
													typeof (ex = aid[i0][ex]) === 'function' && (
															'args' in aid[i0] ?	!aid[i0].args && typeof aid[i0].args === 'object' ?
																						ex.call(aid[i0]) :
																						ex.apply(aid[i0], arr(aid[i0].args)) :
																						ex.call(aid[i0], f,lf));
					
				}
				
			}
			
		}
		
		this.html.style.setProperty('--a-current-duration', f.dur + 's'),
		
		//this.textNode.classList.remove('text'),
		//f.text_a ? (this.textNode.dataset.textA = f.text_a) : delete this.textNode.dataset.textA,
		//f.text_b ? (this.textNode.dataset.textB = f.text_b) : delete this.textNode.dataset.textB,
		//// https://css-tricks.com/restart-css-animation/#update-another-javascript-method-to-restart-a-css-animation
		//void this.textNode.offsetWidth,
		//this.textNode.classList.add('text'),
		
		this.appNode.dataset.current = typeof f.id === 'string' ? f.id : '',
		this.appNode.dataset.currentLabel =
			typeof f.labels === 'string' ? f.labels : Array.isArray(f.labels) ? f.labels.join(' ') : '',
		
		App.setCSSV(this.body, f.ccv),
		
		f.time = Date.now(),
		
		i = -1, ei = 0;
		while (fe = f.serial[++i])
			fe.beginCond.execute(null, fe.nested || isObj(fe.begin) ? fe.pendingBegin : false).then(fe.xBegin),
			fe.endCond.execute(null, fe.nested || isObj(fe.end) ? fe.pendingEnd : false).then(fe.xEnd).then(finished);
		
		i = -1;
		while (fe = f.serial[++i]) {
			
			fel = (sib = fe.nested ? fe.nested.children : fes).length;
			
			if (fe.begin) {
				
				if (
					(p = fe.begin.promise) && typeof p === 'object' &&
					(xFe = 'index' in p ? sib[int(sib.indexOf(fe) + int(p.index, -1,-Infinity), 0, 0, fel - 1)] : null)
				) {
					
					xFe[`${p.when === 'begin' || p.when === 'end' ? p.when : 'begin'}Cond`].executed.
						then(App.createExecution(fe, 'begin'));
					
				}
				
			}
			
			xFe || !fe.beginCond.passive ? (xFe = null) : (
					fe.nested ?	fe.nested.beginCond.executed.then(App.createExecution(fe, 'begin')) :
									fe.beginCond.resolve()
				);
			
			if (fe.end) {
				
				if (
					(p = fe.end.promise) && typeof p === 'object' &&
					(xFe = 'index' in p ? sib[int(sib.indexOf(fe) + int(p.index, -1,-Infinity), 0, 0, fel - 1)] : null)
				) {
					
					xFe[`${p.when === 'begin' || p.when === 'end' ? p.when : 'end'}Cond`].executed.
						then(App.createExecution(fe, 'end'));
					
				}
				
			}
			
			xFe || !fe.endCond.passive ? (xFe = null) : (
					fe.nested ?	fe.nested.endCond.executed.then(App.createExecution(fe, 'end')) :
									fe.endCond.resolve()
				);
			
		
		}
		
	}
	
	get dur() { return parseFloat(this.html.style.getPropertyValue('--a-duration')); }
	set dur(v) {
		
		this.html.style.setProperty('--a-duration', v = dbl(v,5,0) + 's'),
		this.html.style.getPropertyValue('--a-current-duration') === '' &&
			this.html.style.setProperty('--a-current-duration', v);
		
	}
	get pos() {
		
		const result = App.appPosRx.exec(this.body.className);
		
		return result && result[1];
		
	}
	set pos(v) {
		
		const result = App.appPosRx.exec(this.body.className);
		
		result && (this.body.classList.remove(result[1])),
		
		this.body.classList.add('f' + int(Math.round(dbl(v, 1,1,9)), 1,1,9));
		
	}
	get totalDur() { return this.dur * this.files.length; }
	set totalDur(v) { this.dur = v / this.files.length; }
	
	static createExecution(fe, when) {
		
		return () => fe[when + 'Cond'].resolve();
		
	}
	
	static CSS_VAR_PREFIX = 'image-seq-whole-';
	static ignoresProperties = [ 'files' ];
	static eventOnce = { once: true };
	static appPosRx = /(?:^|\s)+(f\d)(?:\s|$)+/;
	static templateNameRx = /\{.+\}/;
	static delayedRatePlaceholderRx = /(?:(\!([.\d]+)\!)|(\?([.\d]+)\?)|(\[\[([^\r\n\t]+)\]\]))/g;
	static customElementConstructors = [ CHTMLImageSeq, CHTMLImageSeqItem ];
	static xError = error => (console.error(error), alert(error));
	static loadProfile(cfg) {
		
		const profileNames = arr(cfg.profileName), l = profileNames.length, profile = cfg.profile;
		let i,k,v, pn,p, error, overrides;
		
		i = -1;
		while (++i < l) {
			
			if (
				error =	typeof (pn = profileNames[i] = (''+profileNames[i]).trim()) === 'string' ?
								!isObj(p = profile[pn]) && `There are no profile such "${pn}"` :
								'The profileName must be a "string"'
			) console.error(error), error = null;
			else {
				
				overrides = arr(p.overrides);
				
				for (k in p) {
					
					switch (k) {
						case 'files':
						cfg[k] = overrides.includes(k) ? arr(p[k]) : [ ...arr(cfg[k]), ...arr(p[k]) ];
						break;
						case 'template':
						cfg[k] = overrides.includes(k) ? obje(p[k]) : { ...obje(cfg[k]), ...obje(p[k]) };
						break;
						default: App.ignoresProperties.includes(k) || (cfg[k] = p[k]);
					}
					
				}
				
			}
			
		}
		
		return cfg;
		
	};
	static appendCSS(hrefs) {
		
		const l = (hrefs = arr(hrefs)).length, head = document.head;
		let i, link;
		
		i = -1;
		while (++i < l) typeof hrefs[i] === 'string' &&
			((link = document.createElement('link')).rel = 'stylesheet', (head.appendChild(link)).href = hrefs[i]);
		
	};
	static setCSSV(element, indexed) {
		
		let k;
		
		for (k in indexed) element.style.setProperty(`--${k}`, indexed[k]);
		
	};
	static fetchCSSV(element, index) {
		
		let k,v;
		
		for (k in index)	v = index[k],
								delete index[k],
								index[`_${v}`] = parseInt(index[v] = element.style.getPropertyValue(`--${k}`)),
								index[`__${v}`] = parseFloat(index[v]);
		
		return index;
		
	};
	// String.prototype.replaceAll の不完全なポリフィルだが、Google Chrome で同メソッドが実装されたのがかなり遅いため、
	// OBS など組み込みで Chromium を採用する環境において必要になる。
	// このメソッドを正規表現とともに使う場合、フラグ g の設定は必須で、未設定の場合無限ループになる。
	static replace(str, rx, dict, replacer) {
		
		let result, replaced, lastIndex;
		
		if (!rx) return str;
		
		replaced = '';
		while (result = rx.exec(str))	replaced += str.substring(lastIndex || 0, result.index) +
													(typeof replacer === 'function' ? replacer(result, dict, rx) : replacer),
												lastIndex = rx.lastIndex;
		
		return lastIndex === undefined ? str : replaced + str.substring(lastIndex);
		
	}
	// このメソッドは一見シンプルだが、内部処理用の setAttr のラッパー関数で、想定処理内容に対し実行コストが高く、
	// そのコストにも実装上の手抜き以上の意味はない。
	static setAttrTo(attr, rx,dict,replacer) {
		
		let i,k, elms;
		
		if (!attr || typeof attr !== 'object') return;
		
		for (k in attr) {
			i = -1, elms = document.querySelectorAll(k);
			while (elms[++i]) App.setAttr(undefined, elms[i], attr[k], rx,dict,replacer);
		}
		
	}
	static replaceWith(object) {
		
		(object && typeof object === 'object') || (object = {});
		
		return (result, dict, rx) => {
				
				if (typeof result[6] !== 'string') return;
				
				let i,l,v, values,replace;
				
				i = -1, l = (values = result[6].split(',')).length;
				while (++i < l) if ((v = get(object, ...(replace = values[i].split('.')))) !== undefined) return v;
				
				return '';
				
			};
		
	}
	static setAttr(type, elm, attr, rx,dict,replacer) {
		
		let k;
		
		if (!(attr && typeof attr === 'object' && elm instanceof HTMLElement)) return;
		
		const	obj = type === 'style' ? elm.style : elm,
				method = type === 'style' ? 'setProperty' : 'setAttribute',
				r = App.replace;
		
		dict = objc(dict, '__k', type);
		for (k in attr) obj[method](r(dict.__name = k, rx,dict,replacer), r(dict.___name = attr[k], rx,dict,replacer));
		delete dict.__k, delete dict.__name, delete dict.___name;
		
	}
	static lazyCopy(json) {
		try {
			json = JSON.parse(JSON.stringify(json));
		} catch (error) {
			console.error(error),
			json = null;
		}
		return json;
	}
	
}