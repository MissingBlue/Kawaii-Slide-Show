/*
	CHTMLImageSeq
		
		子要素 CHTMLImageSeqItem に指定された画像のデータ(url, width, height)を、
		属性 isset に当該要素の id が指定された要素の CSS 変数に設定する。
		変数を設定するタイミングはページ読み込み時に限られる。また id が設定されていないと設定は行われない。
		変数名は既定では --image-seq-[子要素の番号]-{子要素の画像番号}-* だが、属性 vn に任意の文字列を指定すると、
		--${this.vn}-[子要素の番号]-{子要素の画像番号}-* になり、仮に isset を指定した要素が複数の ImageSeq を指定していた場合でも衝突を避けられる。
		子要素に id が指定されている場合、子要素の番号にはその値が使われる。
		他に --image-seq-[子要素内のすべての画像の番号]-* でも変数が作成される。
		
		cvar に JSON 形式で特定の書式を指定すると、指定に基づいた変数を設定する。
		その書式内で使えるプレースホルダーについてはメソッド parseCvar 内のコメントを参照。
		cvar は基本的に c-is 内の画像総数に対応するように配列状に css 変数内に羅列される。
		例えば <c-is ifor="body" cvar='{"a":"1px";}'><c-ii></c-ii><c-ii></c-ii><c-ii></c-ii></c-is> の場合、
		要素 body に CSS 変数 --a: 1px,1px,1px; が設定される。
		ただし、JSON のプロパティの名前に [任意の数字] を含めると、その cvar を該当する要素番号の値に基づいて単一の値として設定される。
		例えば上記の場合で cvar='{"a[0]":"1px";}' の場合、--a-0: 1px; になる。
		プレースホルダーの値は原則単位 px が自動で補完されるが、各プレースホルダーの文字の末尾に * を加えるとこの動作を回避できる。
		
*/
class CHTMLImageSeq extends ExtensionNode {
	
