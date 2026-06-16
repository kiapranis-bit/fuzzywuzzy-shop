console.log("shop-designer.js running");

document.addEventListener("DOMContentLoaded", function () {

  /* ================= PRODUCT SWITCH (rotating highlight) ================= */

  const products = document.querySelectorAll(".product");

  if (products.length > 0) {
    let index = 0;

    setInterval(() => {
      products[index].classList.remove("active");
      index = (index + 1) % products.length;
      products[index].classList.add("active");
    }, 5000);
  }

  /* ================= CHECK FABRIC ================= */

  if (typeof fabric === "undefined") {
    console.error("Fabric.js not loaded");
    return;
  }

  const canvasElement = document.getElementById("tshirtCanvas");

  if (!canvasElement) {
    console.error("Canvas not found");
    return;
  }

  /* ================= CREATE CANVAS ================= */

  const canvas = new fabric.Canvas("tshirtCanvas", {
    width: 400,
    height: 500
  });

  /* ================= DEFAULT SHIRT ================= */

  let currentShirt = "black";

  function setShirt(color) {
    fabric.Image.fromURL(`assets/${color}.png`, function (img) {
      if (!img) return;

      img.scaleToWidth(400);
      img.selectable = false;
      img.evented = false;

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  }

  setShirt(currentShirt);

  /* ================= COLOR SWITCH ================= */

  function initColorButtons() {
    const buttons = document.querySelectorAll(".color-options button");

    if (!buttons.length) {
      console.warn("No color buttons found");
      return;
    }

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {

        const color = btn.getAttribute("data-color");
        if (!color) return;

        currentShirt = color;

        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        setShirt(color);
      });
    });
  }

  initColorButtons();

  /* ================= UPLOAD DESIGN ================= */

  const uploadInput = document.getElementById("uploadDesign");

  if (uploadInput) {
    uploadInput.addEventListener("change", function (e) {

      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (event) {
        fabric.Image.fromURL(event.target.result, function (img) {

          img.set({
            left: 150,
            top: 150
          });

          img.scaleToWidth(150);
          img.lockUniScaling = true;

          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        });
      };

      reader.readAsDataURL(file);
    });
  }

  /* ================= SUBMIT DESIGN ================= */

  const submitBtn = document.getElementById("submitDesign");

  if (submitBtn) {
    submitBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      if (!auth || !auth.currentUser) {
        alert("Please log in to submit a design.");
        window.location.href = "auth.html";
        return;
      }

      const objects = canvas.getObjects();
      let placement = {};

      if (objects.length > 0) {
        const obj = objects[0];
        placement = {
          x:      obj.left,
          y:      obj.top,
          width:  obj.width * obj.scaleX,
          height: obj.height * obj.scaleY,
        };
      }

      submitBtn.disabled  = true;
      submitBtn.innerText = "Submitting...";

      try {
        const imageData = canvas.toDataURL("image/png");
        const size      = document.getElementById("sizeSelector")?.value || "a4";

        const result = await submitDesign({
          imageData,
          color:    currentShirt,
          size,
          ...placement,
        });

        alert(`Design submitted! ID: ${result.designId}\nWe will review and contact you shortly.`);

      } catch (err) {
        alert("Failed to submit design: " + err.message);
      } finally {
        submitBtn.disabled  = false;
        submitBtn.innerText = "Submit Design";
      }
    });
  }

});
