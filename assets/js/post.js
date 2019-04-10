function init(tagName) {
	// transforma os subtitulos em links com anchors
	let titulos = document.querySelectorAll('.page-content ' + tagName) 
    for (let i = 0, length = titulos.length; i < length; i++) {
    	let h = titulos[i];
		let id = h.getAttribute('id');
		if (id) {
			let a = document.createElement('a');
			a.setAttribute('href', `#${id}`);
			a.style.color = 'black';
			a.appendChild(document.createTextNode(h.innerText));
			h.children = [];
			h.innerHTML = '';
			h.appendChild(a);
			h.classList.add('subtitulo');
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	['h2', 'h3'].forEach(tagName => init(tagName));

	let links = document.querySelectorAll( '.page-content a' );
    for (let i = 0, length = links.length; i < length; i++) {
        if (links[i].hostname != window.location.hostname) {
            links[i].target = '_blank';
        }
    }

	links = document.querySelectorAll( '.page-content a.new-window');
    for (let i = 0, length = links.length; i < length; i++) {
        links[i].target = '_blank';
    }
});
