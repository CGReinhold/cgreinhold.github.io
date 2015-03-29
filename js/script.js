$(document).ready(function() {
	$.getJSON("https://dl.dropboxusercontent.com/u/27873575/Site%20Teste/movies.json", function getjson(data) {
		$.each(data, function(key, value){
			$.each(value, function(key2, value2){
				if(typeof value2.link != 'undefined')
				{
					var table = "";
					table += "<div class='movies'>";
					table += "<img alt=\""+ value2.channel +"\" src=\"" + "channels/" + value2.channel + ".png" + "\" class='half'>";
					table += "<div class='grid'>";
					table += "<a  href=\""+ value2.link +"\" >";
					table += "<figure>";
					table += "<img alt=\""+ value2.title +"\" src=" + ((value2.poster === "") ? "images/generico.jpg" : value2.poster) + ">";
					table += "<figcaption>";
					table += "<h3>"+ value2.title +"</h3>";
					table += "</figcaption>";
					table += "</figure>";
					table += "</a>";
					table += "</div>";
					table += "</div>";
					$("#centerDiv").append(table).hide().fadeIn(900);
				}
			});
		});
	});
});