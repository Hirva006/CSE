document.addEventListener('click', function (e) {
  ['mobileMenuBtn', 'mobileMenuBtn2', 'mobileMenuBtn3', 'mobileMenuBtn4', 'mobileMenuBtn5'].forEach((id, i) => {
    if (e.target && e.target.id === id) {
      const menu = document.getElementById(`mobileMenu${i === 0 ? '' : i + 1}`);
      if (menu) menu.classList.toggle('hidden');
    }
  });
});


const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    const msgEl = document.getElementById('contactMsg');

    if (!name || !email || !message) {
      msgEl.textContent = 'Please fill in all fields.';
      msgEl.className = 'text-red-600';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      msgEl.textContent = 'Enter a valid email address.';
      msgEl.className = 'text-red-600';
      return;
    }

    msgEl.textContent = 'Thanks! Your message has been received.';
    msgEl.className = 'text-green-600';
    contactForm.reset();
  });
}

const adminLogin = document.getElementById('adminLoginForm');
if (adminLogin) {
  adminLogin.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const user = adminLogin.username.value.trim();
    const pw = adminLogin.password.value.trim();
    const msg = document.getElementById('adminMsg');

    if (!user || !pw) {
      msg.textContent = 'Enter username and password.';
      msg.className = 'text-red-600';
      return;
    }

    if (user === 'admin' && pw === 'admin123') {
      msg.textContent = 'Login successful — redirecting...';
      msg.className = 'text-green-600';
      setTimeout(() => (window.location.href = 'dashboard.html'), 800);
    } else {
      msg.textContent = 'Invalid credentials.';
      msg.className = 'text-red-600';
    }
  });
}


function addTableRow(tableId, cols = [], saveToStorage = true) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tr = document.createElement('tr');
  cols.forEach((c) => {
    const td = document.createElement('td');
    td.textContent = c;
    tr.appendChild(td);
  });
  const tdAction = document.createElement('td');
  tdAction.innerHTML = `<button class="btn btn-sm btn-danger" onclick="deleteTableRow(this, '${tableId}')">Delete</button>`;
  tr.appendChild(tdAction);
  table.querySelector('tbody').appendChild(tr);

  
  if (saveToStorage) {
    saveTableData(tableId);
  }
}

function deleteTableRow(btn, tableId) {
  btn.closest('tr').remove();
  saveTableData(tableId);
}

function saveTableData(tableId) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const rows = [];
  table.querySelectorAll('tbody tr').forEach(tr => {
    const cols = [];
    tr.querySelectorAll('td').forEach((td, index) => {
      // Skip the last column (Actions)
      if (index < tr.querySelectorAll('td').length - 1) {
        cols.push(td.textContent);
      }
    });
    rows.push(cols);
  });

  localStorage.setItem(tableId, JSON.stringify(rows));
}

function loadTableData(tableId) {
  const data = localStorage.getItem(tableId);
  if (data) {
    const rows = JSON.parse(data);
    rows.forEach(cols => {
      addTableRow(tableId, cols, false);
    });
  }
}


let isDarkMode = false;

document.addEventListener('DOMContentLoaded', function () {
  
  if (document.getElementById('flightsTable')) {
    const savedFlights = localStorage.getItem('flightsTable');
    if (savedFlights) {
      loadTableData('flightsTable');
    } else {
      addTableRow('flightsTable', ['F001', 'Mumbai', 'Dubai', '2025-11-01', '₹8,200']);
      addTableRow('flightsTable', ['F002', 'Delhi', 'London', '2025-12-10', '₹45,000']);
    }
  }
  if (document.getElementById('hotelsTable')) {
    const savedHotels = localStorage.getItem('hotelsTable');
    if (savedHotels) {
      loadTableData('hotelsTable');
    } else {
      addTableRow('hotelsTable', ['H001', 'Ocean View Resort', 'Bali', '₹4,500']);
      addTableRow('hotelsTable', ['H002', 'City Center Hotel', 'Paris', '₹6,200']);
    }
  }
  if (document.getElementById('packagesTable')) {
    const savedPackages = localStorage.getItem('packagesTable');
    if (savedPackages) {
      loadTableData('packagesTable');
    } else {
      addTableRow('packagesTable', ['P001', 'Paris Romantic', '5 days', '₹28,999']);
      addTableRow('packagesTable', ['P002', 'Bali Escape', '7 days', '₹39,999']);
    }
  }

  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode = true;
    applyDarkMode();
  } else {
    isDarkMode = false;
    applyLightMode();
  }
});


const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const html = document.documentElement;