	constructor(option) {
		
		super(option),
		
		this.itemAvailable = customElements.whenDefined('c-ii'),
		
		this.CSS = {},
		this.item = new WeakMap(),
		this.data = {
			'max-width': 0,
			'max-height': 0,
			'total-width': 0,
			'total-height': 0,
			length: 0,
			'total-length': 0,
			urls: [],
			items: [],
			whole: [],
			target: {}
		},
		
		(this.mutationObserver = new MutationObserver(this.mutatedItems)).observe(this, CHTMLImageSeq.mutationOption),
		this.resizeObserver = new ResizeObserver(this.resizedTargets);
		
	}
	attributeChangedCallback(name, lastValue, value) {
		
		this.itemAvailable.then(() => {
				
				const	lastTargets = [ ...document.querySelectorAll(lastValue && `#${lastValue.split(' ').join(',#')}`) ],
						targets = [ ...document.querySelectorAll(value && `#${value.split(' ').join(',#')}`) ];
				let i;
				
				i = -1;
				while (lastTargets[++i]) targets.includes(lastTargets[i]) || this.releaseTarget(lastTargets[i]);
				
				i = -1;
				while (targets[++i]) lastTargets.includes(targets[i]) ||
					(this.updateTarget(targets[i]), this.update(targets[i]), this.resizeObserver.observe(targets[i]));
				
			});
		
	}
	
	
	updateTarget(target) {
		
		const rect = target.getBoundingClientRect(), data = {};
		let k;
		
		this.data.target[target.id] = data;
		for (k in rect) typeof rect[k] === 'number' && (data[`rect-${k}`] = rect[k]);
		
	}
	releaseTarget(target) {
		
		this.resizeObserber.unobserve(target);
		
	}
	async updateItemsData() {
		
		const items = this.querySelectorAll(':scope > c-ii'), data = this.data, itemsData = data.items,
				l = items.length;
		let i,i0, item,img, itemData,imgData, ii;
		
		await this.itemAvailable,
		
		await new Promise(rs => {
				const confirm = () => {++i0 === l && rs()};
				i = -1, i0 = 0;
				while (items[++i]) items[i].available.then(confirm);
			}),
		
		i = ii = -1, data.length = l,
		data['max-width'] = data['max-height'] = data['total-width'] = data['total-height'] = data['total-length'] =
		data.whole.length = itemsData.length = data.urls.length = itemsData.length = 0;
		while (item = items[++i]) {
			
			this.item.set(itemsData[i] = itemData = item.data, item),
			
			data.urls.push(itemData.urls),
			
			data['max-width'] < itemData['max-width'] && (data['max-width'] = itemData['max-width']),
			data['max-height'] < itemData['max-height'] && (data['max-height'] = itemData['max-height']),
			
			itemData['accumulative-width'] = data['total-width'],
			itemData['accumulative-height'] = data['total-height'],
			
			data['total-width'] += itemData['total-width'],
			data['total-height'] += itemData['total-height'],
			data['total-length'] += itemData.imgs.length,
			
			item['item-index'] = i,
			
			i0 = -1;
			while (img = itemData.imgs[++i0])	(data.whole[++ii] = {}).url = img.url,
															data.whole[ii].width = img.width,
															data.whole[ii].height = img.height,
															data.whole[ii].index = ii,
															
															img['accumulative-urls'] = data.whole[ii]['accumulative-urls'] =
																[ ...data.urls, ...img['sub-accumulative-urls'] ],
															img['accumulative-width'] = data.whole[ii]['accumulative-width'] =
																itemData['accumulative-width'] + img['sub-accumulative-width'],
															img['accumulative-height'] = data.whole[ii]['accumulative-height'] =
																itemData['accumulative-height'] + img['sub-accumulative-height'],
															img['image-index'] = data.whole[ii]['image-index'] = i0,
															
															img['item-index'] = data.whole[ii]['item-index'] = i;
			
		}
		
	}
	update(target) {
		
		const	vn = this.vn, cnvV = CHTMLImageSeq.cnvV,
				itemsData = this.data.items, wholeData = this.data.whole;
		let i,i0,l0,k,k0, pfx,pfx0, items,item,itemData,img,targetData, css, cvar, scale;
		
		css = '',
		scale = typeof (scale = ((scale = getComputedStyle(target).getPropertyValue('--image-seq-scale')) === '' || isNaN(scale = parseInt(scale)) || scale)) === 'number' ? scale : null;
		
		for (k in this.data) {
			
			pfx = `${vn}-${k}`;
			
			switch (k) {
				
				case 'items':
				i = -1;
				
				while (itemData = itemsData[++i]) {
					if (!(item = this.item.get(itemData))) continue;
					pfx0 = `${pfx}-${item.id || i}`;
					for (k0 in itemData) (k0 === 'imgs') || (css += cnvV(`${pfx0}-${k0}`, itemData[k0], scale));
					i0 = -1;
					while (img = itemData.imgs[++i0]) for (k0 in img) css += cnvV(`${pfx0}-${i0}-${k0}`, img[k0], scale);
				}
				break;
				
				case 'target':
				targetData = this.data.target[target.id];
				for (k0 in targetData) css += cnvV(`${pfx}-${k0}`, targetData[k0], scale);
				break;
				
				case 'whole':
				i = -1;
				while (itemData = wholeData[++i]) {
					pfx0 = `${pfx}-${i}`;
					for (k0 in itemData) css += cnvV(`${pfx0}-${k0}`, itemData[k0], scale);
				}
				break;
				
				default: css += cnvV(pfx, this.data[k], scale);
				
			}
			
		}
		
		target.style.cssText += css + this.parseCvar(target, scale, vn),
		
		this.emit('updated', target);
		
	}
	updateAll() {
		
		const	targets = document.querySelectorAll(this.ifor);
		let i;
		
		i = -1;
		while (targets[++i]) this.update(targets[i]);
		
		this.emit('updated-all');
		
	}
	parseCvar(target, scale, prefix) {
		
		const	cvar = this.cvar,
				data = this.data, items = data.items, whole = data.whole, targetData = data.target[target.id],
				cvarValue = [], cvarValueScaled = [], parsed = {}, l = whole.length,
				cnvv = CHTMLImageSeq.cnvv;
		let	i,i0,k,k0, cvarRaw,cvarRawScaled,cssValue,placeholder,
				simplexCvarIndex,isSimplex,indicesRaw,indicesRawValues,indices,img, index,itemIndex,
				//pK = Placeholder Name(Key), pV = Placeholder Value, pVS = Placeholder Scaled
				pK,pV,pVS, asNum, value,scaledValue, css, isNum;
		
		if (!cvar) return;
		
		for (k in cvar) {
			
			(i = isSimplex = CHTMLImageSeq.rxSb.exec(k0 = k)) !== null && (
					(isSimplex = !Number.isNaN(simplexCvarIndex = parseInt(i[1]))) &&
						(k0 = `${k.replace(i[0], '')}-${simplexCvarIndex}`)
				),
			
			i = -1, cvarValue.length = cvarValueScaled.length = 0;
			while (img = whole[++i]) {
				
				cvarRaw = cvarRawScaled = cvar[k], index = i, itemIndex = img['item-index'];
				while (placeholder = CHTMLImageSeq.rxCb.exec(cvarRaw)) {
					
					if (indicesRaw = CHTMLImageSeq.rxSb.exec(placeholder[1])) {
						
						(indicesRaw[1][0] === '-' || indicesRaw[1][0] === '+') ?
							(index += parseInt(indicesRaw[1]), itemIndex += parseInt(indicesRaw[1])) :
							(index = itemIndex = indicesRaw[1].length ? parseInt(indicesRaw[1]) : index),
						pK = placeholder[1].replace(indicesRaw[0], '');
						
					} else {
						
						pK = placeholder[1];
						
					}
					
					index = isNaN(index) ? i : index < 0 ? 0 : index < l ? index : l - 1,
					itemIndex = isNaN(itemIndex) ? img.itemIndex :
						itemIndex < 0 ? 0 : itemIndex < items.length ? index : items.length - 1,
					
					(asNum = pK[pK.length - 1] === '*') && (pK = pK.slice(0,-1));
					
					switch (pK.toLowerCase()) {
						case 'u':
						// URL を示すプレースホルダー。小文字だと各画像個々の URL 、大文字だと c-ii に指定されたすべての画像の URL と置換される。
						// 添え番を指定しない場合、大文字小文字にかかわらず c-is が内包する c-ii に指定されたすべての画像の URL と置換する。
						pV = indicesRaw ?
							pK === 'U' ? items[itemIndex].urls : whole[index].url : data.urls;
						break;
						case 'w': case 'h':
						// 画像の幅と高さを示す。小文字だと個々の画像の大きさ、大文字だと c-ii に指定されたすべての画像の大きさと置換される。
						// 添え番を指定しない場合、大文字小文字にかかわらず c-is が内包する c-ii に指定されたすべての画像の大きさと置換する。
						pV = indicesRaw ?	(
									pK === 'W' ? items[itemIndex]['total-width'] : pK === 'w' ?	whole[index].width :
									pK === 'H' ? items[itemIndex]['total-height'] : whole[index].height
								) :
								data[`total-${pK.toLowerCase() === 'w' ? 'width' : 'height'}`];
						break;
						case '!w': case '!h':
						// 画像の最大幅、高さを示す。大文字、小文字の指定にかかわらず、c-ii に指定された画像の中から最大幅ないし高さと置換する。
						// 添え番を指定しない場合、c-is が内包する c-ii に指定されたすべての画像の最大幅ないし高さと置換する。
						pV = indicesRaw ?
							items[itemIndex][`max${pK[1].toLowerCase() === 'w' ? 'width' : 'height'}`] :
							data[`max-${pK[1].toLowerCase() === 'w' ? 'width' : 'height'}`];
						break;
						case '~w': case '~h':
						// 画像の累積幅、高さを示す。小文字の場合、c-ii に指定された画像を幅の場合横に、高さの場合縦に順に並べた時の累積値と置換する。
						// 大文字の場合、c-is が内包する c-ii の同値と置換する。例えば一番目の c-ii が 40*30 の三つの画像を、
						// 二番目の c-ii が 50*20 の二つの画像を指定されている時、~w[2] は 40*2 で 80px になる。
						// ~W[1] は 40*3 で 120px になる。また ~w[4] は 40*3+50+1 で 170px である。添え番を指定しない場合は常に 0px で置換される。
						pV = indicesRaw ? (pK[1] === 'w' || pK[1] === 'h') ?
							whole[index][`accumulative${pK[1] === 'w' ? 'width' : 'height'}`] :
							items[itemIndex][`accumulative${pK[1] === 'W' ? 'width' : 'height'}`] : 0;
						break;
						case '#w': case '#h': case '#l': case '#t': case '#r': case '#b': case '#x': case '#y':
						// 大文字、小文字の指定にかかわらず、
						// iFor で指定した要素の矩形が示す with,height,left,top,right,bottom,x,y の各頭文字に対応する位置の値で置換する。
						// 添え番は無視される（任意の拡張は可能、例えば添え番に対応する ifor 内の要素の値に置換するなど）。
						pV = targetData[`rect-${CHTMLImageSeq.placeholderDict[pK[1]]}`];
						break;
						// i は小文字の場合は c-is が内包するすべての画像の番号、大文字の場合は c-is が内包するすべての c-ii の番号と置換される。
						// 添え番、l も同様に画像の総数と c-is の総数と置換される。このプレースホルダーに限らず、空の添え番 [] を指定した場合、
						// 添え番は 0 から画像の最大数まで自動的に補完される。また任意の数字の直前に + ないし - を付けて指定した場合、
						// 画像の順番をその数だけずらして置換する。ずらした結果、0 以下ないし最大数以上になった場合、それらは 0 ないし最大数に丸められる。
						case 'i': pV = pV === 'I' ? itemIndex : index; break;
						case 'l': pV = pV === 'L' ? items.length : l; break;
						default:
						// 上記のプレースホルダー以外の文字列は、c-is か、c-is、それに指定された画像の該当プロパティの値で置換される。
						// 添え番がない場合は c-is、添え番がありかつ文字列の先頭に : がある場合は c-is、それ以外は画像のプロパティ名として認識される。
						pV = indicesRaw ? pK[1][0] === ':' ?
							items[index][pK[1].slice(1)] : whole[index][pK[1]] :
							data[pK[1]];
					}
					
					Array.isArray(pVS = pV) ?
						(
							pV = (asNum ? cnvv(pK, pV) : pV).join(),
							scale && (pVS = `calc(${(asNum ? pVS : cnvv(pK, pVS)).join()} * ${scale})`)
						) : (
							asNum || (pV = cnvv(pK, pV)),
							scale && (pVS = `calc(${asNum ? pVS : cnvv(pK, pVS)} * ${scale})`)
						);
					
					cvarRaw = cvarRaw.replace(placeholder[0], pV),
					isNum = !isNaN(parseInt(pV)),
					scale === null || (cvarRawScaled = cvarRawScaled.replace(placeholder[0], pVS));
					
				}
				
				cvarValue[cvarValue.length] = cvarRaw,
				scale === null || !isNum || (cvarValueScaled[cvarValueScaled.length] = cvarRawScaled);
				
			}
			
			parsed[k0] = isSimplex ? cvarValue[simplexCvarIndex] : cvarValue.join(),
			cvarValueScaled.length &&
				(parsed[`${k0}-scaled`] = isSimplex ? cvarValueScaled[simplexCvarIndex] : cvarValueScaled.join());
			
		}
		
		if (prefix && !(css = '')) for (k in parsed) css += `${prefix}-${k}:${parsed[k]};`;
		
		return css || parsed;
		
	}
	
