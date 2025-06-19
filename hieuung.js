class Hinh {
  constructor() {}
  Chuvi() {}
  Dientich() {}
}
class Hinhchunhat extends Hinh {
  constructor(d, r) {
    super();
    this.d = d;
    this.r = r;
  }
  Chuvi() {
    super.Chuvi();
    return Number(this.d + this.r) * 2;
  }
  Dientich() {
    super.Dientich();
    return Number(this.d * this.r);
  }
}
class HinhVuong extends Hinh {
  constructor(c) {
    super();
    this.c = c;
  }
  Chuvi() {
    super.Chuvi();
    return Number(this.c * 4);
  }
  Dientich() {
    super.Dientich();
    return Number(this.c * this.c);
  }
}
class HinhThang extends Hinh {
  constructor(a, b, c, d, h) {
    super();
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.h = h;
  }
  Chuvi() {
    super.Chuvi();
    return Number(this.a + this.b + this.c + this.d);
  }
  Dientich() {
    super.Dientich();
    return Number((this.a + this.b) * this.h) / 2;
  }
}
class Hinhtron extends Hinh {
  constructor(r) {
    super();
    this.r = r;
  }
  Chuvi() {
    super.Chuvi();
    return Number(this.r * 2) * Math.PI;
  }
  Dientich() {
    super.Dientich();
    return Number(this.r * this.r) * Math.PI;
  }
}
function LayData(event) {
  event.preventDefault();

  let dai = Number(document.getElementById("chieudai").value);
  let rong = Number(document.getElementById("chieurong").value);

  if (isNaN(dai) || isNaN(rong) || dai <= 0 || rong <= 0) {
    document.getElementById("hienthi").innerHTML = "Nhap sai em oi";
    return;
  }

  let tinhchuvi = new Hinhchunhat(dai, rong);

  document.getElementById("hienthi").innerHTML =
    "Chu vi la: " +
    tinhchuvi.Chuvi() +
    "<br />" +
    "Dien tich la: " +
    tinhchuvi.Dientich();
  const vehinh = document.getElementById("ve");
  vehinh.style.width = dai * 37.8 + "px";
  vehinh.style.height = rong * 37.8 + "px";
  vehinh.style.backgroundColor = "white";
  vehinh.style.border = "2px solid black";
  vehinh.style.margin = "20px";
}
function LayData_2(event) {
  event.preventDefault();

  let canh = Number(document.getElementById("canh").value);

  if (isNaN(canh) || canh <= 0) {
    document.getElementById("hienthi_2").innerHTML = "Nhap sai em oi";
    return;
  }

  let tinhchuvi = new HinhVuong(canh);

  document.getElementById("hienthi_2").innerHTML =
    "Chu vi la: " +
    tinhchuvi.Chuvi() +
    "<br />" +
    "Dien tich la: " +
    tinhchuvi.Dientich();
  const vehinh = document.getElementById("ve");
  vehinh.style.width = canh * 37.8 + "px";
  vehinh.style.height = canh * 37.8 + "px";
  vehinh.style.backgroundColor = "white";
  vehinh.style.border = "2px solid black";
  vehinh.style.margin = "20px";
}
function LayData_3(event) {
  event.preventDefault();

  let bankinh = Number(document.getElementById("bankinh").value);

  if (isNaN(bankinh) || bankinh <= 0) {
    document.getElementById("hienthi_3").innerHTML = "Nhap sai em oi";
    return;
  }

  let tinhchuvi = new Hinhtron(bankinh);

  document.getElementById("hienthi_3").innerHTML =
    "Chu vi la: " +
    tinhchuvi.Chuvi() +
    "<br />" +
    "Dien tich la: " +
    tinhchuvi.Dientich();
  const vehinh = document.getElementById("ve");
  vehinh.style.width = bankinh * 37.8 + "px";
  vehinh.style.height = bankinh * 37.8 + "px";
  vehinh.style.backgroundColor = "white";
  vehinh.style.border = "2px solid black";
  vehinh.style.margin = "20px";
  vehinh.style.borderRadius = "50%";
}
function LayData__4(event) {
  event.preventDefault();

  let a = Number(document.getElementById("daytren").value);
  let b = Number(document.getElementById("dayduoi").value);
  let c = Number(document.getElementById("canhtrai").value);
  let d = Number(document.getElementById("canhphai").value);
  let h = Number(document.getElementById("chieucao").value);
  let checkdk = [a, b, c, d, h];
  for (i = 0; i < checkdk.length; i++) {
    if (isNaN(checkdk[i]) || checkdk[i] <= 0) {
      document.getElementById("hienthi__4").innerHTML = "Nhap sai em oi";
      return;
    }
  }

  let tinhchuvi = new HinhThang(a, b, c, d, h);
  let dt = Number(Math.sqrt(d ** 2 - h ** 2));
  let ct = Number(Math.sqrt(c ** 2 - h ** 2));

  document.getElementById("hienthi__4").innerHTML =
    "Chu vi la: " +
    tinhchuvi.Chuvi() +
    "<br />" +
    "Dien tich la: " +
    tinhchuvi.Dientich();
  const vehinh = document.getElementById("ve");
  vehinh.style.width = a * 37.8 + "px";
  vehinh.style.height = 0 * 37.8 + "px";
  // vehinh.style.border = "2px solid black";
  vehinh.style.borderBottom = h * 37.8 + "px solid black";
  vehinh.style.borderRight = dt * 37.8 + "px solid transparent";
  vehinh.style.borderLeft = ct * 37.8 + "px solid transparent";
}
