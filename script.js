const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxj6tdTrTUA5vLrylR1SGyaiW3TFYQNacCyFZMkoeL4nU9pRJz8dQpwUQR9zkeq9KAX/exec';

const leadForm = document.querySelector('#leadForm');
const phoneInput = leadForm.querySelector('input[name="phone"]');
const successModal = document.querySelector('#successModal');
const privacyModal = document.querySelector('#privacyModal');

const sendLeadToSheet = async (payload) => {
  const data = {
    submittedAt: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    ...payload,
  };

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(data),
  });
};

const showSuccessModal = () => {
  successModal.classList.add('active');
  successModal.setAttribute('aria-hidden', 'false');
};

const submitLeadForm = async (form, payload, submitButton) => {
  const originalContent = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = '접수 중...';

  try {
    await sendLeadToSheet(payload);
    showSuccessModal();
    form.reset();
  } catch (error) {
    alert('신청 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalContent;
  }
};

phoneInput.addEventListener('input', (event) => {
  const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) event.target.value = digits;
  else if (digits.length < 8) event.target.value = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  else event.target.value = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
});

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  await submitLeadForm(leadForm, {
    name: leadForm.elements.name.value,
    phone: leadForm.elements.phone.value,
    status: leadForm.elements.status.value,
    source: '메인 무료 안내 신청',
  }, leadForm.querySelector('button[type="submit"]'));
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

quickForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!quickForm.checkValidity()) {
    quickForm.reportValidity();
    return;
  }

  await submitLeadForm(quickForm, {
    name: quickForm.elements.quickName.value,
    phone: quickForm.elements.quickPhone.value,
    status: '빠른 상담 요청',
    source: '하단 빠른 상담 신청',
  }, quickForm.querySelector('button[type="submit"]'));
});
