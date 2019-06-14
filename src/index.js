import { createFilter } from 'rollup-pluginutils'

const ext = /\.css$/;

function styleInject(id, css) {
	if (!css || typeof document === 'undefined') { return; }

	var element;
	var head = document.head || document.getElementsByTagName('head')[0];
	var styleElements  = head.getElementsByTagName('style');

	// To prevent dublicate of the style code during the script reload
	for (var i = 0; i < styleElements.length; i++) {
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
		if (element.childElementCount) {
			element.replaceChild(text, element.firstChild)
		} else {
			element.appendChild(text);
		}
	}
}

export default function (options = {}) {
	if (!options.include) options.include = '**/*.css'
	const filter = createFilter(options.include, options.exclude);
	const cached = {
		ids: {},
		style: '',
	}
	const id = options.id || uid()
	return {
		name: 'rollup-plugin-css-merge-and-inject',
		transform(code, id) {
			if (!ext.test(id)) return
			if (!filter(id)) return
			if (!cached.ids.hasOwnProperty(id) || cached.ids[id] != code) cached.style += code
			cached.ids[id] = code
			return {
				code: '',
				moduleSideEffects: true
			}
		},
		generateBundle(options, bundle) {
			for (var name in bundle) {
				bundle[name].code += `\n${styleInject.toString()};\nstyleInject("${id}", "${cached.style.replace(/\n/g, '').replace(/"/g, '\\"')}");`;
			}
		}
	}
}
