$("#returnHome").hide();

$("#scrape").on("click", function () {
  console.log("clicked")
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function (data) {
    console.log(data);
  })
  
  $("#returnHome").show();
});
$(document).on("click", "#homeBtn", function(){
  $("#returnHome").hide();
})


$(document).on("click", ".saveArticle", function () {
  console.log("Button clicked");
  let articleId = $(this).data("id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + articleId
  }).done(function (data) {
    window.location = "/"
  })
});

$(document).on("click", ".checkNotes", function () {
  console.log(this)
  let articleId = $(this).data("id");
  console.log(articleId)
  $("#savedArticles").hide();
  $(`.${articleId}`).show();
 
});

$(".saveNote").on("click", function () {
  console.log("save note clicked")
  let thisId = $(this).attr("data-id");
  console.log(thisId)
  if (!$("#noteText" + thisId).val()) {
    alert("please enter a note to save")
  } else {
    $.ajax({
      method: "POST",
      url: "/notes/save/" + thisId,
      data: {
        body: $("#noteText" + thisId).val()
      }
    }).done(function (data) {
      console.log(data);     
      $("#noteText" + thisId).val("");
      $(".modalNote").hide();
      window.location = "/saved"
    });
  }
});


$(".deleteArticle").on("click", function() {
  let thisId = $(this).attr("data-id");
  console.log(thisId)
  $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId
  }).done(function(data) {
      window.location = "/saved"
  })
});

$(".deleteNote").on("click", function() {
  let noteId = $(this).attr("data-note-id");
  let articleId = $(this).attr("data-article-id")
  console.log("Delete note clicked");
  console.log(noteId)
  
  $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + noteId
  }).done(function(data) {
      console.log(data)
      $(`.${articleId}`).hide();
      window.location = "/saved"
  })
});

