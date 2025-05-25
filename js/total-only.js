// Make fixtureCount globally accessible
let fixtureCount = 1;

// Toggle custom fixture type input
window.toggleCustomFixtureType = function(index) {
    try {
        console.log('Toggling custom fixture type for fixture ' + index);
        const typeElement = document.getElementById('fixtureType' + index);
        const customTypeElement = document.getElementById('customFixtureType' + index);
        
        if (!typeElement || !customTypeElement) {
            console.error('Missing elements for fixture ' + index);
            return;
        }
        
        const fixtureType = typeElement.value;
        
        // Toggle custom fixture type input
        if (fixtureType === 'custom') {
            customTypeElement.style.display = 'block';
        } else {
            customTypeElement.style.display = 'none';
        }
        
        // Save form data after toggling
        saveFormData();
    } catch (error) {
        console.error('Error toggling custom fixture type for fixture ' + index + ':', error);
    }
};

// Update custom fixture type
window.updateCustomFixtureType = function(index) {
    try {
        console.log('Updating custom fixture type for fixture ' + index);
        const customTypeElement = document.getElementById('customFixtureType' + index);
        
        if (!customTypeElement) {
            console.error('Missing custom type element for fixture ' + index);
            return;
        }
        
        // Save form data after updating custom type
        saveFormData();
    } catch (error) {
        console.error('Error updating custom fixture type for fixture ' + index + ':', error);
    }
};

