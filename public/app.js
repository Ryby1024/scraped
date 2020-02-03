
$("#scrape").on("click", function(){
    console.log("clicked")
      $.ajax({
          method: "GET",
          url: "/scrape",
      }).done(function(data){
          console.log(data);
          window.location.href = "/";
      })
  });

  $(document).on("click", "#saveArticle", function(e){
    console.log("Button clicked");
    let articleId = $(this).data("id");
    console.log(articleId);

    
  })

  