// Add listeners to the different buttons in the popup.
document.getElementById("reset_all").addEventListener("click", resetAll);
document.getElementById("enable_disable").addEventListener("click", enableDisable);
document.getElementById("website").addEventListener("click", visitWebsite);
document.getElementById("reviews").addEventListener("click", visitReviews);
Object.keys(FILTERS).forEach(function(filter) {
	var rangeInput = document.getElementById(filter);
	// Add listener to the filter range input.
	rangeInput.addEventListener("input", updateFilterValue);
	// Add listener to the filter reset button.
	document.getElementById("reset_" + filter).addEventListener("click", function(e) {
		// Remove "reset_" prefix.
		resetFilter(e.target.id.substring(6));
	});
	// Initialise the displayed value.
	chrome.storage.local.get(filter, function(value) {
		var storageValue = value[filter];
		if (typeof storageValue !== "undefined") {
			rangeInput.value = storageValue;
			document.getElementById(filter + "_text").innerHTML = storageValue + FILTERS[filter];
		}
	});
});
// Get current state of the extension to update the enable/disable button.
chrome.storage.local.get("state", function(value) {
	if (value["state"] === "disabled") {
		document.getElementById("enable_disable_span").innerHTML = "Enable";
	}
});

function updateFilterValue() {
	var filter = this.id;
	var newValue = this.value;
	// Update the displayed value.
	document.getElementById(filter + "_text").innerHTML = newValue + FILTERS[filter];
	var storageObj = {};
	storageObj[filter] = newValue;
	// Persist the new value to the storage so it is picked up by a tab's
	// content script.
	chrome.storage.local.set(storageObj, function() {
		console.log("Set value of " + filter + " to " + newValue + FILTERS[filter]);
	});
}

function resetAll() {
	Object.keys(FILTERS).forEach(function(filter) {
		resetFilter(filter);
	});
}

function resetFilter(filter) {
	var defaultValue = DEFAULT_VALUES[filter];
	// Update position of the range thumb.
	document.getElementById(filter).value = defaultValue;
	// Update the displayed value.
	document.getElementById(filter + "_text").innerHTML = defaultValue + FILTERS[filter];
	var storageObj = {};
	storageObj[filter] = defaultValue;
	// Persist the default value to the storage so it is picked up by a tab's
	// content script.
	chrome.storage.local.set(storageObj, function() {
		console.log("Reset " + filter + " to its default value (" + defaultValue + FILTERS[filter] + ")")
	});
}

function enableDisable() {
	chrome.storage.local.get("state", function(value) {
		var storageObj = {};
		if (value["state"] === "disabled") {
			storageObj["state"] = "enabled";
			document.getElementById("enable_disable_span").innerHTML = "Disable";
		} else {
			// If no value in storage, treat as previously enabled.
			storageObj["state"] = "disabled";
			document.getElementById("enable_disable_span").innerHTML = "Enable";
		}
		chrome.storage.local.set(storageObj, function() {
			console.log("Set global state of extension to " + storageObj["state"]);
		});
	});
}

function visitWebsite() {
	window.open("https://github.com/PyvesB/NightVideoTuner");
}

function visitReviews() {
	if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
		window.open("https://addons.opera.com/fr/extensions/details/night-video-tuner");
	} else {
		window.open("https://chrome.google.com/webstore/detail/night-video-tuner/ogffaloegjglncjfehdfplabnoondfjo");
	}
}