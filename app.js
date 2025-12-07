// Global variable to store domain data
let domain1Data = null;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadDomain1Data();
});

// Load domain1.json data
async function loadDomain1Data() {
    try {
        const response = await fetch('domain1.json');
        if (!response.ok) {
            throw new Error('Failed to load domain1.json');
        }
        domain1Data = await response.json();
        renderDomain1Content();
    } catch (error) {
        console.error('Error loading domain data:', error);
        showError('Failed to load Domain 1 content. Make sure domain1.json is in the same directory.');
    }
}

// Render Domain 1 content
function renderDomain1Content() {
    if (!domain1Data) return;
    
    renderConcepts(domain1Data.concepts);
    renderComparisons(domain1Data.comparisons);
}

// Render concepts sections
function renderConcepts(concepts) {
    const container = document.getElementById('concepts-content');
    container.innerHTML = '';
    
    concepts.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        const header = document.createElement('div');
        header.className = 'section-header';
        header.onclick = () => toggleSection(index);
        header.innerHTML = `
            <h3>${section.title}</h3>
            <span class="chevron" id="chevron-${index}">▶</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'section-content';
        content.id = `section-${index}`;
        
        section.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'concept-item';
            itemDiv.innerHTML = `
                <h4>${item.term}</h4>
                <p>${item.def}</p>
            `;
            content.appendChild(itemDiv);
        });
        
        sectionDiv.appendChild(header);
        sectionDiv.appendChild(content);
        container.appendChild(sectionDiv);
    });
}

// Render comparisons sections
function renderComparisons(comparisons) {
    const container = document.getElementById('comparisons-content');
    container.innerHTML = '';
    
    comparisons.forEach((section, index) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';
        
        const header = document.createElement('div');
        header.className = 'section-header';
        header.onclick = () => toggleSection(`comp-${index}`);
        header.innerHTML = `
            <h3>${section.title}</h3>
            <span class="chevron" id="chevron-comp-${index}">▶</span>
        `;
        
        const content = document.createElement('div');
        content.className = 'section-content';
        content.id = `section-comp-${index}`;
        
        section.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'comparison-item';
            itemDiv.innerHTML = `
                <h4>${item.aspect}</h4>
                <p>${item.description}</p>
            `;
            content.appendChild(itemDiv);
        });
        
        sectionDiv.appendChild(header);
        sectionDiv.appendChild(content);
        container.appendChild(sectionDiv);
    });
}

// Toggle section expand/collapse
function toggleSection(id) {
    const content = document.getElementById(`section-${id}`);
    const chevron = document.getElementById(`chevron-${id}`);
    
    if (!content || !chevron) return;
    
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        chevron.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        chevron.classList.add('rotated');
    }
}

// Switch between domains (1-5)
function switchDomain(domainNum) {
    // Hide all domains
    for (let i = 1; i <= 5; i++) {
        const domainEl = document.getElementById(`domain-${i}`);
        if (domainEl) {
            domainEl.style.display = 'none';
        }
    }
    
    // Show selected domain
    const selectedDomain = document.getElementById(`domain-${domainNum}`);
    if (selectedDomain) {
        selectedDomain.style.display = 'block';
    }
    
    // Update tab styling
    const tabs = document.querySelectorAll('.domain-tab');
    tabs.forEach((tab, index) => {
        if (index === domainNum - 1) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// Switch between content tabs (concepts/comparisons)
function switchContentTab(tabName) {
    // Hide all content tabs
    const conceptsContent = document.getElementById('concepts-content');
    const comparisonsContent = document.getElementById('comparisons-content');
    
    if (conceptsContent) conceptsContent.style.display = 'none';
    if (comparisonsContent) comparisonsContent.style.display = 'none';
    
    // Show selected content
    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
    
    // Update tab styling
    const tabs = document.querySelectorAll('.content-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase().includes(tabName)) {
            tab.classList.add('active');
        }
    });
}

// Show error message
function showError(message) {
    const conceptsContent = document.getElementById('concepts-content');
    if (conceptsContent) {
        conceptsContent.innerHTML = `
            <div class="error">
                <p><strong>⚠️ Error:</strong> ${message}</p>
            </div>
        `;
    }
}

// Expand all sections (utility function)
function expandAllSections() {
    const allSections = document.querySelectorAll('.section-content');
    const allChevrons = document.querySelectorAll('.chevron');
    
    allSections.forEach(section => {
        section.classList.add('expanded');
    });
    
    allChevrons.forEach(chevron => {
        chevron.classList.add('rotated');
    });
}

// Collapse all sections (utility function)
function collapseAllSections() {
    const allSections = document.querySelectorAll('.section-content');
    const allChevrons = document.querySelectorAll('.chevron');
    
    allSections.forEach(section => {
        section.classList.remove('expanded');
    });
    
    allChevrons.forEach(chevron => {
        chevron.classList.remove('rotated');
    });
}

// Search functionality (can be added later)
function searchContent(query) {
    if (!query || !domain1Data) return;
    
    query = query.toLowerCase();
    const allItems = [
        ...domain1Data.concepts.flatMap(c => c.items),
        ...domain1Data.comparisons.flatMap(c => c.items)
    ];
    
    const results = allItems.filter(item => {
        const term = item.term || item.aspect || '';
        const def = item.def || item.description || '';
        return term.toLowerCase().includes(query) || def.toLowerCase().includes(query);
    });
    
    return results;
}