// Save form data to local storage
function saveFormData() {
    try {
        const formData = {
            homeName: document.getElementById('homeName').value,
            jobDate: document.getElementById('jobDate').value,
            notes: document.getElementById('notes').value,
            jobTotal: document.getElementById('jobTotal').value,
            fixtures: []
        };
        
        // Save fixture data
        for (let i = 1; i <= fixtureCount; i++) {
            const fixtureType = document.getElementById(`fixtureType${i}`);
            const customFixtureType = document.getElementById(`customFixtureType${i}`);
            const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`);
            
            if (fixtureType && fixtureQuantity) {
                const fixtureData = {
                    type: fixtureType.value,
                    quantity: fixtureQuantity.value
                };
                
                // Add custom fixture type if applicable
                if (fixtureType.value === 'custom' && customFixtureType) {
                    fixtureData.customType = customFixtureType.value;
                }
                
                formData.fixtures.push(fixtureData);
            }
        }
        
        localStorage.setItem('totalOnlyCalculatorData', JSON.stringify(formData));
        console.log('Form data saved to local storage');
    } catch (error) {
        console.error('Error saving form data to local storage:', error);
    }
}

// Load form data from local storage
function loadFormData() {
    try {
        const savedData = localStorage.getItem('totalOnlyCalculatorData');
        if (!savedData) {
            console.log('No saved data found in local storage');
            return false;
        }
        
        const formData = JSON.parse(savedData);
        console.log('Loading saved data from local storage:', formData);
        
        // Set form values
        document.getElementById('homeName').value = formData.homeName || '';
        
        if (formData.jobDate) {
            document.getElementById('jobDate').value = formData.jobDate;
        } else {
            // Set current date if no saved date
            document.getElementById('jobDate').valueAsDate = new Date();
        }
        
        document.getElementById('notes').value = formData.notes || '';
        document.getElementById('jobTotal').value = formData.jobTotal || '';
        
        // Load fixtures
        if (formData.fixtures && formData.fixtures.length > 0) {
            // Set first fixture
            if (formData.fixtures[0]) {
                document.getElementById('fixtureType1').value = formData.fixtures[0].type || '';
                
                // Handle custom fixture type
                if (formData.fixtures[0].type === 'custom') {
                    const customTypeElement = document.getElementById('customFixtureType1');
                    if (customTypeElement) {
                        customTypeElement.style.display = 'block';
                        customTypeElement.value = formData.fixtures[0].customType || '';
                    }
                }
                
                document.getElementById('fixtureQuantity1').value = formData.fixtures[0].quantity || '1';
            }
            
            // Add additional fixtures
            for (let i = 1; i < formData.fixtures.length; i++) {
                addNewFixtureItem();
                document.getElementById(`fixtureType${i+1}`).value = formData.fixtures[i].type || '';
                
                // Handle custom fixture type
                if (formData.fixtures[i].type === 'custom') {
                    const customTypeElement = document.getElementById(`customFixtureType${i+1}`);
                    if (customTypeElement) {
                        customTypeElement.style.display = 'block';
                        customTypeElement.value = formData.fixtures[i].customType || '';
                    }
                }
                
                document.getElementById(`fixtureQuantity${i+1}`).value = formData.fixtures[i].quantity || '1';
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error loading form data from local storage:', error);
        return false;
    }
}

// Clear all form data
function clearAllData() {
    try {
        // Clear local storage
        localStorage.removeItem('totalOnlyCalculatorData');
        
        // Reset form
        document.getElementById('totalOnlyForm').reset();
        
        // Set current date
        document.getElementById('jobDate').valueAsDate = new Date();
        
        // Remove additional fixtures
        const fixtureItems = document.getElementById('fixtureItems');
        while (fixtureCount > 1) {
            const lastItem = document.getElementById('fixtureItem' + fixtureCount);
            if (lastItem) {
                fixtureItems.removeChild(lastItem);
                fixtureCount--;
            }
        }
        
        // Reset first fixture
        document.getElementById('fixtureType1').value = '';
        document.getElementById('fixtureQuantity1').value = '1';
        document.getElementById('jobTotal').value = '';
        
        console.log('All form data cleared');
    } catch (error) {
        console.error('Error clearing form data:', error);
    }
}

// Add event listeners to form inputs to save data on change
function addSaveDataListeners() {
    const formInputs = document.querySelectorAll('#totalOnlyForm input, #totalOnlyForm select, #totalOnlyForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', saveFormData);
    });
}

// Add a new fixture item (simplified version without rates and amounts)
function addNewFixtureItem(e) {
    if (e) e.preventDefault();
    console.log('Adding new fixture item (Total Only)');
    
    try {
        // Get the container
        const fixtureItems = document.getElementById('fixtureItems');
        if (!fixtureItems) {
            console.error('Fixture items container not found');
            return false;
        }
        
        // Increment fixture count
        fixtureCount++;
        console.log('New fixture count:', fixtureCount);
        
        // Create the new item container
        const newItem = document.createElement('div');
        newItem.className = 'fixture-item';
        newItem.id = 'fixtureItem' + fixtureCount;
        
        // Set the HTML content
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group item-type">
                    <label for="fixtureType${fixtureCount}">Fixture Type:</label>
                    <select id="fixtureType${fixtureCount}" name="fixtureType${fixtureCount}" required onchange="toggleCustomFixtureType(${fixtureCount})">
                        <option value="">Select Type</option>
                        <option value="Faucets">Faucets</option>
                        <option value="Sinks">Sinks</option>
                        <option value="Toilets">Toilets</option>
                        <option value="Bathtubs">Bathtubs</option>
                        <option value="Showers">Showers</option>
                        <option value="Water Heaters">Water Heaters</option>
                        <option value="Hose Bibs">Hose Bibs</option>
                        <option value="Washing Machine Hookups">Washing Machine Hookups</option>
                        <option value="Dishwasher and Ice Maker Connections">Dishwasher and Ice Maker Connections</option>
                        <option value="custom">Custom...</option>
                    </select>
                    <input type="text" id="customFixtureType${fixtureCount}" name="customFixtureType${fixtureCount}" placeholder="Enter custom fixture type" style="display: none; margin-top: 5px;" onchange="updateCustomFixtureType(${fixtureCount})" onkeyup="updateCustomFixtureType(${fixtureCount})">
                </div>
                
                <div class="form-group item-quantity">
                    <label for="fixtureQuantity${fixtureCount}">Quantity:</label>
                    <input type="number" id="fixtureQuantity${fixtureCount}" name="fixtureQuantity${fixtureCount}" min="1" step="1" value="1" required>
                </div>
            </div>
        `;
        
        // Append the new item to the container
        fixtureItems.appendChild(newItem);
        
        return false; // Prevent form submission
    } catch (error) {
        console.error('Error adding fixture item:', error);
        return false;
    }
}

// Remove the last fixture item
function removeLastFixtureItem(e) {
    if (e) e.preventDefault();
    console.log('Removing fixture item (Total Only)');
    
    try {
        const fixtureItems = document.getElementById('fixtureItems');
        if (!fixtureItems) {
            console.error('Fixture items container not found');
            return false;
        }
        
        if (fixtureCount > 1) {
            const lastItem = document.getElementById('fixtureItem' + fixtureCount);
            if (lastItem) {
                fixtureItems.removeChild(lastItem);
                fixtureCount--;
                console.log('Fixture removed, new count:', fixtureCount);
            }
        }
        
        return false; // Prevent form submission
    } catch (error) {
        console.error('Error removing fixture item:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Prevent mouse wheel from changing number input values
    document.addEventListener('wheel', function(event) {
        if (document.activeElement.type === 'number') {
            event.preventDefault();
        }
    }, { passive: false });

    // Initialize variables
    const fixtureItems = document.getElementById('fixtureItems');
    const addFixtureBtn = document.getElementById('addFixture');
    const removeFixtureBtn = document.getElementById('removeFixture');
    const clearAllDataBtn = document.getElementById('clearAllData');
    const fillSampleDataBtn = document.getElementById('fillSampleData');
    const previewJobValueBtn = document.getElementById('previewJobValue');
    const editJobValueBtn = document.getElementById('editJobValue');
    const generatePDFFromPreviewBtn = document.getElementById('generatePDFFromPreview');
    const jobValuePreviewSection = document.getElementById('jobValuePreviewSection');
    const jobValuePreviewContainer = document.getElementById('jobValuePreview');
    const generatePDFBtn = document.getElementById('generatePDF');
    const generateLinkBtn = document.getElementById('generateLink');
    const prefillLinkInput = document.getElementById('prefillLink');
    const copyLinkBtn = document.getElementById('copyLink');
    const linkSection = document.getElementById('linkSection');
    
    console.log('DOM loaded, buttons found:', {
        addFixtureBtn: !!addFixtureBtn,
        removeFixtureBtn: !!removeFixtureBtn,
        clearAllDataBtn: !!clearAllDataBtn,
        fixtureItems: !!fixtureItems
    });
    
    // Load saved data from local storage or set defaults
    if (!loadFormData()) {
        // Set current date for job date if no saved data
        const today = new Date();
        document.getElementById('jobDate').valueAsDate = today;
    }
    
    // Add save data listeners to form inputs
    addSaveDataListeners();
    
    // Add event listeners to buttons
    if (addFixtureBtn) {
        addFixtureBtn.addEventListener('click', function(e) {
            addNewFixtureItem(e);
            // Add save data listeners to new fixture inputs
            addSaveDataListeners();
            // Save form data after adding fixture
            saveFormData();
        });
        console.log('Add fixture button event listener added');
    }
    
    if (removeFixtureBtn) {
        removeFixtureBtn.addEventListener('click', function(e) {
            removeLastFixtureItem(e);
            // Save form data after removing fixture
            saveFormData();
        });
        console.log('Remove fixture button event listener added');
    }
    
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                clearAllData();
            }
        });
        console.log('Clear all data button event listener added');
    }
    
    // Fill sample data
    if (fillSampleDataBtn) {
        fillSampleDataBtn.addEventListener('click', function() {
            // Ask for confirmation if there's existing data
            if (document.getElementById('homeName').value || document.getElementById('fixtureType1').value) {
                if (!confirm('This will replace any existing data. Continue?')) {
                    return;
                }
            }
            
            // Create a new date object for today
            const today = new Date();
            
            document.getElementById('homeName').value = 'Johnson New Build';
            document.getElementById('jobDate').valueAsDate = today;
            
            // Set first fixture - Kitchen
            document.getElementById('fixtureType1').value = 'Faucets';
            document.getElementById('fixtureQuantity1').value = '2';
            
            // Add second fixture - Kitchen
            addNewFixtureItem();
            document.getElementById('fixtureType2').value = 'Sinks';
            document.getElementById('fixtureQuantity2').value = '2';
            
            // Add third fixture - Kitchen
            addNewFixtureItem();
            document.getElementById('fixtureType3').value = 'Dishwasher and Ice Maker Connections';
            document.getElementById('fixtureQuantity3').value = '1';
            
            // Add fourth fixture - Bathrooms
            addNewFixtureItem();
            document.getElementById('fixtureType4').value = 'Toilets';
            document.getElementById('fixtureQuantity4').value = '3';
            
            // Add fifth fixture - Bathrooms
            addNewFixtureItem();
            document.getElementById('fixtureType5').value = 'Bathtubs';
            document.getElementById('fixtureQuantity5').value = '2';
            
            // Add sixth fixture - Bathrooms
            addNewFixtureItem();
            document.getElementById('fixtureType6').value = 'Showers';
            document.getElementById('fixtureQuantity6').value = '1';
            
            // Add seventh fixture - Utility
            addNewFixtureItem();
            document.getElementById('fixtureType7').value = 'Water Heaters';
            document.getElementById('fixtureQuantity7').value = '1';
            
            // Add eighth fixture - Utility
            addNewFixtureItem();
            document.getElementById('fixtureType8').value = 'Washing Machine Hookups';
            document.getElementById('fixtureQuantity8').value = '1';
            
            // Add ninth fixture - Exterior
            addNewFixtureItem();
            document.getElementById('fixtureType9').value = 'Hose Bibs';
            document.getElementById('fixtureQuantity9').value = '2';
            
            // Add tenth fixture - Custom
            addNewFixtureItem();
            document.getElementById('fixtureType10').value = 'custom';
            document.getElementById('customFixtureType10').style.display = 'block';
            document.getElementById('customFixtureType10').value = 'Water Softener System';
            document.getElementById('fixtureQuantity10').value = '1';
            
            document.getElementById('notes').value = 'New construction, 3 bedroom, 2.5 bath home. All fixtures installed and tested. Water softener system installed in utility room. Customer requested premium fixtures in master bath.';
            
            // Ensure job total is set correctly and visible
            const jobTotalField = document.getElementById('jobTotal');
            if (jobTotalField) {
                // Force a reset first
                jobTotalField.value = '';
                // Then set the value with a slight delay to ensure it takes effect
                setTimeout(() => {
                    jobTotalField.value = '1955.00';
                    // Force a change event to ensure any listeners are triggered
                    const event = new Event('change');
                    jobTotalField.dispatchEvent(event);
                }, 100);
            } else {
                console.error('Job total field not found');
            }
            
            // Save sample data to local storage
            saveFormData();
        });
    }
    
    // Preview job value
    if (previewJobValueBtn) {
        previewJobValueBtn.addEventListener('click', function() {
            if (!validateForm()) {
                return;
            }
            
            generateJobValuePreview();
            jobValuePreviewSection.style.display = 'block';
            document.getElementById('totalOnlyForm').style.display = 'none';
            generatePDFBtn.style.display = 'none';
        });
    }
    
    // Edit job value
    if (editJobValueBtn) {
        editJobValueBtn.addEventListener('click', function() {
            jobValuePreviewSection.style.display = 'none';
            document.getElementById('totalOnlyForm').style.display = 'block';
        });
    }
    
    // Generate PDF from preview
    if (generatePDFFromPreviewBtn) {
        generatePDFFromPreviewBtn.addEventListener('click', function() {
            generateJobValuePDF();
        });
    }
    
    // Generate prefill link
    if (generateLinkBtn) {
        generateLinkBtn.addEventListener('click', function() {
            generatePrefillLink();
            linkSection.style.display = 'block';
        });
    }
    
    // Copy link
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', function() {
            const linkInput = document.getElementById('prefillLink');
            linkInput.select();
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        });
    }
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Check for URL parameters to pre-fill form
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('homeName')) {
        document.getElementById('homeName').value = urlParams.get('homeName');
    }
    
    if (urlParams.has('jobDate')) {
        document.getElementById('jobDate').value = urlParams.get('jobDate');
    }
    
    if (urlParams.has('notes')) {
        document.getElementById('notes').value = urlParams.get('notes');
    }
    
    if (urlParams.has('jobTotal')) {
        document.getElementById('jobTotal').value = urlParams.get('jobTotal');
    }
    
    // Handle fixture parameters
    let paramFixtureCount = 0;
    while (urlParams.has(`fixtureType${paramFixtureCount + 1}`)) {
        paramFixtureCount++;
        
        // Add fixture item if needed
        if (paramFixtureCount > fixtureCount) {
            addNewFixtureItem();
        }
        
        // Set fixture values
        document.getElementById(`fixtureType${paramFixtureCount}`).value = urlParams.get(`fixtureType${paramFixtureCount}`);
        document.getElementById(`fixtureQuantity${paramFixtureCount}`).value = urlParams.get(`fixtureQuantity${paramFixtureCount}`);
    }
});

