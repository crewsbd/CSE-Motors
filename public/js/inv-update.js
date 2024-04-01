const form = document.querySelector("#updateForm");

form.addEventListener("change", function () {
  const updateBtn = document.querySelector('input[type="submit"]');
  updateBtn.removeAttribute("disabled");
});
