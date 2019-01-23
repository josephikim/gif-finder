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

  function getTen(queryURL) {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
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
        var downloadLink = `https://media.giphy.com/media/${obj.id}/giphy.gif`
        var downloadBtn = $(`<a class="btn btn-success download-btn" href="${downloadLink}" download>Download GIF</a>`)
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
    })
  }

  function addTenHandler() {
    $('input[value="+10"]').on("click", function(event) {
      event.preventDefault();

      // var queryBaseURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&limit=' + limit + '&offset=' + offset + '&q='
      var string = encodeURIComponent(lastClicked);
      console.log('addtenquery offset:', offset)
      var queryURL = queryBaseURL + offset + '&q=' + string
      console.log('addtenquery:', queryURL)

      // ajax call
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log('queryURL: ' + queryURL);
        console.log(response)

        // For each element of the response's data object...
        response.data.forEach(function(obj) {

          // Creating new div
          var div = $('<div class = \'gif-wrap\'></div>')

          var rating = $('<p>Rating: ' + obj.rating + '</p>')
          //Creating placeholder image
          var img = $('<img>')
          img.attr({
            src: obj.images['480w_still'].url,
            height: 200
          })

          // Function that toggles gif playback via click
          img.click(function() {
            var currentSrc = img.attr('src')
            var stillURL = obj.images['480w_still'].url
            var gifURL = obj.images.fixed_height.url

            if (currentSrc.endsWith('jpg')) {
              img.attr('src', gifURL)
            } else if (currentSrc.endsWith('gif')) {
              img.attr('src', stillURL)
            }
          });

          // Bundle up new div
          div.append(rating)
          div.append(img)

          // Add new div to main section
          $('.main-content').append(div)
        })
      })
      offset += limit
      console.log('new offset:', offset)
    });
  }
  // Main Program
  initializeButtons(topics);

  // When the user clicks a topic, make API call to get 10 gif objects from the Giphy API and display them.
  $(document).on('click', '.buttons .btn', function() {
    var fired_button = $(this).text();
    var string = encodeURIComponent(fired_button);
    if(fired_button !== lastClicked) {
      $('.main-content').empty();
      offset = 0;
    }
    var queryURL = queryBaseURL + offset + '&q=' + string

    // ajax call
    getTen(queryURL);

    // update variables
    offset += limit
    lastClicked = fired_button
    addTenHandler();
  });

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
  $(document).on('click', '.gif-wrap a', function() {
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

  // Click handler for search bar submit
  $('input[value="Search"]').on("click", function(event) {
    event.preventDefault();

    // This line checks for input from the textbox
    var input = $("#userinput").val().trim().toLowerCase();
    console.log(input)
    // console.log("topics.indexof(input):", topics.toLowerCase().indexOf(input))
    // var newInput = new Boolean(topics.toLowerCase().indexOf(input) < 0)
    // console.log('newInput?:', newInput)


    // var array = ['I', 'hAve', 'theSe', 'ITEMs'],
    // query = 'these',
    var index = topics.findIndex(item => input.toLowerCase() === item.toLowerCase());
    console.log('index:', index);



    if (input != '' && input != $("#userinput").defaultValue && index < 0) {

      // Make new queryURL
      var string = encodeURIComponent(input);
      var queryURL = queryBaseURL + offset + '&q=' + string
      console.log('new queryURL: ' + queryURL)

      // ajax call 
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        topics.push(input.toTitleCase())
        console.log(topics)
        $('.buttons').empty();
        initializeButtons();
      })
    }
  });
});