// Validate form
function validateForm() {
    const homeName = document.getElementById('homeName').value.trim();
    const jobDate = document.getElementById('jobDate').value;
    const jobTotal = document.getElementById('jobTotal').value;
    
    if (!homeName) {
        alert('Please enter a home name.');
        return false;
    }
    
    if (!jobDate) {
        alert('Please enter a job date.');
        return false;
    }
    
    if (!jobTotal || parseFloat(jobTotal) <= 0) {
        alert('Please enter a valid job total.');
        return false;
    }
    
    // Validate fixtures
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        
        if (!fixtureType) {
            alert(`Please select a fixture type for fixture ${i}.`);
            return false;
        }
        
        if (!fixtureQuantity || fixtureQuantity < 1) {
            alert(`Please enter a valid quantity for fixture ${i}.`);
            return false;
        }
    }
    
    return true;
}

// Generate pre-fill link
function generatePrefillLink() {
    const baseUrl = window.location.href.split('?')[0];
    const params = new URLSearchParams();
    
    // Add form values to params
    params.append('homeName', document.getElementById('homeName').value);
    params.append('jobDate', document.getElementById('jobDate').value);
    params.append('notes', document.getElementById('notes').value);
    params.append('jobTotal', document.getElementById('jobTotal').value);
    
    // Add fixture values to params
    for (let i = 1; i <= fixtureCount; i++) {
        params.append(`fixtureType${i}`, document.getElementById(`fixtureType${i}`).value);
        params.append(`fixtureQuantity${i}`, document.getElementById(`fixtureQuantity${i}`).value);
    }
    
    const fullUrl = baseUrl + '?' + params.toString();
    document.getElementById('prefillLink').value = fullUrl;
}

