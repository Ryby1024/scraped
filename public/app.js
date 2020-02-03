$("#articleBtn").on("click", function(data) {
    console.log("I am working")
    for (var i = 0; i < data.length; i++) {
      
      $("#articleContainer").append(data[i].title + data[i].summary + data[i].link);
    }
    console.log(data)

    
    
  });
  

$("#scrape").on("click", function(){
    console.log("clicked")
      $.ajax({
          method: "GET",
          url: "/scrape",
      }).done(function(data){
          console.log(data);
          window.location = "/"
      })
  });

  