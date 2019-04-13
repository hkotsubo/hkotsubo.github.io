---
layout: default
title: Tags
permalink: /tags/
---

# Tags

<ul>
  {% for cat in site.categories %}
    <li><a href="{{ site.url }}/tag/{{ cat[0] }}">{{ cat[0] }}</a> ({{ cat[1] | size }} posts)</li>
  {% endfor %}
</ul>