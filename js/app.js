//todo	cond に自身の終了時に他の任意の cond を開始するプロパティ then の設定（親から子へ行う動作を兄弟間などでも行なえるようにする）
//			elements への <audio> ではない音声ファイルの指定。
//issues	iOS で動かない: static の対応が iOS 14.5 からであるのが今のところ確認できている理由。
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
		this.cue = this.cfg.cue,
		
		this.cc = 1.1,
		
		this.asset = obje(cfg.asset),
		isObj(cfg.resource) && await (this.resource = new Resource()).fetch(cfg.resource),
		
		this.order = [],
		
		this.setAppBound('app_width' in cfg ? cfg.app_width : '100%', 'app_height' in cfg ? cfg.app_height : '50%'),
		
		(this.is = document.createElement('c-is')).ifor = 'app',
		this.is.setAttribute('cvar', cfg.cssvar),
		this.is.addEventListener('updated-all', event => {
				
				
				this.prefetch();
				
				const l = this.files.length;
				let l0 = l - 1;
				
				this.transit(
						this.files[this.cue = int(this.cue < 0 ? l + this.cue : this.cue, 0, 0, l0)],
						this.files[int(this.cue - 1, l0, 0, l0)]
					),
				this.is.addEventListener('updated-all', this.updatedAll)
				
			}, App.eventOnce),
		
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
				
				typeof f.elements === 'string' && (f.elements = App.fastCopy(tmp[f.elements])),
				(!f.elements || typeof f.elements !== 'object') && (f.elements = App.fastCopy(tmp.default)),
				(f.elements = arr(f.elements)).length || (f.elements = arr(App.fastCopy(tmp.default)))
				
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
	getTemplate(name, template = this.cfg.template, replacer) {
		
		let i,l;
		
		if (name && typeof name === 'string' && App.templateNameRx.test(typeof replacer === 'function' ? (name = replacer(name)) : name) && (l = (name = name.slice(1,-1).split('?')).length)) {
			
			i = -1;
			while (++i < l) if (name[i] in template) return App.fastCopy(template[name[i]]);
			
		}
		
	}
	createElements(fe, f, option) {
		
		const	r = str => App.replace(str, rx,dict,replacer),
				oi = (option = obje(option)).i,
				ol = option.l,
				rx = option.rx instanceof RegExp ? option.rx : App.delayedRatePlaceholderRx,
				dict = { ...obje(option.replaceDict), i: oi, l: ol },
				replacer = typeof option.replacer === 'function' ? option.replacer : this.createFileReplacer(f, fe);
		
		if (
			!(fe = typeof fe === 'string' ? this.getTemplate(fe, undefined, r) || { tag: fe } : fe) ||
			typeof fe !== 'object'
		) return;
		
		fe.beginCond instanceof Condition && fe.beginCond.clear(true),
		fe.endCond instanceof Condition && fe.endCond.clear(true),
		fe.$ instanceof Node && fe.$.remove();
		
		const elm =	fe.$ = fe.tag || !('text' in fe) ?
							document.createElement(fe.tag || 'div') : document.createTextNode(''),
				attrReplacer = match => {let a = (f.dur - (Date.now() - f.time) / 1000) * parseFloat(match[2]);/*hi(f.dur,(Date.now() - f.time) / 1000,a,match[2],fe);*/return a;},
				template =	isObj(f.template) ?
									isObj(fe.template) ?	{ ...this.cfg.template, ...f.template, ...fe.template } :
																{ ...this.cfg.template, ...f.template } :
									isObj(fe.template) ?	{ ...this.cfg.template, ...fe.template } :
																this.cfg.template;
		let i,l,i0,l0,k,k0, text,html, children,child, placeholder,attr,attr0;
		
		fe.parent = fe.parent || option.parent || true,
		fe.text && (dict.__key = 'text', text = r(fe.text))
		
		if (elm instanceof HTMLElement) {
			
			i = -1, l = (children = fe.children = arr(this.getTemplate(fe.children, template, r) || fe.children)).length;
			while (++i < l) {
				
				if (child = this.getTemplate(children[i], template, r)) {
					
					children.splice(i--,1, ...arr(child)), l = children.length;
					
					continue;
					
				} else if ((child = children[i]) && typeof child === 'object') continue;
				
				children.splice(i--, 1), --l;
				
			}
			
			i = -1, option.l = l;
			while ((option.i = ++i) < l) (children[i] = this.createElements(children[i], f, option)).nested = fe;
			
			text === undefined || elm.insertAdjacentText
				(typeof (fe.textTo = fe.textTo || option.textTo) === 'string' ? fe.textTo : 'afterbegin', text),
			
			'html' in fe && typeof fe.html === 'string' && (
				typeof (fe.htmlTo = fe.htmlTo || option.htmlTo || fe.textTo) === 'string' || (fe.htmlTo = 'afterbegin'),
				dict.__key = 'html',
				elm.insertAdjacentHTML(fe.htmlTo, fe.html = r(r(fe.html)))
			),
			
			fe._attr = App.setAttr('attr', elm, fe.attr, rx,dict,replacer),
			fe._style = App.setAttr('style', elm, fe.style, rx,dict,replacer);
			
		} else if (text !== undefined) elm.textContent = text;
		
		fe.begin && typeof fe.begin.timeout === 'string' &&
			(dict.__key = 'beginTimeout', fe.begin.timeout = r(fe.begin.timeout)),
		(fe.beginCond || (fe.beginCond = new Condition())).set(fe.begin, true),
		fe.beginCond.standby(f.dur, fe.$),
		fe.pendingBegin = !fe.begin || !!fe.begin.promise,
		
		fe.end && typeof fe.end.timeout === 'string' &&
			(dict.__key = 'endTimeout', fe.end.timeout = r(fe.end.timeout)),
		(fe.endCond || (fe.endCond = new Condition())).set(fe.end, true),
		fe.endCond.standby(f.dur, fe.$),
		fe.pendingEnd = !fe.end || !!fe.end.promise;
		
		if (placeholder = f.delayedReplace.get(fe)) {
			
			fe.attrRx = App.delayedRatePlaceholderRx,
			fe.attrReplacer = attrReplacer;
			for (k in placeholder) {
				switch (k) {
					case 'attr': case 'style':
					attr = fe['$' + k] = {}, attr0 = fe['_' + k];
					for (k0 in placeholder[k]) attr[k0] = attr0[k0];
					break;
					case 'beginTimeout': case 'endTimeout': fe[k] = placeholder[k];
				}
			}
			
		}
		
		//fe.traces && fe.$.addEventListener('animationstart', e => (hi(getComputedStyle(fe.$).getPropertyValue('--delay-out'), Date.now() - f.time),fe.traceTimer = setInterval(()=>hi(Date.now() - f.time), 33)), { once: true });
		
		return f.serial[f.serial.length] = fe;
		
	}
	createFileReplacer(f, fe) {
		
		return (result, dict, rx) => {
				
				let i,l, v,values, replace,defaultValue;
				
				if (typeof result[1] === 'string') {
					// !number!
					// element が表示段階になった段階で、
					// ! で囲まれた数値の値を、element が属するファイルの現在の残り表示時間に乗算し、その値で置き換える。
					
					(replace = f.delayedReplace.get(fe)) || f.delayedReplace.set(fe, replace = {}),
					!(dict.__key in replace) && dict.__name && (replace[dict.__key] =  {}),
					(dict.__name ? replace[dict.__key] : replace)[dict.__name || dict.__key] = result.input;
					
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
					// : で区切ると、指定したプロパティがすべて存在しない場合の既定値として使われる。
					// : は任意の位置で任意の数指定できるが、より後方のものがひとつだけ採用される。
					// 逆に言えばファイルオブジェクト、コンフィグオブジェクトのプロパティ名に . , : は使えない。
					
					i = -1, l = (values = result[6].split(',')).length;
					while (++i < l)	if (
												(v = values[i].split(':'), v[1] && (defaultValue = v[1]), v = v[0] || undefined) && (
													(v = get(f, ...(replace = v.split('.')))) !== undefined ||
													(v = get(this.cfg, ...replace)) !== undefined
												)
											) break;
					
					return v === undefined ? defaultValue === undefined ? '' : defaultValue : v;
					
				}
				
			};
		
	}
	createElementBeginning(fe, f) {
		
		return fe.begins = new Promise((rs,rj) => fe.beginCond.executed.then(() => {
				
				//const setAttr = () =>
				let html;
				
				typeof fe.beginTimeout === 'string' &&
					fe.beginCond.interruptTimeout(App.replace(fe.beginTimeout, fe.attrRx,undefined,fe.attrReplacer)),
				typeof fe.endTimeout === 'string' &&
					fe.endCond.interruptTimeout(App.replace(fe.endTimeout, fe.attrRx,undefined,fe.attrReplacer)),
				
				//(html = html || fe.html) && fe.$.insertAdjacentHTML(fe.htmlTo, html),
				
				fe.attrRx && !fe.$.dataset.shareCssP && (
					fe.$attr && App.setAttr('attr', fe.$, fe.$attr, fe.attrRx,undefined,fe.attrReplacer),
					fe.$style && App.setAttr('style', fe.$, fe.$style, fe.attrRx,undefined,fe.attrReplacer)
					//placeholder.html && (html = App.replace(fe.html, rx,undefined,replacer));
				),
				
				fe.parent && this.getParent(fe,f).appendChild(fe.$),
				
				// 以下の処理は直上の同じ処理と重複している。
				// 要素に element.closest を使う処理を含む場合を考慮し、含む場合のみ DOM ツリーへの追加後に行なうようにしているが、
				// 抜本的な解決策ではないため、代替策の検討が必要。
				fe.attrRx && fe.$.dataset.shareCssP && (
					fe.$attr && App.setAttr('attr', fe.$, fe.$attr, fe.attrRx,undefined,fe.attrReplacer),
					fe.$style && App.setAttr('style', fe.$, fe.$style, fe.attrRx,undefined,fe.attrReplacer)
					//placeholder.html && (html = App.replace(fe.html, rx,undefined,replacer));
				),
				
				rs();
				//fe.atime || hi((fe.atime = Date.now()) - f.time,fe);
				//hi(f.time - (fe.time = Date.now()),fe);
			}));
		
	}
	/*
	createElementEnd(fe, f) {
		return () => (fe.beginCond.executed || Promise.resolve()).then(() => this.resolveAll(fe));
	}
	*/
	createElementEnd(fe, f) {
		
		return fe.ends = new Promise((rs,rj) => fe.endCond.executed.then(() => {
				
				// fe.end の値が true の時、
				// 自身ののすべての子要素（再帰を含む）の endCond.excuted が解決された時に、自身の endCond を解決する。
				
				const resolve = () => (!i || ++i0 >= i) && (this.resolveAll(fe), rs()/*, (fe.traces && clearInterval(fe.traceTimer), fe.loops = (fe.loops || (fe.loops = 0)) + 1) < 2 && hi(Date.now()- f.time,Date.now()- fe.time,fe.$,fe.time,Date.now()))*/);
				let i,i0;
				
				if (fe.end === true) {
					
					const	ends = App.fetchRecursive(fe, 'endCond');
					
					i = -1, i0 = 0;
					while (ends[++i]) ends[i].executed.then(resolve);
					
				} else fe.beginCond.executed ? fe.beginCond.executed.then(resolve) : resolve();
				
			}));
		
	}
	resolveAll(fe, when = true) {
		
		if (!fe || typeof fe !== 'object') return;
		
		if (Array.isArray(fe.children)) {
			
			const children = fe.children, l = children.length;
			let i;
			
			i = -1;
			while (++i < l) this.resolveAll(children[i], when);
			
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
		while (fe = f.serial[++i])
			fe.$ && (delete fe.begins, delete fe.ends, fe.beginCond.reset(), fe.endCond.reset(), fe.$.remove());
		
		this.transit(fs[li === fs.length ? 0 : li], f);
		
	}
	transit(f, lf) {
		
		const	fes = f.elements,
				fl = f.serial.length,
				finished = () => ++ei === fl && this.transited(f, lf),
				exec = App.createExecution;
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
		
		this.appNode.dataset.current = typeof f.id === 'string' ? f.id : '',
		this.appNode.dataset.currentLabel =
			typeof f.labels === 'string' ? f.labels : Array.isArray(f.labels) ? f.labels.join(' ') : '',
		this.appNode.dataset.currentLabel === '' && delete this.appNode.dataset.currentLabel,
		
		App.setCSSV(this.body, f.ccv),
		
		i = -1, ei = 0;
		while (fe = f.serial[++i])
			fe.beginCond.execute(null, fe.nested || isObj(fe.begin) ? fe.pendingBegin : false).
				then(this.createElementBeginning(fe,f)),
			fe.endCond.execute(null, fe.nested || isObj(fe.end) ? fe.pendingEnd : false).
				then(this.createElementEnd(fe,f)).then(finished);
		
		i = -1;
		while (fe = f.serial[++i]) {
			
			fel = (sib = fe.nested ? fe.nested.children : fes).length;
			
			if (fe.begin) {
				
				if (
					(p = fe.begin.promise) && typeof p === 'object' &&
					(xFe = 'index' in p ? sib[int(sib.indexOf(fe) + int(p.index, -1,-Infinity), 0, 0, fel - 1)] : null)
				) {
					
					xFe[(p.when === 'begin' || p.when === 'end' ? p.when : 'begin') + 's'].
						then(exec(fe.beginCond, fe.beginCond.executed));
					
				}
				
			}
			
			xFe || !fe.beginCond.passive ? (xFe = null) :
				(fe.nested ? fe.nested.begins.then(exec(fe.beginCond, fe.beginCond.executed)) : fe.beginCond.resolve());
			
			if (fe.end) {
				
				if (
					(p = fe.end.promise) && typeof p === 'object' &&
					(xFe = 'index' in p ? sib[int(sib.indexOf(fe) + int(p.index, -1,-Infinity), 0, 0, fel - 1)] : null)
				) {
					
					xFe[(p.when === 'begin' || p.when === 'end' ? p.when : 'begin') + 's'].
						then(exec(fe.endCond, fe.endCond.executed));
					
				}
				
			}
			
			xFe || !fe.endCond.passive ? (xFe = null) : 
				(fe.nested ? fe.nested.ends.then(exec(fe.endCond, fe.endCond.executed)) : fe.endCond.resolve());
		
		}
		
		// この setTimeout は Firefox で生じる、大量の CSS 再計算がすべてのスレッドを停止させる問題に対応するための便宜的な対応。
		// この関数内で、スライドショーに表示させる画像の切り替えを行なっているが、設定に依存するが、
		// 切り換え直後は大量の要素の入れ替えが行われることが想定される。
		// それに伴い要素の追加毎に随時 CSS の再計算が行なわれることが考えられるが、
		// Firefox はそのために setTimeout などの非同期処理を含むページ内のスレッド（恐らくは）全体を止めてしまう。
		// これにより、JavaScript と CSS との間に時間的な不整合が生じる。
		// これは、通常問題に現れにくいが、この処理では JavaScript 側で画像の切り替え開始時間を記録し、
		// それを基に CSS 変数に、現在の画像の再生時間を間接的に CSS 側に伝えるため、
		// 例えば CSS 再計算に 500ms かかった場合、CSS の animation が再生開始するのは、切り換え後 +500ms だが、
		// JavaScript 側で記録している切り換え開始時間はそれよりも -500ms になるため、現在の表示経過時間が常に -500ms になる。
		// これだけなら、animation の開始を addEventListener で捕捉してそれを開始時間とすればいいが、
		// この処理は animation の使用は任意であるため、それに依存して時間を決めることは現実的ではない。
		// 様々な解決策が考えられるかもしれないが、Firefox の仕様の変更や chromium 系ブラウザーへの影響を最小限に留めるため、
		// 現段階では Firefox が setTimeout をも止めることを逆手に取り、実行時間を 0 秒にした無意味な setTimeout を実行して、
		// CSS の再計算とともにすべてのスレッドが再稼動した時点を画像の表示開始開始時間として記録するコールバック関数を実行している。
		// これは上記の仕様の Firefox 以外にとっては完全に無意味な処理であるため、仮に Firefox が仕様を改めたら修正すべきである。
		// また現状、Firefox が無差別的にスレッドを停止させるためにこの解決策で問題が解消されるが、
		// 選択的にスレッドを停止するようなさらに半端な仕様に変更された場合、再び問題が表面化する可能性がある。
		// そのため、画像の表示時間が意図しない長さになった場合、この setTimeout のコール版数の中身を直接実行するように変更するなどして確認することを推奨する。
		// なお、この setTimeout のコールバック関数が実行する処理そのものは、この処理全体において必要欠くべからざる処理である。
		setTimeout(() => f.time = Date.now(), 0);
		
		
		//this.timer || (this.timerDate = Date.now(), hi(Date.now() - this.timerDate), this.timer = setTimeout(()=>hi(Date.now() - this.timerDate),16));
		
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
	
	static createExecution(cond, executed) {
		
		// 以下の executed の比較は非常にピーキーな（しかしテスト時などはままある）状況下でのみ有効になる。
		// ファイルがひとつだけで、かつそのファイルの要素内に end の条件が設定されてないものがあり、
		// その要素の親要素の解決条件が、ファイルの表示終了相当だった場合、表示終了時点では実際にすべての要素の開始、終了条件は解決されることになるが、
		// この関数が返す以下のアロー関数は、要素の条件の解決後に then を通じて非同期で実行されるため、
		// それが単一のファイルかつその表示終了を条件とする要素の解決に紐付けられていた場合、
		// 実行が同一ファイルの切り替わりに間に合わず、新しい表示により新規の条件が作成され、
		// その後、旧表示に紐付けられたこの関数が実行され、新しい条件が非同期に遅れて実行されたこの関数により意図せず解決されてしまう。
		// そのため第一引数 cond に条件の参照、第二引数 executed に紐付けた時点での promise を取り、
		// 非同期に実行された時に、現在の条件の promise と、この関数に与えられた promise を以下のように比較し、
		// それが偽を示す場合、executed が示す条件は過去のものでかつ既に解決済みとして、cond が示す現在の条件の解決を回避する。
		// あまり直感的ではない実装だが、一度 then に設定した関数の実行は中止ないし停止できないため、現状妥当と思われる。
		return () => cond.executed === executed && cond.resolve();
		
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
		
		//fe.$.style.setProperty('--timestamp', timestamp),
		//fe.$.style.setProperty('--time-remaining', f.dur - timestamp),
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
		
		let i,k,k0,v0;
		
		if (!(attr && typeof attr === 'object' && elm instanceof HTMLElement)) return;
		
		const	asStyle = type === 'style',
				obj = asStyle ? elm.style : elm,
				method = asStyle ? 'setProperty' : 'setAttribute',
				r = App.replace,
				_attr = {},
				_dict = isObj(dict) ? { ...dict } : {},
				filter = elm.dataset.shareCssFilter && elm.dataset.shareCssFilter.split(' '),
				elms = [ ...document.querySelectorAll(elm.dataset.shareCssQ) ];
		
		_dict.__key = type, (k = elm.closest(elm.dataset.shareCssP)) && !elms.includes(k) && (elms[elms.length] = k);
		for (k in attr) {
			obj[method](
					k0 = r(_dict.__name = k, rx,_dict,replacer),
					v0 = _attr[k] = r(_dict.___name = attr[k], rx,_dict,replacer)
				);
			if (filter && filter.length && filter.includes(k0) && (i = -1))
				while (elm = elms[++i]) (asStyle ? elm.style : elm)[method](k0, v0);
		}
		
		return _attr;
		
	}
	static ezCopy(json) {
		try {
			json = JSON.parse(JSON.stringify(json));
		} catch (error) {
			console.error(error),
			json = null;
		}
		return json;
	}
	static fastCopy(from) {
		
		if (!from || typeof from !== 'object') return from;
		
		const isA = Array.isArray(from), to = isA ? [] : {};
		let k,v;
		
		for (k in from) to[k = isA ? +k : k] = (v = from[k]) && typeof v === 'object' ? App.fastCopy(v) : v;
		
		return to;
		
	}
	static fetchRecursive(node, key, childrenName = 'children') {
		
		const children = node.children, values = [];
		let i,i0,l0,vi, child,values0;
		
		if (Array.isArray(children)) {
			
			i = -1, vi = -1;
			while (child = children[++i]) {
				key in child && (values[++vi] = child[key]);
				if (childrenName in child && (i0 = -1, l0 = (values0 = App.fetchRecursive(child, key)).length))
					while (++i0 < l0) values[++vi] = values0[i0];
			}
			
		}
		
		return values;
		
	}
	
}