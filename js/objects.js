class Condition {
	
	constructor(cond) {
		
		this.passive = false,
		this.fulfilled = () => (
				this.error && (console.error(this.error), delete this.error),
				delete this.resolution,
				delete this.rejection,
				this.passive = false,
				this
			),
		this.events = [],
		this.timeout = { of: this },
		
		isObj(cond) && this.set(cond);
		
	}
	
	set(cond, handleEvents) {
		
		let i,k;
		
		cond =	typeof cond === 'string' ? { event: { animationend: { target: true, name: cond, count: 1 } } } :
					typeof cond === 'object' ? cond || {} : {};
		
		for (k in cond) {
			
			switch (k) {
				
				// timeout は常に上書き
				// timeout を設定する場合、引数 cond のプロパティ timeout に数値か true を設定する。
				// true の場合、このオブジェクトのメソッド execute の第一引数の値が設定される。
				case 'timeout': this.setTimeout(cond[k]); break;
				
				// event は追加
				case 'event': this.setEvents(cond[k], handleEvents); break;
				
			}
			
		}
		
		return cond;
		
	}
	setTimeout(value) {
		
		this.pauseTimeout(true),
		this.timeout.v = typeof value === 'number' ? dbl(value, 1,0,1) : true;
		
	}
	setEvents(events, handles) {
		
		const evs = this.events;
		let i,i0,l0,k, ev;
		
		typeof handles === 'boolean' && this.pauseEvents(handles),
		
		i = evs.length;
		for (k in events) {
			i0 = -1, l0 = events[k].length;
			while (++i0 < l0)	typeof (ev = evs[i++] = { ...objc(events[k][i0], 'target') }).target === 'string' ||
										(ev.target = int(ev.target, true,-Infinity)),
									ev.of = this,
									ev.type = k,
									ev.count = int(ev.count, 1, 1);
		}
		
	}
	standby(defaultTimeout, defaultElement = document.body) {
		
		const to = this.timeout, evs = this.events, l = evs.length;
		let i, ev,target;
		
		(!('v' in to) || typeof to.exec === 'function') || (
				to.exec = () => to.promise = new Promise((rs,rj) => (
						to.resolution = rs,
						to.rejection = rj,
						to.timer = setTimeout(() => rs(to), (to.v === true ? defaultTimeout : to.v) * 1000)
					)).then(Condition.timeouted, Condition.timeouted)
			),
		
		i = -1;
		while (++i < l) typeof (ev = evs[i]).exec === 'function' || (
				ev.begun = Condition.createEventBeginning(ev, defaultElement, this),
				ev.exec = Condition.createEventExecution(ev, defaultElement, this)
			);
		
		return this;
		
	}
	pauseTimeout(clears) {
		
		const to = this.timeout;
		
		typeof to.rejection === 'function' && to.rejection((to.error = Condition.REJECTED_MESSAGE_BY_PAUSE, to)),
		
		clears && delete to.promise;
		
	}
	pauseEvents(clears) {
		
		const evs = this.events;
		let i, ev;
		
		i = -1;
		while (ev = evs[++i])	typeof ev.rejection === 'function' &&
											ev.rejection((ev.error = Condition.REJECTED_MESSAGE_BY_PAUSE, ev)),
										clears && delete ev.promise;
		
		clears && (evs.length = 0);
		
	}
	clear(clearsTimeout, clearsEvents = clearsTimeout) {
		
		this.pauseTimeout(clearsTimeout),
		this.pauseEvents(clearsEvents),
		
		typeof this.rejection && this.rejection((this.error = Condition.REJECTED_MESSAGE_SAFELY, this)),
		delete this.executed;
		
	}
	execute(resets, pending) {
		
		resets && this.reset();
		
		return this.executed || (this.executed = new Promise((rs,rj) => {
				
				const evs = this.events, resolved = () => ++i0 === l0 && rs(this);
				let i,i0,l0, ev;
				
				this.resolution = rs,
				this.rejection = rj,
				
				i0 = l0 = 0,
				
				typeof this.timeout.exec === 'function' &&
					(++l0, this.timeout.promise || this.timeout.exec()).then(resolved),
				
				i = -1;
				while (ev = evs[++i]) typeof ev.exec === 'function' && (++l0, ev.promise || ev.exec().then(resolved));
				
				l0 || (this.passive = pending) || rs(this);
				
			}).then(this.fulfilled,this.fulfilled));
		
	}
	resolve(isPassiveThen, asRejection) {
		
		(!isPassiveThen || this.passive) && (
				asRejection ?	typeof this.rejection === 'function' &&
										this.rejection((this.error = Condition.REJECTED_MESSAGE_BY_RESET, this)) :
									typeof this.resolution === 'function' && this.resolution(this)
			);
		
	}
	reset(executes) {
		
		const evs = this.events;
		let i, ev;
		
		typeof this.timeout.rejection === 'function' &&
			this.timeout.rejection((this.timeout.error = Condition.REJECTED_MESSAGE_SAFELY, this.timeout)),
		delete this.timeout.promise,
		
		i = -1;
		while (ev = evs[++i])	typeof ev.rejectedExecution === 'function' &&
											ev.rejectedExecution((ev.error = Condition.REJECTED_MESSAGE_SAFELY, ev)),
										delete event.bugun,
										delete ev.promise;
		
		typeof this.rejection === 'function' && this.rejection((this.error = Condition.REJECTED_MESSAGE_SAFELY, this)),
		delete this.executed;
		
		return executes ? this.execute() : undefined;
		
	}
	
	static REJECTED_MESSAGE_BY_PAUSE = 'Paused a condition.';
	static REJECTED_MESSAGE_BY_RESET = 'The condition was rejected by an user.';
	static REJECTED_MESSAGE_SAFELY = 'The condition mieght be rejected safely. This means the error affects nothing.';
	static timeouted(to) {
		
		to.error && (console.error(to.error), delete to.error),
		
		clearTimeout(to.timer),
		delete to.resolution,
		delete to.rejection;
		
		return to;
		
	}
	// このメソッドを通じて作成される Promise は、イベント捕捉対象の要素が取得可能になった時に解決する。
	// これは cond.events[i].target に数値を指定した場合、つまり cond.events 間の任意の要素を指定する時に実行される。
	static createEventBeginning(event, defaultElement, condition) {
		
		return () =>	new Promise((rs, rj) => (event.executed = rs, event.rejectedExecution = rj)).
								then(Condition.xBegun,Condition.xBegun);
		
	}
	static xBegun(event) {
		
		event.error && (console.error(event.error), delete event.error),
		delete event.executed,
		delete event.rejectedExecution;
		
		return event;
		
	}
	static createEventExecution(event, defaultElement, condition) {
		
		return () => event.promise = new Promise((rs, rj) => {
			
			const evs = condition.events, l = evs.length - 1;
			let begun;
			
			event.resolution = rs,
			event.rejection = rj,
			event.i = 0,
										// この分岐は通常の Event であるか、あるいは対象のアニメーションの AnimationEvent であるかを判定
			event.handler = e =>	(!(e instanceof AnimationEvent) || event.name === e.animationName) &&
											++event.i === event.count &&
													(event.$.removeEventListener(event.type, event.handler), rs(event));
			
			switch (typeof event.target) {
				
				case 'string':
				event.$ = document.querySelector(event.target) || defaultElement;
				break;
				
				case 'number':
				const i = evs.indexOf(event), v = int(i + event.target, i, 0, l);
				i !== v && 'begun' in (target = evs[v]) ? (begun = target.begun()) : (event.$ = defaultElement);
				break;
				
				default: event.$ = defaultElement; break;
				
			}
			
			(
				begun ?	begun.then(target => event.$ = target.$) :
							(typeof event.executed === 'function' && event.executed(event), Promise.resolve(event.$))
			).then(() => event.$.addEventListener(event.type, event.handler));
			
		}).then(Condition.xExecutedEvent,Condition.xExecutedEvent);
		
	}
	static xExecutedEvent(event) {
		
		event.$.removeEventListener(event.type, event.handler),
		
		event.error && (console.error(event.error), delete event.error),
		
		delete event.resolution,
		delete event.rejection,
		
		typeof event.rejectedExecution === 'function' &&
			event.rejectedExecution((event.error = Condition.REJECTED_MESSAGE_SAFELY, event));
		
		return event;
		
	}
	
}