// Generate PDF job value
function generateJobValuePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get form values
    const homeName = document.getElementById('homeName').value;
    const jobDate = document.getElementById('jobDate').value;
    const formattedDate = formatDate(jobDate);
    const jobTotal = document.getElementById('jobTotal').value;
    const notes = document.getElementById('notes').value;
    
    // Set document properties
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.text('Job Value: ' + homeName, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Date: ' + formattedDate, 20, 30);
    
    // Add fixtures table
    doc.setFontSize(14);
    doc.text('Fixtures', 20, 45);
    
    doc.setFontSize(10);
    doc.text('Type', 20, 55);
    doc.text('Quantity', 90, 55);
    
    let yPos = 65;
    
    // Add fixture items
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        
        doc.text(fixtureType, 20, yPos);
        doc.text(fixtureQuantity, 90, yPos);
        
        yPos += 10;
    }
    
    // Add total
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Total:', 70, yPos);
    doc.text('$' + jobTotal, 90, yPos);
    
    // Add notes
    if (notes) {
        yPos += 20;
        doc.setFontSize(14);
        doc.text('Notes:', 20, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        
        // Split notes into multiple lines if needed
        const splitNotes = doc.splitTextToSize(notes, 170);
        doc.text(splitNotes, 20, yPos);
    }
    
    // Save the PDF
    doc.save('Job_Value_' + homeName.replace(/\s+/g, '_') + '.pdf');
}

