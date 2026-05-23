// products-data.js
// Fetches and renders products from Supabase

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized.');
        return;
    }

    const supabase = window.supabaseClient;
    const productGrid = document.getElementById('product-grid');
    const productCount = document.getElementById('product-count');
    const noResults = document.getElementById('no-results-msg'); // We'll add this to HTML

    // Fetch products from Supabase
    async function fetchProducts() {
        // Show loading state
        if (productGrid) {
            productGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">Loading products...</div>';
        }

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching products:', error);
            if (productGrid) {
                productGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #EF4444;">Error loading products. Please try again later.</div>';
            }
            return [];
        }

        return data || [];
    }

    // Render product cards
    function renderProducts(products) {
        if (!productGrid) return;
        
        productGrid.innerHTML = '';
        
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-results" style="display:block;"><div class="no-results-icon">📦</div><div class="no-results-text">No products found.</div></div>';
            if (productCount) productCount.textContent = '0';
            return;
        }

        if (productCount) productCount.textContent = products.length;

        products.forEach((product, index) => {
            // Determine badge HTML
            let badgeHtml = '';
            if (product.badge) {
                const badgeClass = `badge-${product.badge.toLowerCase()}`;
                const badgeText = product.badge.charAt(0).toUpperCase() + product.badge.slice(1);
                badgeHtml = `<span class="product-badge ${badgeClass}">${badgeText}</span>`;
            }

            // Determine pricing HTML
            let priceHtml = `₹${product.price}`;
            if (product.original_price) {
                priceHtml += ` <span class="orig-price">₹${product.original_price}</span>`;
            }

            // Build article element
            const article = document.createElement('article');
            article.className = `product-card reveal visible`;
            article.style.transitionDelay = `${(index % 4) * 0.1}s`;
            
            // Set data attributes for filtering/search
            article.setAttribute('data-category', product.category || '');
            article.setAttribute('data-name', (product.name || '').toLowerCase());
            article.setAttribute('data-brand', product.brand || '');
            article.setAttribute('data-fullname', product.fullname || '');
            article.setAttribute('data-price', `₹${product.price}`);
            article.setAttribute('data-desc', product.description || '');
            article.setAttribute('data-features', product.features || '');
            article.setAttribute('data-img', product.image_url || 'assets/placeholder.png');

            article.innerHTML = `
                <div class="product-img-wrap">
                    <img src="${product.image_url || 'assets/placeholder.png'}" alt="${product.fullname}" class="product-img" loading="lazy" onerror="this.src='assets/jmd_logo.png'" />
                    ${badgeHtml}
                    <span class="product-category-tag">${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'Product'}</span>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand || 'JMD Auto Care'}</div>
                    <div class="product-name">${product.fullname || product.name}</div>
                    <p class="product-desc-short">${product.description ? product.description.substring(0, 100) + '...' : ''}</p>
                    <div class="product-footer">
                        <div class="product-price">${priceHtml}</div>
                        <button class="product-enquire-btn" onclick="openModal(this)" aria-label="Quick view ${product.fullname}">Quick View</button>
                    </div>
                </div>
            `;
            
            productGrid.appendChild(article);
        });

        // Re-attach filter logic if it exists in script.js
        if (typeof window.initializeFilters === 'function') {
            window.initializeFilters();
        }
    }

    // Load and render
    if (productGrid) {
        const products = await fetchProducts();
        window.allProductsData = products; // Store globally for search/filtering
        renderProducts(products);
    }
});

// Update the filter logic globally to work with dynamically loaded items
window.initializeFilters = function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('product-search');
    const productCards = document.querySelectorAll('.product-card');
    const noResults = document.querySelector('.no-results');
    const countSpan = document.getElementById('product-count');

    function filterProducts() {
        if (!productCards.length) return;
        
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const searchTerm = (searchInput?.value || '').toLowerCase();
        
        let visibleCount = 0;

        productCards.forEach(card => {
            const category = card.dataset.category || '';
            const name = (card.dataset.name || '').toLowerCase();
            const brand = (card.dataset.brand || '').toLowerCase();

            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = name.includes(searchTerm) || brand.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                card.style.display = 'flex';
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; // trigger reflow
                card.style.animation = null;
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countSpan) countSpan.textContent = visibleCount;
        
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            // Remove existing listeners by replacing clone
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                newBtn.classList.add('active');
                filterProducts();
            });
        });
    }

    if (searchInput) {
        const newSearch = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearch, searchInput);
        newSearch.addEventListener('input', filterProducts);
    }
};
