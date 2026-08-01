document.addEventListener('DOMContentLoaded', () => {
  // Live AJAX Search
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');

  if (searchInput && searchResults) {
    let debounceTimer;

    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = searchInput.value.trim();

      if (query.length < 2) {
        searchResults.classList.remove('show');
        searchResults.innerHTML = '';
        return;
      }

      debounceTimer = setTimeout(() => {
        fetch(`/api/search/?q=${encodeURIComponent(query)}`)
          .then(res => res.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              let html = '';
              data.results.forEach(item => {
                html += `
                  <a href="${item.url}" class="search-item">
                    <span>${item.title}</span>
                    <span class="search-item-type">${item.type}</span>
                  </a>
                `;
              });
              searchResults.innerHTML = html;
              searchResults.classList.add('show');
            } else {
              searchResults.innerHTML = '<div class="search-item" style="color:#94a3b8;">No results found</div>';
              searchResults.classList.add('show');
            }
          })
          .catch(err => console.error('Search error:', err));
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('show');
      }
    });
  }

  // Mobile Menu Toggle Handler
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileToggleBtn && navLinksContainer) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksContainer.classList.toggle('mobile-active');
    });

    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        navLinksContainer.classList.remove('mobile-active');
      }
    });
  }

  // Upload Page Tab Handler
  const uploadTabs = document.querySelectorAll('.upload-tab');
  const uploadFormPanels = document.querySelectorAll('.upload-form-panel');

  if (uploadTabs.length > 0) {
    uploadTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');

        uploadTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        uploadFormPanels.forEach(panel => {
          if (panel.id === `form-panel-${targetTab}`) {
            panel.style.display = 'block';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });
  }

  // Video & Book Modal Viewer Functions
  window.openVideoModal = function(videoUrl, title) {
    const modal = document.getElementById('media-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-media-content');

    if (!modal) return;

    modalTitle.textContent = title;
    
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      let embedUrl = videoUrl;
      if (videoUrl.includes('watch?v=')) {
        embedUrl = videoUrl.replace('watch?v=', 'embed/');
      } else if (videoUrl.includes('youtu.be/')) {
        embedUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
      }
      modalContent.innerHTML = `
        <div class="video-responsive">
          <iframe src="${embedUrl}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else {
      modalContent.innerHTML = `
        <div class="video-responsive">
          <video controls autoplay src="${videoUrl}"></video>
        </div>
      `;
    }

    modal.classList.add('show');
  };

  window.closeMediaModal = function() {
    const modal = document.getElementById('media-modal');
    const modalContent = document.getElementById('modal-media-content');
    if (modal) {
      modal.classList.remove('show');
      if (modalContent) modalContent.innerHTML = '';
    }
  };
});
