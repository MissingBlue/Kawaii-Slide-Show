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
			
			let i,l,i0,i1,i2, k,k0, cfg, change,compat, sources,from;
			
			try { cfg = SETTINGS; } catch (error) { cfg = PRESET_SETTINGS; }
			
			!(cfg && typeof cfg === 'object') && (cfg = {});
			for (k in PRESET_SETTINGS) {
				k in cfg || (cfg[k] = PRESET_SETTINGS[k]);
				if (k === 'profile') for (k0 in PRESET_SETTINGS[k]) k0 in cfg[k] || (cfg[k][k0] = PRESET_SETTINGS[k][k0]);
			}
			
			i = -1, l = cfg.changes.length;
			while (++i < l) {
				(change = cfg.changes[i]).v === cfg.version && (i = l), i0 = -1;
				while (compat = change.compatible[++i0]) {
					i1 = -1;
					while (compat[++i1]) {
						switch (k) {
							
							case 'change-property-name':
							i2 = -1, sources = _GET(cfg, compat[k].from), from = compat[k].from[compat[i1].from.length - 1];
							while (sources[++i2]) sources[i2][compat[i1].to] = sources[i2][from];
							break;
							
						}
					}
				}
			}
			
			switch (PRESET_SETTINGS.version) {
				
				case '0.1':
				break;
				
				default:
				
			}
			
			rs(cfg);
			
		}, { once: true }),
	preset.src = 'settings.preset.js',
	
	document.head.appendChild(preset);
	
}),
_GET = (obj, ...keys) => {
	
	let i,l,l0, results,result;
	
	i = -1, l0 = (l = keys.length) - 1, results = [];
	if (Array.isArray(obj)) {
		
		i = -1, l = obj.length;
		while (++i < l) (result = _GET(obj[i], ...keys)) &&
			Array.isArray(result) ? (results = results.concat(result)) : (results[results.length] = result);
		
		return results;
		
	} else if (obj && typeof obj === 'object') {
		
		if (keys.length > 1) return typeof obj[keys[0]] === 'object' ? _GET(obj[keys[0]], ...keys.slice(1)) : results;
		
		return keys[0] in obj ? [ obj ] : results;
		
	}
	
	return results;
	
};