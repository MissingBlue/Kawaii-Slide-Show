const PRESET_SETTINGS = {

dur: 5,
// 一枚毎の画像の表示時間。秒数を整数ないし小数で指定。

transition_dur: 0.04,
// 次の画像ファイルへ移る際に行われるトランジション効果（ファイル間の切り換え演出）時間。
// この値は秒数ではなく、0 から 1 の間の小数値を取る相対値で指定する。
// 例えば dur が 5 の場合、この値を 0.04 にすると 5 * 0.04 = 0.2 になるので、トランジションは 0.2 秒間で行われることになる。
// この値を 1 にすると、ファイルの表示の開始から終了までの全時間を通じてトランジションが行われ、0 にするとトランジションがまったく行われない。

transition_reflection_delay: 0.15,
// トランジション時の反射光演出の開始時間。
// 画像表示中に反射光を発生させるタイミングを、表示時間全体を 0 から 1 として、その範囲の小数値で指定する。
// 例えば dur: 5, transition_reflection_delay: 0.25 であれば、 5 ＊ 0.25 で、表示切替後 1.25 秒後に反射光が発生する。
// 1 を指定すると、反射光演出がオフになる。
transition_reflection: 0.4,
// トランジション発生時の反射光演出の効果時間。
// transition_reflection_delay 同様 0 から 1 の範囲の小数値で指定するが、
// その範囲は dur - (dur * transition_reflection_delay) になる。
// dur: 5, transition_reflection_delay: 0.25, transition_reflection: 0.4 であれば、
// 5 - (5 * 0.25) * 0.4 で、1.5 秒間、反射光が生じることになる。
// 0 を指定した場合、反射光演出はオフになる。 

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

files: [

{ file_path: "img/", text_a: '', text_b: '' },

],
// 表示する画像のリスト。
// 角括弧 [] に囲まれた中に画像ファイルの相対パスか絶対パス、または URL を、シングルクォーテーション(')かダブルクォーテーション(")で囲んで指定する。
// 複数ある場合はコンマ(,)で区切って並べて指定する。このリストに並べた順で表示を行う。

resource: {
	audios: [
		//{ id: '', src: '', delay: 0, offset: 0, duration: true, gain: 0.05, playbackRate: 1 }
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
asset: {},
// 任意のアセット名に、アセットの構成物となるリソースの id を、再生ないし表示順に配列に列挙して指定する。

// 以下内部処理用
css: 'css/responsible.css',

profileName: [ 'responsible' ],
// 任意のプロファイル名を文字列で、配列か文字列のまま指定。
// 各プロファイル間で同名のプロパティが存在した場合、前方から後方に向けて上書きされていく。

profile: {
	
	responsible: {
		
		cssvar: '{ "target-raw-rect-height[0]" : "{#h*}" }'
		
	},
	
	fixed: {
		
		css: 'css/fixed.css',
		
		app_width: '',
		app_height: '',
		
		cssvar: '{"bgp-from": "calc(50% + {#w[]} * {i[]})", "bgp-to": "calc(50% + ({#w[]} * {i[]} - {#w[]} * {l[]}))", "bgi": "{u[]}", "total-duration[0]": "calc(var(--a-duration) * {l})", "bg-size-t0": "0% 0%", "bg-size-t1": "calc({w[]} * {#h*} / {h*[]}) {#h}"}'
		
	}
	
},

version: '0.1'

};