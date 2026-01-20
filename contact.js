// contact.js - handle AJAX form submissions for booking and messages

function formToObject(form){
  const data = {};
  new FormData(form).forEach((v,k)=>{
    data[k] = v;
  });
  return data;
}

async function submitForm(e){
  e.preventDefault();
  const form = e.currentTarget;
  const endpoint = form.action || form.dataset.endpoint;
  if (!endpoint){
    alert('Form endpoint not set');
    return;
  }

  const data = formToObject(form);
  try{
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(()=>({ok:false, error:'invalid-json'}));

    if (res.ok && json.ok){
      if (form.id === 'bookForm'){
        alert('Your order has been booked');
      } else if (form.id === 'messageForm'){
        alert('Your message has been submitted');
      } else {
        alert('Submission successful');
      }
      form.reset();
    } else {
      const err = json && json.error ? json.error : 'Server error';
      alert('Error: ' + err);
    }
  }catch(err){
    console.error(err);
    alert('Network or server error');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const bookForm = document.getElementById('bookForm');
  const messageForm = document.getElementById('messageForm');
  if (bookForm) bookForm.addEventListener('submit', submitForm);
  if (messageForm) messageForm.addEventListener('submit', submitForm);
});
