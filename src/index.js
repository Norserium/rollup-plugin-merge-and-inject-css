import { createFilter } from 'rollup-pluginutils'

const ext = /\.css$/;

function styleInject(id, css) {
	if (!css || typeof document === 'undefined') { return; }

	let element;
	const head = document.head || document.getElementsByTagName('head')[0];
	const styleElements  = head.getElementsByTagName('style');

	// To prevent dublicate of the style code during the script reload
	for (let i = 0; i < styleElements.length; i++) {
		if (styleElements[i].innerText.startsWith('/*for=' + id)) {
			element = styleElements[i]
		}
	}

	if (!element) {
		element = document.createElement('style');
		element.type = 'text/css';
		head.insertBefore(element, styleElements[0] || head.firstChild);
	}

	if (element.styleSheet) {
		element.styleSheet.cssText = css;
	} else {
		const text = document.createTextNode('/*for=' + id + '*/' + css)
		element.innerHTML = "";
		element.appendChild(text);
	}
}

export default function (options = {}) {
	if (!options.include) options.include = '**/*.css'
	const filter = createFilter(options.include, options.exclude);
	var cached = {
		positions: {},
		fragments: []
	};
	var buildID = options.id || uid();
	return {
		name: 'rollup-plugin-css-merge-and-inject',
		transform(code, id) {
			if (!ext.test(id)) return
			if (!filter(id)) return
			if (id in cached.positions) {
				cached.fragments[cached.positions[id]] = code
			} else {
				cached.positions[id] = cached.fragments.length
				cached.fragments.push(code)
			}
			return {
				code: '',
				moduleSideEffects: true
			}
		},
		generateBundle(options, bundle) {
			var code = cached.fragments.join('')
			for (var name in bundle) {
				bundle[name].code += "\n" + (styleInject.toString()) + ";\nstyleInject(\"" + buildID + "\", \"" + (code.replace(/\n/g, '').replace(/"/g, '\\"')) + "\");";
			}
		}
	}
}
