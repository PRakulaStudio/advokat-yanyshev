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


    if (location.hostname !== "new.advokat-yanyshev.ru" && location.hostname !== "advokat-yanyshev.ru")
        document.querySelectorAll("[data-template]").forEach(i => {
            a(i, "parts/" + i.attributes.getNamedItem("data-template").value + ".html");
            i.attributes.removeNamedItem("data-template");
        });

    let path = location.pathname.split('/')[1];
    if (path === "") path = "/";
    else path = "/" + path + "/";
    let menuItem = document.querySelector("header nav a[href='" + path + "']");
    if (menuItem != null)
        menuItem.parentNode.classList.add('active');


    let serviceSituations = document.querySelector(".service-situations ul");
    if (serviceSituations != null) {
        serviceSituations.classList.add("row");
        serviceSituations.querySelectorAll("li").forEach((li, index) => {
            li.classList.add("col");
            li.innerHTML = '<span class="situations__index">' + (index + 1) + '</span>' + li.innerHTML;
        });
    }
    let btn = document.querySelector('.menu__btn');

    btn.addEventListener("click", e => {
        showMenu();
    });

    let images = document.querySelectorAll(".awards .row img");
    images.forEach((img, index) => {
        if (img.attributes.hasOwnProperty('width'))
            img.attributes.removeNamedItem('width');
        if (img.attributes.hasOwnProperty('height'))
            img.attributes.removeNamedItem('height');
        img.classList.add('col');
        img.addEventListener('click', function () {
            let toIndex = index;

            let listener = (event) => {
                if (event.keyCode === 37) toPrev();
                else if (event.keyCode === 39) toNext();
            };
            let lightboxer = new Lightboxer();
            setImgHtml(img);
            document.addEventListener('keydown', listener, false);
            lightboxer.show();

            function setImgHtml(img) {
                //lightboxer.setHtml('<span>&#8592;</span><span>&#8594;</span>' + img.outerHTML);
                lightboxer.setHtml(img.outerHTML + '<span></span><span></span><div class="close"></div>');
                lightboxer.div.querySelector('.close').addEventListener('click', function (event) {
                    lightboxer.closeBox();
                    document.removeEventListener('keydown', listener, false);
                })
                let spans = lightboxer.div.querySelectorAll('span');
                spans[0].addEventListener('click', evt => {
                    evt.preventDefault();
                    toPrev();
                });
                spans[1].addEventListener('click', evt => {
                    evt.preventDefault();
                    toNext();
                });
                lightboxer.div.querySelectorAll('img').forEach(img => {

                    let initialPoint;
                    let finalPoint;
                    img.addEventListener('touchstart', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        initialPoint = event.changedTouches[0];
                    }, false);
                    img.addEventListener('touchend', function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        finalPoint = event.changedTouches[0];
                        let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
                        let yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
                        if (xAbs > 20 || yAbs > 20) {
                            if (xAbs > yAbs) {
                                if (finalPoint.pageX < initialPoint.pageX) {
                                    toNext()
                                }
                                else {
                                    toPrev()
                                }
                            }
                        }
                        else {
                            toNext();
                        }
                    }, false);
                    img.addEventListener('click', function (event) {
                        toNext()
                    })
                });

            }

            function toPrev() {
                toIndex = toIndex - 1;
                if (toIndex < 0) toIndex = images.length - 1;
                setImgHtml(images[toIndex]);
            }

            function toNext() {
                toIndex = toIndex + 1;
                if (toIndex === images.length) toIndex = 0;
                setImgHtml(images[toIndex]);
            }
        });
    });

    document.querySelectorAll('.services__item').forEach(item => {
        item.addEventListener('click', function () {
            log(item);
            location.href = item.querySelector('a').attributes.getNamedItem('href').value;
        });
    })
    document.querySelectorAll('[data-mce-bogus]').forEach(item => {
        item.remove();
    });

    let scroll = document.createElement("div");
    scroll.classList.add('scrollup');
    body.appendChild(scroll);
    window.onscroll = function () {
        (window.pageYOffset > 200) ? scroll.classList.add('scrollup-o') : scroll.classList.remove('scrollup-o');
    };

    document.querySelector('div.scrollup').addEventListener('click', function (event) {
        animateScrollTo(0);
    });
    modal('.btn--open_form', '#form', function (div, lightboxer) {
    })
});

function showMenu() {
    let header = document.querySelector("header");
    let ul = header.querySelector(".menu__list").outerHTML;
    let logo = header.querySelector(".logo").outerHTML;
    let contacts = header.querySelector(".contacts").outerHTML;

    let lightboxer = new Lightboxer();
    lightboxer.setHtml("<div class='mobile_menu__wrapper'><div class='logo__wrapper'>" + logo + "<div class='menu__btn--close'><img src='/assets/icons/icons8-cancel.svg' alt=''></div></div>" + contacts + "<div class='menu__wrapper'>" + ul + "</div></div>");
    lightboxer.div.querySelector('.menu__btn--close').addEventListener('click', evt => {
        lightboxer.closeBox();
    });
    let menu__list = lightboxer.div.querySelector(".menu__list");
    menu__list.classList.remove('menu__list--hover');
    let items = disableMenuItems(menu__list);
    items.forEach(item => {
        let ul = item.querySelector("ul");
        if (ul != null) {
            let arrow = document.createElement('span');
            arrow.classList.add("arrow");
            item.append(arrow);
            arrow.addEventListener('click', e => {
                if (!ul.classList.contains("d-none")) {
                    let func = function () {
                        ul.classList.add("d-none");
                        ul.removeEventListener("transitionend", func, false);
                    };
                    ul.classList.add("o-none");
                    ul.addEventListener("transitionend", func, false);
                    arrow.classList.add("arrow-close");
                }
                else {
                    ul.classList.remove("d-none");
                    setTimeout(function () {
                        ul.classList.remove("o-none");
                    }, 20);
                    arrow.classList.remove("arrow-close");
                }
            });
        }
    });
    lightboxer.show();
}

function showMenu2() {
    log('dasd');
}

function disableMenuItems(menu_list) {
    let items = [];
    menu_list.querySelectorAll("li").forEach(value => {
        if (value.querySelector("ul")) {
            /*value.querySelector("a").addEventListener('click', evt => {
                evt.preventDefault();
            });*/
            items.push(value);
        }
    });
    return items;
}


// UTILS
function log(s) { // -Упрощенный лог
    console.log(s);
}

function Lightboxer() {
    let div = document.createElement("div");
    div.classList.add("lightboxer-container", "d-none", "o-none");
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
        div.addEventListener('click', ev => {
            if (ev.target.classList.contains("lightboxer-container")) this.closeBox();
        });
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