class Resource {
	
	constructor(resource) {
		
		this.rsc = {},
		this.cache = {};
		
	}
	async fetch(resource) {
		
		let i,l,k;
		
		if (!resource || typeof resource !== 'object') return;
		
		for (k in resource) {
			i = -1, l = (Array.isArray(resource[k]) ? resource[k] : (resource[k] = [ resource[k] ])).length;
			while (++i < l) typeof this[k] === 'function' && await this[k](resource[k][i]).catch(Resource.xError);
		}
		
	}
	get(id) {
		
		return this.rsc[id];
		
	}
	async audios(rsc) {
		
		const rscs = this.rsc, cache = this.cache;
		let src, id;
		
		typeof rsc === 'string' && (rsc = { src: rsc });
		
		rsc && typeof rsc === 'object' && (src = rsc.src) && (
				await (rscs[id = rsc.id || (rsc.id = src)] = new Sound(rsc)).
					load(src in cache && cache[src] instanceof ArrayBuffer ? cache[src] : src).catch(Resource.xError),
				cache[src] === rscs[id].buffer || (cache[src] = rscs[id].buffer) || delete rscs[id],
				rscs[id] && (rscs[id].exec = 'play', rscs[id].args = undefined)
			);
		
	}
	// このメソッドを通じて作成した DOM 要素は他のリソースと同様個別ではなく使い回しである。
	// DOM であるため、現状 exit の実装はなく、実行毎にここで作成された要素を exec の実装を通じて別の要素に都度移し替えている。
	// これは現状は問題が表面化しないが、同じリソースを供する任意の数のオブジェクトを同時に表示する場合、競合が発生するのが容易に想像される。
	// その場合は exec で挿入する要素をこのリソースの cloneNode にするなどで対応する必要がある。
	dom(rsc) {
		
		if (!rsc || typeof rsc !== 'object' || !rsc.id) return;
		
		const	parentElement = document.querySelector(rsc.parent || 'body');
		let i,k, elements = [];
		
		if (parentElement) {
			if (rsc.attr && typeof rsc.attr === 'object')
				for (k in rsc.attr) parentElement.setAttribute(k, rsc.attr[k]);
			if (rsc.style && typeof rsc.style === 'object')
				for (k in rsc.style) parentElement.style.setProperty(k, rsc.style[k]);
		}
		
		i = -1, Array.isArray(rsc.elements) || (rsc.elements = [ rsc.elements ]);
		while (rsc.elements[++i]) (elements = [ ...elements, ...Resource.createElements(rsc.elements[i]) ]).length;
		
		this.rsc[rsc.id] = {
				// 以下の prepend は viewports で指定した要素を常に最背面にするための妥協的な仕様で、
				// assets で dom を指定した場合、後方の dom が前方の dom の前面に配置されるため、
				// その逆である DOM の挿入および表示順序仕様を踏まえると若干非直感的で留意を要する。
				// 一方で非スクリプト言語ユーザーには比較的直感的かもしれない。
				append: (f,lf) => elements[0].parentElement || (parentElement || f.view).prepend(...elements),
				// 一度追加した dom は削除する必要がないと思われるため、以下の exit の実装は現状不使用。
				remove: () => {
					let i;
					i = -1;
					while (elements[++i]) elements[i].remove();
				},
				exec: 'append'/*,
				exit: 'remove'*/
			};
		
		return Promise.resolve();
		
	}
	
