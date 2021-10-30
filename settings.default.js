// Rename this file to "settings.js" then app will be configured with this settings.

// 必要最小限の設定内容で、処理が重く動作環境を選ぶが表示オプションが豊富なテンプレートを既定で使用する設定ファイル。
// この設定ファイルを流用する場合、ファイル名を settings.default.js から settings.js に変更すること。
// 設定ファイルについての詳細な説明は settings.preset.js を参照。
// 設定ファイルに変更を加えたい場合は、settings.preset.js ではなく、原則 settings.js に対して行なうことを推奨。

const SETTINGS = {

dur: 10,
position: 1,
app_width: '100%',
app_height: '60%',

profileName: [ 'default', 'simplex' ],

files: [
	
	// simplex 版コピペ用記述子
	/*
	{
		file_path: "img/",
		
		file_title: '',
		file_date: '2021 1 1',
		file_author: '',
		file_copy_0: '',
		file_copy_1: '',
		//file_description: '',
		//file_description_pos: '',
	},
	*/
	// サンプルファイル記述子。プロパティ file_path の img/ 以下に有効なファイル名を指定すること。
	/*
	{
		file_path: "img/",
		file_template: '{default_simplex}',
		//dur: true,
		//exclusive: true,
		//file_attribute: 'guest',
		file_title: '',
		file_date: '2021 1 1',
		file_author: '',
		file_copy_0: '',
		file_copy_1: '',
		//file_description: '',
		//file_description_pos: 'bottom',
	},
	*/
	
	// ファイル記述子の例。
	/*
	// 以下はプロパティの解説付きの例。
	// 実際に使用する場合はこの下にある解説コメントのないものをコピペして使用することを推奨。
	{
		file_path: "img/",
		// ファイルを img フォルダー内に入れたあとで、そのファイル名を img/ のあとに入力する。
		file_template: '{default_simplex}',
		// ファイルの表示方法。default_simplex の場合、画像全体を指定時間表示し続ける。
		// このプロパティを消すと、画像の一部と全体を三つのカットに分ける表示方法になる。
		// この場合、カット毎の表示位置は常に固定であるため、画像によっては効果のない表示になる場合が多い。
		// これはプロパティ template 内の default を編集するか、
		// template 内に任意の名前の値を作成し、そこに必要なプロパティを設定した上で、
		// この記述子内に file_template: "{任意の名前}" とすることで、任意の表示にさせられる。
		// ただし、この方法は非常に難解かつ複雑で、CSS についての理解も欠かせないため、推奨はされない。
		
		//dur: true,
		// ファイルに任意の表示時間を与えたい場合、このプロパティに任意の秒数を指定する。
		// true を指定した場合は他のファイルと同じ共通の表示時間が与えられる。
		
		//exclusive: true,
		// このプロパティに true を設定した場合、他にファイルが存在しても表示されるファイルはこのファイルだけになる。
		// より厳密に言えば、exclusive: true が設定されたファイルがひとつ以上ある場合、
		// 表示されるファイルはそれが設定されたファイルだけになる。特定のファイルの表示確認したい時などに有用。
		// この機能を使う時は、exclusive の前の // を消すこと。
		
		//file_attribute: 'guest',
		// このプロパティに guest を指定すると、画像の表示前に、file_author の値をスポット表示する。
		// その際、file_author の下部に "ゲストアート" と表示される。
		// この機能は調整中で、現状は他者のファイルを強調表示する以外の目的では使いにくい。
		// この機能を使う場合は、file_attribute の前の // を消すこと。
		file_title: '',
		// ファイルのタイトルを指定する。
		file_date: 'Y M D',
		// ファイルの月日を指定する。YYYY に年、MM に月、D に日を指定する。
		// 一定の書式を持っており、詳細は latest_term のコメントを参照。
		file_author: '',
		// ファイルの作者名を指定する。
		file_copy_0: '',
		// ファイルの表示中に重ねて表示される文字列を指定する。
		file_copy_1: '',
		// ファイルの表示中に重ねて表示される文字列を指定する。
		// file_copu_0 と同様であるが、テンプレートの種類によるが、原則 file_copy_0 に続く形で表示される。
		
		// file_description: '',
		// ファイルの説明文を指定する。説明文は以下の file_description_pos の指定に基づいた位置で表示される。
		// file_copy よりも若干強調された形で表示され、折り返しも自動で行なわれるため、比較的長めの文章も表示させられるが、
		// 表示時間はそれほど長くないため、平易な文章であることが推奨される。
		// この機能を使う場合は、file_description の前の // を消すこと。
		
		//file_description_pos: '',
		// file_description で指定した説明文の表示位置を指定する。
		// 指定できる値は top, right, bottom, left のいずれかで、それぞれ対応する位置に説明文を表示する。
		// この機能を使う場合は、file_description_pos の前の // を消すこと。
		
	},
	// コピペ用ファイル記述子。
	// // で始まるプロパティはコメントになっているので、使用する場合は // を消すこと。
	{
		file_path: "img/",
		file_template: '{default_simplex}',
		//dur: true,
		//exclusive: true,
		//file_attribute: 'guest',
		file_title: '',
		file_date: '2021 1 1',
		file_author: '',
		file_copy_0: '',
		file_copy_1: '',
		//file_description: '',
		//file_description_pos: '',
	},
	*/
]

};