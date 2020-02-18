// find edit form
let postEditForm = document.querySelector('#postEditForm');
// add submit listener to form
postEditForm.addEventListener('submit', (event) => {
    // find length of uploaded images
    let imageUploads = document.querySelector('#imageUpload').files.length;
    // find total number of existing images
    let existingImgs = document.querySelectorAll('.imageDeleteCheckbox').length;
    // find total # of potential deletions
    let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    // determine if form should be submitted
    let newTotal = existingImgs - imgDeletions + imageUploads;
    if(newTotal > 4) {
        event.preventDefault();
        let removalAmnt = newTotal - 4;
        alert(`You need to remove at least ${removalAmnt} (or more) image${removalAmnt === 1 ? '' : 's'}`);
    }
});