	get cvar() { return isObj(fromJSON(this.getAttribute('cvar'))) || null; }
	set cvar(v) { this.setAttribute('cvar', JSON.stringify(v)); }
	
	get vn() { return `--${this.getAttribute('vn') || 'image-seq'}`; }
	set vn(v) { this.setAttribute('vn', v); }
	
	get ifor() {
		let v;
		// 以下の replace は replaceAll を使えば正規表現を使わずに済むが、
		// OBS の内部ブラウザーが未対応であるケースが考えられるため、replace を使っている。
		return (v = this.getAttribute('ifor')) ? (v = v.replace(CHTMLImageSeq.rxSpace, ',#')) ? '#' + v : null : null;
	}
	set ifor(v) { this.setAttribute('ifor', v); }
	
	static get observedAttributes() { return [ 'ifor' ]; }
	
	static LOGGER_SUFFIX = 'IS';
	static tagName = 'c-is';
	static rxSpace = /\s/g;
	static rxCb = /\{(.*?)\}/;
	static rxSb = /\[(.*?)\]/;
	static mutationOption = { childList: true };
	static placeholderDict = {
		w: 'width',
		h: 'height',
		t: 'top',
		r: 'right',
		b: 'bottom',
		l: 'left',
		x: 'x',
		y: 'y'
	};
	static dataRxs = [
		[ /^(?:.*-(?:width|height|top|left|bottom|right|x|y)|[^-]?(?:x|y|w|h|#(?:t|r|b|l)))(?:-scaled)?$/i, [ null, 'px' ] ],
		[ /(?:.*-urls?|[^-]?u)$/i, [ 'url("', null, '")' ] ]
	];
	static bound = {
		
		async mutatedItems(mr) {
			
			const	moved = ExtensionNode.getMovedNodesFromMR(mr);
			let v;
			
			for (v of moved)
				if (v instanceof CHTMLImageSeqItem && !(await this.updateItemsData()) && !this.updateAll()) break;
			
		},
		
		resizedTargets(entries) {
			
			let i, entry;
			
			i = -1;
			while (entry = entries[++i]) this.updateTarget(entry.target), this.update(entry.target);
			
		}
		
	};
	static cnvv(k, v) {
		
		let i,l, args,arg;
		
		if (Array.isArray(v)) {
			
			i = -1, l = (v = [ ...v ]).length;
			while (++i < l) v[i] = CHTMLImageSeq.cnvv(k, v[i]);
			
			return v.join();
			
		}
		
		i = -1;
		while ((args = CHTMLImageSeq.dataRxs[++i]) && !args[0].test(k));
		
		return args ? ((arg = [ ...args[1] ])[(i = arg.indexOf(null)) === -1 ? 0 : i] = v, v = arg.join('')) : v;
		
	};
	static cnvV(k, v, scale) {
		
		const value = CHTMLImageSeq.cnvv(k,v, scale);
		// NaN判定するとcss変数が激減する。accumulative関連が最初からNaN
		
		return `${k}:${value};` + (
				isNaN(parseInt(v)) ? '' : `${typeof scale === 'number' ? `${k}-scaled:calc(${value} * ${scale});` : ''}`
			);
		
	};
	
};

/*
	CHTMLImageSeqItem
		
		要素 CHTMLImageSeq に内包されている時、属性 src に指定された画像を読み込む。
		読み込みに成功すると、画像の URI, width, height を取得する。
		属性 src には連番を指定することができる。
		連番は [桁詰め文字:桁数:開始番号-終了番号] で指定する。
		開始番号は整数でなければならず、開始番号より終了番号の方が大きい場合、開始番号から遡って連番を作成する。
		桁詰め文字と桁数は省略可能で、それぞれの既定値はいずれも 0 になる。
		桁詰めは連番の左方向に対して行われるが、桁数に負の値を指定すると右方向に対して行われる。
		連番指定は複数行うことができる。例えば a-[0-2]-[0-2] の場合、
		a-0-0,a-0-1,a-0-2,a-1-0,a-1-1,a-1-2,a-2-0,a-2-1,a-2-2 が作成される。
		属性 exclude に正規表現を示す文字列を指定すると、連番中の該当するファイル名の画像を読み込みない。
		正規表現のあとに # で区切って正規表現オプションを指定できる。
		* 複雑になりすぎるため実装見送り
		属性 duplicate に正規表現を指定すると、連番中の該当するファイル名の画像をその直後に複製する。
		複製する数を正規表現のあとに # で区切って指定する。
		例えばファイル名に 3 を含む画像を 4 つ複製する場合 duplicate="3/4" とする。
*/
class CHTMLImageSeqItem extends ExtensionNode {
	
	constructor() {
		
		super(),
		
		this.urls = [],
		
		this.available = Promise.resolve(this);
		
	}
	attributeChangedCallback(name, lastValue, value) {
		
		value === lastValue || (this.available = new Promise(rs => this.fetch(value).then(imgs => rs(this))));
		
	}
	
	fetch(src = this.src, exclude = this.exclude) {
		
		return new Promise(rs => {
				
				const	imgs = [],
						decoded = error =>
							(error && console.error(error), ++l === imgs.length && (this.set(imgs), this.toData(), rs(imgs)));
				let i,i0,l, srcs;
				
				i = i0 = -1, l = 0, srcs = CHTMLImageSeqItem.parseSrc(src),
				exclude && (exclude = new RegExp((exclude = this.exclude.split('#'))[0], exclude[1] || ''));
				while (srcs[++i])	(typeof exclude === 'RegExp' && exclude.test(srcs[i])) ||
					((imgs[++i0] = new Image()).src = srcs[i], imgs[i0].decode().then(decoded).catch(decoded));
				
			});
		
	}
	set(imgs) {
		
		let i, img;
		
		i = -1, this.images = imgs, this.urls.length = 0,
		this.maxWidth = this.maxHeight = this.totalWidth = this.totalHeight = 0;
		while (img = imgs[++i])	img.url = img.src,
										img.accumulativeUrls = [ ...this.urls ],
										img.accumulativeWidth = this.totalWidth,
										img.accumulativeHeight = this.totalHeight,
										this.urls[i] = img.url,
										this.totalWidth += img.width,
										this.totalHeight += img.height,
										this.maxWidth < img.width && (this.maxWidth = img.width),
										this.maxHeight < img.height && (this.maxHeight = img.height);
		
	}
	toData() {
		
		const	data = {
					'total-width': this.totalWidth,
					'total-height': this.totalHeight,
					'max-width': this.maxWidth,
					'max-height': this.maxHeight,
					length: this.images.length,
					urls: [ ...this.urls ],
					imgs: []
				};
		let i, img;
		
		i = -1;
		while (img = this.images[++i]) data.imgs[i] = {
														url: img.src,
														width: img.width,
														height: img.height,
														'sub-accumulative-urls': img.accumulativeUrls,
														'sub-accumulative-width': img.accumulativeWidth,
														'sub-accumulative-height': img.accumulativeHeight
													};
		
		return this.data = data;
		
	}
	
	get src() { return this.getAttribute('src'); }
	set src(v) { this.setAttribute('src', v); }
	get exclude() { return this.getAttribute('exclude'); }
	set exclude(v) { this.setAttribute('exclude', v); }
	
	static get observedAttributes() { return [ 'src' ]; }
	
	static tagName = 'c-ii';
	static LOGGER_SUFFIX = 'II';
	static rxSb = /\[(.*?)\]/;
	//	parseSrc
	//		属性 src に指定された文字列中のプレースホルダーを展開する。
	static parseSrc(srcs) {
		
		let i,l,i0,l0, src,cntRaw,cnt,parsedSrcs,replacedSrcs;
		
		i = -1, l = (Array.isArray(srcs) ? srcs : (srcs = [srcs])).length, replacedSrcs = [], parsedSrcs = [];
		while (++i < l) {
			
			if (!(cntRaw = CHTMLImageSeqItem.rxSb.exec(src = srcs[i]))) continue;
			
			switch ((cnt = cntRaw[1].split(':')).length) {
				case 0: cnt = [ '' ]; break;
				case 1: cnt = CHTMLImageSeqItem.getCnt(cnt[0]); break;
				case 2: cnt.unshift(0);
				case 3: cnt = CHTMLImageSeqItem.getCnt(cnt[2], cnt[0], cnt[1]); break;
				default: cnt = [ cntRaw[1] ];
			}
			
			i0 = -1, l0 = cnt.length;
			while (++i0 < l0) replacedSrcs[replacedSrcs.length] = src.replace(cntRaw[0], cnt[i0]);
			
			i0 = -1, l0 = (replacedSrcs = CHTMLImageSeqItem.parseSrc(replacedSrcs)).length;
			while (++i0 < l0) parsedSrcs[parsedSrcs.length] = replacedSrcs[i0];
			
		}
		
		return parsedSrcs.length ? parsedSrcs : srcs;
		
	}
	static getCnt(cnt, pad = '0', padLength = 0) {
		
		let i,l,i0,padMethod,reverses;
		
		if ((cnt = cnt.split('-')).length === 2) {
			
			(i = parseInt(cnt[0])) < (l = parseInt(cnt[1])) && (i0 = -1),
			i > l && (i0 = i, i = l, l = i0, i0 = -1, reverses = true);
			
			if (i0 === -1) {
				--i,
				padMethod = (padLength = isNaN(padLength = parseInt(padLength)) ? 0 : padLength) < 0 ? 'padEnd' : 'padStart',
				padLength = Math.abs(padLength);
				while (++i <= l) cnt[++i0] = (''+i)[padMethod](padLength, pad);
				reverses && (cnt.reverse());
			}
			
		} else cnt = [ cnt ];
		
		return cnt;
		
	}
	
}