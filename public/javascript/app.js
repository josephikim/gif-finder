// var axios = require('axios')

$(document).ready(function() {
  // Global objects
  var apiKey = 'tj4h4gdxevqPIJTUM8kTJjt91EWJTm9D'
  var limit = 10
  var offset = 0
  var lastClicked = ''
  var topics = ['Dave Chappelle', 'Kate McKinnon', 'Adam Sandler', 'Jim Carrey', 'Will Ferrell']
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
    $('#buttons').empty();
    for (let text of arr)
      $('<button></button').text(text).addClass('btn btn-info').appendTo('#buttons')
    console.log('offset', offset)
  }

  function loadGifs(topic, queryURL) {
    console.log('loadgifs topic', topic)
    console.log('lastClicked', lastClicked)
    if(topic.toLowerCase() !== lastClicked.toLowerCase()) {
      // Clear displayed content
      $('.main-content').empty();
      // Reset query offset
      offset = 0;
      // Update last clicked
      lastClicked = topic
    }
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log('response', response)
      if (!$.trim(response.data)){
        $('.main-content').prepend("<h1>No results found! Try again!</h1>");
        return
      }
      // For each element of the response's data object...
      response.data.forEach(function(obj) {

        // Create image
        var img = $('<img>')
        var rating = $('<p>Rating: ' + obj.rating.toUpperCase() + '</p>')
        var animateLink = obj.images.fixed_height.url; // string
        var stillLink = obj.images['480w_still'].url; // string
        var downloadLink = obj.images.original.url; // string
        var downloadBtn = $(`<a class="download-link" href="${downloadLink}" target="_blank" download>Download GIF >></a>`)
        img.attr({
          src: obj.images['480w_still'].url,
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
        // console.log('playButtonImg', playButtonImg)
        //  console.log('typeof playButtonImg', typeof playButtonImg)
        // Create new div
        // var html = $('<div class = \'gif-wrap\'></div>')
        var div = $('<div class = \'gif-wrap\'></div>')
        var divInner = $('<div class = \'gif-img-wrap\'></div>')
        // console.log('makinng div')
        // var div = $(rating + '<div class="gif-wrap"></div>')
        // console.log('div', div[0].outerHTML)
        // console.log('html', html[0].outerHTML)
        // console.log('type of div', typeof div)
        // Testing addition of playbutton div
        divInner.append(playButtonImg, img)
        // console.log(div[0].outerHTML)
        // Add new div to main section
        div.append(rating, divInner, downloadBtn)
        // console.log(div[0].outerHTML)
        $('.main-content').append(div)
        // html.append(img).append("<br>")
        // html.append(downloadBtn)
        // $('.main-content').append(html)
        // $('.main-content div').append(div)
      })
      // Increment offset
      offset += limit
      // Add button for current topic if not displayed
      var lowercaseTopics = topics.map(v => v.toLowerCase());
      var index = lowercaseTopics.indexOf(topic.toLowerCase());
      if(index < 0) addButton(topic)
    })
  }

  function addButton(string) {
    topics.push(string.toTitleCase())
    console.log(topics)
    $('#buttons').empty();
    initializeButtons(topics);
    placeContentContainer()
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

    // API call
    var string = encodeURIComponent(input);
    var queryURL = queryBaseURL + offset + '&q=' + string
    console.log('queryURL: ' + queryURL)
    loadGifs(input, queryURL)
  }

  function placeContentContainer() {
    // Adjust top margin of container div
    var contentPlacement = $("header").position().top + $("header").height();
    $('.container').css('margin-top',contentPlacement);
  }
  // Toggle GIF playback on click
  // $(document).on('click', '.main-content img', function() {
  //   var state = $(this).attr("data-state");
  //   if (state === "still") {
  //     $(this).attr("src", $(this).attr("data-animate"));
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
  $(document).on('click', '#buttons .btn', function() {
    var firedButton = $(this).text();
    var string = encodeURIComponent(firedButton);
    $('#userinput').attr('value', 'Enter a search term');

    // Clear screen if user clicked on a different button
    if(firedButton.toLowerCase() !== lastClicked.toLowerCase()) {
      $('.main-content').empty();
    }

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

  // Main Program
  initializeButtons(topics);
  placeContentContainer();
  window.addEventListener('resize', () => placeContentContainer());
});