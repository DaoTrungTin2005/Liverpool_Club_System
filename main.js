const temp = document.getElementById("co");
const temp2 = document.getElementById("ko");
const desc_bien = document.getElementById("desc");
temp2.addEventListener("click", function (e) {
  e.preventDefault();
  desc_bien.textContent = "May phai thich tao";
  temp.style.scale = "10";
});
temp.addEventListener("click", function (e) {
  e.preventDefault();
  desc_bien.textContent = "Ok da chon dung";
  temp2.style.display = "none";
  temp.style.display = "none";
  desc_bien.style.scale = "5";
});
