window.bindProductRecMjProgress = window.bindProductRecMjProgress || function (sectionId) {
  var root = document.getElementById('product-rec-mj-' + sectionId);
  var wrap = document.getElementById('product-rec-mj-progress-' + sectionId);
  if (!root || !root.splide || !wrap) return false;
  if (root.dataset.prMjProgressBound === '1') return true;

  var splide = root.splide;
  var bar = wrap.querySelector('.splide-progress-bar');
  if (!bar) return false;

  root.dataset.prMjProgressBound = '1';
  var rafId = null;

  function getThumbPct() {
    var isDesktop = window.innerWidth >= 768;
    var fromData = parseFloat(isDesktop ? bar.dataset.thumbPctDesktop : bar.dataset.thumbPctMobile);
    if (!isNaN(fromData) && fromData > 0) return fromData;
    var perPage = Number(splide.options.perPage) || 1;
    var length = splide.length || 1;
    return Math.min(100, (perPage / length) * 100);
  }

  function applyWidth(animate) {
    var thumbPct = getThumbPct();
    var end = splide.Components.Controller.getEnd();
    var index = Math.max(0, Math.min(splide.index, end));
    var width = end <= 0 ? 100 : thumbPct + (index / end) * (100 - thumbPct);
    bar.style.marginLeft = '0';
    bar.style.marginRight = '0';
    bar.style.transform = 'none';
    bar.style.width = width + '%';
    bar.style.transition = animate === false ? 'none' : 'width 0.25s ease';
  }

  function schedule(animate) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      rafId = null;
      applyWidth(animate);
    });
  }

  splide.on('mounted', function () { schedule(true); });
  splide.on('move', function () { schedule(true); });
  splide.on('moved', function () { schedule(true); });
  splide.on('scroll', function () { schedule(false); });
  splide.on('dragged', function () { schedule(true); });
  splide.on('resized', function () { schedule(true); });
  splide.on('refresh', function () { schedule(true); });

  schedule(true);
  return true;
};

if (!window.Eurus.loadedScript.includes('product-recommendations.js')) {
  window.Eurus.loadedScript.push('product-recommendations.js');

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.store('xProductRecommendations', {
        loading: false,
        listOfUpsellProducts: [],
        el: '',
        listUpsellId: [],
        productCount: 0,
        async loadUpsell(el, url, listId, limit, maxItems) {
          this.el = el;
          this.loading = true;
          this.listOfUpsellProducts = [];
          this.productCount = 0;
          this.listUpsellId = [];
          for (let i = 0; i < listId.length; i++) {
            if (this.productCount >= maxItems) {
              break;
            }
            try {
              const response = await fetch(`${url}&product_id=${listId[i]}&limit=${limit}&intent=related`);
              const text = await response.text();
              const html = document.createElement('div');
              html.innerHTML = text;
              const des = document.querySelector('.cart-upsell-carousel');
              const src = html.querySelector('.cart-upsell-carousel')
              if (src && des) des.innerHTML = src.innerHTML
              const recommendations = html.querySelector('.product-recommendations');

              if (recommendations && recommendations.innerHTML.trim().length) {
                const newUpsellProducts = recommendations.querySelectorAll('template[x-teleport="#cart-upsell-drawer"], template[x-teleport="#cart-upsell"]');
                this.listOfUpsellProducts = [...newUpsellProducts, ...this.listOfUpsellProducts];

                for (let index = 0; index < this.listOfUpsellProducts.length; index++) {
                  if (this.productCount >= maxItems) {
                    break;
                  }

                  const element = this.listOfUpsellProducts[index];
                  const elementId = new DOMParser().parseFromString(element.innerHTML, 'text/html').querySelector('.hover-text-link, .link-product-variant').id;

                  if (!this.listUpsellId.includes(elementId)) {
                    this.listUpsellId.push(elementId);
                    el.appendChild(element);
                    this.productCount++;
                  }
                }

                if (recommendations.classList.contains('main-product')) {
                  el.className += ' mb-5 border-y border-solid accordion empty:border-b-0';
                }
              } else if (recommendations && recommendations.classList.contains('main-product')) {
                recommendations.classList.add("hidden");
                el.innerHTML = recommendations.innerHTML;
              }
            } catch (e) {
              console.error(e);
            } finally {
              this.loading = false;
            }
          }
        },
        load(el, url) {
          this.loading = true;
          fetch(url)
            .then(response => response.text())
            .then(text => {
              const html = document.createElement('div');
              html.innerHTML = text;
              const recommendations = html.querySelector('.product-recommendations');
              if (recommendations && recommendations.innerHTML.trim().length) {
                requestAnimationFrame(() => {
                  el.innerHTML = recommendations.innerHTML;
                  if (window.Alpine) {
                    Array.from(el.children).forEach((child) => Alpine.initTree(child));
                  }
                });
                if (recommendations.classList.contains('main-product')) {
                  el.className += ' mb-5 border-y border-solid accordion empty:border-b-0';
                }
              } else if (recommendations && recommendations.classList.contains('main-product')) {
                recommendations.classList.add("hidden");
                el.innerHTML = recommendations.innerHTML;
              }
            })
            .finally(() => {
              this.loading = false;
            })
            .catch(e => {
              console.error(e);
            });
        }
      });
    });
  });
}
