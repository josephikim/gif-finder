// var axios = require('axios')

$(document).ready(function() {
  // Global objects
  var apiKey = 'tj4h4gdxevqPIJTUM8kTJjt91EWJTm9D'
  var limit = 10
  var offset = 0
  var lastClicked = ''
  var topics = ['Dave Chappelle', 'Dana Carvey', 'Jon Mulaney', 'Bill Hader', 'Robin Williams', 'Chris Rock', 'Louis CK', 'Aziz Ansari', 'Jerry Seinfeld', 'George Carlin']
  // var queryBaseURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&limit=' + limit + '&offset=' + offset + '&q='
  var queryBaseURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&limit=' + limit + '&offset='
  // Prototypes
  // Converts a string to Title Case
  String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Functions
  function initializeButtons(arr) {
    $('.buttons').empty();
    for (let text of arr)
      $('<button></button').text(text).addClass('btn btn-info').appendTo('.buttons')
  }

  function loadGifs(topic, query) {
    $.ajax({
      url: query,
      method: "GET"
    }).then(function(response) {
      console.log('response', response)
      if (!$.trim(response.data)){
        $('.main-content').html("<h1>No results found! Try again!</h1>");
        return
      }

      // For each element of the response's data object...
      response.data.forEach(function(obj) {

        // Create new div
        var div = $('<div class = \'gif-wrap\'></div>')

        // Create image
        var img = $('<img>')
        var rating = $('<p>Rating: ' + obj.rating.toUpperCase() + '</p>')
        var animateLink = obj.images.fixed_height.url;
        var stillLink = obj.images['480w_still'].url;
        var downloadLink = obj.images.original.url;
        var downloadBtn = $(`<a class="btn btn-success download-btn" href="${downloadLink}" target="_blank" download>Download GIF</a>`)
        img.attr({
          src: obj.images['480w_still'].url,
          height: 200,
          "data-state": "still",
          "data-still": stillLink,
          "data-animate": animateLink
        })

        // Add new div to main section
        div.append(rating)
        div.append(img).append("<br>")
        div.append(downloadBtn)
        $('.main-content').append(div)
      })
      // Increment offset
      offset += limit
      var index = topics.findIndex(item => topic.toLowerCase() === item.toLowerCase());
      if(index < 1) addButton(topic)
    })
  }

  function addButton(string) {
    topics.push(string.toTitleCase())
    console.log(topics)
    $('.buttons').empty();
    initializeButtons(topics);
  }

  // Clear userinput on click
  $('#userinput').on("click", function() {
    $('#userinput').attr('value', '');

  })

  // Toggle GIF playback on click
  $(document).on('click', '.main-content img', function() {
    var state = $(this).attr("data-state");
    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }
  })

  // Handler for 'Download GIF' buttons
  $('.gif-wrap a').on("click", function() {
    var queryURL = $(this).attr("href");
    console.log('clicked link', queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
        responseType: 'blob'
      })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${lastClicked}.gif`);
      document.body.appendChild(link);
      link.click();
    });
  })

    // var onChange = function(evt) {
    //   console.info(this.value);
    //   // or
    //   console.info(evt.target.value);
    // };
    // var input = document.getElementById('userinput');
    // input.addEventListener('input', onChange, false);


  // Handler for search button
  $('input[value="Search"]').on("click", function(event) {
    event.preventDefault();
    lastClicked = $("#userinput").val().trim()
    // Check for duplicate input
    var index = topics.findIndex(item => lastClicked.toLowerCase() === item.toLowerCase());
    // console.log('index:', index);
    // console.log('userinput current value', document.getElementById("userinput").value)

    // if (lastClicked != '' && lastClicked != $("#userinput").defaultValue && index < 0) {
    if (lastClicked != '' && document.getElementById("userinput").value != null && index < 0) {
      // Set queryURL
      offset = 0
      var string = encodeURIComponent(lastClicked);
      var queryURL = queryBaseURL + offset + '&q=' + string
      console.log('new queryURL: ' + queryURL)
      $('.main-content').empty();
      loadGifs(lastClicked, queryURL)
    } else {
      console.log('last clicked:', lastClicked)
      $("#userinput").attr("value","Try again!")
    }
  });

  // Handler for Moar! button
  $('input[value="Moar!"]').on("click", function() {
    console.log('lastClicked', lastClicked)
    if(lastClicked) {
      string = encodeURIComponent(lastClicked)
      // Make AJAX call
      var queryURL = queryBaseURL + offset + '&q=' + string
      console.log('queryUrl', queryURL)
      loadGifs(lastClicked, queryURL)
    }
  });

  // Handler for topic buttons. When the user clicks on a topic, make an API call to get 10 gif objects from the Giphy API and display them.
  $(document).on('click', '.buttons .btn', function() {
    var firedButton = $(this).text();
    var string = encodeURIComponent(firedButton);
    $('#userinput').attr('value', 'Enter a search term');

    // Clear screen if user clicked on a different button
    if(firedButton !== lastClicked) {
      $('.main-content').empty();
      offset = 0;
    }

    // Update last clicked
    lastClicked = firedButton

    // Make AJAX call
    var queryURL = queryBaseURL + offset + '&q=' + string
    console.log('queryURL', queryURL)
    loadGifs(firedButton, queryURL)

  });
  // Main Program
  initializeButtons(topics);
});