requestAnimationFrame(() => {
  document.addEventListener('alpine:init', () => {
    /**
     * Tags from Liquid `| json` are usually an array; normalize edge cases (string, missing).
     * Matching is case-insensitive so admin tag casing does not break the filter.
     */
    const normalizeProductTags = (productData) => {
      const raw = productData && productData.tags;
      if (raw == null || raw === '') return [];
      if (Array.isArray(raw)) {
        return raw.map((t) => String(t).trim()).filter(Boolean);
      }
      if (typeof raw === 'string') {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.map((t) => String(t).trim()).filter(Boolean);
          }
        } catch (e) {
          /* comma-separated */
        }
        return raw.split(',').map((t) => t.trim()).filter(Boolean);
      }
      return [];
    };

    const productHasTag = (productData, requiredTag) => {
      const req = (requiredTag || '').trim();
      if (!req) return false;
      const lower = req.toLowerCase();
      return normalizeProductTags(productData).some((t) => t.toLowerCase() === lower);
    };

    Alpine.store('xBadges', {
      fixedPositionTemplate: `<div
        class="x-badge-{label-id} x-badge-container pointer-events-none{container-img-class} ltr"
        {preview-show-condition}
      >
        {content}
      </div>`,
      customPositionTemplate: `<div
        class="x-badge-{label-id} x-badge-container min-w-fit max-w-full max-h-full pointer-events-none{container-css-class} ltr"
        x-data="{
          contentHeight: 1,
          rePosition() {
            this.$nextTick(() => {
              this.contentHeight = this.$refs.content ? this.$refs.content.offsetHeight : contentHeight;
            });
          }
        }"
        x-intersect.once="rePosition();
          if (Shopify.designMode) {
            window.addEventListener('resize', () => {
              if ($store.xBadges.lastWindowWidth != window.innerWidth) {
                rePosition();
              }
            });
          } else {
            installMediaQueryWatcher('(min-width: 768px)', (matches) => rePosition());
          }"
        {preview-show-condition}
        :style="'{css-position} min-height: ' + contentHeight + 'px'"
      >
        {content}
      </div>`,
      productDetailTemplate: `<div
        class="x-badge-{label-id} x-badge-container min-w-fit max-w-full max-h-full bottom-0 pointer-events-none{container-css-class}{container-img-class}"
      >
        {content}
      </div>`,
      outSideImageTemplate: `<div class="hidden" 
        x-data="{
          setPosition() {
            const element = $el.closest('.card-product').getElementsByClassName('{queryEL}');
            for (let i = 0; i < element.length; i++) {
              element[i].innerHTML += $el.innerHTML;
            }
          }
        }"
        x-init="setPosition()">
        <div
          class="x-badge-{label-id} x-badge-container min-w-fit max-w-full max-h-full bottom-0 pointer-events-none{container-img-class}"
          {preview-show-condition}
        >
          {content}
        </div>
      </div>`,
      previewActiveBlock: window.xBadgesPreviewActiveBlock,
      init() {
        if (Shopify.designMode) {
          document.addEventListener('shopify:block:select', (event) => {
            if (!event.target.classList.contains('x-badges-block-preview')) return;

            let blockId = event.target.getAttribute('block-id');
            this.previewActiveBlock = blockId;
            window.xBadgesPreviewActiveBlock = blockId;
            document.dispatchEvent(new CustomEvent("eurus:badges:block-select"));
          });
        }
      },
      load(el, callback = () => {}, container = null, productCard = false) {
        if (container) el.container = container;

        if (productCard && el.closest('#shopify-section-recently-viewed')) {
          if (el.dataset.rvBadgesInitialized === '1') return;
          this.doLoad(el, productCard, callback);
          return;
        }

        // Featured / PDP recommendations: labels immediately, skip Splide wait.
        if (productCard && el.closest('.featured-collection-mj__carousel, .product-rec-mj__carousel, .recently-viewed__carousel')) {
          this.doLoad(el, productCard, callback);
          return;
        }

        const sliderEl = el.closest('[x-data-slider]');
        if (sliderEl) {
          if (!sliderEl.classList.contains('is-initialized')) {
            const sectionId = el.closest('[x-data-slider]').getAttribute('x-data-slider');
            document.addEventListener(`eurus:${sectionId}:splide-ready`, () => {
              this.doLoad(el, productCard, callback);
            });
          } else {
            this.doLoad(el, productCard, callback);
          }
        } else {
          this.doLoad(el, productCard, callback);
        }
      },
      clearCardBadges(el) {
        const cardProduct = el.closest('.card-product');
        if (!cardProduct) return;
        const currentLabels = cardProduct.getElementsByClassName('x-badge-container');
        while (currentLabels?.length > 0) {
          currentLabels[0].remove();
        }
        cardProduct.querySelectorAll('.label-container').forEach((node) => {
          if (!node.querySelector('.x-badge-container')) node.remove();
        });
      },
      doLoad(el, productCard, callback = () => {}) {
        this.initAllLabels(el, productCard);

        if (Shopify.designMode) {
          let productData = xParseJSON(el.getAttribute('x-labels-data'));
          document.addEventListener('shopify:section:load', () => {
            if (productData && !productData.isXBadgesPreview) {
              this.initAllLabels(el, productCard);
            }
          });
        }

        callback(el);
      },
      initAllLabels(el, productCard) {
          let productDatas = xParseJSON(el.getAttribute('x-labels-data'));
          let allLabels = document.getElementsByClassName('x-badges-block-data');

          if (!productDatas) return;

          if (productCard && el.closest('#shopify-section-recently-viewed') && el.dataset.rvBadgesInitialized === '1') {
            return;
          }

          if (Shopify.designMode || productCard) {
            this.clearCardBadges(el);
          }

          if (productCard) {
            // Cancel stale frames so rapid load() calls (intersect + splide-ready) don't stack labels.
            const gen = (el._mjBadgesGen = (el._mjBadgesGen || 0) + 1);
            if (el._mjBadgesRaf) cancelAnimationFrame(el._mjBadgesRaf);

            el._mjBadgesRaf = requestAnimationFrame(() => {
              el._mjBadgesRaf = null;
              if (el._mjBadgesGen !== gen) return;

              this.clearCardBadges(el);

              let variantId = null;
              const variantEl = el.closest('.card-product')?.querySelector(".current-variant");

              if (variantEl) {
                const currentVariant = JSON.parse(el.closest('.card-product')?.querySelector(".current-variant")?.textContent);
                variantId = (typeof currentVariant === 'object') ? currentVariant.id : currentVariant;
              }
              
              if (variantId) {
                let matched = false;
                productDatas.forEach(productData => {
                  if (matched) return;
                  if (productData.variant_id === Number(variantId)) {
                    matched = true;
                    for (let i = 0;i < allLabels.length;i++) {
                      let label = xParseJSON(allLabels[i].getAttribute('x-badges-block-data'));
                      if (!label.enable && !productData.isXBadgesPreview) return;
                      
                      label.settings.icon = allLabels[i].getAttribute('x-badges-icon');
                      this.appendLabel(el, label, productData);
                    }  
                  }
                });    
              } else {
                for (let i = 0;i < allLabels.length;i++) {
                  let label = xParseJSON(allLabels[i].getAttribute('x-badges-block-data'));
                  if (!label.enable && !productDatas[0].isXBadgesPreview) return;
                  
                  label.settings.icon = allLabels[i].getAttribute('x-badges-icon');
                  this.appendLabel(el, label, productDatas[0]);
                }  
              }

              if (el.closest('#shopify-section-recently-viewed')) {
                el.dataset.rvBadgesInitialized = '1';
              }
            });
          } else {
            for (let i = 0;i < allLabels.length;i++) {
              let label = xParseJSON(allLabels[i].getAttribute('x-badges-block-data'));
              if (!label.enable && !productDatas.isXBadgesPreview) return;
              
              label.settings.icon = allLabels[i].getAttribute('x-badges-icon');
              this.appendLabel(el, label, productDatas);
            }  

            el.removeAttribute('x-labels-data');
          }
      },
      appendLabel(el, label, productData) {
        // Skip if this label block was already rendered on the card (guards race duplicates).
        if (productData.container == 'card' && label.id) {
          const card = el.closest('.card-product') || el;
          if (card.querySelector(`.x-badge-${label.id}`)) return;
        }

        if (productData.container == 'product-info' || label.settings.position == 'custom') {
          el.innerHTML += this.processTemplate(el, label, productData);
          return;
        }

        let position = label.settings.position;
        // Cards: % descuento va junto al precio (price.liquid), no sobre la imagen
        if (productData.container == 'card' && label.type === 'sale-label') {
          return;
        }
        // Cards: Nuevo + promociones arriba a la izquierda (Figma)
        if (productData.container == 'card' && (
          label.type === 'new-label'
          || label.type === 'tag-label'
          || label.settings.image
        )) {
          position = 'top-left';
        }

        let container = el.querySelector(`.${position}-container`);
        if (!container) {
          container = this.createFixedPositionContainer(position);
          el.appendChild(container);
        }

        const originalPosition = label.settings.position;
        if (position !== originalPosition) {
          label.settings.position = position;
        }

        container.innerHTML += this.processTemplate(el, label, productData);

        if (position !== originalPosition) {
          label.settings.position = originalPosition;
        }
      },
      createFixedPositionContainer(position) {
        let HTMLClass = `${position}-container label-container absolute gap-1 space-y-1`;
        HTMLClass += position.includes('top') ? ' top-1 flex-col' : ' bottom-1 flex-col-reverse';
        HTMLClass += position.includes('left') ? ' left-1' : ' right-1';

        container = document.createElement("div");
        container.setAttribute('class', HTMLClass);

        return container;
      },
      processContent(el, label, productData) {
        let content = false;
        const canShow = this.canShow(label, productData);

        if (label.settings.image && canShow) {
          /** image label */
          let imageHeight, imageWidth;
          if (productData.container == 'product-info') {
            imageHeight = 126;
            imageWidth = Math.round(imageHeight * label.settings.image_aspect_ratio);
          } else {
            imageWidth = label.settings.size_mobile > label.settings.size ? label.settings.size_mobile * 15 : label.settings.size * 15;
            imageHeight = imageWidth / label.settings.image_aspect_ratio;
          }
          let image;
          if (label.settings.image.src) {
            image = label.settings.image.src.includes('burst.shopifycdn.com') ? label.settings.image.src : 
            label.settings.image.src + `&width=` + (imageWidth * 3);
          } else {
            image = label.settings.image.includes('burst.shopifycdn.com') ? label.settings.image : 
            label.settings.image + `&width=` + (imageWidth * 3);
          }
          if (productData.container == "card") {
            var imageDirection = label.settings.position.includes('left') ? "justify-start" : "justify-end";
            var styleImage = 'width: var(--width-image-label); height: var(--height-image-label)';
          } else {
            var imageDirection = productData.make_content_center ? "justify-center" : "justify-start";
            var styleImage = '';
          }
          content = `<div x-ref="content" class='x-badge-content flex ${imageDirection}{css-opacity}'>
            <img 
              loading="lazy"
              width="` + imageWidth + `"
              height="` + imageHeight + `"
              alt="` + (label.settings.image_alt.length > 0 ? label.settings.image_alt : productData.title) + `"
              src="` + image + `"
              style="${styleImage}"
            />
          </div>`;
        } else if (label.settings.content && canShow) {
          /** text label */
          let qty = (productData.inventory_management.length < 1 || productData.qty < 0) ? '' : productData.qty;
          let saleAmount = productData.sale_amount.includes('-') ? '' : productData.sale_amount;
          let countDown = label.settings.schedule_enabled ? '<span x-intersect.once="$nextTick(() => { if (typeof rePosition !== `undefined`) {rePosition()} });" class="x-badge-countdown-' + label.id + ' label-countdown empty:hidden"></span>' : '';
          let sale = Math.round((productData.compare_at_price - productData.price) * 100 / productData.compare_at_price);
          sale = sale == 100 ? 99 : sale;
          sale = sale > 0 ? sale + '%' : '';

          content = label.settings.content.replace(/{sale}/gi, sale)
                      .replace(/{sale_amount}/gi, saleAmount)
                      .replace(/{qty}/gi, qty)
                      .replace(/{price}/gi, productData.price_with_currency)
                      .replace(/{count_down}/gi, countDown);

          if (productData.metafield_label) {
            Object.entries(productData.metafield_label).forEach(([key, value]) => {
              content = content.replace(`{${key}}`, value);
            });
          }
          const padding = label.settings.size / 2;
          const padding_mobile = label.settings.size_mobile / 2;
          const sizeClass = productData.container == 'product-info' ? '' : ` pt-${padding_mobile} pb-${padding_mobile} pl-${padding_mobile + 1.5} pr-${padding_mobile + 1.5} md:pt-${padding} md:pb-${padding} md:pl-${padding + 1.5} md:pr-${padding + 1.5}`;
          const inlineStyle = productData.container == 'product-info' ? '' : `style="font-size: var(--font-size-scale);"`;
          const inlineStyleIcon = productData.container == 'product-info' ? '' : `style="height: var(--font-size-scale); width: var(--font-size-scale); min-width: var(--font-size-scale);"`;
          const newLabelClass = label.type === 'new-label' ? ' x-badge-text--new' : '';
          content = content.length > 0
            ? `<div
                x-ref="content"
                class='x-badge-content ltr x-badge-text${newLabelClass} select-none inline-flex justify-center${sizeClass} items-center{css-opacity}{css-type} gap-2'
                ${inlineStyle}
              ><span class="icon-label empty:hidden" ${inlineStyleIcon}>${label.settings.icon}</span><span class="leading-normal w-fit p-break-words">${content}</span></div>` : false;

          if (countDown.length > 0 && label.settings.schedule_enabled) {
            Alpine.store('xHelper').countdown(label.settings, function(canShow, seconds, minutes, hours, days) {
              let container = el.container ? el.container : el;
              const countdownElements = container.getElementsByClassName('x-badge-countdown-' + label.id);

              if (!canShow) {
                for (let i = 0;i < countdownElements.length;i++) {
                  countdownElements[i].innerHTML = '';
                }

                return;
              }

              days = days > 0 ? days + "D&nbsp;&nbsp;&nbsp;" : "";
              hours = hours == 0 && days.length == 0 ? "" : hours + " : ";
              const timeLeft = days + hours + minutes + " : " + seconds;

              for (let i = 0;i < countdownElements.length;i++) {
                countdownElements[i].innerHTML = timeLeft;
              }
            });
          }
        }

        return content;
      },
      processTemplate(el, label, productData) {
        let template = '';
        if (content = this.processContent(el, label, productData)) {
          const cssOpacity = " opacity-" + label.settings.opacity;
          const cssPosition = productData.container == "card" ? "left: " + label.settings.horizontal_position + "%;" + " transform: translate(-"+ label.settings.horizontal_position+"%, -"+ label.settings.vertical_position+"%);"
                            + " top: " + (label.settings.vertical_position) + "%;"
                            : "";
          let cssType = '';
          if (label.settings.type == 'round') cssType = ' rounded-md';
          if (label.settings.type == 'rounded-full') cssType = ' rounded-full';

          let containerCssClass = productData.container == "card" ? " absolute w-max" : "";
          containerCssClass += label.settings.horizontal_position > 50 ? " text-end" : " text-start";
          const previewShowCondition = productData.isXBadgesPreview ? `x-show="$store.xBadges.previewActiveBlock == '{label-id}'"` : '';
          const imgClass = label.settings.image ? ' label-img' : '';

          template = this.getLableTemplate(productData.container, label.settings.position);
          template = template.replace('{preview-show-condition}', previewShowCondition)
            .replace('{content}', content)
            .replace('{css-opacity}', cssOpacity)
            .replace('{css-position}', cssPosition)
            .replace('{css-type}', cssType)
            .replace('{container-css-class}', containerCssClass)
            .replace('{container-img-class}', imgClass)
            .replace(/{label-id}/gi, label.id);
        }
        return template;
      },
      getLableTemplate(container, position) {
        if (container == 'product-info') {
          return this.productDetailTemplate;
        } else if (position == 'custom') {
          return this.customPositionTemplate;
        } else if (position == 'below-image' || position == 'bottom-card' || position == 'next-price') {
          return this.outSideImageTemplate.replace('{queryEL}', position);
        }

        return this.fixedPositionTemplate;
      },
      canShow(label, productData) {
        if (productData.isXBadgesPreview) {
          return true;
        }

        if (productData.container == 'card' && !label.settings.show_on_product_card) {
          return false;
        }

        if (productData.container == 'product-info' && !label.settings.show_on_product_page) {
          return false;
        }

        const productTagFilter = (label.settings.product_tag || '').trim();
        if (label.type === 'tag-label' || productTagFilter) {
          if (!productTagFilter || !productHasTag(productData, productTagFilter)) {
            return false;
          }
        }

        if (label.type == "sale-label" && productData.compare_at_price > productData.price) {
          return true;
        }

        if (label.type == "sold-out-label" && !productData.available) {
          return true;
        }
        if (label.type == "preorder-label" ) {
          if (productData.can_show_preorder && productData.available) {
            return true;
          } else {
            return false;
          }
        }
        if (label.type == "new-label" ) {
          if (label.settings.day_since == 'creation_date' && label.settings.number_show < productData.diff_day_create) {
            return false;
          } else if (label.settings.day_since == 'activation_date' && label.settings.number_show < productData.diff_day_publish) {
            return false;
          }
        }

        if (label.settings.schedule_enabled) {
          let endDate = new Date(
            label.settings.end_year,
            label.settings.end_month - 1,
            label.settings.end_day,
            label.settings.end_hour,
            label.settings.end_minute
          );
          label.endTime = endDate.getTime()
            + (-1 * label.settings.timezone * 60 - endDate.getTimezoneOffset()) * 60 * 1000;
  
          let startDate = new Date(
            label.settings.start_year,
            label.settings.start_month - 1,
            label.settings.start_day,
            label.settings.start_hour,
            label.settings.start_minute
          );
          label.startTime = startDate.getTime()
            + (-1 * label.settings.timezone * 60 - startDate.getTimezoneOffset()) * 60 * 1000;

          let now = new Date().getTime();
          if (label.endTime < now) {
            return false;
          }

          if (label.startTime > now) {
            return false;
          }
        }
        
        const appliedProducts = label.settings.applied_products || [];
        const appliedCollections = label.settings.applied_collections || [];

        if (appliedProducts.some((id) => id == productData.product_id)) {
          return true;
        }

        for (let i = 0; i < appliedCollections.length; i++) {
          if (productData.collections && productData.collections.includes(appliedCollections[i])) {
            return true;
          }
        }

        if (label.type != "sale-label"
          && label.type != "sold-out-label"
          && label.type != "tag-label"
          && appliedProducts.length == 0
          && appliedCollections.length == 0) {
          return true;
        }

        if (label.type === 'tag-label'
          && appliedProducts.length == 0
          && appliedCollections.length == 0) {
          return true;
        }

        return false;
      }
    });
  });
});
