// Create and inject the light mode toggle
function createToggle() {
  const toggleContainer = document.createElement('div');
  toggleContainer.id = 'light-mode-toggle-container';
  
  const toggle = document.createElement('button');
  toggle.id = 'light-mode-toggle';
  toggle.setAttribute('aria-label', 'Toggle light mode');
  
  const sunIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;
  
  const moonIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;
  
  toggle.innerHTML = moonIcon;
  toggleContainer.appendChild(toggle);
  document.body.appendChild(toggleContainer);
  
  return toggle;
}

// Load saved theme preference
function loadTheme() {
  chrome.storage.sync.get(['lightMode'], function(result) {
    if (result.lightMode) {
      document.body.classList.add('light-mode');
      updateToggleIcon(true);
    }
  });
}

// Update toggle icon based on current mode
function updateToggleIcon(isLightMode) {
  const toggle = document.getElementById('light-mode-toggle');
  if (!toggle) return;
  
  const sunIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `;
  
  const moonIcon = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `;
  
  toggle.innerHTML = isLightMode ? sunIcon : moonIcon;
}

// Toggle light mode
function toggleLightMode() {
  const body = document.body;
  const isLightMode = body.classList.toggle('light-mode');
  
  // Save preference
  chrome.storage.sync.set({ lightMode: isLightMode });
  
  // Update icon
  updateToggleIcon(isLightMode);
}

// Inject background image URL
function injectBackgroundImage() {
  const imageUrl = chrome.runtime.getURL('Images/brooklyncollegecampus.jpg');
  const style = document.createElement('style');
  style.textContent = `
    body.light-mode .hero-header {
      background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${imageUrl}') !important;
      background-size: cover !important;
      background-position: center top !important;
      background-repeat: no-repeat !important;
      padding: 30px 20px !important;
      margin-top: -80px !important;
      padding-top: 110px !important;
    }
    
    body.light-mode .hero-header .row {
      position: relative !important;
      z-index: 1 !important;
    }
  `;
  document.head.appendChild(style);
}

