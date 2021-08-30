const settingsAvailable = new Promise((rs, rj) => {
	
	const preset = document.createElement('script');
	
	preset.addEventListener(
			'error',
			error => {
				
				const downloadLink = document.createElement('a');
				
				downloadLink.href = 'https://github.com/MissingBlue/Kawaii-Slide-Show/releases',
				downloadLink.textContent = 'Please download the latest or any version from GitHub.',
				document.body.appendChild(downloadLink),
				
				alert('A file "settings.preset.json" is required, but it does\'nt seem to exist.');
				
			},
			{ once: true }
		),
	preset.addEventListener('load', event => {
			
			let k, cfg;
			
			try { cfg = SETTINGS; } catch (error) { cfg = PRESET_SETTINGS; }
			
			!(cfg && typeof cfg === 'object') && (cfg = {});
			for (k in PRESET_SETTINGS) k in cfg || (cfg[k] = PRESET_SETTINGS[k]);
			
			switch (PRESET_SETTINGS.version) {
				
				case '0.1':
				break;
				
				default:
				
			}
			
			rs(cfg);
			
		}, { once: true }),
	preset.src = 'settings.preset.js',
	
	document.head.appendChild(preset);
	
});