const body = document.querySelector("body");

window.addEventListener("load", function () {
    function a(a, b) {
        let c = /^(?:file):/, d = new XMLHttpRequest, e = 0;
        d.onreadystatechange = function () {
            4 === d.readyState && (e = d.status), c.test(location.href) && d.responseText && (e = 200), 4 === d.readyState && 200 === e && (a.innerHTML = d.responseText + a.innerHTML)
        };
        try {
            d.open("GET", b, false);
            d.send();
        } catch (f) {
        }
    }
    document.querySelectorAll("[data-include]").forEach(i => {
        a(i, i.attributes.getNamedItem("data-include").value + ".html");
        i.attributes.removeNamedItem("data-include");
    });
});

// UTILS
function log(s) { // Упрощенный лог
    console.log(s);
}

function Lightboxer() {
    let div = document.createElement("div");
    div.classList.add("lightbox-container", "d-none", "o-none");
    body.appendChild(div);
    this.div = div;
    this.closeBox = function () {
        let func = function () {
            div.classList.add("d-none");
            div.removeEventListener("transitionend", func, false);
            div.remove();
        };
        div.classList.add("o-none");
        div.addEventListener("transitionend", func, false);
        body.classList.remove("overflow-hidden");
    };
    this.setHtml = function (html) {
        div.innerHTML = html
    };
    this.show = function () {
        body.classList.add("overflow-hidden");
        div.classList.remove("d-none");
        setTimeout(function () {
            div.classList.remove("o-none");
        }, 20);
    };
}

function modal(clicker, modal_div, func) {
    modal_div = document.querySelector(modal_div);
    let id = guidGenerator();
    document.querySelectorAll(clicker).forEach(clicker => {
        clicker.addEventListener('click', function (e) {
            e.preventDefault();
            let lightboxer = new Lightboxer();
            lightboxer.div.id = id;
            lightboxer.setHtml("<div class='modal-form'><span class='btn-modal-form-close'></span>" + modal_div.innerHTML + "</div>");
            document.querySelector("#" + id).addEventListener('click', function (e) {
                if (e.target.classList.contains("lightbox-container") || e.target.classList.contains("btn-modal-form-close")) lightboxer.closeBox();
            });
            if (func != null) func(lightboxer.div, lightboxer);
            lightboxer.show();
        });
    });
}

function modalLoading() {
    let modal_div = document.createElement("div");
    modal_div.classList.add("modal");
    modal_div.innerHTML = "<img width='50' height='50' style='margin: auto' src='/assets/images/loading.gif'>";
    body.appendChild(modal_div);
    let lightboxer = new Lightboxer();
    lightboxer.setHtml("<div class='modal-loading'>" + modal_div.innerHTML + "</div>");
    lightboxer.show();
    return lightboxer;
}

function modalAlert(title, text) {
    let modal_div = document.createElement("div");
    modal_div.classList.add("modal");
    let id = guidGenerator();
    modal_div.innerHTML = "<div><h3>" + title + "</h3><p>" + text + "</p></div>";
    body.appendChild(modal_div);
    let lightboxer = new Lightboxer();
    lightboxer.div.id = id;
    lightboxer.setHtml("<div class='modal-form modal-alert'><span class='btn-modal-form-close'></span>" + modal_div.innerHTML + "</div>");
    document.querySelector("#" + id).addEventListener('click', function (e) {
        if (e.target.classList.contains("lightbox-container") || e.target.classList.contains("btn-modal-form-close")) lightboxer.closeBox();
    });
    lightboxer.show();
}

//modalAlert("tt", "dasd");

function guidGenerator() {
    let S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return "q" + (S4() + S4() + S4() + S4() + S4() + S4());
}

function ajax(data, link, success) {
    let l = modalLoading();
    fetch(link, {method: 'POST', credentials: 'same-origin', body: data})
        .then(function (response) {
            let responseData = false;
            try {
                responseData = response.json();
            }
            catch (e) {
                responseData = {status: false, statusText: "Произошла ошибка при соединении"};
                response.text().then(console.debug);
            }

            return responseData;
        })
        .catch(function (e) {
            modalAlert("Произошла ошибка", "Позвоните нам, и мы ответим на любой Ваш вопрос");
            console.log(e);
        })
        .then(function (response) {
            if (response.status) {
                if (success) success(response);
            }
            return response.status;
        })
        .finally(() => {
            l.closeBox();
            //alert("Ебеня какие-то");
        });
}

function inputNumber(input) {
    input.onkeypress = function (e) {
        e = e || event;
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        let chr = getChar(e);
        if (chr == null) return;
        if (chr < '0' || chr > '9') {
            return false;
        }
    };
}

function getChar(event) {
    if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode) // IE
    }
    if (event.which !== 0 && event.charCode !== 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) // остальные
    }
    return null; // специальная клавиша
}
