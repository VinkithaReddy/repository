// File upload validation
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('file');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            const maxSize = 16 * 1024 * 1024; // 16MB
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            
            if (file.size > maxSize) {
                alert('File size exceeds 16MB limit!');
                this.value = '';
                return;
            }
            
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type! Please upload PDF, JPG, PNG, or DOC files only.');
                this.value = '';
                return;
            }
        });
    }
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
});

// Confirm delete
function confirmDelete(recordId) {
    if (confirm('Are you sure you want to delete this record?')) {
        window.location.href = `/delete/${recordId}`;
    }
}

