const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const leadForm = document.querySelector('#leadForm');
const phoneInput = leadForm.querySelector('input[name="phone"]');
const successModal = document.querySelector('#successModal');
const privacyModal = document.querySelector('#privacyModal');

phoneInput.addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) event.target.value = digits;
  else if (digits.length < 8) event.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  else event.target.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
});

leadForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }
  successModal.classList.add('active');
  successModal.setAttribute('aria-hidden', 'false');
  leadForm.reset();
});

document.querySelector('#privacyOpen').addEventListener('click', () => {
  privacyModal.classList.add('active');
  privacyModal.setAttribute('aria-hidden', 'false');
});

document.querySelectorAll('.modal-close, .modal-confirm').forEach((button) => {
  button.addEventListener('click', () => {
    button.closest('.modal').classList.remove('active');
    button.closest('.modal').setAttribute('aria-hidden', 'true');
  });
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});

const quickForm = document.querySelector('#quickForm');
const quickPhone = quickForm.querySelector('input[name="quickPhone"]');

quickPhone.addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) event.target.value = digits;
  else if (digits.length < 8) event.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  else event.target.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
});

quickForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!quickForm.checkValidity()) {
    quickForm.reportValidity();
    return;
  }
  successModal.classList.add('active');
  successModal.setAttribute('aria-hidden', 'false');
  quickForm.reset();
});
