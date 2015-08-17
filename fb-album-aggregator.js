(function ($) {
	$.fn.FBAlbumAggregator = function (options) {
		var defaults = {
			pageId: '', // FB page ID
			appId: '', // FB app ID
			appSecret: '', // FB app secret
			listClass: 'fba-list', // album list
			albumClass: 'fba-album', // single album photo list
			albumLinkClass: 'fba-album-link',
			singleLinkClass: 'fba-single-link'
		}

		var settings = $.extend({}, defaults, options);

		// Element the plugin was called on
		var $container = $(this);

		// Create initial DOM elements & kick things off
		var init = function () {
			$container.html('<ul class="' + settings.listClass + ' loading"></ul><ul class="' + settings.albumClass + '"></ul>');

			requestAlbums();
			eventWatcher();
		}

		// Make first request to pull list of FB albums
		var requestAlbums = function () {
			$.ajax({
				method: 'get',
				url: 'https://graph.facebook.com/' + settings.pageId + '/albums?access_token=' + settings.appId + '|' + settings.appSecret,
				success: function (res) {
					for (var i = 0; i < res.data.length; i++) {
						var album = res.data[i],
							id = album.id;

						// Add album to album list
						if (album.count > 0) { // Skip empty albums
							var domEl = '<li id="fba-' + id + '" class="loading"><a class="' + settings.albumLinkClass + '" href="#' + album.id + '">' +
									'<span class="fba-album-title">' + album.name + '</span>' +
									'</a></li>';

							$(document).find('.' + settings.listClass).append(domEl);

							requestAlbumCover(album.cover_photo, id);
						}
					}

					$('.' + settings.listClass).removeClass('loading');
				}
			});
		}

		var requestAlbumCover = function (cover, albumId) {
			$.ajax({
				method: 'get',
				url: 'https://graph.facebook.com/' + cover + '?access_token=' + settings.appId + '|' + settings.appSecret,
				success: function (res) {
					var photoEl = $(document).find('#fba-' + albumId);

					photoEl.find('a').prepend('<img src="' + res.images[5].source + '">');
					photoEl.removeClass('loading');
				}
			});
		}

		// Watch for events
		var eventWatcher = function () {
			$(document)
				// Watch for clicks to album links
				.on('click', '.' + settings.albumLinkClass, function (e) {
					// Hide album list
					$('.' + settings.listClass).hide();

					// Add loading class
					$('.' + settings.albumClass).addClass('loading');

					// Grab the album's ID
					var albumId = $(this).attr('href').split('#')[1],
						albumTitle = $(this).text();

					requestSingleAlbum(albumId, albumTitle);
				})
				// Watch for back to albums click
				.on('click', '#fba-back-to-albums', function (e) {
					e.preventDefault();

					// Show album list
					$('.' + settings.listClass).show();

					// Remove breadcrumbs
					$(document).find('.fba-breadcrumbs').remove();

					// Empty single album list
					$('.' + settings.albumClass).empty();
				})
				// Watch for clicks on single photos
				.on('click', '.' + settings.singleLinkClass, function (e) {
					e.preventDefault();
					e.stopPropagation();

					var photoUrl = $(this).attr('href'),
						photoCaption = $(this).data('caption');

					expandPhoto(photoUrl, photoCaption);
				})
				// Watch for clicks anywhere on body to close modal
				.on('click', function () {
					$('body').removeClass('fba-modal--open');
					$(document).find('.fba-modal').remove();
				})
				// Watch for clicking X to close modal
				.on('click', '.fba-modal__close', function (e) {
					e.preventDefault();

					$('body').removeClass('fba-modal--open');
					$(document).find('.fba-modal').remove();
				})
				// Watch for clicks inside to modal to keep it open
				.on('click', '.fba-modal__inner', function (e) {
					e.preventDefault();
					e.stopPropagation();
				})
				// Watch for escape key to close modal
				.keydown(function (e) {
		            if (e.keyCode == 27) { 
						$('body').removeClass('fba-modal--open');
						$(document).find('.fba-modal').remove();
		            }
		        });

			// Watch for changes to hashtag in URL
			$(window).on('hashchange', function () {
 				if (!window.location.hash) {
 					// Show album list
					$('.' + settings.listClass).show();

					// Remove breadcrumbs
					$(document).find('.fba-breadcrumbs').remove();

					// Empty single album list
					$('.' + settings.albumClass).empty();
 				}
			});
		}

		// Request single album photos
		var requestSingleAlbum = function (albumId, albumTitle) {
			$.ajax({
				method: 'get',
				url: 'https://graph.facebook.com/' + albumId + '/photos?access_token=' + settings.appId + '|' + settings.appSecret,
				success: function (res) {
					// Add breadcrumbs
					$container.prepend('<h2 class="fba-breadcrumbs"><a href="#" id="fba-back-to-albums">Albums</a>&nbsp;&raquo;&nbsp;' + albumTitle + '</h2>');

					for (var i = 0; i < res.data.length; i++) {
						var photo = res.data[i],
							largePhoto = photo.images[1].source,
							thumb = photo.images.length > 5 ? photo.images[5].source : photo.images[2].source,
							caption = photo.name ? photo.name : '';

						// Display thumbnail
						$('.' + settings.albumClass).append('<li><a class="' + settings.singleLinkClass + '" href="' + largePhoto + '" data-caption="' + caption + '"><img src="' + thumb + '"></a></li>');
					}

					// Remove loading class
					$('.' + settings.albumClass).removeClass('loading');
				}
			});
		}

		var expandPhoto = function (url, caption) {
			$('body')
				.addClass('fba-modal--active')
				.append(
				'<div class="fba-modal">' +
				'<div class="fba-modal__inner">' +
				'<a href="#" class="fba-modal__close">&times;</a>' +
				'<img src="' + url + '">' +
				'<p>' + caption + '</p>' +
				'</div></div>'
				)
		}

		// Initialize
		init();

		return this;
	}
})(jQuery);