var catsArray = [];
const colors = [
    'rgba(196, 198, 11, 1)',
    'rgba(251, 128, 95, 1)',
    'rgba(196, 78, 76, 1)',
    'rgba(108, 177, 132, 1)',
    'rgba(213, 164, 72, 1)',
    'rgba(167, 104, 87, 1)',
    'rgba(82, 121, 154, 1)',
    'rgba(108, 76, 117, 1)',
    'rgba(93, 159, 158, 1)',
];
var index = 0;

$.getJSON('/data', function (data) {
    processData(data.values);
});

// Primary Function for JSON
function processData(data) {
    const original = Array.from(data);
    delete data[0];
    data.sort((a, b) => (a[0] > b[0]) ? -1 : 1);

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var year = data[key][6],
                title = data[key][1],
                authors = data[key][7],
                labels = data[key][3],
                cat = data[key][5],
                desc = data[key][2],
                link = data[key][4],
                img = data[key][8],
                exclude = data[key][9] && data[key][9].trim().length;

            // Trim the description
            // desc = desc.split(' ').splice(0, 25).join(' ');

            if (!exclude) {
                // Send data to cards function
                createCards(year, title, authors, labels, cat, link, desc, img);
            }
        }
    }

    for (var key in original) {
        if (original.hasOwnProperty(key)) {
            var cat = original[key][5];
            exclude = original[key][9] && original[key][9].trim().length;
            // If category is new, push to array
            if (!exclude && catsArray.indexOf(cat) === -1) {
                catsArray.push(cat);
            }
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
    // var desc = (desc == '') ? '' : desc + '...';
    var desc = (desc == '') ? '' : desc;
    var authors = (authors == '') ? '' : '<strong>Per:</strong> ' + authors;
    var labels = (labels == '') ? '' : `🔖 <small>${labels}</small>`;
    var img = getImgSrc(img);

    var card =
        `<div class="card" data-category-type="${cat}" data-img-src="${img}">
        <a href="${link}" target="_blank">
          <div class="card-header">
            <span class="card-category"><!-- ${cat} --></span>
            <p class="card-date"><!-- ${year} --></p>
          </div>
          <div class="card-content">
            <p class="card-title">${title}</p>
            <p class="card-authors">${authors}</p>
            <p class="card-desc">${desc}</p>
            <p class="card-labels">${labels}</p>
          </div>
          <div class="card-footer"></div>
        </a>
      </div>`;

    $('.resources').append(card);
}

// Create Filter
function createFilter() {
    // catsArray.sort();

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
                const background = `linear-gradient(black, black), url(${img})`;
                const headerBackground =
                    `linear-gradient(225deg, rgba(${r},${g},${b},1) 0%, rgba(${r},${g},${b},1) 2rem, rgba(0,0,0,0) 2rem, rgba(0,0,0,0) 100%)`;
                $(y).css({
                    'background': background,
                    'background-size': 'contain',
                    'background-position': 'top',
                    'background-blend-mode': 'saturation',
                });
                $(y).find('.card-header').css({
                    'background': headerBackground,
                });
            }
        });
    });
}

function normalizeText(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getDriveUrlFromId(id) {
    return `https://lh3.googleusercontent.com/d/${id}=w1000?authuser=1/view`;
}

function getImgSrc(str) {
    try {
        var id = new URL(str).searchParams.get('id');
        if (id) {
            return getDriveUrlFromId(id);
        }
        var m = str.match(
            new RegExp('https://drive.google.com/file/d/([^/]*)/'),
        );
        if (m) {
            return getDriveUrlFromId(m[1]);
        }
    } catch {
        return '/static/placeholder.jpg';
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
