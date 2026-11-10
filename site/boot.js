// Applique la palette du mois avant le premier affichage, sans script en ligne (CSP).
(function () {
  var data = JSON.parse(document.getElementById('theme-data').textContent);
  var mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var month = new Date().getMonth();
  var palette = data.months[month][mode];
  var root = document.documentElement;
  ['bg', 'text', 'accent', 'muted', 'panel', 'panelText', 'line', 'rule', 'onAccent', 'link', 'shadow'].forEach(function (key) {
    root.style.setProperty('--' + key, palette[key]);
  });
  root.dataset.month = month;
  root.dataset.mode = mode;
  root.style.colorScheme = mode;
})();
