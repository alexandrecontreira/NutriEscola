(function () {
  'use strict';

  function setYear() {
    document.querySelectorAll('[data-current-year]').forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function smoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function printReport() {
    document.querySelectorAll('[data-print]').forEach((button) => {
      button.addEventListener('click', () => window.print());
    });
  }

  function updateSurplusPreview() {
    const platesInput = document.querySelector('[data-plates-input]');
    const surplusInput = document.querySelector('[data-surplus-input]');
    const totalOutput = document.querySelector('[data-total-plates]');
    const surplusOutput = document.querySelector('[data-surplus-output]');

    if (!platesInput || !surplusInput || !totalOutput || !surplusOutput) return;

    function update() {
      const plates = Math.max(Number(platesInput.value) || 1, 1);
      const surplus = Math.min(Math.max(Number(surplusInput.value) || 0, 0), 40);
      const total = Math.ceil(plates * (1 + surplus / 100));
      totalOutput.textContent = total.toLocaleString('pt-BR');
      surplusOutput.textContent = `${surplus}%`;
    }

    platesInput.addEventListener('input', update);
    surplusInput.addEventListener('input', update);
    update();
  }

  function caloriePreview() {
    const portionInputs = Array.from(document.querySelectorAll('[data-portion]'));
    const totalOutput = document.querySelector('[data-total-calories]');
    const bar = document.querySelector('[data-calorie-bar]');
    const status = document.querySelector('[data-calorie-status]');
    const limit = Number(document.body.dataset.calorieLimit || 2000);

    if (!portionInputs.length || !totalOutput || !bar || !status) return;

    function colorClass(percent) {
      if (percent > 100) return 'kcal-red';
      if (percent > 85) return 'kcal-orange';
      if (percent > 60) return 'kcal-yellow';
      return 'kcal-green';
    }

    function label(percent) {
      if (percent > 100) return 'Bloqueado';
      if (percent > 85) return 'Proximo do limite';
      if (percent > 60) return 'Atencao';
      return 'Saudavel';
    }

    function update() {
      const total = portionInputs.reduce((sum, input) => {
        const grams = Math.max(Number(input.value) || 0, 0);
        const kcal = Number(input.dataset.caloriesPer100g || 0);
        return sum + (kcal / 100) * grams;
      }, 0);
      const percent = Math.round((total / limit) * 100);
      totalOutput.textContent = Math.round(total).toLocaleString('pt-BR');
      bar.style.width = `${Math.min(percent, 100)}%`;
      bar.className = colorClass(percent);
      status.textContent = label(percent);
      status.className = `status-pill ${percent > 100 ? 'status-alert' : 'status-valid'}`;
    }

    portionInputs.forEach((input) => input.addEventListener('input', update));
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    smoothAnchors();
    printReport();
    updateSurplusPreview();
    caloriePreview();
  });
})();
