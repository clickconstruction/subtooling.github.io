// Define calculateFixtureAmount as a global function so it can be called from HTML
window.calculateFixtureAmount = function(index) {
    try {
        console.log('Calculating amount for fixture ' + index);
        const quantityElement = document.getElementById('fixtureQuantity' + index);
        const rateElement = document.getElementById('fixtureRate' + index);
        const amountElement = document.getElementById('fixtureAmount' + index);
        
        if (!quantityElement || !rateElement || !amountElement) {
            console.error('Missing elements for fixture ' + index);
            return;
        }
        
        const quantity = parseInt(quantityElement.value) || 0;
        const rate = parseFloat(rateElement.value) || 0;
        const amount = quantity * rate;
        
        console.log('Fixture ' + index + ': ' + quantity + ' x ' + rate + ' = ' + amount.toFixed(2));
        amountElement.value = amount.toFixed(2);
        
        // Recalculate totals
        calculateTotals();
    } catch (error) {
        console.error('Error calculating amount for fixture ' + index + ':', error);
    }
};

// Define updateFixtureRate as a global function
window.updateFixtureRate = function(index) {
    try {
        console.log('Updating rate for fixture ' + index);
        const typeElement = document.getElementById('fixtureType' + index);
        const rateElement = document.getElementById('fixtureRate' + index);
        
        if (!typeElement || !rateElement) {
            console.error('Missing elements for fixture ' + index);
            return;
        }
        
        const fixtureType = typeElement.value;
        let rate = 0;
        
        // Set default rates based on fixture type
        switch (fixtureType) {
            case 'Light Fixture':
                rate = 35.00;
                break;
            case 'Outlet':
                rate = 25.00;
                break;
            case 'Switch':
                rate = 20.00;
                break;
            case 'Ceiling Fan':
                rate = 75.00;
                break;
            case 'Smoke Detector':
                rate = 45.00;
                break;
            case 'Other':
                rate = 30.00;
                break;
            default:
                rate = 0;
        }
        
        rateElement.value = rate.toFixed(2);
        
        // Calculate the amount
        calculateFixtureAmount(index);
    } catch (error) {
        console.error('Error updating rate for fixture ' + index + ':', error);
    }
};

// Make fixtureCount globally accessible
let fixtureCount = 1;

// Calculate totals for all fixtures
window.calculateTotals = function() {
    try {
        let total = 0;
        
        // Sum up all fixture amounts
        for (let i = 1; i <= fixtureCount; i++) {
            const amountElement = document.getElementById('fixtureAmount' + i);
            if (amountElement) {
                total += parseFloat(amountElement.value) || 0;
            }
        }
        
        // Update the job total
        const jobTotalElement = document.getElementById('jobTotal');
        if (jobTotalElement) {
            jobTotalElement.value = total.toFixed(2);
        }
    } catch (error) {
        console.error('Error calculating totals:', error);
    }
};

// Add a new fixture item
function addNewFixtureItem(e) {
    if (e) e.preventDefault();
    console.log('Adding new fixture item');
    
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
                    <select id="fixtureType${fixtureCount}" name="fixtureType${fixtureCount}" required onchange="updateFixtureRate(${fixtureCount})">
                        <option value="">Select Type</option>
                        <option value="Light Fixture">Light Fixture</option>
                        <option value="Outlet">Outlet</option>
                        <option value="Switch">Switch</option>
                        <option value="Ceiling Fan">Ceiling Fan</option>
                        <option value="Smoke Detector">Smoke Detector</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div class="form-group item-quantity">
                    <label for="fixtureQuantity${fixtureCount}">Quantity:</label>
                    <input type="number" id="fixtureQuantity${fixtureCount}" name="fixtureQuantity${fixtureCount}" min="1" step="1" value="1" required onchange="calculateFixtureAmount(${fixtureCount})" onkeyup="calculateFixtureAmount(${fixtureCount})">
                </div>
                
                <div class="form-group item-rate">
                    <label for="fixtureRate${fixtureCount}">Rate ($):</label>
                    <input type="number" id="fixtureRate${fixtureCount}" name="fixtureRate${fixtureCount}" min="0" step="0.01" required onchange="calculateFixtureAmount(${fixtureCount})" onkeyup="calculateFixtureAmount(${fixtureCount})">
                </div>
                
                <div class="form-group item-amount">
                    <label for="fixtureAmount${fixtureCount}">Amount ($):</label>
                    <input type="number" id="fixtureAmount${fixtureCount}" name="fixtureAmount${fixtureCount}" readonly>
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
    console.log('Removing fixture item');
    
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
                calculateTotals();
            }
        }
        
        return false; // Prevent form submission
    } catch (error) {
        console.error('Error removing fixture item:', error);
        return false;
    }
}

