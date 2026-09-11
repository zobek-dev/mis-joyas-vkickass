window.bindRecentlyViewedMjProgress = window.bindRecentlyViewedMjProgress || function (sectionId) {
  var root = document.getElementById('recently-viewed-carousel-' + sectionId);
  var wrap = document.getElementById('recently-viewed-progress-' + sectionId);
  if (!root || !root.splide || !wrap) return false;
  if (root.dataset.rvMjProgressBound === '1') return true;

  var splide = root.splide;
  var bar = wrap.querySelector('.splide-progress-bar');
  if (!bar) return false;

  root.dataset.rvMjProgressBound = '1';
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

if (!window.Eurus.loadedScript.includes('recently-viewed.js')) {
  window.Eurus.loadedScript.push('recently-viewed.js');

  function getRecentlyViewedLimit(container) {
    const root = container || document.getElementById('shopify-section-recently-viewed');
    return parseInt(root?.getAttribute('x-products-to-show'), 10) || 10;
  }

  function stripRecentlyViewedCardHandlers(container) {
    if (!container) return;

    container.querySelectorAll('.card-product, .card-product *').forEach((el) => {
      for (const attr of [...el.attributes]) {
        if (
          attr.name.startsWith('x-intersect') ||
          attr.name.startsWith('x-cloak') ||
          attr.name === 'onload'
        ) {
          el.removeAttribute(attr.name);
        }
      }
    });

    container.querySelectorAll('.card-product [id^="x-slideshow-card-product-"]').forEach((el) => {
      for (const attr of [...el.attributes]) {
        if (attr.name.startsWith('x-') || attr.name.startsWith('@')) {
          el.removeAttribute(attr.name);
        }
      }
    });
  }

  function reorderRecentlyViewedSlides(container, productIds) {
    const list = container?.querySelector('.splide__list');
    if (!list || !productIds?.length) return;

    const order = new Map(productIds.map((id, index) => [String(id), index]));
    const slides = Array.from(list.children);

    slides.sort((slideA, slideB) => {
      const idA = slideA.querySelector('.link-product-variant')?.id?.split('-')?.[0];
      const idB = slideB.querySelector('.link-product-variant')?.id?.split('-')?.[0];
      const rankA = order.has(idA) ? order.get(idA) : Number.MAX_SAFE_INTEGER;
      const rankB = order.has(idB) ? order.get(idB) : Number.MAX_SAFE_INTEGER;
      return rankA - rankB;
    });

    slides.forEach((slide) => list.appendChild(slide));
  }

  function getRecentlyViewedSlideId(slide) {
    return slide?.querySelector('.link-product-variant')?.id?.split('-')?.[0] || null;
  }

  function injectRecentlyViewedRemoveButtons(container) {
    if (!container) return;

    const label = container.getAttribute('x-rv-remove-label') || 'Remove';
    const removeIcon =
      '<svg viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">' +
      '<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

    container.querySelectorAll('.card-product').forEach((card) => {
      if (card.querySelector('.rv-remove')) return;

      const productId = getRecentlyViewedSlideId(card);
      if (!productId) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'rv-remove';
      button.setAttribute('aria-label', label);
      button.innerHTML = removeIcon;

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const slide = card.closest('.splide__slide') || card;
        if (window.Alpine) {
          Alpine.store('xProductRecently').removeProduct(productId, slide);
        }
      });

      card.appendChild(button);
    });
  }

  function disableRecentlyViewedCardAnimations(container) {
    if (!container) return;

    container.querySelectorAll('.card-product [class*="animate_transition"]').forEach((el) => {
      el.classList.remove('animate_transition_card__image', 'animate_transition_image');
      el.classList.add('static-card-image', 'active', 'lazy_active');
      el.style.transform = 'none';
      el.style.scale = '1';
      el.style.transition = 'none';
      el.style.animation = 'none';
    });

    container.querySelectorAll('.card-product img').forEach((el) => {
      el.classList.remove(
        'image-hover',
        'image-first-hover',
        'image-second-hover',
        'image-first-slide-anm',
        'image-first-hover-slide-anm',
        'animate_transition_image',
        'animate-Xpulse',
        'skeleton-image'
      );
      el.removeAttribute('onload');
      el.style.transform = 'none';
      el.style.scale = '1';
      el.style.transition = 'none';
      el.style.animation = 'none';
    });

    container.querySelectorAll('.card-product .link-product-variant').forEach((el) => {
      el.classList.add('static-card-image-link');
    });

    container.querySelectorAll('.card-product .static-card-image, .card-product .link-product-variant > div').forEach((el) => {
      if (el.querySelector('img')) {
        el.classList.add('static-card-image');
      }
    });

    container.querySelectorAll('.card-product .media-slide, .card-product .splide__arrow').forEach((el) => {
      el.remove();
    });

    container.querySelectorAll('.card-product-img.x-splide, .card-product [id^="x-slideshow-card-product-"]').forEach((el) => {
      if (el.splide) {
        try {
          el.splide.destroy(true);
        } catch (_error) {
          /* noop */
        }
      }
      el.classList.remove('card-product-img', 'x-splide', 'splide');
      for (const attr of [...el.attributes]) {
        if (attr.name.startsWith('x-') || attr.name.startsWith('@')) {
          el.removeAttribute(attr.name);
        }
      }
    });
  }

  function enforceRecentlyViewedStaticImages(container) {
    // Una sola pasada: el bloque <style data-recently-viewed-no-zoom> de la sección
    // ya fuerza las imágenes estáticas con !important, y bindRecentlyViewedCarouselAnimations
    // re-aplica esto en los eventos de Splide. No hace falta un setInterval (causaba titileo).
    disableRecentlyViewedCardAnimations(container);
  }

  function bindRecentlyViewedCarouselAnimations(carousel, container) {
    if (!carousel?.splide || !container || carousel.dataset.rvAnimBound === '1') return;
    carousel.dataset.rvAnimBound = '1';
    carousel.splide.on('move refresh resized mounted', () => {
      disableRecentlyViewedCardAnimations(container);
    });
  }

  function finishRecentlyViewedRender(container) {
    if (!container || container.dataset.rvRenderDone === '1') return;
    container.dataset.rvRenderDone = '1';
    enforceRecentlyViewedStaticImages(container);
    injectRecentlyViewedRemoveButtons(container);
    window.initRecentlyViewedCarousel(container);
  }

  function scheduleRecentlyViewedFinish(container) {
    const carousel = container?.querySelector('[data-recently-viewed-carousel]');
    const sectionId = carousel?.getAttribute('x-data-slider');
    const isStatic = carousel?.classList.contains('recently-viewed__carousel--static');

    if (!carousel || isStatic || !sectionId) {
      requestAnimationFrame(() => finishRecentlyViewedRender(container));
      return;
    }

    const onReady = () => finishRecentlyViewedRender(container);

    document.addEventListener(`eurus:${sectionId}:splide-ready`, onReady, { once: true });

    if (carousel.classList.contains('is-initialized') || carousel.splide) {
      onReady();
      return;
    }

    let attempts = 0;
    const timer = setInterval(() => {
      if (carousel.classList.contains('is-initialized') || carousel.splide || ++attempts > 150) {
        clearInterval(timer);
        onReady();
      }
    }, 100);
  }

  window.initRecentlyViewedCarousel = function (container) {
    const carousel = container?.querySelector('[data-recently-viewed-carousel]');
    if (!carousel) return;

    const sectionId =
      carousel.getAttribute('x-data-slider') ||
      (carousel.id || '').replace('recently-viewed-carousel-', '');

    function tryBind() {
      if (!carousel.splide) return false;
      // Peek carousel: avanzar de a 1 para mantener el recorte del siguiente producto
      if (typeof window.bindFeaturedCollectionMjArrows === 'function') {
        window.bindFeaturedCollectionMjArrows(carousel, 1, 1);
      }
      if (sectionId && typeof window.bindRecentlyViewedMjProgress === 'function') {
        window.bindRecentlyViewedMjProgress(sectionId);
      }
      disableRecentlyViewedCardAnimations(container);
      bindRecentlyViewedCarouselAnimations(carousel, container);
      return true;
    }

    if (tryBind()) return;

    let attempts = 0;
    const timer = setInterval(() => {
      if (tryBind() || ++attempts > 150) clearInterval(timer);
    }, 100);
  };

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.store('xProductRecently', {
        show: false,
        showEmpty: false,
        emptyEnabled: false,
        productsToShow: 10,
        productsToShowMax: 10,
        init() {
          const root = document.getElementById('shopify-section-recently-viewed');
          if (root) {
            this.productsToShow = getRecentlyViewedLimit(root);
            this.emptyEnabled = root.getAttribute('x-rv-show-empty') === 'true';
          }
        },
        showProductRecently() {
          this.show = !!localStorage.getItem('recently-viewed')?.length;
        },
        setProduct(productViewed) {
          let productList = [];

          if (localStorage.getItem('recently-viewed')?.length) {
            productList = JSON.parse(localStorage.getItem('recently-viewed'));
            productList = productList
              .filter((p) => String(p) !== String(productViewed))
              .filter((_p, i) => i < this.productsToShowMax);
          }

          localStorage.setItem('recently-viewed', JSON.stringify([productViewed, ...productList]));
          this.show = true;
        },
        getProductRecently(sectionId, productId) {
          const el = document.getElementById('shopify-section-recently-viewed');
          if (!el) return;

          const limit = getRecentlyViewedLimit(el);
          this.productsToShow = limit;

          let products = [];
          if (localStorage.getItem('recently-viewed')?.length) {
            products = JSON.parse(localStorage.getItem('recently-viewed'));
            // Excluir el producto que se está viendo. Comparar como string: en localStorage
            // pueden quedar IDs numéricos (de versiones previas) y productId llega como string.
            products = productId ? products.filter((p) => String(p) !== String(productId)) : products;
            products = products.slice(0, limit);
          } else {
            this.show = false;
            this.showEmpty = this.emptyEnabled;
            return;
          }

          if (!products.length) {
            this.show = false;
            this.showEmpty = this.emptyEnabled;
            return;
          }

          this.show = true;
          this.showEmpty = false;

          const query = products.map((value) => 'id:' + value).join(' OR ');
          // URL absoluta: los wrappers de fetch de apps de terceros (minMaxify, analytics)
          // hacen new URL(input) y fallan con URLs relativas → "Failed to fetch".
          const root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';
          const searchUrl = `${window.location.origin}${root}search?section_id=${encodeURIComponent(
            sectionId
          )}&type=product&q=${encodeURIComponent(query)}`;

          fetch(searchUrl, { headers: { Accept: 'text/html' } })
            .then((response) => {
              if (!response.ok) throw new Error(response.status);
              return response.text();
            })
            .then((text) => {
              const parsed = new DOMParser()
                .parseFromString(text, 'text/html')
                .querySelector('#shopify-section-recently-viewed');

              if (!parsed) return;

              el.innerHTML = parsed.innerHTML;
              el.dataset.rvRenderDone = '0';
              const freshCarousel = el.querySelector('[data-recently-viewed-carousel]');
              if (freshCarousel) delete freshCarousel.dataset.rvMjProgressBound;
              reorderRecentlyViewedSlides(el, products);
              stripRecentlyViewedCardHandlers(el);
              disableRecentlyViewedCardAnimations(el);

              if (window.Alpine) {
                // OJO: NO hacer Alpine.initTree(el). El root #shopify-section-recently-viewed
                // tiene el x-init que llama a getProductRecently; reinicializarlo re-ejecuta
                // ese x-init → fetch → innerHTML → initTree → loop infinito (titileo).
                // Inicializamos solo los hijos inyectados.
                Array.from(el.children).forEach((child) => Alpine.initTree(child));
              }

              stripRecentlyViewedCardHandlers(el);
              enforceRecentlyViewedStaticImages(el);
              scheduleRecentlyViewedFinish(el);
            })
            .catch((error) => {
              // Ignorar abortos por navegación (el usuario cambió de página antes de resolver).
              if (error && (error.name === 'AbortError' || error.name === 'TypeError')) return;
              console.error(error);
            });
        },
        removeProduct(productId, slide) {
          let products = [];
          if (localStorage.getItem('recently-viewed')?.length) {
            products = JSON.parse(localStorage.getItem('recently-viewed'));
          }

          products = products.filter((p) => String(p) !== String(productId));

          if (products.length) {
            localStorage.setItem('recently-viewed', JSON.stringify(products));
          } else {
            localStorage.removeItem('recently-viewed');
            this.show = false;
            this.showEmpty = this.emptyEnabled;
          }

          const el = document.getElementById('shopify-section-recently-viewed');
          const carousel = el?.querySelector('[data-recently-viewed-carousel]');
          const slideEl = slide || null;

          if (!slideEl) return;

          if (carousel?.splide) {
            const slides = Array.from(
              carousel.querySelectorAll('.splide__list > .splide__slide:not(.splide__slide--clone)')
            );
            const index = slides.indexOf(slideEl);
            try {
              if (index > -1) {
                carousel.splide.remove(index);
              } else {
                slideEl.remove();
              }
              carousel.splide.refresh();
            } catch (_error) {
              slideEl.remove();
            }
          } else {
            slideEl.remove();
          }
        },
        clearStory() {
          const result = confirm('Are you sure you want to clear your recently viewed products?');
          if (result === true) {
            localStorage.removeItem('recently-viewed');
            this.show = false;
          }
        },
      });
    });
  });
}
