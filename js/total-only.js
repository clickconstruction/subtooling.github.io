// Make fixtureCount globally accessible
let fixtureCount = 1;

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
                    <select id="fixtureType${fixtureCount}" name="fixtureType${fixtureCount}" required>
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
        fixtureItems: !!fixtureItems
    });
    
    // Set current date for job date
    const today = new Date();
    document.getElementById('jobDate').valueAsDate = today;
    
    // Add event listeners to buttons
    if (addFixtureBtn) {
        addFixtureBtn.addEventListener('click', addNewFixtureItem);
        console.log('Add fixture button event listener added');
    }
    
    if (removeFixtureBtn) {
        removeFixtureBtn.addEventListener('click', removeLastFixtureItem);
        console.log('Remove fixture button event listener added');
    }
    
    // Fill sample data
    if (fillSampleDataBtn) {
        fillSampleDataBtn.addEventListener('click', function() {
            document.getElementById('homeName').value = 'Smith Residence';
            document.getElementById('jobDate').valueAsDate = today;
            
            // Set first fixture
            document.getElementById('fixtureType1').value = 'Light Fixture';
            document.getElementById('fixtureQuantity1').value = '8';
            
            // Add second fixture
            addNewFixtureItem();
            document.getElementById('fixtureType2').value = 'Outlet';
            document.getElementById('fixtureQuantity2').value = '12';
            
            // Add third fixture
            addNewFixtureItem();
            document.getElementById('fixtureType3').value = 'Ceiling Fan';
            document.getElementById('fixtureQuantity3').value = '3';
            
            document.getElementById('notes').value = 'New construction, all fixtures installed and tested.';
            document.getElementById('jobTotal').value = '675.00';
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
