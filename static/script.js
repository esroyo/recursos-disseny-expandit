var catsArray = [];
/*
var colors = [
    '#F479A3',
    '#E91F63',
    '#DE0F00',
    '#9D27B0',
    '#4E00D8',
    '#001FE0',
    '#2197F3',
    '#78AEFF',
    '#03BBD4',
    '#009688',
    '#4CAF50',
    '#076B0B',
    '#ABB92D',
    '#DAC406',
    '#FFC008',
    '#FF9800',
    '#FE470E',
    '#C60E00',
    '#816464',
];
*/
var colors = [
    'rgba(244, 121, 163, 1)',
    'rgba(233, 31, 99, 1)',
    'rgba(222, 15, 0, 1)',
    'rgba(157, 39, 176, 1)',
    'rgba(78, 0, 216, 1)',
    'rgba(0, 31, 224, 1)',
    'rgba(33, 151, 243, 1)',
    'rgba(120, 174, 255, 1)',
    'rgba(3, 187, 212, 1)',
    'rgba(0, 150, 136, 1)',
    'rgba(76, 175, 80, 1)',
    'rgba(7, 107, 11, 1)',
    'rgba(171, 185, 45, 1)',
    'rgba(218, 196, 6, 1)',
    'rgba(255, 192, 8, 1)',
    'rgba(255, 152, 0, 1)',
    'rgba(254, 71, 14, 1)',
    'rgba(198, 14, 0, 1)',
    'rgba(129, 100, 100, 1)',
];
var index = 0;

$.getJSON('/data', function (data) {
    processData(data.values);
});

// Primary Function for JSON
function processData(data) {
    delete data[0];
    data.sort((a, b) => (a[5] > b[5]) ? -1 : 1);

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var year = data[key][5],
                title = data[key][0],
                authors = data[key][6],
                labels = data[key][2],
                cat = data[key][4],
                desc = data[key][1],
                link = data[key][3],
                img = data[key][7];

            // Trim the description
            desc = desc.split(' ').splice(0, 25).join(' ');

            // If category is new, push to array
            if (catsArray.indexOf(cat) === -1) {
                catsArray.push(cat);
            }

            // Send data to cards function
            createCards(year, title, authors, labels, cat, link, desc, img);
        }
    }

    // Send data to filter function
    createFilter(cat);

    // Match colors to categories
    matchColor();
}

// Create cards
function createCards(year, title, authors, labels, cat, link, desc, img) {
    var year = (year == '') ? '' : year;
    var desc = (desc == '') ? '' : desc + '...';
    var authors = (authors == '') ? '' : '<strong>Per:</strong> ' + authors;
    var labels = (labels == '') ? '' : `🔖 <small>${labels}</small>`;
    var img = getImgSrc(img);

    var card =
        `<div class="card" data-category-type="${cat}" data-img-src="${img}">
        <a href="${link}" target="_blank">
          <div class="card-header">
            <span class="card-category">${cat}</span>
            <p class="card-date">${year}</p>
          </div>
          <div class="card-content">
            <p class="card-title">${title}</p>
            <p class="card-authors">${authors}</p>
            <p class="card-desc">${desc}</p>
            <p class="card-labels">${labels}</p>
          </div>
        </a>
      </div>`;

    $('.resources').append(card);
}

// Create Filter
function createFilter() {
    catsArray.sort();

    for (i = 0; i < catsArray.length; i++) {
        $('<li/>')
            .attr('data-category-type', catsArray[i])
            .text(catsArray[i])
            .css('color', colors[index])
            .appendTo('.categories');

        index++;
    }

    // Add filter
    $('.categories li').on('click', function (e) {
        e.preventDefault();

        var filter = $(this).data('categoryType');

        if (filter === 'all') {
            $('.card').show();
        } else {
            $('.card').hide();
            $('.card[data-category-type="' + filter + '"]').show();
        }
    });
}

// Match colors to categories
function matchColor() {
    $('.categories li').filter(function (i) {
        var x = $(this);

        $('.card').each(function () {
            var y = $(this);

            if (x.attr('data-category-type') == y.attr('data-category-type')) {
                var color = $(x).css('color');
                console.log(color);
                var [r, g, b] = color.match(/rgba?\(([^,)]*),([^,)]*),([^,)]*)/)
                    .splice(1);
                var img = y.attr('data-img-src');
                const background =
                    `linear-gradient(180deg, rgba(${r},${g},${b},1) 0%, rgba(${r},${g},${b},0.7) 15%, rgba(255,255,255,1) 16%, rgba(255,255,255,1) 100%), url(${img})`;
                console.log(background);
                $(y).css({
                    'background': background,
                    'background-size': 'contain',
                    'background-position': 'center',
                });
            }
        });
    });
}

function normalizeText(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getImgSrc(str) {
    try {
        var id = new URL(str).searchParams.get('id');
        return `https://lh3.googleusercontent.com/d/${id}=w1000?authuser=1/view`;
    } catch {
        return '';
    }
}

// Search Bar
$(document).ready(function () {
    $('.search').on('keyup', function () {
        var value = normalizeText($(this).val());
        $('.resources .card').filter(function () {
            $(this).toggle(normalizeText($(this).text()).indexOf(value) > -1);
        });
    });
});
