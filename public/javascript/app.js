// var axios = require('axios')

$(document).ready(function() {
  // Global objects
  var apiKey = 'tj4h4gdxevqPIJTUM8kTJjt91EWJTm9D'
  var limit = 10
  var offset = 0
  var lastClicked = ''
  var topics = ['Dave Chappelle', 'Chris Farley', 'Adam Sandler', 'Jim Carrey', 'Will Ferrell']
  var queryBaseURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&limit=' + limit + '&offset='
  // Prototypes
  // Converts a string to Title Case
  String.prototype.toTitleCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };


  function initializeButtons(arr) {
    $('#buttons').empty();
    for (let text of arr)
      $('<button></button').text(text).addClass('btn btn-primary').appendTo('#buttons')
    console.log('offset', offset)
  }

  function loadGifs(topic, queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log('response', response)
      if (!$.trim(response.data)){
        $('#scrollable-div').prepend("<h1>No results found! Try again!</h1>");
        return
      }
      // For each element of the response's data object...
      response.data.forEach(function(currentValue, index) {

        // Create image
        var img = $('<img>')
        var rating = $('<span>Rating: <b>' + currentValue.rating.toUpperCase() + '</b></span>')
        var animateLink = currentValue.images.fixed_height.url; // string
        var stillLink = currentValue.images['480w_still'].url; // string
        var downloadLink = currentValue.images.original.url; // string
        var downloadBtn = $(`<a class="download-link" href="${downloadLink}" target="_blank" download>Download >></a>`)
        img.attr({
          src: currentValue.images['480w_still'].url,
          // width: 400,
          "class": "gif",
          "data-state": "still",
          "data-still": stillLink,
          "data-animate": animateLink
        })

        // Create play button image
        var playButtonImg = $('<img>')
        playButtonImg.attr({
          src: "./public/images/play-btn-white.png",
          "class": "gif-overlay",
          // style: "padding: 75px",
          // "data-state": "still",
        })
        var div = $('<div class = \'gif-wrap\'></div>')
        var divInner = $('<div class = \'gif-img-wrap\'></div>')
        divInner.append(playButtonImg, img)
        div.append(rating, divInner, downloadBtn)
        // Add gif container to fluid bootstrap divs consecutively
        // $('#scrollable-div').append(div)
        console.log('index', index)
        var gifContainer = $('<div class="col-sm-12 col-md-6 col-lg-4 col-xl-3"><div class="gif-container img-fluid" id="' + `${index}` + '"></div></div>')
        $('div#scrollable-div').append(gifContainer)
        $(`div#${index}.gif-container`).append(div)
        // html.append(img).append("<br>")
        // html.append(downloadBtn)
        // $('.main-content').append(html)
        // $('.main-content div').append(div)
      })
      // Increment offset
      offset += limit
      // Add button for current topic if not displayed
      var lowercaseTopics = topics.map(v => v.toLowerCase());
      var matchIndex = lowercaseTopics.indexOf(topic.toLowerCase());
      if(matchIndex < 0) addButton(topic)
    })
  }

  function addButton(string) {
    topics.push(string.toTitleCase())
    console.log(topics)
    $('#buttons').empty();
    initializeButtons(topics);
    // placeContentContainer()
  }

  function performSearch() {
    console.log('$("#userinput").val()', $("#userinput").val())
    input = $("#userinput").val().trim()
    // Check for invalid input
    if (input === "Enter a search term" || input === "" || input === null) return
    // Check for duplicate input
    // var lowercaseTopics = topics.map(v => v.toLowerCase());
    // var index = lowercaseTopics.indexOf(input.toLowerCase());
    // console.log('index', index)
    if(input.toLowerCase() !== lastClicked.toLowerCase()) {
      // $('#scrollable-div').empty();
      $('.gif-container').empty();
    }
    offset = 0;
    lastClicked = input
    // API call
    var string = encodeURIComponent(input);
    var queryURL = queryBaseURL + offset + '&q=' + string
    console.log('queryURL: ' + queryURL)
    loadGifs(input, queryURL)
  }

  // function placeContentContainer() {
  //   // Adjust top margin of container div
  //   var contentPlacement = $("#buttons").position().top + $("buttons").height();
  //   $('.container').css('margin-top',contentPlacement);
  // }
  // Toggle GIF playback on click
  // $(document).on('click', '.main-content img', function() {
  //   var state = $(this).attr("data-state");
  //   if (state === "still") {
  //     $(this).attr("sr c", $(this).attr("data-animate"));
  //     $(this).attr("data-state", "animate");
  //   } else {
  //     $(this).attr("src", $(this).attr("data-still"));
  //     $(this).attr("data-state", "still");
  //   }
  // })

  // Clear userinput on click
  $('#userinput').on("click", function() {
    $('#userinput').attr('value', '');
  })

  // Handler for search button
  $('input[value="Search"]').on("click", function(event) {
    event.preventDefault();
    performSearch()
  });

  // Handler for 'Enter' keypress
  document.getElementById("userinput").addEventListener("keydown", function(e) {
    // Enter is pressed
    if (e.keyCode == 13) { 
      performSearch()
    }
  }, false);

  // Handler for MOAR button
  $('input[value="MOAR"]').on("click", function() {
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
  $(document).on('click', '#buttons .btn', function() {
    var firedButton = $(this).text();
    var string = encodeURIComponent(firedButton);
    $('#userinput').attr('value', 'Enter a search term');

    // Clear screen if user clicked on a different button
    if(firedButton.toLowerCase() !== lastClicked.toLowerCase()) {
      // $('#scrollable-div').empty();
      $('.gif-container').empty();
    }
    offset = 0
    lastClicked = firedButton
    // Make AJAX call
    var queryURL = queryBaseURL + offset + '&q=' + string
    console.log('queryURL', queryURL)
    loadGifs(firedButton, queryURL)
  });

  $(document).on('click', '.gif-img-wrap', function() {
    console.log('clicked this:', this)
    $(this).children('.gif-overlay').attr('style', 'display: none')
    var gif = $(this).children('.gif')
    var state = gif.attr("data-state");
    if (state === "still") {
      gif.attr("src", gif.attr("data-animate"));
      gif.attr("data-state", "animate");
    } else {
      gif.attr("src", gif.attr("data-still"));
      gif.attr("data-state", "still");
      $(this).children('.gif-overlay').attr('style', 'display: initial')
    }
  })


  // Handler for 'Download GIF' buttons
  $(document).on('click', '.download-link', function() {
    console.log('this clicked', this)
    var queryURL = $(this).attr("href");
    console.log('queryURL', queryURL)
    $.ajax({
        url: queryURL,
        method: "GET",
        responseType: 'blob'
      })
    .then((response) => {
      console.log('response', response)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${lastClicked}.gif`);
      document.body.appendChild(link);
      link.click();
    });
  })

// Toggle bootstrap nav handlers 
  $( ".close" ).hide();
  $( ".menu" ).hide();
  $( ".hamburger" ).click(function() {
    // $( ".menu" ).slideToggle( "slow", function() {
    //   $( ".hamburger" ).hide();
    //   $( ".close" ).show();
    // });
    $( ".menu" ).show();
    $( ".hamburger" ).hide();
    $( ".close" ).show();
  });
  $( ".close" ).click(function() {
    // $( ".menu" ).slideToggle( "slow", function() {
    //   $( ".close" ).hide();
    //   $( ".hamburger" ).show();
    // });
    $( ".menu" ).hide();
    $( ".close" ).hide();
    $( ".hamburger" ).show();
  });

  // Main Program
  initializeButtons(topics);
  // placeContentContainer();
  // window.addEventListener('resize', () => placeContentContainer());
});