function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  
  // 1. Create the toast element
  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.innerText = message;
  
  // 2. Append it to the container
  container.appendChild(toast);
  
  // 3. Trigger transition animation via a tiny delay
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 4. Automatically clear the toast after the specified duration
  setTimeout(() => {
    toast.classList.remove('show');
    
    // Smooth cleanup from the DOM after transition finishes
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}