// Save form data to local storage
function saveFormData() {
    try {
        const formData = {
            homeName: document.getElementById('homeName').value,
            jobDate: document.getElementById('jobDate').value,
            notes: document.getElementById('notes').value,
            fixtures: []
        };
        
        // Save fixture data
        for (let i = 1; i <= fixtureCount; i++) {
            const fixtureType = document.getElementById(`fixtureType${i}`);
            const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`);
            const fixtureRate = document.getElementById(`fixtureRate${i}`);
            
            if (fixtureType && fixtureQuantity && fixtureRate) {
                formData.fixtures.push({
                    type: fixtureType.value,
                    quantity: fixtureQuantity.value,
                    rate: fixtureRate.value
                });
            }
        }
        
        localStorage.setItem('jobValueCalculatorData', JSON.stringify(formData));
        console.log('Form data saved to local storage');
    } catch (error) {
        console.error('Error saving form data to local storage:', error);
    }
}

// Load form data from local storage
function loadFormData() {
    try {
        const savedData = localStorage.getItem('jobValueCalculatorData');
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
        
        // Load fixtures
        if (formData.fixtures && formData.fixtures.length > 0) {
            // Set first fixture
            if (formData.fixtures[0]) {
                document.getElementById('fixtureType1').value = formData.fixtures[0].type || '';
                document.getElementById('fixtureQuantity1').value = formData.fixtures[0].quantity || '1';
                document.getElementById('fixtureRate1').value = formData.fixtures[0].rate || '0';
                calculateFixtureAmount(1);
            }
            
            // Add additional fixtures
            for (let i = 1; i < formData.fixtures.length; i++) {
                addNewFixtureItem();
                document.getElementById(`fixtureType${i+1}`).value = formData.fixtures[i].type || '';
                document.getElementById(`fixtureQuantity${i+1}`).value = formData.fixtures[i].quantity || '1';
                document.getElementById(`fixtureRate${i+1}`).value = formData.fixtures[i].rate || '0';
                calculateFixtureAmount(i+1);
            }
        }
        
        // Calculate totals
        calculateTotals();
        
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
        localStorage.removeItem('jobValueCalculatorData');
        
        // Reset form
        document.getElementById('fixtureForm').reset();
        
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
        document.getElementById('fixtureRate1').value = '';
        document.getElementById('fixtureAmount1').value = '';
        
        // Calculate totals
        calculateTotals();
        
        console.log('All form data cleared');
    } catch (error) {
        console.error('Error clearing form data:', error);
    }
}

// Add event listeners to form inputs to save data on change
function addSaveDataListeners() {
    const formInputs = document.querySelectorAll('#fixtureForm input, #fixtureForm select, #fixtureForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', saveFormData);
    });
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
            document.getElementById('homeName').value = 'Smith Residence';
            document.getElementById('jobDate').valueAsDate = today;
            
            // Set first fixture
            document.getElementById('fixtureType1').value = 'Light Fixture';
            document.getElementById('fixtureQuantity1').value = '8';
            updateFixtureRate(1);
            
            // Add second fixture
            addNewFixtureItem();
            document.getElementById('fixtureType2').value = 'Outlet';
            document.getElementById('fixtureQuantity2').value = '12';
            updateFixtureRate(2);
            
            // Add third fixture
            addNewFixtureItem();
            document.getElementById('fixtureType3').value = 'Ceiling Fan';
            document.getElementById('fixtureQuantity3').value = '3';
            updateFixtureRate(3);
            
            document.getElementById('notes').value = 'New construction, all fixtures installed and tested.';
            
            calculateTotals();
            
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
            document.getElementById('fixtureForm').style.display = 'none';
            generatePDFBtn.style.display = 'none';
        });
    }
    
    // Edit job value
    if (editJobValueBtn) {
        editJobValueBtn.addEventListener('click', function() {
            jobValuePreviewSection.style.display = 'none';
            document.getElementById('fixtureForm').style.display = 'block';
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
    
    // Initialize the first fixture
    updateFixtureRate(1);
    
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
        updateFixtureRate(paramFixtureCount);
    }
    
    // Calculate totals
    calculateTotals();
});

// Validate form
function validateForm() {
    const homeName = document.getElementById('homeName').value.trim();
    const jobDate = document.getElementById('jobDate').value;
    
    if (!homeName) {
        alert('Please enter a home name.');
        return false;
    }
    
    if (!jobDate) {
        alert('Please enter a job date.');
        return false;
    }
    
    // Validate fixtures
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        const fixtureRate = document.getElementById(`fixtureRate${i}`).value;
        
        if (!fixtureType) {
            alert(`Please select a fixture type for fixture ${i}.`);
            return false;
        }
        
        if (!fixtureQuantity || fixtureQuantity < 1) {
            alert(`Please enter a valid quantity for fixture ${i}.`);
            return false;
        }
        
        if (!fixtureRate || fixtureRate <= 0) {
            alert(`Please enter a valid rate for fixture ${i}.`);
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
    
    // Add fixture values to params
    for (let i = 1; i <= fixtureCount; i++) {
        params.append(`fixtureType${i}`, document.getElementById(`fixtureType${i}`).value);
        params.append(`fixtureQuantity${i}`, document.getElementById(`fixtureQuantity${i}`).value);
        params.append(`fixtureRate${i}`, document.getElementById(`fixtureRate${i}`).value);
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
    doc.text('Rate ($)', 130, 55);
    doc.text('Amount ($)', 170, 55);
    
    let yPos = 65;
    
    // Add fixture items
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        const fixtureRate = document.getElementById(`fixtureRate${i}`).value;
        const fixtureAmount = document.getElementById(`fixtureAmount${i}`).value;
        
        doc.text(fixtureType, 20, yPos);
        doc.text(fixtureQuantity, 90, yPos);
        doc.text(fixtureRate, 130, yPos);
        doc.text(fixtureAmount, 170, yPos);
        
        yPos += 10;
    }
    
    // Add total
    yPos += 10;
    doc.setFontSize(12);
    doc.text('Total:', 130, yPos);
    doc.text('$' + jobTotal, 170, yPos);
    
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
                            <th>Rate ($)</th>
                            <th>Amount ($)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add fixture items
    for (let i = 1; i <= fixtureCount; i++) {
        const fixtureType = document.getElementById(`fixtureType${i}`).value;
        const fixtureQuantity = document.getElementById(`fixtureQuantity${i}`).value;
        const fixtureRate = document.getElementById(`fixtureRate${i}`).value;
        const fixtureAmount = document.getElementById(`fixtureAmount${i}`).value;
        
        previewHTML += `
            <tr>
                <td>${fixtureType}</td>
                <td>${fixtureQuantity}</td>
                <td>${fixtureRate}</td>
                <td>${fixtureAmount}</td>
            </tr>
        `;
    }
    
    // Add total and notes
    previewHTML += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="total-label">Total:</td>
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
