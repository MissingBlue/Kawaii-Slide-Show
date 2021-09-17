const PRESET_SETTINGS = {

dur: 5,
// 一枚毎の画像の表示時間。秒数を整数ないし小数で指定。

app_width: '100%',
app_height: '50%',
// 画像フレームの幅(app_width)と、高さ(app_height)。
// 表示される画像の大きさは、フレームの高さに基づいて自動で決定するため、
// app_height で指定した値が実質的な画像の表示サイズの基準になる。そのため、app_width は基本的には 100% のままで変更する必要はない。
// 値の単位は px, % などが使える。% で指定した場合、このスライドショーが属するドキュメントの大きさに対する割合として認識される。
// いずれの場合も、指定した値はシングルクォーテーション(')かダブルクォーテーション(")で必ず囲んでいる必要がある。
// OBS で使う際の推奨値としては、頻繁にスライドショーの位置を OBS 上で任意に動かす場合は、app_width: 100%, app_height: 100%、
// 概ね固定して使用する場合は、スライドショーを読み込んだ OBS のブラウザーソースのプロパティ内から「幅」、「高さ」を配信画面の解像度と同じピクセス数、
// 例えばフル HD 解像度で配信しているなら 幅:1920 高さ:1080 にした上で、 app_width: 100%, app_height: 40% などとし、
// 下記の設定値 position に、表示したい位置に合わせた任意の値（例えば左下なら position: 1 ）を指定する。

position: 1,
// スライドショーの表示位置を、画面を九分割して、1 を左下隅としたテンキーの位置に対応する整数値(1～9)で指定する。
// 1 より小さい値は 1 になり、9 より大きい値は 9 になる。

// プロパティ template 内の値は、必ず JSON 互換でなければならない。
// 例えばプロパティの値に式や変数は使ってはならない。（逆に言えば template 以外のプロパティには実は式や変数が指定できる、しかし非推奨、非対応）
// 各 template に begin.promise.index, end.promise.index が設定する場合、
// 各要素の位置関係は絶対的であり、任意に並び替える際は同プロパティの値を必ず変更しなければならない点に留意すること。
template: {},

profileName: [ 'simple' ],
// 任意のプロファイル名を文字列で、配列か文字列のまま指定。
// 各プロファイル間で同名のプロパティが存在した場合、前方から後方に向けて上書きされていく。

// ファイルの情報を示すオブジェクト内にプロパティ exclusive を設定し、その値に真を示す値を指定すると、
// リスト内に他のファイルが存在していても、そのプロパティが設定されたファイルのみ表示される。
// 逆に言えばファイルリスト内にひとつでも exclusive を設定したファイルがあると、他のファイルは一切表示されない。
// また、exclusive はプロパティであるため、当然ファイルパスを文字列で直接している場合は設定できない。
// このプロパティは、特定のファイルの表示確認のための使用とを想定している。
files: [

"img/sample-0.png",
{ file_path: "img/sample-1.png", file_author: 'SAMPLE' },
"img/sample-2.png",

],
// 表示する画像のリスト。
// 角括弧 [] に囲まれた中に画像ファイルの相対パスか絶対パス、または URL を、シングルクォーテーション(')かダブルクォーテーション(")で囲んで指定する。
// 複数ある場合はコンマ(,)で区切って並べて指定する。このリストに並べた順で表示を行う。

resource: {},
// 画像ファイル以外のリソースを読み込む。現在は音声ファイルを扱う audios のみ対応。
// 指定方法は simple 内の同プロパティ下にあるコメントを参照。

asset: {},
// 任意のアセット名に、アセットの構成物となるリソースの id を、再生ないし表示順に配列に列挙して指定する。

assets: [],
// 使用するアセット名。ここで指定したアセットは、すべての画像に対して適用される。
// 個別にアセットを割り当てる場合は、各ファイル毎に別個で指定することで、ここでの設定が上書きされる。



// 以下内部処理用

profile: {
	
	simple: {
		
		css: 'css/simple.css',
		
		cssvar: '{"target-raw-rect-height[0]":"{#h*}"}',
		
		resource: {
			audios: [
				{ id: 'sample', src: 'audios/sample.mp3', delay: 0, offset: 0, duration: true, gain: 1, playbackRate: 1 }
			]
		},
		// audiosに指定した文字列ないしオブジェクト内のプロパティ src に指定したリソースを音声ファイルとして読み込む。
		// audios は複数指定でき、その際は audios の値を配列にし、その中に読み込む音声ファイルを文字列ないしオブジェクトで列挙する。
		// オブジェクトで指定した場合、音声ファイルの再生形式などのパラメーターを任意で指定できる。
		// パラメーターは主に AudioNode 内の各種コンストラクター関数が受け付けるものに準じており、具体的には以下と同名のパラメーターがそのまま使える。
		// https://developer.mozilla.org/en-US/docs/Web/API/GainNode/GainNode#parameters
		// https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/AudioBufferSourceNode#parameters
		// ちなみに AudioBufferSourceNode のパラーメーターに相当する delay, offset, duration は、
		// それぞれ再生開始時間、音声ファイルの再生開始位置、再生時間を示し、それらの値はすべて実数（ないし整数）で指定する。
		// ただし、duration は実数として解釈できない値（例えば true など）を指定した場合、音声ファイルの元の再生時間で補完される。
		
		asset: {
			sample: [ 'sample' ]
		},
		
		assets: [ 'sample' ],
		
		template: {
			
			default: [
				
				{
					end: { timeout: true },
					attr: { 'class': 'viewport' },
					children: [ { tag: 'div', attr: { 'class': 'author' }, text: '[[file_author]]' } ]
				}
				
			]
			
		}
		
	},
	
	// 以下のテンプレートは動作確認済みで問題なく使用できると思われるが、
	// 特定のファイルでのみ表示確認をしており、汎用的な目的での利用には適わない。
	default: {
		
		css: 'css/default.css',
		
		cssvar: '{"target-raw-rect-height[0]":"{#h*}"}',
		
		template: {
			
			title_date: {
				attr: { 'class': 'text' },
				end: { promise: { index: 1, when: 'end' } },
				children: [
					{ tag: 'div', attr: { 'class': 'file-title' }, text: '[[file_title]]' },
					{ tag: 'div', attr: { 'class': 'file-date' }, text: '[[file_date]]' }
				]
			},
			default: [
				'{title_date}',
				{
					end: { event: { animationend: [ { target: true, count: 2, name: 'transition2' } ] } },
					attr: { 'class': 'viewport' },
					children: '{default_anime}'
				}
			],
			default_reflection: [
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
					attr: { 'class': 'reflection 0' },
					style: { '--ref-dur': '.8s', '--ref-delay': '0s' }
				},
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
					attr: { 'class': 'reflection 1' },
					style: { '--ref-dur': '.4s', '--ref-delay': '0.375s' }
				},
				{
					begin: { promise: { index: -4, when: 'begin' } },
					attr: { 'class': 'reflection 2' },
					style: { '--ref-dur': '.5s', '--ref-delay': '0s' }
				}
			],
			default_anime: [
				
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 0', 'data-dur': 0.15 },
					style: { '--dur': '?0.15?s', '--func': 'ease', '--count': 1, '--from-x': '-45%', '--from-y': '-35%', '--from-w': '250%', '--from-h': '250%', '--from-r': '0deg', '--to-y': '-45%' }
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 1', 'data-dur': 0.15, 'data-delayed-delay': '0' },
					style: { '--dur': '?0.15?s', '--func': 'ease', '--count': 1, '--from-x': '-165%', '--from-y': '-20%', '--from-w': '400%', '--from-h': '400%', '--from-r': '0deg', '--to-x': '-180%' }
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 2', 'data-dur': 1, 'data-delayed-delay': '0,1', 'data-delayed-delay-correction': 0.9 },
					style: { '--dur': '!1!s', '--from-x': '0%', '--from-y': '0%', '--from-w': '100%', '--from-h': '100%', '--from-r': '0deg', '--o-0': 0, '--o-1': 1, '--o-2': 1, '--o-3': 1, '--z-index': -1 }
				},
				'{default_reflection}'
			],
			default2: [
				'{title_date}',
				{
					end: { event: { animationend: [ { target: true, count: 2, name: 'transition2' } ] } },
					attr: { 'class': 'viewport' },
					children: '{default_anime_1}'
				}
			],
			default_anime_1: [
				
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 0', 'data-dur': 0.15 },
					style: { '--dur': '?0.15?s', '--func': 'ease', '--count': 1, '--from-x': '-45%', '--from-y': '-35%', '--from-w': '250%', '--from-h': '250%', '--from-r': '0deg', '--to-y': '-45%' }
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 1', 'data-dur': 0.15, 'data-delayed-delay': '0' },
					style: { '--dur': '?0.15?s', '--func': 'ease', '--count': 1, '--from-x': '-165%', '--from-y': '-20%', '--from-w': '400%', '--from-h': '400%', '--from-r': '0deg', '--to-x': '-180%' }
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 2', 'data-dur': 1, 'data-delayed-delay': '0,1', 'data-delayed-delay-correction': 0.9 },
					style: { '--dur': '!1!s', '--from-x': '0%', '--from-y': '0%', '--from-w': '100%', '--from-h': '100%', '--from-r': '0deg', '--o-0': 0, '--o-1': 1, '--o-2': 1, '--o-3': 1, '--z-index': -1 }
				},
				'{default_reflection}'
				
			]
		}
		
	}
	
},

version: '0.3',

changes: []

};