	static xError(error) {
		
		console.error(error);
		
	};
	static placeholderRx = /([^\\]?)%(i|l|(?:col|row)(?:_cnt)?|rnd)%/g;
	static cellRx = /(\d+)x(\d+)/g;
	// String.prototype.replaceAll の不完全なポリフィルだが、Google Chrome で同メソッドが実装されたのがかなり遅いため、
	// 古い Chromium を採用する環境において必要になる。
	static replace(str, dict, rx = Resource.placeholderRx, replacer) {
		
		let i,k,v, result, replaced, lastIndex;
		
		replaced = '';
		while (result = rx.exec(str)) {
			
			if (typeof replacer === 'function') {
				
				v = replacer(result, dict, rx), i = 0
				
			} else {
				
				if (!((k = result[2]) in dict || (k = result[3]) in dict)) continue;
				
				switch (k) {
					case 'row': case 'col':
					v = dict[k][dict.i];
					break;
					case 'rnd':
					v = Math.random();
					break;
					default:
					v = typeof dict[k] === 'function' ? dict[k](k, result) : dict[k];
				}
				
				i = result[1].length;
				
			}
			
			replaced += str.substring(lastIndex || 0, result.index + i) + v,
			lastIndex = rx.lastIndex;
			
		}
		
		return lastIndex === undefined ? str : replaced + str.substring(lastIndex);
		
	}
	static createElements(data, placeholderDictionary = {}, rx, replacer) {
		
		if (!(data = typeof data === 'string' ? { tag: data } : data) || typeof data !== 'object') return [];
		
		const element = data.tag || !('text' in data) ? document.createElement(data.tag || 'div') : null,
				elements = [],
				dict = { ...placeholderDictionary, row: [], col: [], rnd: true },
				r = Resource.replace,
				length = 'length' in data ? typeof data.length === 'number' ? Math.max(parseInt(data.length), 0) : 1 : 1;
		let i,l,k, cell;
		
		if (element && data.children) {
			
			i = -1, l = (Array.isArray(data.children) ? data.children : (data.children = [ data.children ])).length;
			while (++i < l)
				element.append(...Resource.createElements(data.children[i], placeholderDictionary, rx, replacer));
			
		}
		
		if (typeof data.asCell === 'string' && (cell = Resource.cellRx.exec(data.asCell))) {
			
			i = -1, l = (dict.row_cnt = +cell[1]) * (dict.col_cnt = +cell[2]);
			while (++i < l) dict.row[i] = i - (dict.col[i] = i / dict.row_cnt | 0) * dict.row_cnt;
			
		}
		
		i = -1, dict.l = length;
		while ((dict.i = ++i) < length) {
			
			if (typeof (elements[i] = element ? element.cloneNode(true) : r(data.text, dict)) === 'string') continue;
			
			data.text &&
				(dict.__key = 'text', elements[i].insertAdjacentText('afterbegin', r(data.text, dict, rx, replacer)));
			
			if (data.attr && typeof data.attr === 'object') {
				dict.__key = 'attr';
				for (k in data.attr)
					elements[i].setAttribute(r(dict.__name = k, dict), r(data.attr[k], dict, rx, replacer));
			}
			if (data.style && typeof data.style === 'object') {
				dict.__key = 'style';
				for (k in data.style)
					elements[i].style.setProperty(r(dict.__name = k, dict), r(data.style[k], dict, rx, replacer));
			}
			
		}
		
		return elements;
		
	}
	
}

