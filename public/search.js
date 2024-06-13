document.addEventListener("DOMContentLoaded", async () => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const partnerName = urlParams.get("partnerName")?.trim();

	const response = await fetch("/api/partners");
	if (response.ok) {
		const partners = await response.json();

		const matchingPartner = partners.find(
			(partner) => partner.name === partnerName
		);

		const resultsContainer = document.querySelector(".results-container");

		if (matchingPartner) {
			const card = document.createElement("div");
			card.classList.add("search-result-card");

			const image = document.createElement("img");
			image.classList.add("partner-image");
			image.src = matchingPartner.logo;

			const info = document.createElement("div");
			info.classList.add("partner-info");

			const name = document.createElement("h2");
			name.classList.add("partner-name");
			name.textContent = matchingPartner.name;

			const activityStatus = document.createElement("span");
			activityStatus.classList.add("partner-activity-status");
			activityStatus.textContent = matchingPartner.active
				? "Active"
				: "Inactive";

			const description = document.createElement("p");
			description.classList.add("partner-description");
			description.textContent = matchingPartner.description;

			const buttonSection = document.createElement("div");
			buttonSection.classList.add("button-section");

			const editButton = createEditButton();
			const deleteButton = createDeleteButton();
			const backButton = createBackButton();

			buttonSection.appendChild(backButton);
			buttonSection.appendChild(editButton);
			buttonSection.appendChild(deleteButton);

			if (matchingPartner.logo) {
				card.appendChild(image);
			}
			card.appendChild(name);
			card.appendChild(activityStatus);
			card.appendChild(description);
			card.appendChild(buttonSection);

			resultsContainer.appendChild(card);

			editButton.addEventListener("click", () => {
				const nameInput = createTextInput(
					"partner-name-input",
					matchingPartner.name
				);
				const descriptionInput = createTextAreaInput(
					"partner-description-input",
					matchingPartner.description
				);
				const activitySelect = createActivitySelect(
					"partner-activity-select",
					matchingPartner.active
				);
				const saveButton = createSaveButton();

				card.replaceChild(nameInput, name);
				card.replaceChild(descriptionInput, description);
				card.replaceChild(activitySelect, activityStatus);
				buttonSection.replaceChild(saveButton, editButton);

				saveButton.addEventListener("click", async () => {
					const oldName = matchingPartner.name;
					matchingPartner.name = nameInput.value;
					matchingPartner.description = descriptionInput.value;
					matchingPartner.active = activitySelect.value === "Active";

					const updateResponse = await fetch(
						`/api/partners/${encodeURIComponent(oldName)}`,
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(matchingPartner),
						}
					);

					if (updateResponse.ok) {
						name.textContent = matchingPartner.name;
						description.textContent = matchingPartner.description;
						activityStatus.textContent = matchingPartner.active
							? "Active"
							: "Inactive";

						card.replaceChild(name, nameInput);
						card.replaceChild(description, descriptionInput);
						card.replaceChild(activityStatus, activitySelect);
						buttonSection.replaceChild(editButton, saveButton);

						const newUrl = `${
							window.location.pathname
						}?partnerName=${encodeURIComponent(
							matchingPartner.name
						)}`;
						history.pushState({ path: newUrl }, "", newUrl);
					} else {
						console.error("Failed to update partner");
					}
				});
			});

			deleteButton.addEventListener("click", async () => {
				const deleteResponse = await fetch(
					`/api/partners/${encodeURIComponent(matchingPartner.name)}`,
					{
						method: "DELETE",
					}
				);

				if (deleteResponse.ok) {
					window.location.href = "main_page.html";
				} else {
					console.error("Failed to delete partner");
				}
			});

			backButton.addEventListener("click", () => {
				window.location.href = "main_page.html";
			});
		} else {
			const notFoundCard = document.createElement("div");
			notFoundCard.classList.add("not-found-card");

			const notFoundMessage = document.createElement("p");
			notFoundMessage.classList.add("not-found-message");
			notFoundMessage.textContent = "Partner not found";

			const backButton = createBackButton();
			resultsContainer.appendChild(backButton);

			notFoundCard.appendChild(notFoundMessage);
			notFoundCard.appendChild(backButton);

			resultsContainer.appendChild(notFoundCard);

			backButton.addEventListener("click", () => {
				window.location.href = "main_page.html";
			});
		}
	} else {
		const partnerNameDisplay = document.querySelector(".partner-name");
		const partnerDescriptionDisplay = document.querySelector(
			".partner-description"
		);

		partnerNameDisplay.textContent = "Not found";
		partnerDescriptionDisplay.textContent = "";
	}
});

function createEditButton() {
	const editButton = document.createElement("button");
	editButton.classList.add("edit-button");
	editButton.textContent = "Edit";
	return editButton;
}

function createSaveButton() {
	const saveButton = document.createElement("button");
	saveButton.classList.add("save-button");
	saveButton.textContent = "Save";
	return saveButton;
}

function createTextInput(className, value) {
	const input = document.createElement("input");
	input.classList.add(className);
	input.type = "text";
	input.value = value;
	return input;
}

function createTextAreaInput(className, value) {
	const textarea = document.createElement("textarea");
	textarea.classList.add(className);
	textarea.value = value;
	return textarea;
}

function createActivitySelect(className, value) {
	const select = document.createElement("select");
	select.classList.add(className);

	const activeOption = document.createElement("option");
	activeOption.value = "Active";
	activeOption.text = "Active";
	const inactiveOption = document.createElement("option");
	inactiveOption.value = "Inactive";
	inactiveOption.text = "Inactive";

	select.add(activeOption);
	select.add(inactiveOption);

	select.value = value ? "Active" : "Inactive";

	return select;
}

function createBackButton() {
	const backButton = document.createElement("button");
	backButton.classList.add("back-button");
	backButton.textContent = "Back";
	return backButton;
}

function createDeleteButton() {
	const deleteButton = document.createElement("button");
	deleteButton.classList.add("delete-button");
	deleteButton.textContent = "Delete";
	return deleteButton;
}
