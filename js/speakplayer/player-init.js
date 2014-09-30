/* Retrieve Data From Plugin */

function populatePlayer(obj){

	$.each( obj, function( key, song ) {
		var songObj = new SpeakPlayer.Song(song);
		SpeakPlayer.player.songs.push(songObj);
	});
	renderSongs();

}

function sortByKey(array, key) {
	return array.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}

function preparePlayerData(){
	var data = {
		action: 'get_songs',
		security : MyAjax.security,
		whatever: 1234
	};

  // since 2.8 ajaxurl is always defined in the admin header and points to admin-ajax.php
  $.post(MyAjax.ajaxurl, data, function(response) {
  	var obj = jQuery.parseJSON( response );
  	populatePlayer(obj);
  });
}


/* Init */

function initSpeakPlayer(libraryContainer, playerContainer, playlistContainer){
	console.log("init attempt. player.isInitialized= %s, libraryContainer.length= %s", SpeakPlayer.player.isInitialized, libraryContainer.length);
	if(SpeakPlayer.player.isInitialized == "false" && libraryContainer.length > 0){
		console.log('init');
        SpeakPlayer.player.playerContainer = playerContainer;
        SpeakPlayer.player.playlistContainer = playlistContainer;
        SpeakPlayer.player.libraryContainer = libraryContainer;
		defineSVG();
		preparePlayerData();
		renderPlayer();		//only want to call once
		renderPlaylist();
		initVisualizer();
		startInteractionTimer();
	}
}

function onNoInteraction(){
	$('canvas.sketch').addClass('opaque');
	SpeakPlayer.player.libraryContainer.addClass('transparent');

}
function startInteractionTimer(){

	var interactionTimer = setTimeout(function(){onNoInteraction();}, 5000);

	SpeakPlayer.player.libraryContainer.hover(function(){
		$('canvas.sketch').removeClass('opaque');

		SpeakPlayer.player.libraryContainer.removeClass('transparent');
		clearTimeout(interactionTimer);
	},
	function(){
		interactionTimer = setTimeout(function(){onNoInteraction();}, 5000);
	});
}
function defineSVG(){
	prevSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="15.799px" viewBox="2 5.6 24 15.799" enable-background="new 2 5.6 24 15.799" xml:space="preserve"><polygon fill="#969696" points="8.84,17.45 15.682,21.399 15.682,15.441 19.161,17.45 26,21.399 26,13.5 26,5.6 19.161,9.55 15.682,11.557 15.682,5.6 8.84,9.55 2,13.5 "/></svg>';
	nextSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="15.799px" viewBox="2 5.6 24 15.799" enable-background="new 2 5.6 24 15.799" xml:space="preserve"><polygon fill="#969696" points="19.16,9.547 12.318,5.598 12.318,11.556 8.839,9.547 2,5.598 2,13.498 2,21.396 8.839,17.446 12.318,15.439 12.318,21.396 19.16,17.446 26,13.498 "/></svg>';
	volumeSVG = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" width="31.967px" height="24.826px" viewBox="242.491 244.087 31.967 24.826" enable-background="new 242.491 244.087 31.967 24.826" xml:space="preserve"><style>.style0{fill:	#969696;}.style1{stroke:	#969696;stroke-linecap:	round;fill:	none;}</style><g><path d="M250.632 260.729c-0.091-0.079-0.207-0.122-0.327-0.122h-7.314v-8.329h7.438 c0.12 0 0.236-0.043 0.327-0.122l7.561-6.538v21.761L250.632 260.729z" class="style0"/><path d="M257.816 246.712v19.574l-6.857-5.935c-0.182-0.157-0.414-0.244-0.654-0.244h-6.814v-7.329h6.938 c0.24 0 0.472-0.086 0.654-0.244L257.816 246.7 M258.816 244.526l-8.388 7.252h-7.938v9.329h7.814l8.512 7.366V244.526 L258.816 244.526z" class="style0"/></g><path d="M263.086 261.765c0.943-1.514 1.499-3.289 1.499-5.21 c0-1.944-0.57-3.751-1.542-5.278" class="style1"/><path d="M266.486 247.835c1.803 2.4 2.9 5.5 2.9 8.7 c0 3.235-1.041 6.235-2.824 8.7" class="style1"/><path d="M269.724 268.402c2.571-3.252 4.117-7.368 4.117-11.848 c0-4.502-1.56-8.641-4.165-11.911" class="style1"/></svg>';
	playSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="23.379px" height="27px" viewBox="0 0 23.379 27" enable-background="new 0 0 23.379 27" xml:space="preserve"><polygon fill="#969696" points="0,27 11.692,20.248 23.379,13.5 11.692,6.749 0,0 "/></svg>';
	pauseSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="23.379px" height="27px" viewBox="0 0 23.379 27" enable-background="new 0 0 23.379 27" xml:space="preserve"><rect x="14.678" y="-0.003" fill="#969696" width="6.701" height="27.007"/><rect x="2" y="-0.003" fill="#969696" width="6.701" height="27.007"/></svg>';
	playlistSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="27px" height="24.826px" viewBox="242.491 244.087 27 24.826" enable-background="new 242.491 244.087 27 24.826" xml:space="preserve"><rect x="242.491" y="266.402" fill="#969696" width="8.368" height="2.511"/><rect x="242.491" y="260.823" fill="#969696" width="8.368" height="2.511"/><rect x="242.491" y="255.245" fill="#969696" width="15.063" height="2.51"/><rect x="242.491" y="249.666" fill="#969696" width="15.063" height="2.51"/><rect x="242.491" y="244.087" fill="#969696" width="15.063" height="2.51"/><path fill="#969696" d="M255.869,268.484c-1.142-0.289-2.202-1.127-2.503-2.302c-0.315-1.122,0.097-2.326,0.803-3.212c1.311-1.641,3.559-2.481,5.622-2.094c0.017-5.49-0.001-10.98,0.009-16.47c0.498,0.733,1.035,1.451,1.707,2.037c1.428,1.294,3.204,2.117,4.671,3.358c1.266,1.078,2.364,2.414,2.925,3.996c0.411,1.131,0.495,2.374,0.256,3.552c-0.315,1.513-1.243,2.364-2.243,3.531c0.341-1.408,0.729-2.357,0.294-3.771c-0.29-0.98-0.925-1.831-1.716-2.466c-0.904-0.73-1.964-1.234-3.028-1.687c-0.014,3.627-0.001,7.255-0.006,10.883c0.056,1.252-0.583,2.45-1.498,3.273C259.76,268.381,257.712,268.958,255.869,268.484"/></svg>';
	expandSVG = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12.75px" height="25.54px" viewBox="0 0 12.75 25.54" enable-background="new 0 0 12.75 25.54" xml:space="preserve"><g><path fill="#E7E7E7" d="M0.539,0.843C0.242,0.379,0.45,0,1,0h2.546c0.55,0,1.248,0.375,1.551,0.834l7.274,11.025 c0.303,0.459,0.304,1.21,0.001,1.67L5.115,24.576c-0.302,0.46-1,0.836-1.549,0.836H1.051c-0.55,0-0.759-0.38-0.464-0.845 l6.991-11.028c0.295-0.465,0.293-1.224-0.003-1.688L0.539,0.843z"/></g></svg>';
}
jQuery(document).ready(function($) {
	console.log("document loaded");
	initSpeakPlayer($('#libraryContainer'), $('#playerContainer'), $('#playlistContainer'));
});