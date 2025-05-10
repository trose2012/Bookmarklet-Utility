let generatedBookmarklet = "";
let selectedBookmarkletIndex = null;

// Generate Bookmarklet
function generateBookmarklet() {
    let code = document.getElementById("jsCode").value.trim();
    if (!code) {
        alert("Please enter JavaScript code.");
        return;
    }

    generatedBookmarklet = `javascript:(function(){${encodeURIComponent(code)}})();`;

    let link = document.getElementById("bookmarkletLink");
    link.href = generatedBookmarklet;
    link.innerText = "📌 Drag to Bookmark Bar";

    document.getElementById("bookmarkletActions").style.display = "flex";
}

// Add Generated Bookmarklet to Collection
function addGeneratedBookmarklet() {
    if (!generatedBookmarklet) {
        alert("Generate a bookmarklet first!");
        return;
    }

    let name = prompt("Enter a name for this bookmarklet:");
    if (!name) return;

    saveBookmarklet(name, generatedBookmarklet);
}

// Save Bookmarklet to Collection
function saveBookmarklet(name, bookmarklet) {
    let stored = JSON.parse(localStorage.getItem("bookmarklets")) || [];
    stored.push({ name, bookmarklet });
    localStorage.setItem("bookmarklets", JSON.stringify(stored));
    displayBookmarklets();
}

// Display Saved Bookmarklets
function displayBookmarklets() {
    let list = document.getElementById("bookmarkletList");
    list.innerHTML = "";
    let stored = JSON.parse(localStorage.getItem("bookmarklets")) || [];

    if (stored.length === 0) {
        list.innerHTML = "<p>No bookmarklets saved yet.</p>";
        return;
    }

    stored.forEach((item, index) => {
        let li = document.createElement("li");

        let button = document.createElement("button");
        button.innerText = item.name;
        button.classList.add("bookmarklet-btn");
        button.onclick = () => window.location.href = item.bookmarklet;
        button.oncontextmenu = (event) => openContextMenu(event, index);

        li.appendChild(button);
        list.appendChild(li);
    });
}

// Open Context Menu
function openContextMenu(event, index) {
    event.preventDefault();
    selectedBookmarkletIndex = index;

    let menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
}

// Close Context Menu
document.addEventListener("click", () => {
    document.getElementById("contextMenu").style.display = "none";
});

// Copy Bookmarklet
document.getElementById("copyBtn").onclick = () => {
    let stored = JSON.parse(localStorage.getItem("bookmarklets")) || [];
    if (selectedBookmarkletIndex !== null && stored[selectedBookmarkletIndex]) {
        navigator.clipboard.writeText(stored[selectedBookmarkletIndex].bookmarklet).then(() => {
            alert("Bookmarklet copied! Paste it into the address bar.");
        }).catch(err => {
            console.error("Failed to copy: ", err);
        });
    }
};

// Delete Bookmarklet
document.getElementById("deleteBtn").onclick = () => {
    let stored = JSON.parse(localStorage.getItem("bookmarklets")) || [];
    if (selectedBookmarkletIndex !== null && stored[selectedBookmarkletIndex]) {
        stored.splice(selectedBookmarkletIndex, 1);
        localStorage.setItem("bookmarklets", JSON.stringify(stored));
        displayBookmarklets();
    }
};

// Load saved bookmarklets on page load
window.onload = displayBookmarklets;