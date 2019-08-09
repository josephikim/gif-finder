$(document).ready(function() {
  // Global objects
  var apiKey = 'tj4h4gdxevqPIJTUM8kTJjt91EWJTm9D'
  var limit = 10
  var offset = 0
  var lastClicked = ''
  var names = ['Dave Chappelle', 'Chris Farley', 'Adam Sandler', 'Jim Carrey', 'Will Ferrell']
  var queryBaseURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + apiKey + '&limit=' + limit + '&offset='

  // Converts a string to Title Case
  function toTitleCase(str) {
      return str.replace(
          /\w\S*/g,
          function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
      );
  }

  function initializeButtons(arr) {
    $('#sidebar .buttons').empty()
    for (let item of arr) {
      var button = $('<button>')
      button.text(item).addClass(
        'btn btn-primary').append(
        '<img class="close-icon" src="public/images/redx.png"/>').appendTo(
        '#sidebar .buttons')
    }
  }

  function loadGifs(name, queryURL) {
    console.log('queryURL', queryURL)
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      if (!$.trim(response.data)){
        $('#scrollable-div').prepend("<h1>No results found! Try again!</h1>");
        return
      }
      // Create GIF container for each element in response object...
      response.data.forEach(function(currentValue, index) {

        // Create image
        var rating = $('<span>Rating: <b>' + currentValue.rating.toUpperCase() + '</b></span>')
        var img = $('<img>')
        var downloadBtn = $(`<a class="download-link" href="${currentValue.url}" target="_blank" download>Download >></a>`)
        img.attr({
          src: currentValue.images['480w_still'].url,
          // width: 400,
          "class": "gif",
          "data-state": "still",
          "data-still": currentValue.images['480w_still'].url,
          "data-animate": currentValue.images.fixed_height.url
        })

        // Create play button
        var playButtonImg = $('<img>')
        playButtonImg.attr({
          src: "./public/images/play-btn-white.png",
          "class": "gif-overlay",
        })

        var gifImg = $('<div class = "gif-img-wrap"></div>')
        gifImg.append(playButtonImg, img)

        var gifContainer = $('<div class="gif-container img-fluid" id="' + `${ offset + index}` + '"></div>').append(rating, gifImg, downloadBtn)

        // Add gif container to scrollable-div
        $('div#scrollable-div').append(
          $("<div/>",{"class": "col-xs-12 col-sm-6 col-md-4 col-lg-3"}).append(gifContainer));
      })
      // Increment offset
      offset += limit
      // Add button for current name if not displayed
      var uppercaseNames = names.map(v => v.toUpperCase());
      var matchIndex = uppercaseNames.indexOf(name.toUpperCase());
      if(matchIndex < 0) addButton(name)
    })
  }

  function addButton(string) {
    names.push(toTitleCase(string))
    $('#sidebar .buttons').empty();
    initializeButtons(names);
  }

  function performSearch() {
    input = $("#userinput").val().trim()
    // Check for invalid input
    if (input === "Enter a search term" || input === "" || input === null) return
    $('#scrollable-div').empty();
    offset = 0;
    lastClicked = input
    // API call
    var string = encodeURIComponent(input);
    var queryURL = queryBaseURL + offset + '&q=' + string
    loadGifs(input, queryURL)
  }

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
    if(lastClicked) {
      string = encodeURIComponent(lastClicked)
      // Make AJAX call
      var queryURL = queryBaseURL + offset + '&q=' + string
      loadGifs(lastClicked, queryURL)
    }
  });

  // Handler for named buttons - query Giphy API for GIFs and display them
  $(document).on('click', '.buttons .btn', function() {
    $('#userinput').attr('value', 'Enter a search term'); // Reinitialize search bar text
    clicked = $(this).text()

    // Clear screen if user clicked on a different button
    if(clicked.toUpperCase() !== lastClicked.toUpperCase()) {
      $('#scrollable-div').empty();
      offset = 0
    }
    lastClicked = $(this).text()
    // Make AJAX call
    var queryURL = queryBaseURL + offset + '&q=' + encodeURIComponent(lastClicked)
    loadGifs(lastClicked, queryURL)
  });
  
  // Handler for close icon
  $(document).on('click', '.close-icon', function(event) {
    event.stopPropagation();
    var name = $(this).parent().text()
    console.log('name:', name)
    // remove name from names array
    var index = names.indexOf(name)
    if (index > -1) {
      names.splice(index, 1)
    }
    console.log('names:', names)
    initializeButtons(names)
  })
  // Handler for playing and stopping GIFs
  $(document).on('click', '.gif-img-wrap', function() {
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
    var queryURL = $(this).attr("href");
    $.ajax({
        // url: queryURL,
        url: "https://giphy.com/gifs/dave-chappelle-crackhead-crack-head-l2SpKF3z2hbcrRdkI",
        method: "GET",
        // dataType: "json",
        responseType: "blob",
      })
    .then((blob) => {
      // Logging blob
      var myReader = new FileReader();
      myReader.onload = function(event){
          // console.log(JSON.stringify(myReader.result));
      };
      myReader.readAsText(new Blob([blob.data]));

      // Preparing download
      const url = window.URL.createObjectURL(new Blob([blob.data]));
      // console.log('blob url', url)
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${lastClicked}.gif`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      alert('your file has downloaded!')
    })
  })

  // Main Program
  initializeButtons(names);
});