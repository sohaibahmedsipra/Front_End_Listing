$(document).ready(function () {

    const addJobButton = $('.add');
    const popupForm = $('.popup-form');
    const closePopup = $('.close');
    const filters = [];
    var jobs = [];

    addJobButton.click(function () {
        popupForm.show();
    });

    closePopup.click(function () {
        popupForm.hide();
    });

    $('#jobForm').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the selected values for languages
        const selectedLanguages = [];
        $('input[name="languages"]:checked').each(function () {
            selectedLanguages.push($(this).val());
        });

        // Get the selected values for tools
        const selectedTools = [];
        $('input[name="tools"]:checked').each(function () {
            selectedTools.push($(this).val());
        });

        var company_name;
        if ($('#company').val() == 'Photosnap') {
            company_name = 'photosnap';
        }
        else if ($('#company').val() == 'Manage') {
            company_name = 'manage';
        }
        else if ($('#company').val() == 'Account') {
            company_name = 'account';
        }
        else if ($('#company').val() == 'MyHome') {
            company_name = 'myhome';
        }
        else if ($('#company').val() == 'Loop Studios') {
            company_name = 'loop-studios';
        }
        else if ($('#company').val() == 'FaceIt') {
            company_name = 'faceit';
        }
        else if ($('#company').val() == 'Shortly') {
            company_name = 'shortly';
        }
        else if ($('#company').val() == 'Insure') {
            company_name = 'insure';
        }
        else if ($('#company').val() == 'Eyecam Co.') {
            company_name = 'eyecam-co';
        }
        else if ($('#company').val() == 'The Air Filter Company') {
            company_name = 'the-air-filter-company';
        }

        const company = $('#company').val();
        const position = $('#position').val();
        const contact = $('input[name="contact"]:checked').val();
        const location = $('#location').val();
        const role = $('input[name="role"]:checked').val();
        const level = $('#level').val();
        // Create a job object with form data
        const job = {
            logo: './images/' + company_name + '.svg',
            company: company,
            position: position,
            contract: contact,
            role: role,
            location: location,
            level: level,
            languages: selectedLanguages,
            tools: selectedTools,
            postedAt: 'Just Now!',
            new: true,
            featured: false
        };

        // Call the addJob function with the created job object
        addJob(job);
        jobs.push(job);


        // Close the popup form
        $('#popupForm').hide();
    });

    //read data from json file
    $.getJSON('data.json', function (data) {
        data.forEach(job => {
            addJob(job);
            jobs.push(job);
        });
    });

    $('.clear-filters').hide();
    // Add filter buttons for role, tool, language, and level
    $('body').on('click', '.right button', function () {

        //show clear filters button
        $('.clear-filters').show();

        const filterText = $(this).text();
        if (!filters.includes(filterText)) {
            filters.push(filterText);
            // Add filter button to .filters
            $('.filters').append(`<div class="filter">${filterText} <span class="remove-filter">X</span></div>`);
        }

        

        //re render jobs
        $('.listings').empty();
        //load jobs from jobs array
        jobs.forEach(job => {
            addJob(job);
        });
    });

    // Remove filter button when X is clicked
    $('body').on('click', '.remove-filter', function () {
        const filterText = $(this).parent().text().trim();
        filters.splice(filters.indexOf(filterText), 1);
        $(this).parent().remove();
        
        if (filters.length == 0) {
            $('.clear-filters').hide();
        }

        $('.listings').empty();
        jobs.forEach(job => {
            addJob(job);
        });
    });

    $('.clear-filters').click(function () {

        filters.length = 0;

        $('.filters').empty();

        $('.clear-filters').hide();

        $('.listings').empty();
        jobs.forEach(job => {
            addJob(job);
        });

    });




    function addJob(job) {
        const listings = $('.listings');
        const listing = $('<div class="listing"></div>');
        const im = $('<div class="listing-image"></div>');
        const left = $('<div class="left"></div>');
        const left_top = $('<div class="left-top"></div>');
        const left_bottom = $('<div class="left-bottom"></div>');

        const image = $('<img src="' + job.logo + '" alt="Job Image">');
        const company = $('<label class="company">' + job.company + '</label>');
        const new_tag = $('<label class="new">New!</label>');
        const featured_tag = $('<label class="featured">Featured</label>');
        const position = $('<h2>' + job.position + '</h2>');
        const details = $('<ul></ul>');
        const postedAt = $('<li class="posted">' + job.postedAt + '</li>');
        const contract = $('<li>' + job.contract + '</li>');
        const location = $('<li>' + job.location + '</li>');

        const jobFilters = [job.role, job.level, ...job.languages, ...job.tools];

        if (filters.length > 0) {
            if (!filters.every(filter => jobFilters.includes(filter))) {
                return;
            }
        }

        if (job.featured) {
            listing.css('border-left', '7px solid hsl(180, 29%, 50%)');
        }

        im.append(image);
        listing.append(im);
        left_top.append(company);
        if (job.new) {
            left_top.append(new_tag);
        }
        if (job.featured) {
            left_top.append(featured_tag);
        }

        left.append(left_top);

        details.append(postedAt);
        details.append(contract);
        details.append(location);

        left_bottom.append(position);
        left_bottom.append(details);

        left.append(left_bottom);

        listing.append(left);

        const right = $('<div class="right"></div>');

        const role = $('<button>' + job.role + '</button>');
        const level = $('<button>' + job.level + '</button>');
        const languages = job.languages.map(language => '<button>' + language + '</button>');
        const tools = job.tools.map(tool => '<button>' + tool + '</button>');
        const remove = $('<button class="remove">X</button>');

        right.append(role);
        right.append(level);
        right.append(languages);
        right.append(tools);
        right.append(remove);

        listing.append(right);

        listings.append(listing);

        remove.click(function () {
            const job_name = job.company + ' ' + job.position;
            listing.remove();
            jobs.splice(jobs.indexOf(job), 1);
            alert(job_name + ' is removed from listings');
        });

        image.click(function () {
            console.log('clicked');
            const jobpopup = $('<div class="job-popup"></div>');
            const popup_left = $('<div class="popup-left"></div>');
            const popup_right = $('<div class="popup-right"></div>');

            const popup_image = $('<img src="' + job.logo + '" alt="Job Image">');
            const popup_company = $('<h3>' + job.company + '</h3>');
            const popup_new_tag = $('<span class="new">New!</span>');
            const popup_featured_tag = $('<span class="featured">Featured</span>');

            const popup_position = $('<h2>' + job.position + '</h2>');
            const popup_details = $('<ul></ul>');
            const popup_postedAt = $('<li>' + job.postedAt + '</li>');
            const popup_contract = $('<li>' + job.contract + '</li>');
            const popup_location = $('<li>' + job.location + '</li>');

            const popup_role = $('<button>' + job.role + '</button>');
            const popup_level = $('<button>' + job.level + '</button>');
            const popup_languages = job.languages.map(language => '<button>' + language + '</button>');
            const popup_tools = job.tools.map(tool => '<button>' + tool + '</button>');

            const popup_close = $('<button class="popup-close">X</button>');

            popup_left.append(popup_image);
            popup_left.append(popup_company);
            if (job.new) {
                popup_left.append(popup_new_tag);
            }
            if (job.featured) {
                popup_left.append(popup_featured_tag);
            }

            popup_details.append(popup_postedAt);
            popup_details.append(popup_contract);
            popup_details.append(popup_location);

            popup_left.append(popup_position);
            popup_left.append(popup_details);

            popup_right.append(popup_role);
            popup_right.append(popup_level);
            popup_right.append(popup_languages);
            popup_right.append(popup_tools);
            popup_right.append(popup_close);

            jobpopup.append(popup_left);
            jobpopup.append(popup_right);

            $('.popup').append(jobpopup);

            popup_close.click(function () {
                $('.popup').empty();
                $('.popup').hide();
            });

            $('.popup').show();
        });
    }
});
