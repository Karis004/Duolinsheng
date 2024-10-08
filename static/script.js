var my_list, days;
var currentIndex = 0;
var file_name;
var learn_words;
var height_now;
var width_now;
var top_now;
var right_now;
var xhr = new XMLHttpRequest();
var reg = /[\u4e00-\u9fa5]/;
var error_num_list;


function confettiJs() {
    const duration = 2 * 1000,
        animationEnd = Date.now() + duration,
        defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // since particles fall down, start a bit higher than random
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
        );
        confetti(
            Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        );
    }, 250);
}

function celebrate() {
    const end = Date.now() + 1 * 1000;
    const colors = ["#bb0000", "#ffffff"];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });

        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
};

var audioPlayer = document.getElementById('audioPlayer');
var word_check = 1;

function displayNextItem() {
    var show_word = my_list[currentIndex]
    document.getElementById('itemDisplay').querySelector('span').innerText = show_word;
    if ((currentIndex + 1) != my_list.length) {
        if (show_word.charAt(0) == '~') {
            mistake_btn.style.display = 'none';
            var endIndex = show_word.indexOf("\n", 33);
            if (endIndex === -1) {
                endIndex = show_word.length;
            }
            var extracted_word = show_word.substring(33, endIndex);
            audioPlayer.src = "http://dict.youdao.com/dictvoice?type=1&audio=" + extracted_word;
            audioPlayer.pause();
            audioPlayer.play();
        } else {
            if (!reg.test(show_word)) {
                mistake_btn.style.display = 'none';
                audioPlayer.src = "http://dict.youdao.com/dictvoice?type=1&audio=" + show_word;
                audioPlayer.pause();
                audioPlayer.play();
            }
            if (word_check % 2 == 1) {
                mistake_btn.style.display = 'none';
            } else {
                mistake_btn.style.display = 'block';
            }
            if (error_num_list){
                red_badge.innerText =  error_num_list[Math.round(((word_check-1)%(error_num_list.length*2)+1)/2)-1]
            }
            if (show_word.includes('单词本')) {
                celebrate();
                word_check++;
            }
            word_check++;
        }
    } else {
        if (error_num_list){
            red_badge.style.display = 'none';
        }
        mistake_btn.style.display = 'none';
        if (mistake_list.length > 0) {
            xhr.open("POST", "/report_mistake", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log('report_mistake success');
                } else {
                    console.log('report_mistake failed');
                }
            };
            xhr.send(JSON.stringify({ mistake_list: mistake_list, file_name: file_name }));
        }
    }
    currentIndex++;
    if (currentIndex == my_list.length) {
        currentIndex = 0;
        confettiJs();
    }
}


