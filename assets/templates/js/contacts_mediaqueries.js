/**
 * Changes the dot icon image on mouseover and mouseout events.
 * Listens for DOM content loaded event to attach event listeners to the dot icon container.
 */
document.addEventListener("DOMContentLoaded", (event) => {
  const dotIconContainer = document.getElementById("dotIcon");

  if (dotIconContainer) {
    dotIconContainer.addEventListener("mouseover", () => {
      const dotIcon = dotIconContainer.querySelector(".dotIcon");
      if (dotIcon) {
        dotIcon.src = "../assets/img/dotIconBlue.svg";
      }
    });

    dotIconContainer.addEventListener("mouseout", () => {
      const dotIcon = dotIconContainer.querySelector(".dotIcon");
      if (dotIcon) {
        dotIcon.src = "../assets/img/dotIcon.svg";
      }
    });
  }
});

/**
 * Closes the small "Add Contact" overlay when the close button is clicked.
 * Listens for DOM content loaded event to attach the event listener to the close button.
 */
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("closeAddOverlay").addEventListener("click", function () {
    document.querySelector(".addNewContactOverlay").classList.add("hidden");
  });
});