class Sound extends AudioContext {
	
	constructor(option) {
		
		super(),
		
		this.option = { ...Sound.option, ...(option && typeof option === 'object' ? option : {}) },
		
		this.gain = new GainNode(this, this.option),
		
		this.handler = () => {
			
			// createBufferSource が返す AudioScheduledSourceNode は再利用できそうに思えるが、常に新規作成する必要がある。
			
			const source = new AudioBufferSourceNode(this, this.option);
			
			source.connect(this.gain),
			this.gain.connect(this.destination),
			
			//https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start
			source.start(
					this.option.delay,
					this.option.offset,
					isNaN(this.option.duration = parseFloat(this.option.duration)) ? undefined : this.option.duration
					//isNaN(+this.option.duration) ? source.buffer.duration : +this.option.duration
				);
			
		};
		
	}
	async load(src) {
		
		return src instanceof ArrayBuffer ?
			(this.buffer = src, Promise.resolve(this)) :
			new Promise((rs,rj) =>
				fetch(src).then(Sound.toBuffer).then(buffer => (this.buffer = buffer, rs(this))).catch(rj)
			);
		
	}
	async play(buffer = this.buffer) {
		
		// decodeAudioData に渡すバッファは恐らく参照が使われるため、実行する度に新しいバッファを作成する必要がある。、
		return buffer === this.buffer && this.option.buffer instanceof AudioBuffer ?
			(this.handler(), Promise.resolve(this)) :
			new Promise((rs,rj) => this.decodeAudioData(this.buffer.slice()).
				then(decoded => (this.handler(this.option.buffer = decoded), rs(this))).catch(rj));
		
	}
	
	static option = {
		delay: 0,
		offset: 0,
		gain: 1
	};
	static toBuffer(response) { return response.arrayBuffer(); }
	
}