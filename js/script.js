$(document).ready(function() {
	$.getJSON("https://dl.dropboxusercontent.com/u/27873575/Site%20Teste/movies.json", function getjson(data) {
		$.each(data, function(key, value){
			$.each(value, function(key2, value2){
				var table = "";
				table = table + "<a  href=\""+ value2["link"] +"\" >";
				table = table + "<table class='movies'>";
				table = table + "<tr>";
				table = table + "<td>";
				table = table + "<img src=\"" + "channels/" + value2["channel"] + ".png" + "\" class='half'>";
				table = table + "<br>";
				table = table + "<div class='grid'>";
				table = table + "<figure class='effect'>";
				table = table + "<img src=" + ((value2["poster"] == "") ? "images/generico.jpg" : value2["poster"]) + ">";
				table = table + "<figcaption>";
				table = table + "<h3>"+ value2["title"] +"</h3>";
				table = table + "<p>"+ value2["rating"] +"</p>";
				table = table + "</figcaption>";
				table = table + "</figure>";
				table = table + "</div>";
				table = table + "</td>";
				table = table + "</tr>";
				table = table + "</table>";
				table = table + "</a>";
				$("#centerDiv").html($("#centerDiv").html() + table);
			});
		});
	});
});