themeToggle?.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    localStorage.setItem('theme', 'dark');
    applyDarkMode();
  } else {
    localStorage.setItem('theme', 'light');
    applyLightMode();
  }
});

function applyDarkMode() {
  html.classList.add('dark');

  document.body.className = 'bg-gray-900 text-gray-100';


  const header = document.querySelector('header');
  if (header) {
    header.className = header.className.replace('bg-white', 'bg-gray-800') + ' shadow transition-colors duration-300';
  }


  const sidebar = document.querySelector('.admin-sidebar');
  if (sidebar) {
    sidebar.className = 'w-64 bg-gray-800 border-r p-4 admin-sidebar text-gray-100';

    
    sidebar.querySelectorAll('nav a').forEach(link => {
      
      if (link.classList.contains('bg-indigo-50')) {
        link.classList.remove('bg-indigo-50');
        link.classList.add('bg-indigo-900', 'text-indigo-100');
      }
      
      link.classList.remove('hover:bg-gray-100');
      link.classList.add('hover:bg-gray-700', 'text-gray-300');
    });
  }

  
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.querySelectorAll('.bg-white').forEach(el => {
      el.classList.remove('bg-white');
      el.classList.add('bg-gray-800');

      el.querySelectorAll('.text-gray-500').forEach(txt => {
        txt.classList.remove('text-gray-500');
        txt.classList.add('text-gray-300');
      });

      
      el.querySelectorAll('.text-2xl, .font-bold, .font-semibold').forEach(txt => {
        if (!txt.classList.contains('text-indigo-600')) {
          txt.classList.add('text-gray-100');
        }
      });
    });

  
    mainContent.querySelectorAll('input, select').forEach(input => {
      input.classList.add('bg-gray-700', 'border-gray-600', 'text-gray-100', 'placeholder-gray-400');
      input.style.colorScheme = 'dark';
    });
  }

  
  document.querySelectorAll('.bg-gray-50, .bg-gray-100, .bg-gray-200').forEach(el => {
    if (el !== document.body) {
      el.classList.remove('bg-gray-50', 'bg-gray-100', 'bg-gray-200');
      el.classList.add('bg-gray-700');
    }
  });

  
  document.querySelectorAll('.text-gray-600').forEach(el => {
    el.classList.remove('text-gray-600');
    el.classList.add('text-gray-300');
  });


  document.querySelectorAll('table').forEach(table => {
    table.classList.add('table-dark');
    table.classList.remove('table-striped');
  });


  const footer = document.querySelector('footer');
  if (footer) {
    
    footer.classList.remove('bg-white');
    footer.classList.add('bg-gray-800');
    
    
    footer.querySelectorAll('.bg-white').forEach(el => {
      el.classList.remove('bg-white');
      el.classList.add('bg-gray-800');
    });
    
    
    footer.querySelectorAll('.bg-gray-50').forEach(el => {
      el.classList.remove('bg-gray-50');
      el.classList.add('bg-gray-800');
    });
    
    
    footer.querySelectorAll('.text-gray-600').forEach(el => {
      el.classList.remove('text-gray-600');
      el.classList.add('text-gray-300');
    });
  }
  
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    mobileMenu.classList.remove('bg-white');
    mobileMenu.classList.add('bg-gray-800');
  }


  if (themeToggle) {
    themeToggle.className = 'p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center';
  }

  
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.classList.remove('bg-white');
    modalContent.classList.add('bg-gray-800');

  
    modalContent.querySelectorAll('h2, h3').forEach(heading => {
      heading.classList.add('text-gray-100');
    });

  
    modalContent.querySelectorAll('label').forEach(label => {
      label.classList.remove('text-gray-700');
      label.classList.add('text-gray-300');
    });

  
    modalContent.querySelectorAll('input').forEach(input => {
      input.classList.remove('border-gray-300');
      input.classList.add('bg-gray-700', 'border-gray-600', 'text-gray-100', 'placeholder-gray-400');
    });

  
    const closeBtn = modalContent.querySelector('#closeModal, #closeModalBtn');
    if (closeBtn) {
      closeBtn.classList.remove('text-gray-500', 'hover:text-gray-700');
      closeBtn.classList.add('text-gray-400', 'hover:text-gray-200');
    }

  
    const cancelBtn = modalContent.querySelector('#cancelBtn, button[type="button"]');
    if (cancelBtn && cancelBtn.classList.contains('bg-gray-300')) {
      cancelBtn.classList.remove('bg-gray-300', 'text-gray-700', 'hover:bg-gray-400');
      cancelBtn.classList.add('bg-gray-700', 'text-gray-300', 'hover:bg-gray-600');
    }

  
    modalContent.querySelectorAll('span').forEach(span => {
      if (span.textContent === '₹') {
        span.classList.remove('text-gray-500');
        span.classList.add('text-gray-400');
      }
    });
  }

  
  if (sunIcon && moonIcon) {
    sunIcon.classList.add('hidden');
    sunIcon.classList.remove('text-gray-800');
    sunIcon.classList.add('text-gray-100');
    moonIcon.classList.remove('hidden');
    moonIcon.classList.remove('text-gray-800');
    moonIcon.classList.add('text-gray-100');
  }
}

