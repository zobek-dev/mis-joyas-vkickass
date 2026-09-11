if (!window.Eurus.loadedScript.includes('product-cart.js')) {
  window.Eurus.loadedScript.push('product-cart.js');

  requestAnimationFrame(() => {
    document.addEventListener('alpine:init', () => {
      Alpine.data('xProductCart', (
        wrappringVariantId,
        engravingVariantId,
      ) => ({
        loading: false,
        errorMessage: false,
        mainHasError: false,
        buttonSubmit: "",
        error_message_wrapper: {},
        stopAction: false,
        insuranceVariantId: '',
        loadInsurance(id) {
          if (this.insuranceVariantId == '') {
            this.insuranceVariantId = id;
          }
        },
        async addToCart(e, required, quickView, sticky) {
          e.preventDefault();
          if (required) {
            var productInfo = this.$el.closest('.product-info');
            if(sticky){
              productInfo = document.querySelector('.product-info');
            }
            if (productInfo) {
              var propertiesInput = productInfo.querySelectorAll(`.customization-picker`);
              this.stopAction = false;
              let scrollStatus = false;
              
              propertiesInput.length && propertiesInput.forEach((input) => {
                if (input.required && input.value.trim() == '' || input.classList.contains("validate-checkbox")) {
                  input.classList.add("required-picker");
                  this.stopAction = true;
                  if(!scrollStatus){
                    input.parentElement.querySelector('.text-required').scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                    scrollStatus = true;
                  }    
                }                
              });              
            }
            if (this.stopAction) {
              return true;
            }
          }

          this.loading = true;

          if (this.$refs.engraving_text && engravingVariantId) {
            if (this.$refs.engraving_text.value.trim()) {
              if (!this.$refs.engraving_text.hasAttribute('name')) this.$refs.engraving_text.setAttribute('name', this.$refs.text_area_name.value);
            } else {
              if (this.$refs.engraving_text.hasAttribute('name')) this.$refs.engraving_text.removeAttribute('name');
            }
          }

          var productForm = this.$el.closest('.product-info') || this.$el.closest('form');
          var edt_element = productForm ? productForm.querySelector('.hidden.cart-edt-properties') : null;
          if (edt_element) {
            edt_element.value = edt_element.value.replace("time_to_cut_off", Alpine.store('xEstimateDelivery').noti)
          }
          let formData = new FormData(this.$refs.product_form);
          formData.append(
            'sections',
            Alpine.store('xCartHelper').getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          await fetch(`${Eurus.cart_add_url}`, {
            method:'POST',
            headers: { Accept: 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
            body: formData
          }).then(reponse => {
            return reponse.json();
          }).then(async (response) => {
            if (response.status == '422') {
              if (typeof response.errors == 'object') {
                this.error_message_wrapper = response.errors;
                document.querySelector('.recipient-error-message').classList.remove('hidden');
              } else {
                this.errorMessage = true;
                if(this.$refs.error_message){
                  this.$refs.error_message.textContent = response.description;
                }
                if(this.$refs.error_message_mobile){
                  this.$refs.error_message_mobile.textContent = response.description;
                }
              }
              if (Alpine.store('xMiniCart')) {
                Alpine.store('xMiniCart').reLoad();
              }
            } else {  
              if (Alpine.store('xCartNoti') && Alpine.store('xCartNoti').enable) {
                Alpine.store('xCartNoti').setItem(response); 
              }
              if ((this.$refs.gift_wrapping_checkbox && this.$refs.gift_wrapping_checkbox.checked && wrappringVariantId) || (this.$refs.engraving_text && engravingVariantId && this.$refs.engraving_text.value.trim()) || (this.insuranceVariantId && !localStorage.getItem('insuranceRemoved'))) {
                let additionalOptionData = {
                  items: [],
                  sections:  Alpine.store('xCartHelper').getSectionsToRender().map((section) => section.id)
                };
                if (this.$refs.gift_wrapping_checkbox && this.$refs.gift_wrapping_checkbox.checked && wrappringVariantId) {
                  additionalOptionData.items.push(
                    {
                      id: wrappringVariantId,
                      quantity: 1,
                      properties: {
                        "For": response.title,
                        "_key_link": response.key
                      }
                    }
                  );
                }
                if (this.$refs.engraving_text && engravingVariantId && this.$refs.engraving_text.value.trim()) {
                  additionalOptionData.items.push(
                    {
                      id: engravingVariantId,
                      quantity: 1
                    }
                  );
                }
                if (this.insuranceVariantId && !localStorage.getItem('insuranceRemoved')) {
                  additionalOptionData.items.push(
                    {
                      id: this.insuranceVariantId,
                      quantity: 1
                    }
                  );
                }

                await window.fetch('/cart/add.js', {
                  method: 'POST',
                  credentials: 'same-origin',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                  },
                  body: JSON.stringify(additionalOptionData),
                }).then((response) => {
                  return response.json();
                }).then(response => {
                  document.querySelector('.recipient-error-message') ? document.querySelector('.recipient-error-message').classList.add('hidden') : '';
                  this.error_message_wrapper = {};
    
                  
      
                  if (Alpine.store('xQuickView') && Alpine.store('xQuickView').show) {
                    Alpine.store('xQuickView').show = false;
                  }
                  Alpine.store('xPopup').open = false;
                  if (Alpine.store('xMiniCart')) {
                    clearTimeout(Alpine.store('xMiniCart')._popupTimer);
                    Alpine.store('xMiniCart')._popupTimer = null;
                  }
                  
                    if((quickView && Alpine.store('xQuickView').buttonQuickView && Alpine.store('xQuickView').buttonQuickView.dataset.addAsBundle) || (!quickView && this.$refs.product_form && this.$refs.product_form.querySelector('[data-add-as-bundle="true"]'))) {
                      document.dispatchEvent(new CustomEvent("eurus:cart:add-as-bundle"));
                    } else {
                      window.renderSectionsFromResponse(response.sections, Alpine.store('xCartHelper').getSectionsToRender());
                      if (!Alpine.store('xCartNoti') || !Alpine.store('xCartNoti').enable) {
                        setTimeout(() => {
                          Alpine.store('xMiniCart').openCart();                  
                        }, 500);
                      }  
                      Alpine.store('xCartHelper').currentItemCount = response.item_count ?? window.getCartBubbleCount();
                      document.dispatchEvent(new CustomEvent("eurus:cart:items-changed"));
                    }
                });
              } else {
                document.querySelector('.recipient-error-message') ? document.querySelector('.recipient-error-message').classList.add('hidden') : '';
                this.error_message_wrapper = {};
      
                if (Alpine.store('xQuickView') && Alpine.store('xQuickView').show) {
                  Alpine.store('xQuickView').show = false;
                }
                Alpine.store('xPopup').open = false;
                if (Alpine.store('xMiniCart')) {
                  clearTimeout(Alpine.store('xMiniCart')._popupTimer);
                  Alpine.store('xMiniCart')._popupTimer = null;
                }
                
                if((quickView && Alpine.store('xQuickView').buttonQuickView && Alpine.store('xQuickView').buttonQuickView.dataset.addAsBundle) || (!quickView && this.$refs.product_form && this.$refs.product_form.querySelector('[data-add-as-bundle="true"]'))) {
                  document.dispatchEvent(new CustomEvent("eurus:cart:add-as-bundle"));
                } else {
                  window.renderSectionsFromResponse(response.sections, Alpine.store('xCartHelper').getSectionsToRender());
                  if (!Alpine.store('xCartNoti') || !Alpine.store('xCartNoti').enable) {
                    Alpine.store('xMiniCart').openCart();
                  }               
                  Alpine.store('xCartHelper').currentItemCount = response.item_count ?? window.getCartBubbleCount();
                  document.dispatchEvent(new CustomEvent("eurus:cart:items-changed"));
                }
              }
            }
          }).catch((error) => {
            console.error('Error:', error);
          }).finally(() => {
            this.loading = false;
            if ((quickView && Alpine.store('xQuickView').buttonQuickView && !Alpine.store('xQuickView').buttonQuickView.dataset.addAsBundle) || (!quickView && this.$refs.product_form && !this.$refs.product_form.querySelector('[data-add-as-bundle="true"]'))) {
              if(this.$refs.gift_wrapping_checkbox) this.$refs.gift_wrapping_checkbox.checked = false;
            }
          }) 
        }
      }))
    });
  });
}