function send_post() {
    var promise = new Promise(function (resolve, reject) {
        var data = JSON.stringify({ file_name: file_name, learn_words: learn_words });
        xhr.open("POST", "/get_start", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.my_list;
                days = response.days;
                resolve([my_list, days]);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send(data);
    })
    return promise;
}

async function display_review() {
    var get_data = await send_post();
    my_list = get_data[0];
    days = get_data[1];
    my_list.push('Congratulations!\n连胜' + days + '天');
    mistake_btn.style.display = 'block';
    displayNextItem();
    width_now = btn.offsetWidth;
    height_now = btn.offsetHeight;
    top_now = btn.getBoundingClientRect().top;
    right_now = btn.getBoundingClientRect().right;
    mistake_btn.style.top = top_now + height_now + 30 + 'px';
    mistake_btn.style.width = width_now + 'px';
}

var start_flag = true;
var select_btn = document.getElementById('radio-buttons');
var btn = document.getElementById('itemDisplay');
var input_learn_words = document.getElementById('input');
var mistake_btn = document.getElementById('mistake_btn');
// var test = document.getElementById('test');

btn.addEventListener('click', function () {
    if (start_flag) {
        if (file_name == undefined) {
            alert('请选择用户');
            return;
        }
        learn_words = input_learn_words.value;
        if (learn_words == undefined) {
            input_learn_words.value = '5';
        }
        document.cookie = "learn_words=" + learn_words;
        display_review();
        start_flag = false;
        select_btn.style.display = 'none';
        input_learn_words.style.display = 'none';
        review_btn.style.display = 'none';
        error_book_img.style.display = 'none';
    } else {
        displayNextItem();
        height_now = btn.offsetHeight;
        width_now = btn.offsetWidth;
        top_now = btn.getBoundingClientRect().top;
        right_now = btn.getBoundingClientRect().right;
        mistake_btn.style.top = top_now + height_now + 30 + 'px';
        mistake_btn.style.width = width_now + 'px';
        red_badge.style.top = top_now - 15 + 'px';
        red_badge.style.left = right_now - 20 + 'px';
    }
});

var mistake_list = [];
mistake_btn.addEventListener('click', function () {
    var mistake = my_list[currentIndex - 2];
    if (reg.test(mistake)) {
        mistake = my_list[currentIndex - 1]
    }
    mistake_list.push(mistake);
});

const radioButtons = document.querySelectorAll('.radio-button input[name="option"]');
let selectedOption;

var username = getCookie('username');
if (username) {
    if (username === 'Karis') {
        file_name = 'Karis';
        radioButtons[0].checked = true;
    } else if (username === 'Tracy') {
        file_name = 'Tracy';
        radioButtons[1].checked = true;
    }
} else {
    console.log("No username cookie found.");
}

radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        if (this.checked) {
            selectedOption = this.value;
            if (selectedOption != username) {
                alert('请确定是否改变用户');
            }
            file_name = selectedOption;
            document.cookie = "username=" + selectedOption;
        }
    });
});

function getCookie(name) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : '';
}


var learn_words_cookie = getCookie('learn_words');
if (learn_words_cookie) {
    input_learn_words.value = learn_words_cookie;
} else {
    console.log("No learn_words cookie found.");
}


function send_post_to_get_review() {
    var promise = new Promise(function (resolve, reject) {
        var data = JSON.stringify({ file_name: file_name });
        xhr.open("POST", "/get_review", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.res;
                days = response.days;
                resolve([my_list, days]);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send(data);
    })
    return promise;
}

async function display_review_to_get_review() {
    var get_data = await send_post_to_get_review();
    my_list = get_data[0];
    days = get_data[1];
    if (Array.isArray(my_list)) {
        my_list.push('Congratulations!\n连胜' + days + '天');
        start_flag = false;
        review_btn.style.display = 'none';
        select_btn.style.display = 'none';
        input_learn_words.style.display = 'none';
        error_book_img.style.display = 'none';
        displayNextItem();
    } else {
        alert('多少先学点吧！');
    }
}

var review_btn = document.getElementById('review_btn');
review_btn.addEventListener('click', function () {
    display_review_to_get_review();
});

var red_badge = document.getElementById('red_badge');
var error_book_img = document.getElementById('error_book_img')
error_book_img.addEventListener('click', function () {
    display_review_to_error_book();
});

function send_post_to_error_book() {
    var promise = new Promise(function (resolve, reject) {
        var data = JSON.stringify({ file_name: file_name });
        xhr.open("POST", "/error_book", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = JSON.parse(xhr.responseText);
                my_list = response.res;
                error_num_list = response.error_num_list;
                resolve([my_list, error_num_list]);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.send(data);
    })
    return promise;
}

async function display_review_to_error_book() {
    var get_data = await send_post_to_error_book();
    my_list = get_data[0];
    error_num_list = get_data[1];
    if (Array.isArray(my_list)) {
        my_list.push('复习完了！');
        red_badge.innerText = error_num_list[0]
        start_flag = false;
        review_btn.style.display = 'none';
        select_btn.style.display = 'none';
        input_learn_words.style.display = 'none';
        error_book_img.style.display = 'none';
        error_book_img.style.display = 'none';
        displayNextItem();
        top_now = btn.getBoundingClientRect().top;
        right_now = btn.getBoundingClientRect().right;
        red_badge.style.top = top_now - 15 + 'px';
        red_badge.style.left = right_now - 20 + 'px';
        red_badge.style.visibility = 'visible'
    } else {
        alert('没有案底');
    }
}