function applyLightMode() {
  html.classList.remove('dark');

  
  document.body.className = 'bg-gray-50 text-gray-800';

  
  const header = document.querySelector('header');
  if (header) {
    header.className = header.className.replace('bg-gray-800', 'bg-white') + ' shadow transition-colors duration-300';
  }

  
  const sidebar = document.querySelector('.admin-sidebar');
  if (sidebar) {
    sidebar.className = 'w-64 bg-white border-r p-4 admin-sidebar';

  
    sidebar.querySelectorAll('nav a').forEach(link => {
      
      if (link.classList.contains('bg-indigo-900')) {
        link.classList.remove('bg-indigo-900', 'text-indigo-100', 'text-gray-300');
        link.classList.add('bg-indigo-50');
      } else {
      
        link.classList.remove('hover:bg-gray-700', 'text-gray-300');
        link.classList.add('hover:bg-gray-100');
      }
    });
  }

  
  document.querySelectorAll('.bg-gray-800').forEach(el => {
    el.classList.remove('bg-gray-800');
    el.classList.add('bg-white');

    
    el.querySelectorAll('.text-gray-300').forEach(txt => {
      txt.classList.remove('text-gray-300');
      txt.classList.add('text-gray-500');
    });

    el.querySelectorAll('.text-gray-100').forEach(txt => {
      if (!txt.classList.contains('text-indigo-600')) {
        txt.classList.remove('text-gray-100');
      }
    });
  });

  
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.querySelectorAll('input, select').forEach(input => {
      input.classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-100', 'placeholder-gray-400');
      input.style.colorScheme = 'light';
    });
  }

  
  document.querySelectorAll('.bg-gray-700').forEach(el => {
    el.classList.remove('bg-gray-700');
    el.classList.add('bg-gray-200');
  });

  
  document.querySelectorAll('.text-gray-300').forEach(el => {
    el.classList.remove('text-gray-300');
    el.classList.add('text-gray-600');
  });

  
  document.querySelectorAll('table').forEach(table => {
    table.classList.remove('table-dark');
    table.classList.add('table-striped');
  });

  
  if (themeToggle) {
    themeToggle.className = 'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center';
  }

  
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.classList.remove('bg-gray-800');
    modalContent.classList.add('bg-white');

    
    modalContent.querySelectorAll('h2, h3').forEach(heading => {
      heading.classList.remove('text-gray-100');
      heading.classList.add('text-gray-800');
    });

    
    modalContent.querySelectorAll('label').forEach(label => {
      label.classList.remove('text-gray-300');
      label.classList.add('text-gray-700');
    });

    
    modalContent.querySelectorAll('input').forEach(input => {
      input.classList.remove('bg-gray-700', 'border-gray-600', 'text-gray-100', 'placeholder-gray-400');
      input.classList.add('border-gray-300');
    });

    
    const closeBtn = modalContent.querySelector('#closeModal, #closeModalBtn');
    if (closeBtn) {
      closeBtn.classList.remove('text-gray-400', 'hover:text-gray-200');
      closeBtn.classList.add('text-gray-500', 'hover:text-gray-700');
    }

    
    const cancelBtn = modalContent.querySelector('#cancelBtn, button[type="button"]');
    if (cancelBtn && cancelBtn.classList.contains('bg-gray-700')) {
      cancelBtn.classList.remove('bg-gray-700', 'text-gray-300', 'hover:bg-gray-600');
      cancelBtn.classList.add('bg-gray-300', 'text-gray-700', 'hover:bg-gray-400');
    }

    
    modalContent.querySelectorAll('span').forEach(span => {
      if (span.textContent === '₹') {
        span.classList.remove('text-gray-400');
        span.classList.add('text-gray-500');
      }
    });
  }

  
  if (sunIcon && moonIcon) {
    moonIcon.classList.add('hidden');
    moonIcon.classList.remove('text-gray-100');
    moonIcon.classList.add('text-gray-800');
    sunIcon.classList.remove('hidden');
    sunIcon.classList.remove('text-gray-100');
    sunIcon.classList.add('text-gray-800');
  }
}
