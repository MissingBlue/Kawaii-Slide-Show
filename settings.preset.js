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

cue: -1,
// 指定した整数に対応する files 内の画像から再生を開始する。
// たくさんの画像が指定された files 内の、後方のファイルの表示を、並び順を替えずに確認したい時に有用。
// 例えば files に三つの画像 'a', 'b', 'c' を指定した場合、通常は 'a' から再生されるが、
// cue に 1 を指定すると、'b' から再生される。
// cue に負の整数を指定すると、files を後ろから数えた対応する位置の画像から再生する。
// 例えば上記の例の場合、cue に -1 を指定すると、再生順は 'c', 'a', 'b', 'c' ... になる。
// 範囲外の値を指定するか整数以外の値を指定した場合、files の先頭か最後尾に丸められる。

// ファイルの情報を示すオブジェクト内にプロパティ exclusive を設定し、その値に真を示す値を指定すると、
// リスト内に他のファイルが存在していても、そのプロパティが設定されたファイルのみ表示される。
// 逆に言えばファイルリスト内にひとつでも exclusive を設定したファイルがあると、他のファイルは一切表示されない。
// また、exclusive はプロパティであるため、当然ファイルパスを文字列で直接している場合は設定できない。
// このプロパティは、特定のファイルの表示確認のための使用とを想定している。
files: [

"img/sample-0.png",
{ file_path: "img/sample-1.png", file_author: 'SAMPLE' },
{
	file_path: "img/sample-2.png",
	template: {
		
		default_author: { tag: 'div', text: 'This is an overwritten template. Never affect the other files using the original one though.' }
		
	}
},
{ file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Thuringia_Eisenach_asv2020-07_img23_Wartburg_Castle.jpg/800px-Thuringia_Eisenach_asv2020-07_img23_Wartburg_Castle.jpg", file_author: "«© A.Savin, WikiCommons»" },
{
	file_path: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Blutenburg_gespiegelt.jpg/800px-Blutenburg_gespiegelt.jpg",
	file_author: 'Schloss Blutenburg in Obermenzing/München.',
	file_author_template: '{wikimedia_author}',
},

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
					// [[]] refers to the file descriptor or configuration property corresponding to the included string..
					// the string following : will be used as a default value if there is no corresponding property.
					children: [ '[[file_author_template:{default_author}]]' ]
				}
				
			],
			default_author: { tag: 'div', attr: { 'class': 'author' }, text: '[[file_author]]' },
			wikimedia_author: {
				tag: 'div', attr: { 'class': 'author wikimedia' }, text: '[[file_author]]',
				children: '{wikimedia_icon}'
			},
			wikimedia_icon: { attr: { 'class': 'wikimedia_icon expat' } }
			
		}
		
	},
	
	// 以下のテンプレートは動作確認済みで問題なく使用できると思われるが、
	// 特定のファイルでのみ表示確認をしており、汎用的な目的での利用には適わない。
	
	default: {
		
		css: 'css/default.css',
		
		cssvar: '{"target-raw-rect-height[0]":"{#h*}"}',
		
		template: {
			
			default_simple: [
				'{default_timeout}',
				'{default_notation}',
				'{file_meta}',
				{
					end: { event: { animationend: [ { target: true, count: 2, name: 'transition2' } ] } },
					attr: { 'class': 'viewport' },
					children: [
						{
							end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
							attr: { 'class': 'scene 0', 'data-dur': 0.15 },
							style: {
								'--dur': '!1!s',
								'--from-x': '0%',
								'--from-y': '0%',
								'--from-w': '100%',
								'--from-h': '100%',
								'--from-r': '0deg',
								'--o-0': 0,
								'--o-1': 1,
								'--o-2': 1,
								'--o-3': 1,
								'--z-index': -1
							}
						},
						{
							end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
							attr: { 'class': 'reflection 0' },
							style: { '--ref-dur': '.8s', '--ref-delay': '0s' }
						},
						{
							end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
							attr: { 'class': 'reflection 1' },
							style: { '--ref-dur': '.4s', '--ref-delay': '0.375s' }
						}
					]
				}
			],
			
			default: {
				end: true,
				attr: { 'class': 'view-root', 'data-note': '[[file_note]]' },
				style: {
					
					// file_copy_0 の表示設定
					'--copy-0-delay-in': '?0.1?s', '--copy-0-dur-in': '?0.1?s',
					'--copy-0-delay-primary': '?0.2?s', '--copy-0-dur-primary': '?0.1?s',
					'--copy-0-delay-out': '?0.3?s', '--copy-0-dur-out': '?0.05?s',
					'--copy-0-t-x': '0%',
					'--copy-0-t-x-amount-in': '0%',
					'--copy-0-t-x-amount-primary': '0%',
					'--copy-0-t-x-amount-out': '0%',
					'--copy-0-t-y': '-3%',
					'--copy-0-t-y-amount-in': '5%',
					'--copy-0-t-y-amount-primary': '3%',
					'--copy-0-t-y-amount-out': '5%',
					// s は拡大・縮小、r は回転、接尾辞 -to も対応
					//'--copy-0-t-s-primary': '1',
					//'--copy-0-t-r-primary': '0deg',
					// フォント関連、接尾辞 -to も対応
					//'--copy-0-font-family': '"メイリオ"',
					//'--copy-0-font-size': 5rem,
					//'--copy-0-font-weight': bold,
					//'--copy-0-line-height-line-height': 1,
					//'--copy-0-word-break': keep-all,
					//'--copy-0-func-in': 'linear',
					
					'--copy-1-delay-in': '?0.21?s', '--copy-1-dur-in': '?0.1?s',
					'--copy-1-delay-primary': '?0.31?s', '--copy-1-dur-primary': '?0.49?s',
					'--copy-1-delay-out': '?0.8?s', '--copy-1-dur-out': '?0.05?s',
					'--copy-1-t-x': '0%',
					'--copy-1-t-x-amount-in': '0%',
					'--copy-1-t-x-amount-primary': '0%',
					'--copy-1-t-x-amount-out': '0%',
					'--copy-1-t-y': '7%',
					'--copy-1-t-y-amount-in': '-5%',
					'--copy-1-t-y-amount-primary': '-3%',
					'--copy-1-t-y-amount-out': '-5%',
					'--copy-1-func': 'linear',
					
					'--key-0-delay-in': '0s', '--key-0-dur-in': 'calc(var(--a-current-duration) * .05)',
					'--key-0-delay-primary': '0s', '--key-0-dur-primary': 'calc(var(--a-current-duration) * .15)',
					'--key-0-delay-out': 'calc(var(--key-0-delay-primary) + (var(--key-0-dur-primary)) - var(--key-0-dur-out))',
					'--key-0-dur-out': 'var(--key-0-dur-in)',
					'--key-0-s': 2.5, '--key-0-s-to': 'var(--key-0-s)',
					'--key-0-x': 0.3, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.1, '--key-0-y-to': 0.275,
					'--key-0-transform': 'none', '--key-0-transform-to': 'var(--key-0-transform)',
					
					'--key-1-delay-in': '0s', '--key-1-dur-in': '?0.05?s',
					'--key-1-delay-primary': '0s', '--key-1-dur-primary': '?0.15?s',
					'--key-1-delay-out': '?0.1?s', '--key-1-dur-out': '?0.05?s',
					'--key-1-s': 4, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 0.55, '--key-1-x-to': 0.61,
					'--key-1-y': 0.075, '--key-1-y-to': 'var(--key-1-y)',
					'--key-1-transform': 'none', '--key-1-transform-to': 'var(--key-1-transform)',
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.05?s',
					'--key-2-delay-primary': '0s',
					// --key-2-dur-primary, --key-2-delay-out は、対応するファイル記述子内で直接相対値で指定している。
					// このように、!任意の値! で指定する相対値の場合は、実際のファイル記述子内で指定しないと想定する値を得られない。
					// 以下のコメントを外した上で任意の値に書き換えれば自動的に上書きできる。
					//'--key-2-dur-primary': '0s',
					//'--key-2-delay-out': '0s',
					'--key-2-dur-out': '?0.05?s',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-transform': 'translate(0%,5%) scale(1.05)',
					'--key-2-transform-to': 'translate(0%,5%) scale(1.15)',
					'--key-2-func': 'ease-out',
					'--key-2-iterate': 1,
					'--key-2-z-index': '-1'
					
				},
				children: '[[file_template:{default_content}]]'
			},
			default_heat: {
				end: true,
				style: {
					
					
				},
				children: '{default_intercept?default_content}'
			},
			default_alice: {
				end: true,
				style: {
					
					'--key-0-s': 3, '--key-0-s-to': 'var(--key-0-s)',
					'--key-0-x': 0.4, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.4, '--key-0-y-to': 0.5,
					
					'--key-1-s': 5, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 0.45, '--key-1-x-to': 'var(--key-1-x)',
					'--key-1-y': 0.3, '--key-1-y-to': 0.22,
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.2?s',
					'--key-2-delay-primary': '0s', '--key-2-dur-primary': 'calc(var(--key-2-dur-remaining) * .1)',
					'--key-2-delay-out': 'calc(var(--key-2-dur-remaining) * .9 - var(--key-2-dur-out))', '--key-2-dur-out': '?0.05?s',
					//'--key-2-delay-primary': '0s', '--key-2-dur-primary': '!0.1!s',
					//'--key-2-delay-out': 'calc(!0.9!s - ?0.05?s)', '--key-2-dur-out': '?0.05?s',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-transform': 'translate(5%,0%)',
					'--key-2-transform-to': 'translate(0%,0%)',
					'--key-2-transform-out-to': 'translate(-4%,0%)',
					
				},
				children: '{default_intercept?default_content}'
			},
			default_notice_me: {
				end: true,
				attr: { 'class': 'hr-copy' },
				style: {
					
					'--copy-default-font-family': '"ステッキ"',
					'--copy-default-font-size': '4rem',
					'--copy-default-white-space': 'normal',
					'--copy-default-word-break': 'break-all',
					'--copy-0-t-x': '0%',
					'--copy-0-t-x-amount-in': '0%',
					'--copy-0-t-x-amount-primary': '0%',
					'--copy-0-t-x-amount-out': '0%',
					'--copy-0-t-y': '50%',
					'--copy-0-t-y-amount-in': '-50%',
					'--copy-0-t-y-amount-primary': '-5%',
					'--copy-0-t-y-amount-out': '-10%',
					'--copy-0-func-in': 'cubic-bezier(1,-1.11,0,2.38)',
					'--copy-0-t-s-in': '1.2',
					'--copy-0-t-s-in-to': '1',
					'--copy-0-t-r-primary': '-15deg',
					'--copy-1-t-x': '0%',
					'--copy-1-t-x-amount-in': '0%',
					'--copy-1-t-x-amount-primary': '0%',
					'--copy-1-t-x-amount-out': '0%',
					'--copy-1-t-y': '50%',
					'--copy-1-t-y-amount-in': '-50%',
					'--copy-1-t-y-amount-primary': '-5%',
					'--copy-1-t-y-amount-out': '-10%',
					'--copy-1-func-in': 'cubic-bezier(1,-1.11,0,2.38)',
					'--copy-1-t-s-in': '1.2',
					'--copy-1-t-s-in-to': '1',
					'--copy-1-t-r-primary': '-15deg',
					
					'--key-0-delay-in': '0s', '--key-0-dur-in': '?0.1?s',
					'--key-0-delay-primary': '0s', '--key-0-dur-primary': '?0.1?s',
					'--key-0-delay-out': '?0.1?s', '--key-0-dur-out': '?0.05?s',
					'--key-0-func': 'cubic-bezier(.69,4.71,.4,-2.43)',
					'--key-0-s': 6.5, '--key-0-s-to': 5.5,
					'--key-0-x': 0.45, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.2, '--key-0-y-to': 'var(--key-0-y)',
					
					'--key-1-s': 3, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 1, '--key-1-x-to': 0.425,
					'--key-1-y': 0.45, '--key-1-y-to': 'var(--key-1-y)',
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.05?s',
					'--key-2-delay-primary': '0s', '--key-2-dur-primary': '?0.1?s',
					'--key-2-delay-out': 'calc((var(--key-2-dur-remaining) - var(--key-2-delay-in)) - var(--key-2-dur-out))', '--key-2-dur-out': '?0.05?s',
					//'--key-2-delay-primary': '0s', '--key-2-dur-primary': '!0.1!s',
					//'--key-2-delay-out': 'calc(!0.9!s - ?0.05?s)', '--key-2-dur-out': '?0.05?s',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-func': 'cubic-bezier(.69,4.71,.4,-2.43)',
					'--key-2-transform': 'scale(1.1)',
					'--key-2-transform-to': 'scale(1)',
					/*
					'--key-2-transform-in': 'translate(-10%,0%)',
					'--key-2-transform-in-to': 'translate(-0%,0%)',
					'--key-2-transform': 'translate(0%,0%)',
					'--key-2-transform-to': 'translate(5%,0%)',
					'--key-2-transform-out-to': 'translate(-4%,0%)',
					*/
				},
				children: '{default_intercept?default_content}'
			},
			default_summoner: {
				end: true,
				attr: { 'class': 'hr-copy' },
				style: {
					
					'--copy-default-font-size': '3rem',
					
					'--copy-default-white-space': 'normal',
					'--copy-default-word-break': 'break-all',
					
					'--copy-0-background': 'rgba(0,0,0,1)',
					'--copy-0-border': '.4rem solid rgba(255,255,255,1)',
					'--copy-0-border-radius': '1rem',
					'--copy-0-padding': '1rem',
					'--copy-0-font-family': '"ドットゴシック16"',
					'--copy-0-font-size': '1.75rem',
					'--copy-0-font-weight': 'bold',
					'--copy-0-t-x': '0%',
					'--copy-0-t-x-amount-in': '0%',
					'--copy-0-t-x-amount-primary': '0%',
					'--copy-0-t-x-amount-out': '0%',
					'--copy-0-t-y': '20%',
					'--copy-0-t-y-amount-in': '-20%',
					'--copy-0-t-y-amount-primary': '0%',
					'--copy-0-t-y-amount-out': '20%',
					'--copy-0-position': 'absolute',
					'--copy-0-top': '5%',
					'--copy-0-left': '0%',
					'--copy-0-width': '60%',
					
					'--key-0-s': 5, '--key-0-s-to': 'var(--key-0-s)',
					'--key-0-x': 0.11, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.18, '--key-0-y-to': 0.27,
					
					'--copy-1-background': 'rgba(0,0,0,.5)',
					'--copy-1-border': '.4rem solid rgba(255,255,255,1)',
					'--copy-1-border-radius': '1rem',
					'--copy-1-padding': '1rem',
					'--copy-1-margin': '.5rem',
					'--copy-1-font-family': '"ドットゴシック16"',
					'--copy-1-font-size': '1.75rem',
					'--copy-1-font-weight': 'bold',
					'--copy-1-position': 'absolute',
					'--copy-1-top': '10%',
					'--copy-1-left': '0%',
					
					'--key-1-s': 5, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 0.48, '--key-1-x-to': 'var(--key-1-x)',
					'--key-1-y': 0.32, '--key-1-y-to': 0.23,
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.2?s',
					'--key-2-delay-primary': '0s', '--key-2-dur-primary': 'calc(var(--key-2-dur-remaining) * .1)',
					'--key-2-delay-out': 'calc(var(--key-2-dur-remaining) * .9 - var(--key-2-dur-out))', '--key-2-dur-out': '?0.05?s',
					//'--key-2-delay-primary': '0s', '--key-2-dur-primary': '!0.1!s',
					//'--key-2-delay-out': 'calc(!0.9!s - ?0.05?s)', '--key-2-dur-out': '?0.05?s',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-transform': 'translate(5%,0%)',
					'--key-2-transform-to': 'translate(0%,0%)',
					'--key-2-transform-out-to': 'translate(-4%,0%)',
					
				},
				children: '{default_intercept?default_content}'
			},
			default_vanilla: {
				end: true,
				style: {
					
					//'--from-x-0': '-120%',
					//'--from-y-0': '-70%',
					//'--to-y-0': '-100%',
					//'--from-w-0': '300%',
					//'--from-h-0': '300%',
					//
					//'--from-x-1': '-230%',
					//'--from-y-1': '-70%',
					//'--to-y-1': '-80%',
					//'--from-w-1': '500%',
					//'--from-h-1': '500%',
					'--copy-0-delay-in': '?0.05?s', '--copy-0-dur-in': '?0.1?s',
					'--copy-0-delay-primary': '0s', '--copy-0-dur-primary': '?0.05?s',
					'--copy-0-delay-out': '?0.2?s', '--copy-0-dur-out': '?0.1?s',
					'--copy-0-func-primary': 'linear',
					'--copy-0-iterate-primary': 'infinite',
					'--copy-0-dir-primary': 'alternate',
					'--copy-0-t-y': '0%',
					'--copy-0-t-y-amount-in': '0%',
					'--copy-0-t-y-amount-primary': '5%',
					'--copy-0-t-y-amount-out': '0%',

					'--copy-1-delay-in': '?0.15?s', '--copy-1-dur-in': '?0.1?s',
					'--copy-1-delay-primary': '?0.15?s', '--copy-1-dur-primary': '?0.05?s',
					'--copy-1-delay-out': '?0.25?s', '--copy-1-dur-out': '?0.1?s',
					'--copy-1-func-primary': 'linear',
					'--copy-1-iterate-primary': 'infinite',
					'--copy-1-dir-primary': 'alternate',
					'--copy-1-t-y': '0%',
					'--copy-1-t-y-amount-in': '0%',
					'--copy-1-t-y-amount-primary': '-5%',
					'--copy-1-t-y-amount-out': '0%',

					'--copy-default-font-family': '"フィバ字"',
					'--copy-default-font-size': '3.5rem',
					
					'--key-0-delay-primary': '0s', '--key-0-dur-primary': '?0.2?s',
					'--key-0-s': 5, '--key-0-s-to': 'var(--key-0-s)',
					'--key-0-x': 0.5, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.1, '--key-0-y-to': 'var(--key-0-y)',
					'--key-0-func': 'cubic-bezier(.69,4.71,.4,-4.43)',
					'--key-0-iterate': 'infinite',
					'--key-0-dir': 'alternate',
					'--key-0-transform': 'translate(0%,0%)',
					'--key-0-transform-to': 'translate(0%,2%)',
					
					'--key-1-delay-primary': '0s', '--key-1-dur-primary': '?0.15?s',
					'--key-1-s': 4, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 0.575, '--key-1-x-to': 'var(--key-1-x)',
					'--key-1-y': 0.3, '--key-1-y-to': 'var(--key-1-y)',
					'--key-1-func': 'cubic-bezier(.69,4.71,.4,-4.43)',
					'--key-1-iterate': 'infinite',
					'--key-1-dir': 'alternate',
					'--key-1-transform': 'translate(0%,0%)',
					'--key-1-transform-to': 'translate(0%,-2%)',
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.2?s',
					'--key-2-delay-primary': '0s', '--key-2-dur-primary': 'calc(var(--key-2-dur-remaining) * .6)',
					'--key-2-delay-out': 'calc((var(--key-2-dur-remaining) - var(--key-2-delay-in)) * .9)', '--key-2-dur-out': 'calc((var(--key-2-dur-remaining) - var(--key-2-delay-in)) * .1)',
					//'--key-2-delay-primary': '0s', '--key-2-dur-primary': '!0.1!s',
					//'--key-2-delay-out': 'calc(!0.9!s - ?0.05?s)', '--key-2-dur-out': '?0.05?s',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-func': 'ease-out',
					'--key-2-iterate': 'infinite',
					'--key-2-dir': 'alternate',
					'--key-2-transform': 'translate(0%,1%) scale(1.1)',
					'--key-2-transform-to': 'translate(0%,5%) scale(1.1)',
					'--key-2-opacity-out-to': 1
					
				},
				children: '{default_intercept?default_content}'
			},
			default_seventeen: {
				end: true,
				style: {
					
					//'--dur-0': '?0.2?s',
					//
					//'--dur-1': '?0.2?s',
					//'--transform-origin-2': 'center'
					
					//'--from-x-0': '-280%',
					//'--from-y-0': '-150%',
					//'--to-y-0': '-200%',
					//'--from-w-0': '600%',
					//'--from-h-0': '600%',

					//'--from-x-1': '-130%',
					//'--to-x-1': '-160%',
					//'--from-y-1': '-250%',
					//'--from-w-1': '450%',
					//'--from-h-1': '450%',
					//
					//'--from-t-2': 'scale(1.1)',
					//'--to-t-2': 'scale(1)',

					'--key-0-delay-primary': '0s', '--key-0-dur-primary': '?0.2?s',
					'--key-0-delay-out': 'calc(var(--key-0-dur-primary) - var(--key-0-dur-out))',
					'--key-0-s': 6, '--key-0-s-to': 'var(--key-0-s)',
					'--key-0-x': 0.55, '--key-0-x-to': 'var(--key-0-x)',
					'--key-0-y': 0.28, '--key-0-y-to': 0.39,
					
					'--key-1-delay-primary': '0s', '--key-1-dur-primary': '?0.3?s',
					'--key-1-delay-out': 'calc(var(--key-1-dur-primary) - var(--key-1-dur-out))',
					'--key-1-func': 'linear',
					'--key-1-s': 5, '--key-1-s-to': 'var(--key-1-s)',
					'--key-1-x': 0.39, '--key-1-x-to': 0.42,
					'--key-1-y': 0.71, '--key-1-y-to': 'var(--key-1-y)',
					
					'--key-2-delay-in': '0s', '--key-2-dur-in': '?0.2?s',
					'--key-2-delay-primary': '0s', '--key-2-dur-primary': 'var(--key-2-dur-remaining)',
					'--key-2-delay-out': 'calc((var(--key-2-dur-remaining) - var(--key-2-delay-in)) - var(--key-2-dur-out))', '--key-2-dur-out': 'calc((var(--key-2-dur-remaining) - var(--key-2-delay-in)) * .1)',
					'--key-2-s': 1, '--key-2-s-to': 'var(--key-2-s)',
					'--key-2-x': 0, '--key-2-x-to': 'var(--key-2-x)',
					'--key-2-y': 0, '--key-2-y-to': 'var(--key-2-y)',
					'--key-2-transform': 'scale(1.1)',
					'--key-2-transform-to': 'scale(1)',
					'--key-2-opacity-out-to': '1'
					
				},
				children: '{default_intercept?default_content}'
			},
			default_content: [
				'{default_timeout}',
				'{default_notation}',
				'{file_meta}',
				{
					end: { event: { animationend: [ { target: true, count: 2, name: 'transition2' } ] } },
					attr: { 'class': 'viewport' },
					children: '{default_anime}'
				}
			],
			default_notation: {
				end: true, attr: { 'class': 'key in note' },
				style: {
					
					'--delay-in': 'calc(var(--a-current-duration) * 1 / 10)',
					'--dur-in': 'calc(var(--a-current-duration) * .05)',
					
					'--delay-primary': '0s',
					'--dur-primary': 'calc(var(--a-current-duration) * .9)',
					
					'--delay-out': 'calc((var(--delay-primary) + var(--dur-primary)) - var(--dur-out))',
					'--dur-out': 'var(--dur-in)',
					
				},
				children: {
					end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
					attr: { 'class': 'key out' },
					children: { attr: { 'class': 'key primary' }, }
				}
			},
			default_timeout: {
				end: { event: { animationend: [ { target: true, count: 1, name: 'timeout-end' } ] } },
				attr: { 'class': 'timeout' }
			},
			file_meta: {
				end: true, attr: { 'class': 'meta' },
				end: { promise: { index: 1, when: 'end' } },
				style: {
					
					'opacity': 1,
					
					'--delay-in': '?0.5?s',
					//'--delay-in': '?0.0?s',
					'--dur-in': '?0.025?s',
					'--delay-out': '?0.85?s',
					'--dur-out': 'var(--dur-in)',
					
					'--delay-vr-in': 'var(--delay-in)',
					'--dur-vr-in': 'var(--dur-in)',
					'--delay-vr-out': 'var(--delay-out)',
					'--dur-vr-out': 'var(--dur-vr-in)',
					
				},
				children: [
					{
						end: true, attr: { 'class': 'key in meta-pane-0' },
						children: {
							end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
							attr: { 'class': 'key out' },
							children: {
								attr: { 'class': 'key' },
								children: { tag: 'div', attr: { 'class': 'file-title' }, html: '[[file_title]]' }
							}
						}
					},
					{
						end: true, attr: { 'class': 'key in vertical-rule' },
						children: {
							end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
							attr: { 'class': 'key out' },
							children: { attr: { 'class': 'key' } }
						}
					},
					{
						end: true, attr: { 'class': 'key in meta-pane-1' }, end: true,
						children: {
							end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
							attr: { 'class': 'key out' },
							children: {
								attr: { 'class': 'key' },
								children: [
									{ tag: 'div', attr: { 'class': 'file-author' }, html: '[[file_author]]' },
									{ tag: 'div', attr: { 'class': 'file-date' }, html: '[[file_date]]' }
								]
							}
						}
					}
				]
			},
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
			default_reflection_in: [
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
					attr: { 'class': 'reflection' },
					style: { '--ref-dur': '?0.16?s', '--ref-delay': '0s' }
				},
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
					attr: { 'class': 'reflection' },
					style: { '--ref-dur': '?0.08?s', '--ref-delay': '?0.075?s' }
				}
			],
			default_reflection_one: {
				end: { event: { animationend: [ { target: true, count: 1, name: 'reflection' } ] } },
				attr: { 'class': 'reflection' },
				style: { '--ref-dur': '?0.1?s', '--ref-delay': '0s' }
			},
			default_anime: [
				
				{ tag: 'div', end: { timeout: true }, attr: { 'class': 'copy' }, html: '[[file_copy]]' },
				{
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 0' },
					style: {
						'--dur': 'var(--dur-0, ?0.15?s)',
						'--func': 'var(--func-0, ease)',
						'--count': 'var(--count-0, 1)',
						'--from-x': 'var(--from-x-0, -45%)',
						'--from-y': 'var(--from-y-0, -35%)',
						'--from-w': 'var(--from-w-0, 250%)',
						'--from-h': 'var(--from-h-0, 250%)',
						'--from-t': 'var(--from-t-0, none)',
						'--to-x': 'var(--to-x-0, var(--from-x))',
						'--to-y': 'var(--to-y-0, var(--from-y))',
						'--to-w': 'var(--to-w-0, var(--from-w))',
						'--to-h': 'var(--to-h-0, var(--from-h))',
						'--to-t': 'var(--to-t-0, var(--from-t))',
						'--transform-origin': 'var(--transform-origin-0, left top)',
					}
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 1' },
					style: {
						'--dur': 'var(--dur-1, ?0.15?s)',
						'--func': 'var(--func-1, ease)',
						'--count': 'var(--count-1, 1)',
						'--from-x': 'var(--from-x-1, -165%)',
						'--from-y': 'var(--from-y-1, -20%)',
						'--from-w': 'var(--from-w-1, 400%)',
						'--from-h': 'var(--from-h-1, 400%)',
						'--from-t': 'var(--from-t-1, none)',
						'--to-x': 'var(--to-x-1, var(--from-x))',
						'--to-y': 'var(--to-y-1, var(--from-y))',
						'--to-w': 'var(--to-w-1, var(--from-w))',
						'--to-h': 'var(--to-h-1, var(--from-h))',
						'--to-t': 'var(--to-t-1, var(--from-t))',
						'--transform-origin': 'var(--transform-origin-1, left top)',
					}
				},
				{
					begin: { promise: { index: -1, when: 'end' } },
					end: { event: { animationend: [ { target: true, count: 1, name: 'element-preset-anime' } ] } },
					attr: { 'class': 'scene 2' },
					style: {
						'--dur': 'var(--dur-2, !1!s)',
						'--from-x': 'var(--from-x-2, 0%)',
						'--from-y': 'var(--from-y-2, 0%)',
						'--from-w': 'var(--from-w-2, 100%)',
						'--from-h': 'var(--from-h-2, 100%)',
						'--from-t': 'var(--from-t-2, none)',
						'--to-x': 'var(--to-x-2, var(--from-x))',
						'--to-y': 'var(--to-y-2, var(--from-y))',
						'--to-w': 'var(--to-w-2, var(--from-w))',
						'--to-h': 'var(--to-h-2, var(--from-h))',
						'--to-t': 'var(--to-t-2, var(--from-t))',
						'--o-0': 'var(--o-0-2, 0)',
						'--o-1': 'var(--o-1-2, 1)',
						'--o-2': 'var(--o-2-2, 1)',
						'--o-3': 'var(--0-3-2, 1)',
						'--transform-origin': 'var(--transform-origin-2, left top)',
						'--z-index': 'var(--z-index-2, -1)'
					}
				},
				'{default_reflection}'
			],
			default_anime: [
				'{default_copy}',
				'{default_key}'
			],
			default_copy: {
				end: true, attr: { 'class': 'copy key' },
				style: {
					'--transform': 'var(--copy-transform, translate(0%,10%))',
					'--copy-text-shadow': 'var(--copy-default-text-shadow, 0px 1px 0px rgba(0,0,0,1), 0px 0px .2rem rgba(0,0,0,1), 0px 0px 1rem rgba(0,0,0,1))',
					//'--copy-font-family:' '',
					//'--copy-font-size:' '',
					//'--copy-font-weight:' '',
					//'--copy-letter-spacing:' '',
					//'--copy-font-break:' '',
				},
				children: [
					{
						attr: {
							'class': 'key in',
							'data-share-css-q': '.view-root',
							'data-share-css-filter': '--copy-0-dur-remaining'
						},
						style: {
							
							'--copy-0-dur-remaining': '!1!s',
							
							'--delay-in': 'var(--copy-0-delay-in)', '--dur-in': 'var(--copy-0-dur-in)',
							'--delay-primary': 'var(--copy-0-delay-primary)', '--dur-primary': 'var(--copy-0-dur-primary)',
							'--delay-out': 'var(--copy-0-delay-out)', '--dur-out': 'var(--copy-0-dur-out)',
							
							'--copy-func-in': 'var(--copy-0-func-in)',
							'--copy-iterate-in': 'var(--copy-0-iterate-in)',
							'--copy-dir-in': 'var(--copy-0-dir-in)',
							'--copy-func-primary': 'var(--copy-0-func-primary)',
							'--copy-iterate-primary': 'var(--copy-0-iterate-primary)',
							'--copy-dir-primary': 'var(--copy-0-dir-primary)',
							'--copy-func-out': 'var(--copy-0-func-out)',
							'--copy-iterate-out': 'var(--copy-0-iterate-out)',
							'--copy-dir-out': 'var(--copy-0-dir-out)',
							
							'--t-x-in': 'var(--copy-0-t-x)',
							'--t-x-amount-in': 'var(--copy-0-t-x-amount-in)',
							'--t-x-amount-primary': 'var(--copy-0-t-x-amount-primary)',
							'--t-x-amount-out': 'var(--copy-0-t-x-amount-out)',
							'--t-y-in': 'var(--copy-0-t-y)',
							'--t-y-amount-in': 'var(--copy-0-t-y-amount-in)',
							'--t-y-amount-primary': 'var(--copy-0-t-y-amount-primary)',
							'--t-y-amount-out': 'var(--copy-0-t-y-amount-out)',
							'--t-s-in': 'var(--copy-0-t-s-in, 1)',
							'--t-s-in-to': 'var(--copy-0-t-s-in-to, var(--t-s-in))',
							'--t-s-primary': 'var(--copy-0-t-s-primary, 1)',
							'--t-s-primary-to': 'var(--copy-0-t-s-primary-to, var(--t-s-primary))',
							'--t-s-out': 'var(--copy-0-t-s-out, 1)',
							'--t-s-out-to': 'var(--copy-0-t-s-out-to, var(--t-s-out))',
							'--t-w-in': 'var(--copy-0-t-w-in)',
							'--t-w-in-to': 'var(--copy-0-t-w-in-to, var(--t-w-in))',
							'--t-w-primary': 'var(--copy-0-t-w-primary)',
							'--t-w-primary-to': 'var(--copy-0-t-w-primary-to, var(--t-w-primary))',
							'--t-w-out': 'var(--copy-0-t-w-out)',
							'--t-w-out-to': 'var(--copy-0-t-w-out-to, var(--t-w-out))',
							'--t-h-in': 'var(--copy-0-t-h-in)',
							'--t-h-in-to': 'var(--copy-0-t-h-in-to, var(--t-h-in))',
							'--t-h-primary': 'var(--copy-0-t-h-primary)',
							'--t-h-primary-to': 'var(--copy-0-t-h-primary-to, var(--t-h-primary))',
							'--t-h-out': 'var(--copy-0-t-h-out)',
							'--t-h-out-to': 'var(--copy-0-t-h-out-to, var(--t-h-out))',
							'--t-r-in': 'var(--copy-0-t-r-in, 0deg)',
							'--t-r-in-to': 'var(--copy-0-t-r-in-to, var(--t-r-in))',
							'--t-r-primary': 'var(--copy-0-t-r-primary, 0deg)',
							'--t-r-primary-to': 'var(--copy-0-t-r-primary-to, var(--t-r-primary))',
							'--t-r-out': 'var(--copy-0-t-r-out, 0deg)',
							'--t-r-out-to': 'var(--copy-0-t-r-out-to, var(--t-r-out))',
							
							'--filter': 'var(--copy-0-filter)',
							'--position': 'var(--copy-0-position, relative)',
							'--text-shadow': 'var(--copy-0-text-shadow, var(--copy-text-shadow, none))',
							'--writing-mode': 'var(--copy-0-writing-mode, var(--copy-writing-mode, vertical-rl))',
							
							'--copy-border': 'var(--copy-0-border)',
							'--copy-border-to': 'var(--copy-0-border-to)',
							'--copy-border-radius': 'var(--copy-0-border-radius)',
							'--copy-border-radius-to': 'var(--copy-0-border-radius-to)',
							'--copy-background': 'var(--copy-0-background)',
							'--copy-background-to': 'var(--copy-0-background-to)',
							'--copy-margin': 'var(--copy-0-margin)',
							'--copy-margin-to': 'var(--copy-0-margin-to)',
							'--copy-padding': 'var(--copy-0-padding)',
							'--copy-padding-to': 'var(--copy-0-padding-to)',
							'--copy-top': 'var(--copy-0-top)',
							'--copy-top-to': 'var(--copy-0-top-to)',
							'--copy-right': 'var(--copy-0-right)',
							'--copy-right-to': 'var(--copy-0-right-to)',
							'--copy-bottom': 'var(--copy-0-bottom)',
							'--copy-bottom-to': 'var(--copy-0-bottom-to)',
							'--copy-left': 'var(--copy-0-left)',
							'--copy-left-to': 'var(--copy-0-left-to)',
							'--copy-width': 'var(--copy-0-width)',
							'--copy-height': 'var(--copy-0-height)',
							'--copy-width-to': 'var(--copy-0-width-to)',
							'--copy-height-to': 'var(--copy-0-height-to)',
							
							'--copy-font-family': 'var(--copy-0-font-family, var(--copy-default-font-family))',
							'--copy-font-size': 'var(--copy-0-font-size, var(--copy-default-font-size))',
							'--copy-font-weight': 'var(--copy-0-font-weight, var(--copy-default-font-weight))',
							'--copy-letter-spacing': 'var(--copy-0-letter-spacing, var(--copy-default-letter-spacing))',
							'--copy-word-break': 'var(--copy-0-word-break, var(--copy-default-word-break))',
							'--copy-white-space': 'var(--copy-0-white-space, var(--copy-default-white-space))',
							
						},
						children: {
							attr: { 'class': 'key out' },
							children: {
								html: '[[file_copy_0]]', tag: 'div', attr: { 'class': 'key copy-content' },
								style: {}
							}
						},
					},
					{
						attr: {
							'class': 'key in',
							'data-share-css-q': '.view-root',
							'data-share-css-filter': '--copy-1-dur-remaining'
						},
						style: {
							
							'--copy-1-dur-remaining': '!1!s',
							
							'--delay-in': 'var(--copy-1-delay-in)', '--dur-in': 'var(--copy-1-dur-in)',
							'--delay-primary': 'var(--copy-1-delay-primary)', '--dur-primary': 'var(--copy-1-dur-primary)',
							'--delay-out': 'var(--copy-1-delay-out)', '--dur-out': 'var(--copy-1-dur-out)',
							
							'--t-x-in': 'var(--copy-1-t-x)',
							'--t-x-amount-in': 'var(--copy-1-t-x-amount-in)',
							'--t-x-amount-primary': 'var(--copy-1-t-x-amount-primary)',
							'--t-x-amount-out': 'var(--copy-1-t-x-amount-out)',
							'--t-y-in': 'var(--copy-1-t-y)',
							'--t-y-amount-in': 'var(--copy-1-t-y-amount-in)',
							'--t-y-amount-primary': 'var(--copy-1-t-y-amount-primary)',
							'--t-y-amount-out': 'var(--copy-1-t-y-amount-out)',
							'--t-s-in': 'var(--copy-1-t-s-in, 1)',
							'--t-s-in-to': 'var(--copy-1-t-s-in-to, var(--t-s-in))',
							'--t-s-primary': 'var(--copy-1-t-s-primary, 1)',
							'--t-s-primary-to': 'var(--copy-1-t-s-primary-to, var(--t-s-primary))',
							'--t-s-out': 'var(--copy-1-t-s-out, 1)',
							'--t-s-out-to': 'var(--copy-1-t-s-out-to, var(--t-s-out))',
							'--t-w-in': 'var(--copy-1-t-w-in)',
							'--t-w-in-to': 'var(--copy-1-t-w-in-to, var(--t-w-in))',
							'--t-w-primary': 'var(--copy-1-t-w-primary)',
							'--t-w-primary-to': 'var(--copy-1-t-w-primary-to, var(--t-w-primary))',
							'--t-w-out': 'var(--copy-1-t-w-out)',
							'--t-w-out-to': 'var(--copy-1-t-w-out-to, var(--t-w-out))',
							'--t-h-in': 'var(--copy-1-t-h-in)',
							'--t-h-in-to': 'var(--copy-1-t-h-in-to, var(--t-h-in))',
							'--t-h-primary': 'var(--copy-1-t-h-primary)',
							'--t-h-primary-to': 'var(--copy-1-t-h-primary-to, var(--t-h-primary))',
							'--t-h-out': 'var(--copy-1-t-h-out)',
							'--t-h-out-to': 'var(--copy-1-t-h-out-to, var(--t-h-out))',
							'--t-r-in': 'var(--copy-1-t-r-in, 0deg)',
							'--t-r-in-to': 'var(--copy-1-t-r-in-to, var(--t-r-in))',
							'--t-r-primary': 'var(--copy-1-t-r-primary, 0deg)',
							'--t-r-primary-to': 'var(--copy-1-t-r-primary-to, var(--t-r-primary))',
							'--t-r-out': 'var(--copy-1-t-r-out, 0deg)',
							'--t-r-out-to': 'var(--copy-1-t-r-out-to, var(--t-r-out))',
							
							'--filter': 'var(--copy-1-filter)',
							'--position': 'var(--copy-1-porition, relative)',
							'--text-shadow': 'var(--copy-1-text-shadow, var(--copy-text-shadow, none))',
							'--writing-mode': 'var(--copy-1-writing-mode, var(--copy-writing-mode, vertical-rl))',
							
							'--copy-func-in': 'var(--copy-1-func-in)',
							'--copy-iterate-in': 'var(--copy-1-iterate-in)',
							'--copy-dir-in': 'var(--copy-1-dir-in)',
							'--copy-func-primary': 'var(--copy-1-func-primary)',
							'--copy-iterate-primary': 'var(--copy-1-iterate-primary)',
							'--copy-dir-primary': 'var(--copy-1-dir-primary)',
							'--copy-func-out': 'var(--copy-1-func-out)',
							'--copy-iterate-out': 'var(--copy-1-iterate-out)',
							'--copy-dir-out': 'var(--copy-1-dir-out)',
							
							'--copy-border': 'var(--copy-1-border)',
							'--copy-border-to': 'var(--copy-1-border-to)',
							'--copy-border-radius': 'var(--copy-1-border-radius)',
							'--copy-border-radius-to': 'var(--copy-1-border-radius-to)',
							'--copy-background': 'var(--copy-1-background)',
							'--copy-background-to': 'var(--copy-1-background-to)',
							'--copy-margin': 'var(--copy-1-margin)',
							'--copy-margin-to': 'var(--copy-1-margin-to)',
							'--copy-padding': 'var(--copy-1-padding)',
							'--copy-padding-to': 'var(--copy-1-padding-to)',
							'--copy-position': 'var(--copy-1-position)',
							'--copy-top': 'var(--copy-1-top)',
							'--copy-top-to': 'var(--copy-1-top-to)',
							'--copy-right': 'var(--copy-1-right)',
							'--copy-right-to': 'var(--copy-1-right-to)',
							'--copy-bottom': 'var(--copy-1-bottom)',
							'--copy-bottom-to': 'var(--copy-1-bottom-to)',
							'--copy-left': 'var(--copy-1-left)',
							'--copy-left-to': 'var(--copy-1-left-to)',
							'--copy-width': 'var(--copy-1-width)',
							'--copy-height': 'var(--copy-1-height)',
							
							'--copy-font-family': 'var(--copy-1-font-family, var(--copy-default-font-family))',
							'--copy-font-size': 'var(--copy-1-font-size, var(--copy-default-font-size))',
							'--copy-font-weight': 'var(--copy-1-font-weight, var(--copy-default-font-weight))',
							'--copy-letter-spacing': 'var(--copy-1-letter-spacing, var(--copy-default-letter-spacing))',
							'--copy-word-break': 'var(--copy-1-word-break, var(--copy-default-word-break))',
							'--copy-white-space': 'var(--copy-1-white-space, var(--copy-default-white-space))',
							
						},
						children: {
							attr: { 'class': 'key out' },
							children: {
								html: '[[file_copy_1]]', tag: 'div', attr: { 'class': 'key copy-content' },
								style: {}
							}
						}
					}
				]
			},
			default_key: [
				{
					end: true,
							traces: true,
					attr: {
						'data-share-css-q': '.view-root',
						'data-share-css-filter': '--key-0-dur-remaining'
					},
					style: {
						
						'--key-0-dur-remaining': '!1!s',
						
						'--delay-in': 'var(--key-0-delay-in)', '--dur-in': 'var(--key-0-dur-in)',
						'--delay-primary': 'var(--key-0-delay-primary)', '--dur-primary': 'var(--key-0-dur-primary)',
						'--delay-out': 'var(--key-0-delay-out)', '--dur-out': 'var(--key-0-dur-out)',
						
					},
					children: [
						{
							end: true,
							attr: { 'class': 'key in default-0', },
							style: {
								'--func': 'var(--key-0-func-in, ease-out)',
								'--iterate': 'var(--key-0-iterate-in, 1)',
								'--dir': 'var(--key-0-dir-in, normal)',
								'--opacity': 'var(--key-0-opacity-in, 0)',
								'--opacity-to': 'var(--key-0-opacity-in-to, 1)',
								'--transform': 'var(--key-0-transform-in, none)',
								'--transform-to': 'var(--key-0-transform-in-to, var(--transform))',
							},
							children: {
								end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
								attr: { 'class': 'key out' },
								style: {
									'--func': 'var(--key-0-func-out, ease-in)',
									'--iterate': 'var(--key-0-iterate-out, 1)',
									'--dir': 'var(--key-0-dir-out, normal)',
									'--opacity': 'var(--key-0-opacity-out, 1)',
									'--opacity-to': 'var(--key-0-opacity-out-to, 0)',
									'--transform': 'var(--key-0-transform-out, none)',
									'--transform-to': 'var(--key-0-transform-out-to, var(--transform))',
								},
								children: {
									attr: { 'class': 'key primary' },
									style: {
										
										'--func': 'var(--key-0-func, ease)',
										'--iterate': 'var(--key-0-iterate, 1)',
										'--dir': 'var(--key-0-dir, normal)',
										'--s': 'var(--key-0-s)', '--s-to': 'var(--key-0-s-to)',
										'--x': 'var(--key-0-x)', '--x-to': 'var(--key-0-x-to)',
										'--y': 'var(--key-0-y)', '--y-to': 'var(--key-0-y-to)',
										'--opacity': 'var(--key-0-opacity, 1)',
										'--opacity-to': 'var(--key-0-opacity-to, var(--opacity))',
										'--transform': 'var(--key-0-transform, none)',
										'--transform-to': 'var(--key-0-transform-to, var(--transform))',
										'--z-index': 'var(--key-0-z-index, 0)'
										
									}
								}
							}
						},
						'{default_reflection_in}'
					]
				},
				{
					begin: { promise: { index: -1, when: 'end' } }, end: true,
					children: [
						{
							end: true,
							attr: {
								'class': 'key in default-1',
								'data-share-css-q': '.view-root',
								'data-share-css-filter': '--key-1-dur-remaining'
							},
							style: {
								
								'--key-1-dur-remaining': '!1!s',
								
								'--delay-in': 'var(--key-1-delay-in)', '--dur-in': 'var(--key-1-dur-in)',
								'--delay-primary': 'var(--key-1-delay-primary)', '--dur-primary': 'var(--key-1-dur-primary)',
								'--delay-out': 'var(--key-1-delay-out)', '--dur-out': 'var(--key-1-dur-out)',
								
								'--func': 'var(--key-1-func-in, ease-out)',
								'--iterate': 'var(--key-1-iterate-in, 1)',
								'--dir': 'var(--key-1-dir-in, normal)',
								'--opacity': 'var(--key-1-opacity-in, 0)',
								'--opacity-to': 'var(--key-1-opacity-in-to, 1)',
								'--transform': 'var(--key-1-transform-in, none)',
								'--transform-to': 'var(--key-1-transform-in-to, var(--transform))',
								
							},
							children: {
								end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
								attr: { 'class': 'key out' },
								style: {
									'--func': 'var(--key-1-func-out, ease-in)',
									'--iterate': 'var(--key-1-iterate-out, 1)',
									'--dir': 'var(--key-1-dir-out, normal)',
									'--opacity': 'var(--key-1-opacity-out, 1)',
									'--opacity-to': 'var(--key-1-opacity-out-to, 0)',
									'--transform': 'var(--key-1-transform-out, none)',
									'--transform-to': 'var(--key-1-transform-out-to, var(--transform))',
								},
								children: {
									attr: { 'class': 'key primary', },
									style: {
										
										'--func': 'var(--key-1-func, ease)',
										'--iterate': 'var(--key-1-iterate, 1)',
										'--dir': 'var(--key-1-dir, normal)',
										'--s': 'var(--key-1-s)', '--s-to': 'var(--key-1-s-to)',
										'--x': 'var(--key-1-x)', '--x-to': 'var(--key-1-x-to)',
										'--y': 'var(--key-1-y)', '--y-to': 'var(--key-1-y-to)',
										'--opacity': 'var(--key-1-opacity, 1)',
										'--opacity-to': 'var(--key-1-opacity-to, var(--opacity))',
										'--transform': 'var(--key-1-transform, none)',
										'--transform-to': 'var(--key-1-transform-to, var(--transform))',
										'--z-index': 'var(--key-1-x-index, 0)'
										
									}
								}
							}
						},
						{
							begin: { promise: { index: -1, when: 'end' } }, end: true,
							attr: {
								'class': 'key in default-2',
								'data-share-css-q': '.view-root',
								'data-share-css-filter': '--key-2-dur-remaining'
							},
							style: {
								
								'--key-2-dur-remaining': '!1!s',
								
								'--delay-in': 'var(--key-2-delay-in)', '--dur-in': 'var(--key-2-dur-in)',
								'--delay-primary': 'var(--key-2-delay-primary)', '--dur-primary': 'var(--key-2-dur-primary, var(--key-2-dur-remaining))',
								'--delay-out': 'var(--key-2-delay-out, calc(var(--key-2-dur-remaining) - var(--dur-out)))', '--dur-out': 'var(--key-2-dur-out)',
								
								'--func': 'var(--key-2-func-in, ease-out)',
								'--iterate': 'var(--key-2-iterate-in, 1)',
								'--dir': 'var(--key-2-dir-in, normal)',
								'--opacity': 'var(--key-2-opacity-in, 0)',
								'--opacity-to': 'var(--key-2-opacity-in-to, 1)',
								'--transform': 'var(--key-2-transform-in, none)',
								'--transform-to': 'var(--key-2-transform-in-to, var(--transform))',
								
							},
							children: {
								end: { event: { animationend: [ { target: true, count: 1, name: 'key' } ] } },
								attr: { 'class': 'key out' },
								style: {
									'--func': 'var(--key-2-func-out, ease-in)',
									'--iterate': 'var(--key-2-iterate-out, 1)',
									'--dir': 'var(--key-2-dir-out, normal)',
									'--transform': 'var(--key-2-transform-out, none)',
									'--transform-to': 'var(--key-2-transform-out-to, var(--transform))',
									'--opacity': 'var(--key-2-opacity-out, 1)',
									'--opacity-to': 'var(--key-2-opacity-out-to, 0)',
								},
								children: {
									attr: { 'class': 'key primary' },
									style: {
										
										'--func': 'var(--key-2-func, ease)',
										'--iterate': 'var(--key-2-iterate, 1)',
										'--dir': 'var(--key-2-dir, normal)',
										'--s': 'var(--key-2-s)', '--s-to': 'var(--key-2-s-to)',
										'--x': 'var(--key-2-x)', '--x-to': 'var(--key-2-x-to)',
										'--y': 'var(--key-2-y)', '--y-to': 'var(--key-2-y-to)',
										'--opacity': 'var(--key-2-opacity, 1)',
										'--opacity-to': 'var(--key-2-opacity-to, var(--opacity))',
										'--transform': 'var(--key-2-transform, none)',
										'--transform-to': 'var(--key-2-transform-to, var(--transform))',
										'--z-index': 'var(--key-2-x-index, 0)'
										
									}
								}
							}
						},
						'{default_reflection_one}'
					]
				}
			]
		}
		
	}
	
},

version: '0.31',

changes: []

};