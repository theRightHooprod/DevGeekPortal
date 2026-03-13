$(function() {
	const searchInput = $('#search-character');
	const characterContainer = $("#character-containers");
	const apiURL = "https://rickandmortyapi.com/api/character"
	const spinnerContainer = $('#spinner-container');
	const nextButton = $('#nextButton');
	const bodyContainer = $('#body-container');

	function createCharacterCard(item) {
		let columnContainer = $('<div></div>');
		columnContainer.addClass('col');

		// main card frame creation.
		{
			let cardContainer = $('<div></div>');
			cardContainer.addClass('card');
			cardContainer.css('width', '18rem');

			let cardImage = $('<img>');

			{
				cardImage.addClass('card-img-top');
				cardImage.attr('loading', 'lazy');
				cardImage.attr('src', item.image);
			}

			let cardBody = $('<div></div>');
			cardBody.addClass('card-body');

			{
				let cardTitle = $('<h5></h5>');
				let cardSpecies = $('<p></p>');

				{
					cardTitle.text(item.name);
					cardTitle.addClass('card-title');
					cardBody.append(cardTitle);

					cardSpecies.text(`Species: ${item.species} Status: ${item.status}`);
					cardSpecies.addClass('card-text');
					cardBody.append(cardSpecies);
				}

			}

			cardContainer.append(cardImage);
			cardContainer.append(cardBody);

			columnContainer.append(cardContainer);

		}

		characterContainer.append(columnContainer);
	}

	function loadCharacters(url) {
		$.getJSON(url).done(function(data) {
			$.each(data.results, function(_, item) {
				createCharacterCard(item);
			});

			let nextUrl = data.info.next;

			if (nextUrl !== undefined && nextUrl !== null) {
				//remove past events from the button.
				nextButton.off('click');

				nextButton.on('click', function() {
					loadCharacters(nextUrl);
				});
				nextButton.show('slow');
			}
		})
	}


	$(document).on('ajaxStart', function() {
		bodyContainer.toggle();
		spinnerContainer.toggle();
	});

	$(document).on('ajaxSuccess', function() {
		setTimeout(function() {
			spinnerContainer.toggle();
			bodyContainer.toggle();
		}, 5000);
	});

	searchInput.on("change keyup paste", function() {
		let currentInputValue = searchInput.val().trim();

		if (!currentInputValue) {
			nextButton.hide();
			spinnerContainer.hide();
			return;
		}

		characterContainer.empty();
		nextButton.hide();


		loadCharacters(apiURL + `?name=${currentInputValue}`);
	});
});

