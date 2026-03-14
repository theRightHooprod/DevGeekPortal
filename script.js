$(function() {
	const searchInput = $('#search-character');
	const characterContainer = $("#character-containers");
	const spinnerContainer = $('#spinner-container');
	const nextButton = $('#nextButton');
	const bodyContainer = $('#body-container');
	const modal = $('#app-modal');
	const modalContent = $('#modal-body');
	const modalLabelTitle = $('#modal-label-title');
	const customToast = $('#custom-toast');

	const apiURL = "https://rickandmortyapi.com/api/character"

	let timeoutId = null;

	function debounce(func, delay) {
		return function(...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func.apply(this, args);
			}, delay);
		};
	}

	function createCharacterCard(item) {
		let columnContainer = $('<div></div>');
		columnContainer.addClass('col');

		// main card frame creation.
		{
			let cardContainer = $('<div></div>');
			cardContainer.addClass('card');
			cardContainer.css('width', '18rem');

			let cardImage = $('<img></img>');

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

			cardContainer.on('click', function() {
				modalContent.empty()

				modalLabelTitle.text(item.name);

				let characterImage = $('<img></img>');
				{
					characterImage.attr('loading', 'lazy');
					characterImage.attr('src', item.image);
				}

				let statusPara = $('<p></p>');

				{
					statusPara.text(`Current status: ${item.status}`);
				}

				let speciesPara = $('<p></p>');

				{
					speciesPara.addClass("mt-3");
					speciesPara.text(`Species: ${item.species}`);
				}

				modalContent.append(characterImage, speciesPara, statusPara);


				modal.modal('toggle');
			});

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
				nextButton.show();
			}
		})
	}


	$(document).on('ajaxStart', function() {
		bodyContainer.hide();
		spinnerContainer.show();
	});

	$(document).on('ajaxSuccess', function() {

		setTimeout(function() {
			bodyContainer.show();
		}, 500);

		setTimeout(function() {
			spinnerContainer.hide();
		}, 500);
	});

	$(document).on("ajaxError", function() {
		customToast.toast('show');
	});

	searchInput.on("change keyup paste", debounce(function() {
		if (searchInput.val()) {
			let currentInputValue = searchInput.val().trim();

			characterContainer.empty();
			nextButton.hide();

			loadCharacters(apiURL + `?name=${currentInputValue}`);
		}
	}, 250));
});

