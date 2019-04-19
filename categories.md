---
layout: default
title: Tags
permalink: /tags/
---

<style type="text/css" media="screen">
#order-criteria {
    color: blue;
    font-weight: bold;
}

#order-criteria span.current-order {
    text-decoration: none;
    cursor: default;
    font-size: 1.2em;
}

#order-criteria span:not(.current-order) {
    text-decoration: underline;
    cursor: pointer;
	font-size: 1em;
}

#order-criteria em {
	font-style: normal;
	font-size: 1.3em;
	font-weight: normal;
	color: black;
}
</style>

<script type="text/javascript">
document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelectorAll('#order-criteria span').forEach(el => el.addEventListener('click', changeOrder));
});

function changeOrder(event) {
    let nodeList = document.querySelectorAll('#dados ul li');
    let list = Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
    let currentCriteria = document.querySelector('#order-criteria .current-order').innerText;
    let criterio = event.target.innerText;

    if (criterio == currentCriteria) {
        return;
    }

    if (criterio == 'quantidade') {
        list.sort((e1, e2) => { // ordem decrescente da quantidade
            return parseInt(e2.dataset.count) - parseInt(e1.dataset.count);
        });
    } else {
        list.sort((e1, e2) => { // ordem alfabética do nome
            return e1.dataset.name.localeCompare(e2.dataset.name, 'pt', { sensitivity: 'base' });
        });
        
    }
    let ul = document.querySelector('#dados ul');
    ul.innerHTML = list.map(li => li.outerHTML).join('');
    document.querySelectorAll('#order-criteria span').forEach(span => span.classList.toggle('current-order'));
}
</script>


# Tags
---

<p>Ordenar por: <span id="order-criteria"><span class="current-order">nome</span> <em>|</em> <span>quantidade</span></span></p>

{% assign sorted_cats = site.categories | sort %}
<div id="dados">
  <ul>
    {% for cat in sorted_cats %}
      <li data-count="{{ cat[1] | size }}" data-name="{{ cat[0] }}"><a href="{{ site.url }}/tag/{{ cat[0] }}">{{ cat[0] }}</a> ({{ cat[1] | size }} posts)</li>
    {% endfor %}
  </ul>
</div>
