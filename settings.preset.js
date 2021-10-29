const PRESET_SETTINGS = {

dur: 5,
// 一枚毎の画像の表示時間。秒数を整数ないし小数で指定。

app_width: '100%',
app_height: '60%',
// 画像フレームの幅(app_width)と、高さ(app_height)。
// 表示される画像の大きさは、フレームの高さに基づいて自動で決定するため、
// app_height で指定した値が実質的な画像の表示サイズの基準になる。そのため、app_width は基本的には 100% のままで変更する必要はない。
// 値の単位は px, % などが使える。% で指定した場合、このスライドショーが属するドキュメントの大きさに対する割合として認識される。
// いずれの場合も、指定した値はシングルクォーテーション(')かダブルクォーテーション(")で必ず囲んでいる必要がある。
// OBS で使う際の推奨値としては、頻繁にスライドショーの位置を OBS 上で任意に動かす場合は、app_width: 100%, app_height: 100%、
// 概ね固定して使用する場合は、スライドショーを読み込んだ OBS のブラウザーソースのプロパティ内から「幅」、「高さ」を配信画面の解像度と同じピクセス数、
// 例えばフル HD 解像度で配信しているなら 幅:1920 高さ:1080 にした上で、 app_width: 100%, app_height: 40% などとし、
// 下記の設定値 position に、表示したい位置に合わせた任意の値（例えば左下なら position: 1 ）を指定する。

position: 3,
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
	// A "template" property for the file descriptor is useful but it reduces readbility.
	// This property is refered from the "children" property of the "default" template,
	// and it will be replaced with the "wikimedia_author"
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

attribute: {
	guest: {
		'--dur-multiplier': 1.5,
		'--dur-add': 0
	}
},

// プリセットの設定は、ユーザーの設定に同名のものがあれば、常にその値で浅いコピーで上書きされるが、
// profile については、ユーザーの設定と重複しないプロパティはそれで補われる。
// つまり以下の profile のプロパティ simple は、ユーザーが任意で設定しない限りユーザーの設定から常に参照できる。
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
					// [[]] refers to the file descriptor or configuration property corresponding to the included string.
					// The string following : will be used as a default value if there is no corresponding property.
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
		
	}
	
},

version: '0.33',

changes: []

};