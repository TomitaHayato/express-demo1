window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.user').forEach((el) => {
    el.addEventListener('click', (event) => {
      console.log(event.target.innerText);
    });
  })
});