// Restructure Dashboard to match Status Details exact layout
function restructureDashboard() {
  // Only run on AutoVerificationDashboard page - check URL more carefully
  if (!window.location.href.includes('AutoVerificationDashboard')) {
    console.log('Not on Dashboard page, skipping restructure');
    return;
  }
  
  // Double check by looking for the dashboard-specific button
  if (!document.getElementById('AutoDashFilterBtn')) {
    console.log('Dashboard button not found, skipping restructure');
    return;
  }

  // Wait for DOM to be fully loaded
  setTimeout(() => {
    const filterContainer = document.getElementById('filterContainer');
    const additionalFilterContainer = document.getElementById('additionalFilterContainer');
    
    // Dashboard page MUST have additionalFilterContainer
    if (!filterContainer || !additionalFilterContainer) {
      console.log('Filter containers not found or this is Status Details page');
      return;
    }

    // Get all the form elements
    const schoolFilter = document.getElementById('schoolFilter');
    const divisionFilter = document.getElementById('divisionFilter');
    const academicYearFilter = document.getElementById('academicYearFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const serviceTypeFilter = document.getElementById('serviceTypeFilter');
    const studentTypeFilter = document.getElementById('studentTypeFilter');
    const isirTypeFilter = document.getElementById('isirTypeFilter');
    const verGroupFilter = document.getElementById('verGroupFilter');
    const includeAllMonths = document.getElementById('includeAllMonths');
    const includeInactiveSchool = document.getElementById('includeInactiveSchool');
    const includeInactiveServiceType = document.getElementById('includeInactiveServiceType');
    const filterButton = document.getElementById('AutoDashFilterBtn');

    if (!schoolFilter) {
      console.log('School filter not found');
      return;
    }

    // Get the parent form
    const form = filterContainer.closest('form');
    if (!form) {
      console.log('Form not found');
      return;
    }

    // Clear the form content
    while (form.firstChild) {
      form.removeChild(form.firstChild);
    }

    // Create wrapper div centered - no Bootstrap classes, pure flexbox
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '2%';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.width = '100%';
    wrapper.style.padding = '0';
    wrapper.style.boxSizing = 'border-box';

    // ===== ROW 1: Verification Type and Verification Group (side by side, centered) =====
    const row1 = document.createElement('div');
    // No Bootstrap classes - pure flexbox to avoid .row negative margins
    row1.style.display = 'flex';
    row1.style.justifyContent = 'center';
    row1.style.width = '560px';
    row1.style.maxWidth = '90vw';
    row1.style.gap = '20px';
    row1.style.marginBottom = '0';
    
    const verTypeCol = document.createElement('div');
    verTypeCol.style.flex = '1';
    if (isirTypeFilter) {
      const sel = isirTypeFilter.cloneNode(true);
      sel.style.width = '100%';
      verTypeCol.appendChild(sel);
    }
    
    const verGroupCol = document.createElement('div');
    verGroupCol.style.flex = '1';
    if (verGroupFilter) {
      const sel = verGroupFilter.cloneNode(true);
      sel.style.width = '100%';
      verGroupCol.appendChild(sel);
    }
    
    row1.appendChild(verTypeCol);
    row1.appendChild(verGroupCol);
    
    wrapper.appendChild(row1);

    // ===== MAIN CONTAINER: All dropdowns stacked =====
    const mainContainer = document.createElement('div');
    // No Bootstrap classes - pure flexbox to avoid .row negative margins and col padding
    mainContainer.id = 'filterContainer';
    mainContainer.style.opacity = '1';
    mainContainer.style.display = 'flex';
    mainContainer.style.flexDirection = 'column';
    mainContainer.style.alignItems = 'center';
    mainContainer.style.width = '100%';

    const singleCol = document.createElement('div');
    singleCol.style.width = '560px';
    singleCol.style.maxWidth = '90vw';

    // Add all dropdowns stacked vertically
    const stackFilters = [schoolFilter, divisionFilter, academicYearFilter, departmentFilter, serviceTypeFilter, studentTypeFilter];
    stackFilters.forEach(f => {
      if (f) {
        const sel = f.cloneNode(true);
        sel.style.width = '100%';
        sel.style.display = 'block';
        sel.style.marginBottom = '10px';
        sel.style.boxSizing = 'border-box';
        singleCol.appendChild(sel);
      }
    });

    mainContainer.appendChild(singleCol);

    // ===== CHECKBOXES: Horizontal row matching Status Details =====
    const checkboxRow = document.createElement('div');
    checkboxRow.style.marginTop = '20px';
    checkboxRow.style.width = '560px';
    checkboxRow.style.maxWidth = '90vw';
    checkboxRow.style.display = 'flex';
    checkboxRow.style.flexDirection = 'row';
    checkboxRow.style.justifyContent = 'center';
    checkboxRow.style.alignItems = 'center';
    checkboxRow.style.gap = '20px';

    // Inactive Schools
    if (includeInactiveSchool) {
      const cb1 = includeInactiveSchool.cloneNode(true);
      const hidden1 = includeInactiveSchool.nextElementSibling;
      checkboxRow.appendChild(cb1);
      if (hidden1 && hidden1.type === 'hidden') {
        checkboxRow.appendChild(hidden1.cloneNode(true));
      }
      const label1 = document.createElement('label');
      label1.className = 'control-label';
      label1.setAttribute('for', 'Inactive_Schools');
      label1.style.marginBottom = '-2%';
      label1.textContent = 'Inactive Schools';
      checkboxRow.appendChild(label1);
    }

    // Inactive Service Types
    if (includeInactiveServiceType) {
      const cb2 = includeInactiveServiceType.cloneNode(true);
      const hidden2 = includeInactiveServiceType.nextElementSibling;
      checkboxRow.appendChild(cb2);
      if (hidden2 && hidden2.type === 'hidden') {
        checkboxRow.appendChild(hidden2.cloneNode(true));
      }
      const label2 = document.createElement('label');
      label2.className = 'control-label';
      label2.setAttribute('for', 'Inactive_Service_Types');
      label2.style.marginBottom = '-2%';
      label2.textContent = 'Inactive Service Types';
      checkboxRow.appendChild(label2);
    }

    // All Students
    if (includeAllMonths) {
      const cb3 = includeAllMonths.cloneNode(true);
      const hidden3 = includeAllMonths.nextElementSibling;
      checkboxRow.appendChild(cb3);
      if (hidden3 && hidden3.type === 'hidden') {
        checkboxRow.appendChild(hidden3.cloneNode(true));
      }
      const label3 = document.createElement('label');
      label3.className = 'control-label';
      label3.setAttribute('for', 'All_Students');
      label3.style.marginBottom = '-2%';
      label3.textContent = 'All Students';
      checkboxRow.appendChild(label3);
    }

    mainContainer.appendChild(checkboxRow);

    // ===== FILTER BUTTON: Centered at bottom =====
    const buttonRow = document.createElement('div');
    buttonRow.style.marginTop = '20px';
    buttonRow.style.width = '560px';
    buttonRow.style.maxWidth = '90vw';
    buttonRow.style.textAlign = 'center';
    
    if (filterButton) {
      const btn = filterButton.cloneNode(true);
      btn.id = 'AutoDashFilterBtn';
      btn.type = 'submit';
      btn.className = 'btn btn-success';
      btn.style.width = '20%';
      btn.style.marginTop = '';
      buttonRow.appendChild(btn);
    }

    mainContainer.appendChild(buttonRow);
    wrapper.appendChild(mainContainer);

    // ===== ADD HIDDEN INPUTS =====
    const hiddenInputs = [
      { id: 'CurrentlyDisplayedSchoolId', name: 'CurrentlyDisplayedSchoolId', value: '0' },
      { id: 'RefreshServiceTypeList', name: 'RefreshServiceTypeList', value: 'True' },
      { id: 'IsManual', name: 'IsManual', value: 'False' },
      { id: 'isSchoolUser', name: 'isSchoolUser', value: 'False' }
    ];

    hiddenInputs.forEach(input => {
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.id = input.id;
      hidden.name = input.name;
      hidden.value = input.value;
      form.appendChild(hidden);
    });

    // Add the wrapper to form
    form.appendChild(wrapper);

    console.log('✓ Dashboard restructured to match Status Details layout');
  }, 1000); // Wait 1 second for page to fully load
}

// Disable dropdowns that have only one option
function disableSingleOptionDropdowns() {
  // Find all select elements in the filter container
  const selects = document.querySelectorAll('#filterContainer select, .hero-header select, #additionalFilterContainer select');
  
  selects.forEach(select => {
    // Get all options
    const options = Array.from(select.options);
    
    // Skip if no options at all
    if (options.length === 0) {
      select.disabled = true;
      select.classList.add('single-option-disabled');
      return;
    }
    
    // If there's only 1 option total, disable it
    if (options.length === 1) {
      select.disabled = true;
      select.classList.add('single-option-disabled');
      return;
    }
    
    // Count real selectable options (not placeholders)
    const realOptions = options.filter(option => {
      // An option is a placeholder if it has empty value
      if (option.value === '') {
        return false;
      }
      
      // Check if the text exactly matches common placeholder labels (exact match only)
      const placeholderLabels = [
        'School',
        'Division', 
        'Academic Year',
        'Academic School Year',
        'Department',
        'Service Type',
        'Student Type',
        'Verification Type',
        'Verification Group',
        'Service Type Status',
        'Created',
        'Select'
      ];
      
      if (placeholderLabels.includes(option.text)) {
        return false;
      }
      
      // Check for "no option" messages
      const isNoOptionMessage = option.text.toLowerCase().includes('no ') || 
                                 option.text.toLowerCase().includes('none available');
      
      if (isNoOptionMessage) {
        return false;
      }
      
      // This is a real option
      return true;
    });
    
    // If there are 0 or 1 real options, disable the dropdown
    if (realOptions.length <= 1) {
      select.disabled = true;
      select.classList.add('single-option-disabled');
    } else {
      // Multiple real options exist, keep enabled
      select.disabled = false;
      select.classList.remove('single-option-disabled');
    }
  });
}

// Reorganize ISIR page into collapsible sections
function reorganizeIsirPage() {
  // Only run on ViewIsir page
  if (!window.location.href.includes('ViewIsir')) {
    return;
  }

  console.log('Reorganizing ISIR page...');

  setTimeout(() => {
    // Find all the content sections
    const allRows = document.querySelectorAll('.row.center.lightText');
    if (allRows.length === 0) {
      console.log('No content rows found');
      return;
    }

    // Create section navigation container
    const navContainer = document.createElement('div');
    navContainer.id = 'isir-section-nav';
    navContainer.innerHTML = `
      <button class="isir-nav-btn active" data-section="general">General Information</button>
      <button class="isir-nav-btn" data-section="student">Student Information</button>
      <button class="isir-nav-btn" data-section="spouse">Spouse Information</button>
      <button class="isir-nav-btn" data-section="parent">Parent Information</button>
      <button class="isir-nav-btn" data-section="parent-spouse">Parent Spouse/Partner</button>
      <button class="isir-nav-btn" data-section="transaction">Transaction Detail</button>
      <button class="isir-nav-btn" data-section="flags">SAI and Flags</button>
    `;

    // Insert navigation after the hero header
    const heroHeader = document.querySelector('.hero-header');
    if (heroHeader && heroHeader.nextElementSibling) {
      heroHeader.parentNode.insertBefore(navContainer, heroHeader.nextElementSibling);
    }

    // Wrap and tag each section
    allRows.forEach((row, index) => {
      const heading = row.querySelector('h2, h3');
      if (!heading) return;
      
      const headingText = heading.textContent.trim().toLowerCase();
      
      // Determine section category
      let sectionType = '';
      if (headingText.includes('general information')) {
        sectionType = 'general';
      } else if (headingText.includes('student') && !headingText.includes('spouse') && !headingText.includes('parent')) {
        sectionType = 'student';
      } else if (headingText.includes('spouse') && !headingText.includes('parent')) {
        sectionType = 'spouse';
      } else if (headingText.includes('parent spouse')) {
        sectionType = 'parent-spouse';
      } else if (headingText.includes('parent') && !headingText.includes('spouse')) {
        sectionType = 'parent';
      } else if (headingText.includes('fti') || headingText.includes('total income') || headingText.includes('matches')) {
        sectionType = 'transaction';
      } else if (headingText.includes('fps') || headingText.includes('correction') || headingText.includes('flags')) {
        sectionType = 'flags';
      }

      if (sectionType) {
        row.classList.add('isir-section');
        row.setAttribute('data-section-type', sectionType);
        
        // Hide all sections except general by default
        if (sectionType !== 'general') {
          row.style.display = 'none';
        }
      }
    });

    // Add click handlers to navigation buttons
    const navButtons = navContainer.querySelectorAll('.isir-nav-btn');
    navButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetSection = this.getAttribute('data-section');
        
        // Update active button
        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Show/hide sections
        const allSections = document.querySelectorAll('.isir-section');
        allSections.forEach(section => {
          const sectionType = section.getAttribute('data-section-type');
          if (sectionType === targetSection) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });

    console.log('ISIR page reorganized successfully!');
  }, 1000);
}

// Initialize
function init() {
  const toggle = createToggle();
  toggle.addEventListener('click', toggleLightMode);
  loadTheme();
  injectBackgroundImage();
  restructureDashboard();
  reorganizeIsirPage();
  
  // Disable single-option dropdowns after a delay to ensure DOM is ready
  setTimeout(() => {
    disableSingleOptionDropdowns();
  }, 1500);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}