// Generate HTML preview of the job value
function generateJobValuePreview() {
    // Get form values
    const homeName = document.getElementById('homeName').value;
    const jobDate = document.getElementById('jobDate').value;
    const formattedDate = formatDate(jobDate);
    const jobTotal = document.getElementById('jobTotal').value;
    const notes = document.getElementById('notes').value;
    
    // Create preview HTML
    let previewHTML = `
        <div class="job-value-preview">
            <div class="preview-header">
                <h1>Job Value: ${homeName}</h1>
                <p class="date">Date: ${formattedDate}</p>
            </div>
            
            <div class="fixtures-section">
                <h2>Fixtures</h2>
                <table class="fixtures-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add fixture items
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        
        previewHTML += `
            <tr>
                <td>${fixtureType}</td>
                <td>${fixtureQuantity}</td>
            </tr>
        `;
    }
    
    // Add total and notes
    previewHTML += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td class="total-label">Total:</td>
                            <td class="total-amount">$${jobTotal}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
    `;
    
    // Add notes if present
    if (notes) {
        previewHTML += `
            <div class="notes-section">
                <h2>Notes</h2>
                <p>${notes.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }
    
    previewHTML += `</div>`;
    
    // Set preview HTML
    document.getElementById('jobValuePreview').innerHTML = previewHTML;
}

// Format date from YYYY-MM-DD to MM/DD/YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}
