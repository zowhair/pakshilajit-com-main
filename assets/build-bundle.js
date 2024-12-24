class BundleBuilder extends HTMLElement {
    constructor() {
      super();
      this.mainElement = '[js-selected-products-wrapper]';
      this.productWrapperSelector = '[js-product-wrapper]';
      this.productTitleSelector   = '[js-product-card-title]';
      this.cardMediaSelector      = '[js-card-content-elm]';
      this.selectProductBtnSelector = '[js-select-product-btn]';
      this.selectProductQuantitySelector = '[js-select-product-quantity]';
      this.quantityInputSelector = '[js-quantity-input]';
      this.incrementBtnSelector = '[js-quantity-increment]';
      this.decrementBtnSelector = '[js-quantity-decrement]';
      this.selectionBoxSelector = '[js-selection-box]';
      this.selectionBoxListSelector = '[js-selection-box-list]';
      if(window.innerWidth >= 767) {
        this.bundleTypeSelector       = '[js-bundle-type-selector]';
      } else {
        this.bundleTypeSelector       = '[js-bundle-type-selector-mobile]';
      }
      this.removeProductSelector    = '[js-bundle-product-cross-icon]';
      this.subscriptionCheckbox     = '[js-subscription-checkbox]';
      this.subscriptionSellingPlan = '[js-subscription-selling-plan]';
  
      this.collectionLinksSelector = '[js-collection-links]';
      this.totalRegularPrice = '[js-bundle-regular-price]';
      this.totalComparePrice = '[js-bundle-compare-price]';
  
      this.selectionCountWrappers = this.querySelector('[js-selection-count-wrapper]');
      this.selectionCounts = this.querySelectorAll('[js-selection-count]');
      this.addToCartBtns = this.querySelectorAll('[js-bundle-addToCart-btn]');
      this.comparePriceWrappers = this.querySelectorAll('[js-product-compare-price]');
      this.priceWrappers = this.querySelectorAll('[js-product-price]');
      this.bundleCompletedMsgs = this.querySelectorAll('[js-bundle-completed-msg]');
      this.bundleProcessMsgs = this.querySelectorAll('[js-bundle-processing-msg]');
      this.selectionRemainingCounts = this.querySelectorAll('[js-remaining-count]');
      this.mobileNavBarDrop = this.querySelector('[js-mobile-nav-drop]');
  
      this.crossBtn = this.querySelector('[js-bundle-products-list-cross-btn]')
      this.storeCurrency = this.querySelector('[data-store-currency]').dataset.storeCurrency
  
      this.totalBox = 3;
      this.products = [];
  
  
  
      this.addEventListener('click', (event) => {
        this.querySelectorAll(`${this.selectProductBtnSelector},${this.productTitleSelector}, ${this.cardMediaSelector}`).forEach(selectProductBtn => {
          if(selectProductBtn.contains(event.target)) {
  
            const parent = selectProductBtn.closest(this.productWrapperSelector);
            const quantityField = parent.querySelector(this.quantityInputSelector);
            
            quantityField.stepUp();
       
            
            parent.classList.add('selected');
            
            
            this.addProductToBox(parent);
            this.selectedProductWrapperHandler();
            this.updateStatus();
          }
  
           if(document.querySelector(this.mainElement) && window.screen.width <= 767) {
               if(document.querySelector(this.mainElement).contains(event.target)) {
                 // console.log('close overlay', event.currentTarget, event.target.classList);
                  if(event.target.classList.contains('drawer-open')) {
                    this.querySelector('[js-selected-products-wrapper]')?.classList.remove('drawer-open');
                  } 
               }
           }
          
        })
  
        this.querySelectorAll(this.decrementBtnSelector).forEach(decrementBtn => {
          if(decrementBtn.contains(event.target)) {
            const parent = decrementBtn.closest(this.productWrapperSelector);
            const currentProductId = Number(parent.dataset.productId);
            const quantityField = parent.querySelector(this.quantityInputSelector);
            if(Number(quantityField.value) > 0) {
              quantityField.stepDown();
            }
            this.selectedProductWrapperHandler();
            this.removeProductFromBox(currentProductId, parent);
          }
        })
  
        this.querySelectorAll(this.incrementBtnSelector).forEach(incrementBtn => {
          
          if(incrementBtn.contains(event.target)) {
            const parent = incrementBtn.closest(this.productWrapperSelector);
            const quantityField = parent.querySelector(this.quantityInputSelector);
            quantityField.stepUp();
            this.addProductToBox(parent);
            this.selectedProductWrapperHandler();
          }
        })
  
        // mobile selection box element
        if(window.innerWidth < 767) {
          this.querySelectorAll(this.selectionBoxSelector).forEach(selectionBox_ => {
            if(selectionBox_.contains(event.target) && !event.target.closest('[js-bundle-product-cross-icon]')) {
              if(!selectionBox_.classList.contains('filled')) {
                const parent_ = event.target.closest('.bundle-meta__container')
                if(parent_.querySelector('[js-bundle-products-list-cross-btn]')) {
                  parent_.querySelector('[js-bundle-products-list-cross-btn]').click()
                }
              }
            }
          })
        }
  
        //    bundle type selector
        this.querySelectorAll(this.bundleTypeSelector).forEach(selectBundleType => {
            if(selectBundleType.contains(event.target)) {
                this.querySelectorAll(this.bundleTypeSelector).forEach(bundleSelector =>  bundleSelector.classList.remove('active'))
                if(!event.target.classList.contains('active')) {
                  
                    const bundleChunk = selectBundleType.dataset.value
                    // this.products = [];
                    this.querySelectorAll(this.productWrapperSelector).forEach(item => {
                      if(!this.products.length) {
                        item.classList.remove('selected')
                        item.querySelector(this.quantityInputSelector).value = 0
                      }
                    })
                    // reset  counter and other stuff too
                    this.totalBox = parseInt(bundleChunk);
                    selectBundleType.classList.add('active')
                    this.updateStatus();
                    this.updatePrice();
                    this.priceHandler()
  
                    const activeBundleValue = parseInt(this.querySelector(`${this.bundleTypeSelector}.active`).dataset.value)
                    if(this.products.length < activeBundleValue) {
                      this.createBox(parseInt(bundleChunk))
                      this.fillProductInSelectionBox(this.products);
                    }
                    
                }
            }
        })
  
        // remove selected product from bundle
        this.querySelectorAll(this.removeProductSelector).forEach(removeItem => {
          if(removeItem.contains(event.target)) {
            // pass id, parent
            const selectedProductLine= removeItem.closest(`${this.selectionBoxSelector}[data-product-id]`)
            const pId = Number(selectedProductLine.dataset.productId)
            const parent_ = this.querySelector(`${this.productWrapperSelector}[data-product-id="${pId}"]`)
            const quantityField = parent_.querySelector(this.quantityInputSelector);
            if(Number(quantityField.value) > 0) {
              quantityField.stepDown();
            }
            this.removeProductFromBox(pId, parent_)
            if(this.totalBox > 4) {
              this.totalBox -= 1
            }
            // this.selectedProductWrapperHandler();
          }
        })
        
        // subscription checkbox
        if(this.querySelector(this.subscriptionCheckbox).contains(event.target)) {
          const checkBoxContainer = event.target.closest(this.subscriptionCheckbox)
          const active = checkBoxContainer.classList.contains('checked')
  
          const sellingPlanDetail = event.target.closest('[js-subscription-selling-plan]');
          const sellingPlanId = sellingPlanDetail.dataset.subscriptionSellingPlanId
          const discountPrice = sellingPlanDetail.dataset.subscriptionSellingPlanDiscount
          const sellingPlanDiscount = this.querySelector('[js-selling-plan-discount]')
  
          if(active) {
            checkBoxContainer.classList.remove('checked')
            checkBoxContainer.setAttribute('checked', 'false')
            if(this.products.length && sellingPlanId) {this.products.forEach((item) => delete item.selling_plan)}
  
            //update selling plan discount
            sellingPlanDiscount.setAttribute('data-percent', '')
          }else {
            checkBoxContainer.classList.add('checked')
            checkBoxContainer.setAttribute('checked', 'true')
            if(this.products.length && sellingPlanId) {this.products.forEach((item) => item['selling_plan'] = sellingPlanId)}
  
            // update selling plan discount
            sellingPlanDiscount.setAttribute('data-percent', discountPrice)
          }
          this.priceHandler()
        }
  
        // bundle selected products cross btn
        if(this.crossBtn.contains(event.target)) {
          this.querySelector('[js-selected-products-wrapper]')?.classList.remove('drawer-open')
          // this.querySelector(`[js-selected-products-wrapper] .box-shadow__inner`)?.classList.add('hidden')
        }
  
        // nav drop mobile
        if(this.mobileNavBarDrop.contains(event.target)) {
          const navBarWrapper = event.target.closest('[js-mobile-nav-wrapper]');
          
          navBarWrapper.style.maxHeight = '50px'
          
          if(navBarWrapper.classList.contains('active')) {
            navBarWrapper.classList.remove('active');
          } else {
            navBarWrapper.classList.add('active');
            const navBarHeight = navBarWrapper.scrollHeight;
            navBarWrapper.style.maxHeight = navBarHeight +'px';
            
          }
        }
        // collections 
        this.querySelectorAll(this.collectionLinksSelector).forEach((cLink) => {
          if(cLink.contains(event.target)) {
            this.querySelectorAll(this.collectionLinksSelector).forEach((cLink) => { cLink.classList.remove('selected')})
            const collectionLink = cLink.dataset.collectionLink
            const dropWrapper = cLink.closest('[js-mobile-nav-wrapper]')
            const dropSelected = dropWrapper.querySelector('[js-mobile-nav-drop] .drop__selected span')
            
            dropSelected.innerText = cLink.querySelector('span').innerText
  
            cLink.classList.add('selected')
  
            this.fetchCollection(collectionLink)
            if(dropWrapper.classList.contains('active')) {
              dropWrapper.style.maxHeight = '50px'
              dropWrapper.classList.remove('active')
            }
  
          }
        })
  
        // mobile add popup
        if(this.selectionCountWrappers.contains(event.target)) {
          if(window.innerWidth < 768) {
            const openDrawerClass= 'drawer-open'
            const drawerWrapper = this.selectionCountWrappers.closest('[js-selected-products-wrapper]')
            
            if(!drawerWrapper.classList.contains(openDrawerClass)) {
              drawerWrapper?.classList.add(openDrawerClass)
              // drawerWrapper.querySelector(`.box-shadow__inner`)?.classList.remove('hidden')
            } else {
              drawerWrapper?.classList.remove(openDrawerClass)
              // drawerWrapper.querySelector(`.box-shadow__inner`)?.classList.add('hidden')
            }
          }  
        }
        
  
      })
      this.bundleTypeSelectorMethod()  
      this.addToCartBtns.forEach(addToCartBtn => {
        addToCartBtn.addEventListener('click', (e) => {
  
          this.addToCartBtns.forEach(addToCartBtn => {
            addToCartBtn.classList.add('loading');
            addToCartBtn.querySelector('.loading__spinner')?.classList.remove('hidden');
         })
  
          const productsId = [];
          const products = [];
    
          this.products.forEach(item => {
            if(productsId.indexOf(item.id) === -1) {
              productsId.push(item.id)
              products.push({
                id: item.id,
                quantity: 1,
                selling_plan: item.selling_plan
              })
            } else { 
              products[productsId.length - 1].quantity += 1;
            }
          })
          this.addToCart(products);
          this.addToCartBtns.forEach(addToCartBtn => {
            addToCartBtn.classList.add('loading');
            // addToCartBtn.querySelector('.loading__spinner')?.classList.add('hidden');
          })  
        })
      })
  
      
  
      // document.addEventListener('renderBundleProduct:init', () => {
      //   this.updateAfterFilterApply();
      // })
  
      this.createBox(this.totalBox);
      this.selectedProductWrapperHandler()
    }
  
  
    // new bundle
    bundleTypeSelectorMethod() {
        const bundleSelector = this.querySelectorAll(this.bundleTypeSelector)
        const hasActiveBundle = this.querySelectorAll(`.active${this.bundleTypeSelector}`)
        if(hasActiveBundle.length < 1) {
            // bundleSelector[0].classList.add('active')
            this.createBox(parseInt(bundleSelector[0].dataset.value))
            setTimeout(() => {
                bundleSelector[1].click()
            }, 100);
            this.totalBox = parseInt(bundleSelector[0].dataset.value);
        }
        this.priceHandler()
    }
  
  
    // to show and hide selected products list on mobile
    selectedProductWrapperHandler() {
      const addedAnyProduct = this.querySelectorAll(`${this.selectionBoxSelector}.filled`).length
      if(window.innerWidth < 767) {
        if(addedAnyProduct) {
          this.querySelector('[js-selected-products-wrapper]')?.classList.add('drawer-open')
          // this.querySelector(`[js-selected-products-wrapper] .box-shadow__inner`)?.classList.remove('hidden')
        } else {
          this.querySelector('[js-selected-products-wrapper]')?.classList.remove('drawer-open')
          // this.querySelector(`[js-selected-products-wrapper] .box-shadow__inner`)?.classList.add('hidden')
        }
        
      }
    }
    // updateAfterFilterApply() {
    //   this.fillProductInSelectionBox(this.products);
      
    //   this.products.forEach(product => {
    //     const selectedProductWrapper = this.querySelector(`${this.productWrapperSelector}[data-product-id="${product.id}"]`);
    //     const currentProducts = this.products.filter(product => product.id == Number(selectedProductWrapper.dataset.productId));
    //     selectedProductWrapper.classList.add('selected');
    //     selectedProductWrapper.querySelector(this.quantityInputSelector).value = currentProducts.length;
    //   })
    // }
  
    removeProductFromBox(id, parent) {
      const otherProducts = this.products.filter(product => product.id !== id);
      const currentProducts = this.products.filter(product => product.id == id);
      currentProducts.splice(0, 1)
      if(currentProducts.length === 0) {
        parent.classList.remove('selected');
      }
      this.products = [...currentProducts, ...otherProducts];
      this.fillProductInSelectionBox(this.products);
      this.priceHandler();
    }
  
    addProductToBox(parent) {
      const imageUrl = parent.dataset.productImageUrl;
      const productId = Number(parent.dataset.productId);
      const title = parent.dataset.productTitle;
      const benefit = parent.dataset.productBenefit;
      const price = Number(parent.dataset.productPrice);
      const comparePrice = Number(parent.dataset.productComparePrice);
  
      const totalPrice = price+comparePrice
      const productGridBarsText = parent.dataset.productGridBarsText
      const productGridSizeType = parent.dataset.productGridSizeType
  
  
      this.products.push({
        id: productId,
        imageUrl,
        title,
        benefit,
        price,
        quantity: 1,
        comparePrice,
        productGridSizeType,
        productGridBarsText
      })
      
      if(this.products.length >= 3) {
        // show atc btn
        this.addToCartBtns.forEach(addToCartBtn => {
          addToCartBtn.classList.remove('hidden');
        })
        // hide add to bundle 
        this.selectionCountWrappers.classList.add('hidden');
        this.totalBox += 1
      }
      if(this.products.length) {
        this.fillProductInSelectionBox(this.products);
      }
      this.priceHandler();
      
    }
  
  
    createBox(number) {
      this.querySelector(this.selectionBoxListSelector).innerHTML = '';
      let productbox = '';
      for (let i = 0; i < number; i++) {
        productbox += `<div class="adding-card selection-box-item d-flex" data-index="${i}" js-selection-box >
                            <div class="card-image selected-product-media">
                            <img src="https://cdn.shopify.com/s/files/1/0847/5728/3136/files/Salud_Immunity_Hibiscus_Pouch_v22_e78a4fa3-8afe-46af-8d98-f407550a76e8.png?v=1700198754" alt="">
                            </div>
                            <div class="empty-selection">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <rect x="0.5" y="0.5" width="79" height="79" rx="7.5" fill="white"/>
                            <rect x="0.5" y="0.5" width="79" height="79" rx="7.5" stroke="#9E9596"/>
                            <path opacity="0.2" d="M24.2717 24.4631H25.4158C25.4158 24.4031 25.4158 24.3546 25.4158 24.3061C25.4158 22.8476 25.4205 21.3881 25.4135 19.9296C25.4123 19.6871 25.3502 19.4458 25.3349 19.2033C25.3209 18.9931 25.3396 18.7806 25.3326 18.5693C25.3267 18.3927 25.3431 18.2044 25.2857 18.0428C25.0501 17.3672 24.7957 16.6986 24.5378 16.0301C24.4311 15.7518 24.2916 15.4862 24.1791 15.2102C24.0642 14.925 24.0384 14.6236 24.0361 14.3176C24.0302 13.7183 23.9939 13.119 24.0009 12.5196C24.0056 12.1293 24.0619 11.739 24.097 11.3499C24.1029 11.291 24.1193 11.2344 24.1381 11.1397C24.2236 11.2344 24.2881 11.3072 24.362 11.3903C24.4475 11.3464 24.5343 11.3049 24.6175 11.2575C24.7054 11.2079 24.784 11.2044 24.8578 11.2818C24.8836 11.3083 24.9141 11.3303 24.9434 11.3534C25.1016 11.4769 25.138 11.485 25.2998 11.3695C25.4287 11.2783 25.5248 11.2529 25.6643 11.3695C25.8613 11.5346 25.8789 11.5277 26.077 11.3695C26.1872 11.2818 26.2622 11.2875 26.3653 11.3776C26.5646 11.5508 26.581 11.5485 26.7956 11.3903C26.8858 11.3233 26.9597 11.3141 27.0394 11.3961C27.0523 11.4088 27.0675 11.4203 27.0828 11.4319C27.2621 11.5647 27.2809 11.5785 27.4415 11.4319C27.5657 11.3187 27.6525 11.3406 27.758 11.4365C27.7885 11.4642 27.8271 11.4815 27.874 11.5116C27.8975 11.3972 27.9186 11.2956 27.9432 11.1767C27.9831 11.2044 28.0077 11.2171 28.0253 11.2356C28.1319 11.3545 28.2703 11.3845 28.4074 11.3002C28.5246 11.2286 28.6196 11.2252 28.7204 11.3268C28.7474 11.3545 28.806 11.3534 28.8505 11.3637C28.8857 11.3718 28.9338 11.3637 28.9537 11.3822C29.0439 11.4688 29.1166 11.4261 29.1975 11.3684C29.2831 11.3072 29.3605 11.2644 29.4718 11.3534C29.5562 11.4215 29.6793 11.4434 29.8118 11.4965C29.8036 11.5023 29.8258 11.4885 29.8481 11.4734C30.1306 11.2852 30.1341 11.2806 30.4108 11.4815C30.4952 11.5427 30.5491 11.5266 30.6206 11.4781C30.8434 11.3268 30.8422 11.3303 31.0661 11.4827C31.1142 11.5162 31.195 11.5647 31.2279 11.5473C31.3334 11.4908 31.4682 11.4527 31.4869 11.3025C31.4905 11.276 31.4987 11.2506 31.5139 11.1801C31.5772 11.2517 31.6241 11.2956 31.6604 11.3464C31.7202 11.4307 31.7859 11.4665 31.8785 11.3949C32.0789 11.2402 32.2595 11.2425 32.4365 11.4388C32.5232 11.5358 32.6311 11.5462 32.7412 11.4469C32.794 11.3984 32.8667 11.3649 32.937 11.3441C32.9816 11.3314 33.0413 11.3476 33.0882 11.3661C33.1257 11.3799 33.1562 11.4134 33.1879 11.4411C33.2758 11.5162 33.3496 11.5266 33.454 11.4457C33.6404 11.3014 33.7928 11.3118 33.9686 11.4596C34.0389 11.5196 34.0905 11.5173 34.1585 11.4596C34.2863 11.3534 34.2921 11.3568 34.427 11.455C34.5184 11.3649 34.6063 11.3753 34.7024 11.4619C34.7282 11.485 34.8032 11.4908 34.8314 11.4711C34.9216 11.4088 34.999 11.3707 35.0893 11.4677C35.1033 11.4827 35.1538 11.4908 35.162 11.4827C35.2698 11.3487 35.3694 11.4146 35.4714 11.5012C35.5664 11.3995 35.6637 11.3418 35.7821 11.4607C35.7938 11.4723 35.8489 11.4654 35.8653 11.4492C35.9567 11.3557 36.0365 11.3776 36.1173 11.4711C36.1537 11.4457 36.1889 11.4249 36.2205 11.3995C36.2826 11.3476 36.3366 11.3441 36.4069 11.3949C36.5429 11.4931 36.7058 11.485 36.8301 11.3684C36.925 11.2794 37.0024 11.2702 37.1056 11.3545C37.204 11.4353 37.3072 11.4758 37.4162 11.3464C37.4701 11.2818 37.5581 11.2448 37.6296 11.1963C37.6413 11.1998 37.6507 11.2009 37.6589 11.2055C37.9461 11.3741 37.9496 11.3788 38.2122 11.1744C38.2884 11.1143 38.3446 11.1028 38.4185 11.1628C38.4431 11.1836 38.4771 11.1928 38.5029 11.2113C38.626 11.2979 38.7244 11.2702 38.837 11.1767C39.0374 11.0104 39.0011 11.0058 39.2133 11.157C39.3375 11.2448 39.4243 11.2379 39.5368 11.1363C39.708 10.9815 39.7185 10.985 39.9108 11.1293C39.994 11.1917 40.0491 11.1882 40.1276 11.1236C40.1909 11.0716 40.3058 10.9942 40.3433 11.0173C40.4453 11.0785 40.5438 11.1732 40.5133 11.321C40.511 11.3337 40.5157 11.3476 40.5168 11.3499C40.5965 11.3995 40.6727 11.4411 40.7431 11.4908C40.8357 11.5577 40.9189 11.5704 40.9998 11.4758C41.0092 11.4654 41.0221 11.4584 41.0326 11.4503C41.2178 11.2979 41.2202 11.2945 41.4265 11.4157C41.5191 11.47 41.5906 11.4838 41.6703 11.3926C41.7172 11.3383 41.7829 11.2945 41.8497 11.2633C41.8895 11.2437 41.9458 11.2529 41.995 11.2575C42.015 11.2598 42.0326 11.2829 42.0525 11.2956C42.2412 11.4134 42.2529 11.4122 42.4241 11.2644C42.539 11.1651 42.6621 11.1497 42.7934 11.2182C42.9246 11.2868 43.0552 11.2741 43.1849 11.1801C43.3525 11.0439 43.3502 11.0473 43.5413 11.1628C43.7511 11.2887 43.703 11.3002 43.8953 11.1478C43.9809 11.0797 44.0512 10.9654 44.1942 11.0693C44.2212 11.0889 44.3056 11.03 44.3642 11.0069C44.3736 11.0208 44.3829 11.0346 44.3923 11.0485C44.3607 11.082 44.3302 11.1155 44.295 11.1524C44.3454 11.2275 44.4111 11.2194 44.4884 11.1524C44.5506 11.0982 44.6232 11.0531 44.6959 11C44.8026 11.097 44.914 11.1778 44.9022 11.3499C44.8929 11.4919 45.0464 11.5104 45.1343 11.5774C45.207 11.6328 45.2539 11.5774 45.3032 11.537C45.3102 11.5312 45.3184 11.5266 45.3243 11.5196C45.4708 11.3464 45.6267 11.2956 45.8131 11.47C45.8823 11.5346 45.9502 11.5139 46.0182 11.4446C46.0827 11.3799 46.1612 11.3268 46.241 11.2806C46.2726 11.2621 46.3254 11.2702 46.3652 11.2794C46.3945 11.2864 46.418 11.3152 46.4461 11.3326C46.6395 11.4515 46.6513 11.44 46.833 11.2991C47.0428 11.1363 47.0205 11.1005 47.2257 11.2483C47.3781 11.358 47.507 11.3291 47.6442 11.2067C47.8317 11.0393 47.8106 11.0635 48.0099 11.1836C48.2479 11.3279 48.1799 11.3372 48.3991 11.1628C48.5433 11.0485 48.5409 11.0462 48.8985 11.0577C48.8574 11.0866 48.8246 11.1109 48.7906 11.1351C48.8645 11.2437 48.9313 11.2506 49.0098 11.1767C49.0262 11.1605 49.0462 11.1478 49.0673 11.1363C49.1329 11.1005 49.2337 11.0196 49.2619 11.0393C49.3603 11.1074 49.4529 11.1859 49.4553 11.336C49.4623 11.8106 49.4846 12.2841 49.5034 12.7887C49.5971 12.7183 49.6722 12.6663 49.7413 12.6086C49.8117 12.5485 49.8738 12.5474 49.9535 12.597C50.2524 12.7806 50.2524 12.776 50.5338 12.5635C50.576 12.5323 50.6475 12.5323 50.7049 12.5289C50.7928 12.5231 50.8819 12.5277 50.9874 12.5277C50.9382 12.5658 50.8995 12.5947 50.8597 12.627C50.9265 12.724 51.0003 12.7321 51.0859 12.649C51.1058 12.6293 51.1293 12.612 51.1539 12.5993C51.2195 12.5658 51.3297 12.4942 51.3473 12.5116C51.4259 12.5889 51.4938 12.6848 51.5325 12.7864C51.5654 12.873 51.5525 12.9769 51.5583 13.045C51.6931 13.1213 51.815 13.1825 51.9288 13.2564C52.0003 13.3026 52.0671 13.3037 52.114 13.2425C52.2781 13.0289 52.5078 13.0427 52.7575 13.052C52.7095 13.0901 52.6731 13.1201 52.6321 13.1524C52.6931 13.2448 52.7634 13.2633 52.8513 13.179C52.8712 13.1594 52.8947 13.1432 52.9193 13.1293C52.985 13.0935 53.0846 13.015 53.1139 13.0358C53.2089 13.1005 53.3073 13.1778 53.3108 13.3187C53.3237 13.8118 53.3437 14.306 53.3554 14.7991C53.3577 14.8857 53.3777 14.9365 53.4597 14.9839C53.768 15.1617 53.7657 15.1663 54.0412 14.9458C54.0998 14.8996 54.1467 14.8834 54.2287 14.91C54.3037 14.9354 54.3975 14.9065 54.5148 14.9007C54.4526 14.9481 54.4139 14.9769 54.3729 15.007C54.4362 15.1051 54.5089 15.1178 54.5956 15.0335C54.6156 15.0139 54.639 14.9966 54.6636 14.9839C54.7293 14.9492 54.8301 14.873 54.8582 14.8926C54.952 14.9585 55.0505 15.0358 55.0528 15.1767C55.0622 15.5682 55.0821 15.9608 55.0927 16.3522C55.1149 17.1363 55.1243 17.9215 55.1571 18.7044C55.1724 19.0797 55.0376 19.4169 54.9508 19.768C54.7199 20.7114 54.3694 21.6155 54.0412 22.5266C53.9357 22.8199 53.8653 23.1248 53.7833 23.4262C53.7692 23.4781 53.7715 23.5382 53.7809 23.5913C53.8454 23.9447 53.7809 24.2876 53.7153 24.6329C53.6895 24.7726 53.6672 24.9158 53.6672 25.0578C53.6824 27.9978 53.7024 30.9389 53.72 33.8789C53.7258 34.9401 53.7282 36.0025 53.7282 37.0637C53.7282 37.1838 53.7633 37.2704 53.8501 37.3558C54.496 37.999 55.1372 38.6468 55.7831 39.29C55.8746 39.3812 55.8945 39.4817 55.8945 39.6006C55.9015 41.8351 55.9109 44.0695 55.9203 46.3028C55.9297 48.7358 55.939 51.1677 55.9484 53.6007C55.959 56.0892 55.9695 58.5765 55.9789 61.065C55.9859 62.8329 55.993 64.6008 56 66.3687C56 66.52 56 66.6712 56 66.8202C55.7081 66.9738 55.3881 66.9507 55.0798 66.9749C52.6602 67.1632 50.2419 67.3445 47.8223 67.5281C45.8096 67.6805 43.7968 67.8329 41.7829 67.983C40.0081 68.1147 38.2321 68.2428 36.4573 68.3768C36.3049 68.3883 36.1748 68.3606 36.0458 68.281C34.148 67.1089 32.2477 65.9414 30.3498 64.7694C28.3722 63.5488 26.3982 62.3236 24.4194 61.1054C24.1756 60.9553 24.0525 60.789 24.0642 60.4761C24.0982 59.5257 24.0876 58.5754 24.0935 57.6238C24.1064 55.3525 24.1181 53.0811 24.131 50.8109C24.1392 49.297 24.1486 47.7831 24.158 46.2693C24.1674 44.7046 24.1779 43.1399 24.1873 41.5752C24.1967 39.9505 24.2072 38.3258 24.2166 36.7011C24.2248 35.2611 24.2342 33.8212 24.2424 32.38C24.2518 30.7322 24.2635 29.0844 24.2705 27.4366C24.274 26.4539 24.2705 25.4701 24.2705 24.4654L24.2717 24.4631Z" fill="#9E9596"/>
                            </svg>
                            </div>
                            <div class="product-card">
                                <h3 class="product-card__title">Add a Box</h3>
                                <div class="product-card__size">
                                      <!-- Full Size
                                      <span class="card-dott"></span>
                                      <span>8 Bars</span>-->
                                </div>
                            </div>
                            <div class="card-icon">
                                <div class="plus-icon">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_38_22502)">
                                        <path d="M8 1.3335V14.6668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M14.6666 8H1.33325" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_38_22502">
                                        <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div class="cross-icon">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_38_27706)">
                                        <path d="M12.7141 3.28564L3.28602 12.7137" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M12.714 12.7137L3.28589 3.28564" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_38_27706">
                                        <rect width="16" height="16" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>`
      }
      this.querySelector(this.selectionBoxListSelector).insertAdjacentHTML('beforeend', productbox);
    }
  
    fillProductInSelectionBox(products) {
      this.createBox(this.totalBox);
      products.forEach((item, index) => {
        this.querySelector(`${this.selectionBoxSelector}[data-index="${index}"]`).innerHTML = '';
        this.querySelector(`${this.selectionBoxSelector}[data-index="${index}"]`).classList.add('filled');
        this.querySelector(`${this.selectionBoxSelector}[data-index="${index}"]`).setAttribute('data-product-id', item.id);
        this.querySelector(`${this.selectionBoxSelector}[data-index="${index}"]`).setAttribute('data-product-price', 6767);
        this.querySelector(`${this.selectionBoxSelector}[data-index="${index}"]`).insertAdjacentHTML('beforeend', `<div class="adding-card selected selection-box-item d-flex" js-selection-box >
        <div class="card-image selected-product-media">
            <img src="${item.imageUrl}" alt="">
        </div>
        
        <div class="product-card">
            <h3 class="product-card__title">${item.title}</h3>
            <div class="product-card__size">
                <span>${item.productGridSizeType}</span>
                <span class="card-dott"></span>
                <span>${item.productGridBarsText}</span>
            </div>
        </div>
        <div class="card-icon">
            <div class="plus-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_38_22502)">
                    <path d="M8 1.3335V14.6668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.6666 8H1.33325" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_38_22502">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="cross-icon" js-bundle-product-cross-icon>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_38_27706)">
                    <path d="M12.7141 3.28564L3.28602 12.7137" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.714 12.7137L3.28589 3.28564" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_38_27706">
                    <rect width="16" height="16" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
        </div>
    </div>`
        )
      })
      this.updateStatus();
      this.updatePrice();
    }
  
    updatePrice() {
      let totalComparePrice = 0;
      this.products.forEach(product => {
        if(product.comparePrice) {
          totalComparePrice += product.comparePrice;
        }
      })
  
      let totalPrice = 0;
      this.products.forEach(product => {
        if(product.price) {
          totalPrice += product.price;
        }
      })
  
      // this.comparePriceWrappers.forEach(comparePriceWrapper => {
      //   comparePriceWrapper.innerHTML = `$${totalComparePrice / 100}`
      // })
  
      // this.priceWrappers.forEach(priceWrapper => {
      //   priceWrapper.innerHTML = `$${totalPrice / 100}`
      // })
    }
  
    updateStatus() {
  
  
      // if(this.products.length > 2) {
      //   this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.add('disabled');
      //  }
      //  else {
      //     this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.remove('disabled');
      //  }
      //  if(this.products.length > 3) {
      //   this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.add('disabled');
      //  }
      //  else {
      //     this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.remove('disabled');
      //  }
  
      const bundleTypeSelector = this.querySelector(this.bundleTypeSelector)
      const bundleTypeValue = parseInt(bundleTypeSelector.dataset.value)
      let activeBundleTypeSelector = this.querySelector(`${this.bundleTypeSelector}.active`)
      let activeBundleTypeSelectorValue = parseInt(activeBundleTypeSelector.dataset.value)
     // console.log('activeBundleTypeSelectorValue', activeBundleTypeSelectorValue);
      
      // if(activeBundleTypeSelectorValue < this.products.length) {
      //   if(this.products.length == 3) {
      //     if(!this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.contains('active')) {
      //       this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).click()
      //     }
      //   } else if(this.products.length > 3) {
      //     if(!this.querySelector(`${this.bundleTypeSelector}[data-value="4"]`).classList.contains('active')) {
      //       this.querySelector(`${this.bundleTypeSelector}[data-value="4"]`).click()
      //     }
      //   }
      // }
        
  
        if(this.products.length == 2) {
          if(!this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.contains('active')) {
            this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).click()
          }
        }
        else if(this.products.length == 3) {
          if(!this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.contains('active')) {
            this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).click()
          }
        }
        else if(this.products.length == 4) {
          if(!this.querySelector(`${this.bundleTypeSelector}[data-value="4"]`).classList.contains('active')) {
            this.querySelector(`${this.bundleTypeSelector}[data-value="4"]`).click()
          }
        }
      
  
     
    
  
      if(this.products.length == 2) {
        this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.remove('disabled')
        this.querySelector(`${this.bundleTypeSelector}[data-value="4"]`).classList.remove('disabled')
      }  else if(this.products.length == 3) {
        this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.add('disabled')
      } else if(this.products.length > 3) {
        this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.add('disabled')
        this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.add('disabled')
      } else {
        this.querySelector(`${this.bundleTypeSelector}[data-value="2"]`).classList.remove('disabled')
        this.querySelector(`${this.bundleTypeSelector}[data-value="3"]`).classList.remove('disabled')
      }
  
       
      
  
  
  
      // this.querySelectorAll(this.incrementBtnSelector).forEach(item => {
      //   item.classList.remove('disabled')
      // })
      this.querySelectorAll(this.selectProductBtnSelector).forEach(item => {
        item.classList.remove('disabled')
      })
      this.querySelectorAll('[js-modal-open-icon]').forEach(item => {
        item.classList.remove('disabled')
      })
  
  
      this.selectionCountWrappers.classList.remove('hidden');
     
      this.addToCartBtns.forEach(addToCartBtn => {
        addToCartBtn.classList.add('hidden');
      })
    
      this.bundleCompletedMsgs.forEach(bundleCompletedMsg => {
        bundleCompletedMsg.classList.add('hidden');
      })
      this.bundleProcessMsgs.forEach(bundleProcessMsg => {
        bundleProcessMsg.classList.remove('hidden');
      })
      this.selectionCounts.forEach((selectionCount) => {
        selectionCount.innerHTML = `${this.products.length}/${this.totalBox}`;
      })
  
      this.selectionRemainingCounts.forEach((selectionRemainingCount) => {
        selectionRemainingCount.innerHTML = this.totalBox - this.products.length;
      })
  
      this.querySelectorAll(this.productTitleSelector).forEach(item => {
        item.classList.remove('disabled')
      })
      this.querySelectorAll(this.cardMediaSelector).forEach(item => {
        item.classList.remove('disabled')
      })
      
  
      if(this.products.length === 0) {
        this.bundleProcessMsgs.forEach(bundleProcessMsg => {
          bundleProcessMsg.classList.add('hidden');
        })
      }
  
      
      activeBundleTypeSelector = this.querySelector(`${this.bundleTypeSelector}.active`)
      activeBundleTypeSelectorValue = parseInt(activeBundleTypeSelector.dataset.value)
      //console.log('updateStatus', activeBundleTypeSelectorValue);
      if(this.products.length > 1 || this.products.length == activeBundleTypeSelectorValue) {
       // console.log('SHOW');
        this.addToCartBtns.forEach(addToCartBtn => {
          addToCartBtn.classList.remove('hidden');
        })
        this.selectionCountWrappers.classList.add('hidden');
      }
      /*
  
      if(this.products.length === this.totalBox) {
        this.querySelectorAll(this.incrementBtnSelector).forEach(item => {
          item.classList.add('disabled')
        })
        this.querySelectorAll(this.selectProductBtnSelector).forEach(item => {
          item.classList.add('disabled')
        })
        this.querySelectorAll('[js-modal-open-icon]').forEach(item => {
          item.classList.add('disabled')
        })
        this.addToCartBtns.forEach(addToCartBtn => {
          addToCartBtn.classList.remove('hidden');
        })
        this.selectionCountWrappers.classList.add('hidden');
       
        this.bundleCompletedMsgs.forEach(bundleCompletedMsg => {
          bundleCompletedMsg.classList.remove('hidden');
        })
  
  
        this.bundleProcessMsgs.forEach(bundleProcessMsg => {
          bundleProcessMsg.classList.add('hidden');
        })
  
        this.querySelectorAll(this.productTitleSelector).forEach(item => {
          item.classList.add('disabled')
        })
        this.querySelectorAll(this.cardMediaSelector).forEach(item => {
          item.classList.add('disabled')
        })
      }*/
    }
  
    async addToCart(products) {
      const requestBody = {
        items: products
      }
  
      const cartDrawer = document.querySelector('cart-drawer');
      requestBody.sections = cartDrawer.getSectionsToRender().map((section) => section.id);
  
      try {
        const resp = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await resp.json();
  
        this.addToCartBtns.forEach(addToCartBtn => {
          addToCartBtn.classList.remove('loading');
          // addToCartBtn.querySelector('.loading__spinner')?.classList.add('hidden');
        })
  
        cartDrawer.renderContents(data);
        document.querySelector('cart-drawer').open();
  
        this.resetBundleSelectBox()
        
      } catch(err){
        console.error({ err })
      }
      
    }
  
    fetchCollection(url) {
      const url_ = location.origin + url + '?view=bundle&default=true'
      fetch(url_)
      .then((response) => response.text())
      .then((text_) => {
        try {
          const html_ = new DOMParser().parseFromString(text_, 'text/html')
          const productGrid = html_.querySelector('.product-grid')
          document.querySelector('.product-grid').replaceWith(productGrid)
          this.updateStatus()
          this.updatePrice()
  
          this.querySelectorAll('.bundle-grid [js-product-wrapper]').forEach((gridItem) => {
            this.products.forEach(selectedProduct => {
              const gridItemId =Number(gridItem.dataset.productId)
              const selectedProductId= Number(selectedProduct.id)
              const gridItemCTABtn =gridItem.querySelector('[js-select-product-btn]')
              const gridItemQuantity = gridItem.querySelector(this.quantityInputSelector)
  
              const allSameItems = this.products.filter(prods => prods.id == gridItemId)              
  
              if(gridItemId === selectedProductId) {
                gridItemQuantity.value = Number(allSameItems.length)
  
                if(!gridItem.classList.contains('selected')) {
                  gridItem.classList.add('selected')
                }
                if(!gridItemCTABtn.classList.contains('disabled')) {
                  gridItemCTABtn.classList.add('disabled')
                }
              }
            })
          })
          
          // this.products = []
          // this.resetBundleSelectBox()
          // this.priceHandler()
  
        }catch(err) {
  
        }
      }).then(() => {
          document.dispatchEvent(new CustomEvent('bundlePopupATB:init'))
          document.dispatchEvent(new CustomEvent('bundlePopupFunctions:init'))
      })
    }
  
    priceHandler() {
      let totalPrice = 0
      let totalComparePrice = 0
      this.products.forEach(item => {
        totalPrice += item.price
        totalComparePrice += item.comparePrice
      })
      totalPrice = Number(totalPrice).toFixed(2)
      totalComparePrice = totalComparePrice
  
      const bundlePriceWrapper = this.querySelectorAll('[js-bunlde-price-wrapper]')
  
      const sellingPlanDiscount = this.querySelector('[js-selling-plan-discount]')
      const discountPrice = sellingPlanDiscount.getAttribute('data-percent')
  
     
      let percentageOff = 0;
      if(this.products.length == 2) {
        percentageOff = 10;
      }
      else if(this.products.length == 3) {
         percentageOff = 20;
      }
      else if(this.products.length >= 4) {
         percentageOff = 30;
      }
      
     
      
     
      
      if(sellingPlanDiscount && discountPrice) {
        const percent = Number(discountPrice)
       // totalPrice = totalPrice - (totalPrice * percent)
        percentageOff = percentageOff + percent;
        
      }
   
      if(percentageOff > 0) {
         totalComparePrice = totalPrice;
         totalPrice = ((100-percentageOff)*totalPrice)/100;
      }
      
      totalPrice = Number(totalPrice).toFixed(2);
      totalComparePrice = Number(totalComparePrice).toFixed(2);
     
       
  
      bundlePriceWrapper.forEach(price => {
        price.querySelector(this.totalRegularPrice).innerText = this.storeCurrency + totalPrice
        if(totalComparePrice > 0)
        {
          price.querySelector(this.totalComparePrice).innerText = this.storeCurrency + totalComparePrice
        }
      })
  
      this.addToCartBtns.forEach(atcBtn => {
        atcBtn.querySelector(this.totalRegularPrice).innerText = this.storeCurrency + totalPrice
        if(totalComparePrice > 0)
        {
          atcBtn.querySelector(this.totalComparePrice).innerText = this.storeCurrency + totalComparePrice
        }
      })
    }
    resetBundleSelectBox() {
      const bundleSelector = this.querySelectorAll(this.bundleTypeSelector)
      this.createBox(parseInt(bundleSelector[0].dataset.value))
      setTimeout(() => {
          bundleSelector[0].click()
      }, 100);
      this.totalBox = parseInt(bundleSelector[0].dataset.value);
  
      if(this.querySelector(this.subscriptionCheckbox).classList.contains('checked')) {
        this.querySelector(this.subscriptionCheckbox).classList.remove('checked')
        this.querySelector(this.subscriptionCheckbox).setAttribute('checked', 'false')
      }
  
      const sellingPlanDiscount = this.querySelector('[js-selling-plan-discount]')
      sellingPlanDiscount.setAttribute('data-percent', '')
      this.products = []
    }
  
  
  }
  
  
  customElements.define('bundle-builder', BundleBuilder)
  
  
  function bundlePageStickyTitle() {
    const collectionSection = document.querySelector('.bundle-collection__grid-container');
    const stickyBoxTitle =  document.querySelector('.bundle-meta__title-wrapper');
    
      function offset(el) {
        var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
      }
      
      if(collectionSection) {
          window.addEventListener('scroll', e => {
              if(window.scrollY > offset(collectionSection).top) {
                  stickyBoxTitle.classList.add('bundle-box-hit-top')
              } else {
                  stickyBoxTitle.classList.remove('bundle-box-hit-top')
              }
          });
      }
  }
  
  bundlePageStickyTitle()