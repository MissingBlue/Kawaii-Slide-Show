class Resource {
	
	constructor(resource) {
		
		this.rsc = {},
		this.cache = {},
		
		this.fetch(resource);
		
	}
	async fetch(resource) {
		
		let i,l,k;
		
		if (!resource || typeof resource !== 'object') return;
		
		for (k in resource) {
			i = -1, l = (Array.isArray(resource[k]) ? resource[k] : (resource[k] = [ resource[k] ])).length;
			while (++i < l) await this[k](resource[k][i]).catch(Resource.xError);
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
				rscs[id] && (rscs[id].exec = 'play')
			);
		
	}
	dom(rsc) {
		
		if (!rsc || typeof rsc !== 'object' || !rsc.id) return;
		
		const	parentElement = document.querySelector((rsc && typeof rsc === 'object' && rsc.selector) || 'body');
		let i, elements = [];
		
		i = -1, Array.isArray(rsc.elements) || (rsc.elements = [ rsc.elements ]);
		while (rsc.elements[++i]) elements = [ ...elements, ...this.createElements(rsc.elements[i]) ];
		
		this.rsc[rsc.id] = {
				append: () => parentElement.append(...elements),
				remove: () => {
					let i;
					i = -1;
					while (elements[++i]) elements[i].remove();
				},
				exec: 'append',
				exit: 'remove'
			};
		
		return Promise.resolve();
		
	}
	createElements(data) {
		
		data = typeof data === 'string' ? { tag: data } : data;
		
		if (!data || typeof data !== 'object' || !data.tag) return [];
		
		const element = document.createElement(data.tag), elements = [];
		let i,k;
		
		data.text && (element.textContent = data.text);
		
		if (data.attr && typeof data.attr === 'object')
			for (k in data.attr) element.setAttribute(k, data.attr[k]);
		if (data.style && typeof data.attr === 'object')
			for (k in data.style) element.style.setProperty(k, data.style[k]);
		
		if (data.children) {
			
			i = -1, Array.isArray(data.children) || (data.children = [ data.children ]);
			while (data.children[++i])
				typeof data.children[i] === 'string' && (data.children[i] = { tag: data.children[i] }),
				data.children[i] && element.append(...this.createElements(data.children[i]));
			
		}
		
		if ((i = -1) && data.length || (!('length' in data) && (data.length = 1)))
			while (++i < data.length) elements[i] = element.cloneNode(true);
		
		return elements;
		
	}
	
	static xError(error) {
		
		console.error(error);
		
	};
	
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