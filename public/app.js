
$("#scrape").on("click", function () {
  console.log("clicked")
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function (data) {
    console.log(data);
  })
});



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
  let articleId = $(this).data("id");
  console.log(articleId)
  $("#savedArticles").hide();
  $(".modalNote").show(articleId);
 
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
  console.log("Delete note clicked");
  console.log(noteId)
  
  $.ajax({
      method: "DELETE",
      url: "/notes/delete/" + noteId
  }).done(function(data) {
      console.log(data)
      $(".modalNote").modal("hide");
      window.location = "/saved"
  })
});

