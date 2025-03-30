const cl = document.getElementById("cl");
let getSegments = "";
let chop = document.querySelector("#chop");
let back = document.querySelector("#back-wheel");

function LoadVongQuay() {
  var TieuDe = $("#txtTieuDe").val();
  if (TieuDe != "") {
    $("#txtLoadTieuDe").html(TieuDe);
  }

  var sPhanQuay = $("#txtPhanQuay").val(); //.replace("\N","\n");

  //setCookie("PhanQuay",sPhanQuay,30);

  var arrPhanQuay = sPhanQuay.split("\n");
  getSegments = [];
  var colors = [
    "#fc6",
    "#6cf",
    "#F56B6B",
    "#6cb",
    "#e6f",
    "#fa6",
    "#6af",
    "#FF1493",
    "#6ab",
    "#a6f",
  ];

  for (var i = 0; i < arrPhanQuay.length; i++) {
    var trimmedValue = arrPhanQuay[i].trim();
    if (trimmedValue != "") {
      var colorIndex = i % colors.length;
      getSegments.push({ color: colors[colorIndex], label: trimmedValue });
    }
  }

  let rand = (m, M) => Math.random() * (M - m) + m;
  let tot = getSegments.length;
  let spinEl = document.querySelector("#spin");
  let ctx = document.querySelector("#wheel").getContext("2d");
  let winner = document.querySelector("#winner");
  let dia = ctx.canvas.width;
  let rad = dia / 2;
  let PI = Math.PI;
  let TAU = 2 * PI;
  let arc = TAU / getSegments.length;
  let isSpinning = false;

  let friction = 0.992; // 0.995=soft, 0.99=mid, 0.98=hard
  let angVel = 0; // Angular velocity
  let ang = 0; // Angle in radians

  let getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

  function drawSector(sector, i) {
    let ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    if (tot <= 10) {
      ctx.font = "normal 20px sans-serif";
    } else if (tot > 10 && tot <= 20) {
      ctx.font = "normal 17px sans-serif";
    } else if (tot > 20 && tot <= 30) {
      ctx.font = "normal 15px sans-serif";
    } else if (tot > 30 && tot <= 40) {
      ctx.font = "normal 14px sans-serif";
    } else if (tot > 40 && tot <= 50) {
      ctx.font = "normal 13px sans-serif";
    }
    ctx.fillText(sector.label, rad - 10, 5);
    //
    ctx.restore();
  }

  let spinTimeout;
  function rotate() {
    let sector = getSegments[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    // chop.style.transform = `rotate(${ang - PI / 2}rad)`;
    if (angVel === 0 && isSpinning) {
      if (!spinTimeout) {
        spinTimeout = setTimeout(() => {
          spinEl.textContent = "Quay";
          spinEl.style.background = "#09f"; // MĂ u ná»n máº·c Ä‘á»‹nh cho Quay
        }, 5000);
      }

      setTimeout(() => {
        //alert(`Káº¿t quáº£: ${sector.label}`);
        // winner.textContent = sector.label;
        openTrungThuong(sector.label);
      }, 300);

      isSpinning = false;
    } else {
      // spinEl.textContent = sector.label;
      spinEl.style.background = sector.color;
      if (spinTimeout) {
        clearTimeout(spinTimeout);
        spinTimeout = null;
      }
    }
    // Kiá»ƒm tra xem cĂ³ Ä‘ang thá»±c thi hĂ m rotate() khĂ´ng
    // Láº¥y táº¥t cáº£ cĂ¡c tháº» cĂ³ class lĂ  'MyButton' vĂ  'MyButton1'
    let buttons = document.querySelectorAll(".MyButton, .MyButton1");
    if (isSpinning) {
      // Láº·p qua tá»«ng tháº» vĂ  ngÄƒn chĂºng khĂ´ng cho phĂ©p ngÆ°á»i dĂ¹ng báº¥m vĂ o
      buttons.forEach((button) => {
        button.classList.add("disable-click");
      });
      spinEl.classList.add("disable-click");
    } else {
      setTimeout(() => {
        buttons.forEach((button) => {
          button.classList.remove("disable-click");
        });
        spinEl.classList.remove("disable-click");
      }, 4000);
    }
  }

  function openTrungThuong(KetQua) {
    document.getElementById("dvTrungThuong").style.display = "block";
    document.getElementById("dvKetQuaQuay").innerHTML =
      "<div style='width: 100%; text-align: center;'>" +
      "<img src='./img/alya.gif' style='max-width: 100px;'>" +
      "</div>" +
      "<div style='font-size: 23px; color: #4e4e4e; text-align: center;'>" +
      "Bạn là người được chọn <3" +
      "</div>" +
      "<div style='text-align: center; font-weight: bold; font-size: 20px;'>" +
      KetQua +
      "</div>";

    // Xóa phần tử đã trúng khỏi danh sách
    let index = getSegments.findIndex((seg) => seg.label === KetQua);
    if (index !== -1) {
      getSegments.splice(index, 1);
    }

    // Cập nhật lại vòng quay
    updateWheel();
  }

  function updateWheel() {
    // Xóa canvas cũ
    let canvas = document.getElementById("wheel");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ lại vòng quay với danh sách mới
    tot = getSegments.length;
    arc = (2 * Math.PI) / tot;
    getSegments.forEach(drawSector);
    ang = 0; // Reset góc quay về ban đầu
  }

  function closeTrungThuong() {
    document.getElementById("dvTrungThuong").style.display = "none";
  }

  function frame() {
    if (!angVel) return;
    angVel *= friction; // Decrement velocity by friction
    if (angVel < 0.002) angVel = 0; // Bring to stop
    ang += angVel; // Update angle
    ang %= TAU; // Normalize angle
    rotate();
  }

  function engine() {
    frame();
    requestAnimationFrame(engine);
  }

  cl.onclick = function clearCanvas() {
    // Dá»«ng quĂ¡ trĂ¬nh quay báº±ng cĂ¡ch Ä‘áº·t angular velocity vá» 0
    angVel = 0;

    $("canvas").remove("#wheel");

    tot = 0;
    // Táº¡o má»™t canvas má»›i
    let newCanvas = $(
      '<canvas id="wheel" width="390" height="390"></canvas>'
    )[0];

    // Thay tháº¿ canvas cÅ© báº±ng canvas má»›i
    $("#wheelOfFortune").append(newCanvas);

    // Gá»i láº¡i hĂ m init vĂ  quay láº¡i vá»‹ trĂ­ ban Ä‘áº§u
    ang = 0;
  };
  function init() {
    getSegments.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine

    spinEl.addEventListener("click", () => {
      if (!angVel && !isSpinning) {
        angVel = rand(0.25, 0.45);
        isSpinning = true;
      }
    });
    spinEl.textContent = "Quay";
    spinEl.style.background = "#09f";
  }

  init();

  ScrollToDiv("vqLeft");
  //document.cookie = "vqmm=" + sPhanQuay + "; expires=Thu, 18 Dec 2030 12:00:00 UTC";
  //alert(sPhanQuay1);
}
