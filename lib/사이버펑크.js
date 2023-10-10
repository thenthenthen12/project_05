$(function () {
  //배경 매트릭스

  function r(from, to) {
    return ~~(Math.random() * (to - from + 1) + from);
  }
  function pick() {
    return arguments[r(0, arguments.length - 1)];
  }
  function getChar() {
    return String.fromCharCode(
      pick(r(0x3041, 0x30ff), r(0x2000, 0x206f), r(0x0020, 0x003f))
    );
  }
  function loop(fn, delay) {
    let stamp = Date.now();
    function _loop() {
      if (Date.now() - stamp >= delay) {
        fn();
        stamp = Date.now();
      }
      requestAnimationFrame(_loop);
    }
    requestAnimationFrame(_loop);
  }
  class Char {
    constructor() {
      this.element = document.createElement("span");
      this.mutate();
    }
    mutate() {
      this.element.textContent = getChar();
    }
  }
  class Trail {
    constructor(list = [], options) {
      this.list = list;
      this.options = Object.assign({ size: 10, offset: 0 }, options);
      this.body = [];
      this.move();
    }
    traverse(fn) {
      this.body.forEach((n, i) => {
        let last = i == this.body.length - 1;
        if (n) fn(n, i, last);
      });
    }
    move() {
      this.body = [];
      let { offset, size } = this.options;
      for (let i = 0; i < size; ++i) {
        let item = this.list[offset + i - size + 1];
        this.body.push(item);
      }
      this.options.offset = (offset + 1) % (this.list.length + size - 1);
    }
  }
  class Rain {
    constructor({ target, row }) {
      this.element = document.createElement("p");
      this.build(row);
      if (target) {
        target.appendChild(this.element);
      }
      this.drop();
    }
    build(row = 20) {
      let root = document.createDocumentFragment();
      let chars = [];
      for (let i = 0; i < row; ++i) {
        let c = new Char();
        root.appendChild(c.element);
        chars.push(c);
        if (Math.random() < 0.5) {
          loop(() => c.mutate(), r(1e3, 5e3));
        }
      }
      this.trail = new Trail(chars, {
        size: r(10, 30),
        offset: r(0, 100),
      });
      this.element.appendChild(root);
    }
    drop() {
      let trail = this.trail;
      let len = trail.body.length;
      let delay = r(10, 100);
      loop(() => {
        trail.move();
        trail.traverse((c, i, last) => {
          c.element.style = `
  color: hsl(70, 100%, ${(85 / len) * (i + 1)}%)
`;
          if (last) {
            c.mutate();
            c.element.style = `
    color: hsl(136, 100%, 85%);
    text-shadow:
      0 0 .5em #fff,
      0 0 .5em currentColor;
  `;
          }
        });
      }, delay);
    }
  }

  const main = document.querySelector("main");
  for (let i = 0; i < 50; ++i) {
    new Rain({ target: main, row: 50 });
  }

  let d_width = 0;
  let d_height = 0;

  function tmp() {
    let con_width = $(window).outerWidth() * $(".box").length;
    $("body").css({
      height: "100vh",
    });

    let w_width = $(window).width();
    let w_height = $(window).height();

    d_width = con_width - w_width;
    d_height = $("body").height() - w_height;
  }

  tmp();

  let array = [];
  for (let i = 0; i < $(".box").length; i++) {
    array[i] = $(".box").eq(i).offset().left;
  }

  let chk = true;
  $(".box").on("mousewheel DOMMouseScroll", function () {
    if (chk) {
      chk = false;
      setTimeout(function () {
        chk = true;
      }, 500);

      let w_delta = event.wheelDelta / 120;

      if (w_delta < 0 && $(this).next().length > 0) {
        $(".container").animate(
          {
            left: -array[$(this).index() + 1],
          },
          500
        );
      }
      else if (w_delta > 0 && $(this).prev().length > 0) {
        $(".container").animate(
          {
            left: -array[$(this).index() - 1],
          },
          500
        );
      }
    }
  });

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = "!<>-_\\/[]{}—=+*^?#________";
      this.update = this.update.bind(this);
    }
    setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => (this.resolve = resolve));
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || "";
        const to = newText[i] || "";
        const start = Math.floor(Math.random() * 40);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
      return promise;
    }
    update() {
      let output = "";
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }
    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  const phrases = [
    "Hello",
    "Welcome",
    "This is CyberPunk 2077",
    "Please Enjoy",
  ];

  const el = document.querySelector(".text-change");
  const fx = new TextScramble(el);

  let counter = 0;
  const next = () => {
    fx.setText(phrases[counter]).then(() => {
      setTimeout(next, 2000);
    });
    counter = (counter + 1) % phrases.length;
  };

  next();

  //cont_01 스크립트 시작
  let arti = $(".cont_01 .inner .arti");

  $(".cont_01 .inner .title").click(function () {
    arti.slideToggle();
  });

  let itemTitle = $(".cont_01 .inner .arti .info .up ul li");
  let itemImg = $(".cont_01 .inner .arti .img img");
  let itemInfo = $(".cont_01 .inner .arti .info .down .item");

  let itemImgList = [
    "img/story1.jpg",
    "img/nightcity1.jpg",
    "img/character1.jpg",
    "img/gameplay1.jpg",
    "img/whatsnew.jpg",
  ];

  itemImg.click(function () {
    $(".cont_01 .inner .arti .info").slideToggle();
  });

  itemTitle.click(function () {
    i = $(this).index();

    itemImg.attr("src", itemImgList[i]);

    itemInfo.removeClass("on");

    itemInfo.eq(i).addClass("on");
  });

  let smallImg = $(".cont_01 .inner .arti .info .down .item .left img");

  smallImg.click(function () {
    let bigImgChange = $(this).attr("src");

    itemImg.attr("src", bigImgChange);
  });

  //cont_02 스크립트 시작

  let title = $(".cont_02 .inner .arti .right > .list p");
  let mainInfo = $(".cont_02 .inner .arti .left > .item");
  let subInfo = $(".cont_02 .inner .arti .center > .info");

  title.click(function () {
    mainInfo.removeClass("on");
    mainInfo.eq($(this).index()).addClass("on");

    subInfo.removeClass("on");
    subInfo.eq($(this).index()).addClass("on");
  });

  let prevBtn = $(
    ".cont_02 .inner .arti .center .info:nth-child(2) span:nth-child(1)"
  );
  let nextBtn = $(
    ".cont_02 .inner .arti .center .info:nth-child(2) span:nth-child(2)"
  );

  prevBtn.click(function () {
    nextBtn.removeClass('on')
    $(this).addClass('on')

    
    $(".cont_02 .inner .arti .left .item:nth-child(2) .in").removeClass("on");
    $(
      ".cont_02 .inner .arti .left .item:nth-child(2) .in:nth-child(1)"
    ).addClass("on");

    $('.cont_02 .inner .arti .center .info.on:nth-child(2) .text >div:nth-child(2)').removeClass('on')
    $('.cont_02 .inner .arti .center .info.on:nth-child(2) .text >div:nth-child(1)').addClass('on')

  });



  nextBtn.click(function () {

    $(".cont_02 .inner .arti .left .item:nth-child(2) .in").removeClass("on");
    $(
      ".cont_02 .inner .arti .left .item:nth-child(2) .in:nth-child(2)"
    ).addClass("on");
    
    prevBtn.removeClass('on')
    $(this).addClass('on')

    })
    $('.cont_02 .inner .arti .center .info.on:nth-child(2) .text > div:nth-child(1)').removeClass('on')
    $('.cont_02 .inner .arti .center .info.on:nth-child(2) .text > div:nth-child(2)').addClass('on')


  


  let glossaryBtn = $(".cont_02 .inner .arti .center > .info:nth-child(3) h4");

  let glossaryImg = $(".cont_02 .inner .arti .left > .item:nth-child(3) > .info");

  glossaryBtn.click(function () {
    glossaryImg.removeClass("on");
    glossaryImg.eq($(this).index()).addClass("on");
  });

  //cont_03 스크립트시작

  $(".cont_03 .change .inner .img .item").mouseenter(function () {
    // $('.cont_03 .inner .img').addClass('on')

    $(".cont_03 .change .inner.on .cont .item_04 .big_img img").removeClass(
      "on"
    );
    $(".cont_03 .change .inner.on .cont .item_04 .big_img img")
      .eq($(this).index())
      .addClass("on");

    $(".cont_03 .change .inner.on .cont .item_01 p").removeClass("on");
    $(".cont_03 .change .inner.on .cont .item_01 p")
      .eq($(this).index())
      .addClass("on");

    $(".cont_03 .change .inner.on .cont .item_02 p").removeClass("on");
    $(".cont_03 .change .inner.on .cont .item_02 p")
      .eq($(this).index())
      .addClass("on");
  });
  $(".cont_03 .change .inner .cont .item_03 h3").click(function () {
    $(".cont_03 .change .inner").removeClass("on");
    $(".cont_03 .change .inner").eq($(this).index()).addClass("on");
  });

  //cont_04 스크립트시작
  $(".cont_04 .inner .left .cont_01 > div").click(function () {
    $(this).addClass("on");
  });
  $(".cont_04 .inner .left").mouseleave(function () {
    $(".cont_04 .inner .left .cont_01 > div.on").removeClass("on");
  });

  $(".cont_04 .inner .left .cont_02 span").click(function () {
    $(".cont_04 .inner .center .cont_01 .item").removeClass("on");
    $(".cont_04 .inner .center .cont_01 .item")
      .eq($(this).index())
      .addClass("on");
  });

});
