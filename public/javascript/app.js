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

  function initializeButtons() {
    for (let text of topics)
      $('<button></button').text(text).addClass('btn btn-info').appendTo('.buttons')
  }

  // Main Program
  initializeButtons();

  //  When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
  $(document).on('click', '.buttons .btn', function() {
    var fired_button = $(this).text();
    console.log('fired_button', fired_button)
    var string = encodeURIComponent(fired_button);
     console.log('string:', string)
     console.log('lastClicked:', lastClicked)

    if(fired_button !== lastClicked) {
      offset = 0;
    }

    console.log('offset for query: ', offset)
    console.log('queryBaseURL', queryBaseURL)
    var queryURL = queryBaseURL + offset + '&q=' + string

    // ajax call
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      $('.main-content').empty();
      console.log('queryURL: ' + queryURL);
      console.log(response)

      if (!$.trim(response.data)){
          $('.main-content').html("<h1>No results found! Try again!</h1>");
      }

      // For each element of the response's data object...
      response.data.forEach(function(gifObject) {

        // Creating new div
        var gifDiv = $('<div class = \'gifdiv\'></div>')

        var rating = $('<p>Rating: ' + gifObject.rating.toUpperCase() + '</p>')
        var downloadLink = `https://media.giphy.com/media/${gifObject.id}/giphy.gif`
        console.log('downloadLink:', downloadLink)
        // var downloadBtn = $('<button class="btn btn-success download">Download GIF</button>')
        // var downloadBtn = $('<button class="btn btn-success download" onclick="location.href=${gifObject.bitly_gif_url}" type="button">Download GIF</button>')
        var downloadBtn = $(`<a class="btn btn-success download-btn" href="${downloadLink}" download>Download GIF</a>`)
        // var downloadBtn = $('<input type="button" onclick="location.href='http://google.com';" value="Go to Google" />')
        //Creating placeholder image
        var img = $('<img>')
        img.attr({
          src: gifObject.images['480w_still'].url,
          height: 200
        })

        // Function that toggles gif playback via click
        img.click(function() {
          var currentSrc = img.attr('src')
          var stillURL = gifObject.images['480w_still'].url
          var gifURL = gifObject.images.fixed_height.url

          if (currentSrc.endsWith('jpg')) {
            img.attr('src', gifURL)
          } else if (currentSrc.endsWith('gif')) {
            img.attr('src', stillURL)
          }
        });

        // Bundle up new div
        gifDiv.append(rating)
        gifDiv.append(img).append("<br>")
        gifDiv.append(downloadBtn)

        // Add new div to main section
        $('.main-content').append(gifDiv)
      })
    })
    offset += limit
    console.log('new offset:', offset)
    lastClicked = fired_button
    console.log('lastClicked:', lastClicked)
    addPlusTenHandler();
  });

  function addPlusTenHandler() {
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
        response.data.forEach(function(gifObject) {

          // Creating new div
          var gifDiv = $('<div class = \'gifdiv\'></div>')

          var rating = $('<p>Rating: ' + gifObject.rating + '</p>')
          //Creating placeholder image
          var img = $('<img>')
          img.attr({
            src: gifObject.images['480w_still'].url,
            height: 200
          })

          // Function that toggles gif playback via click
          img.click(function() {
            var currentSrc = img.attr('src')
            var stillURL = gifObject.images['480w_still'].url
            var gifURL = gifObject.images.fixed_height.url

            if (currentSrc.endsWith('jpg')) {
              img.attr('src', gifURL)
            } else if (currentSrc.endsWith('gif')) {
              img.attr('src', stillURL)
            }
          });

          // Bundle up new div
          gifDiv.append(rating)
          gifDiv.append(img)

          // Add new div to main section
          $('.main-content').append(gifDiv)
        })
      })
      offset += limit
      console.log('new offset:', offset)
    });
  }

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