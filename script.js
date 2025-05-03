/*
- The user should be able to set a color for boxes (this affects both current boxes and new boxes).  -- DONE
- The user should be able to add boxes with the set color to the div with the ID `box-container`: -- DONE
    - When the button with the ID `new-box-button` is clicked. -- DONE
    - When the `N` key is pressed. -- DONE
- The user should be able to remove a box when the box is double-clicked on. -- DONE
- Each box should display its ID. -- DONE
- Each box should display its page coordinates when hovered (when the mouse leaves, it displays its ID back). -- DONE
- Each box should have a class `box` for styling and selecting. -- DONE
*/

document.addEventListener('DOMContentLoaded', () => {
    let boxID = 0;
    const style = document.createElement('style');
    document.head.append(style);

    const colorInput = document.querySelector('#color-input');
    const colorForm = document.querySelector('#color-form');
    const newBoxButton = document.querySelector('#new-box-button');
    const boxContainer = document.querySelector('#box-container');

    function addBox() {
        const box = document.createElement('div');
        box.classList.add('box');
        box.id = 'box' + boxID;
        box.innerText = `ID: ${box.id}`;

        box.addEventListener('dblclick', (e) => {
            e.target.remove();
        });

        box.addEventListener('mouseover', (e) => {
            const rect = e.target.getBoundingClientRect();
            e.target.innerText =
            `x: ${rect.left + window.scrollX}
            y: ${rect.top + window.scrollY}`;
        });

        box.addEventListener('mouseout', (e) => {
            e.target.innerText = `ID: ${e.target.id}`;
        });

        boxContainer.appendChild(box);
        boxID++;
    }

    newBoxButton.addEventListener('click', () => {
        addBox();
    });

    document.addEventListener('keypress', (e) => {
        if ((e.key === 'n' || e.key === 'N') && document.activeElement.id !== 'color-input') addBox();
        console.log(document.activeElement.id);
    });

    colorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const boxColor = colorInput.value;
        style.textContent = `.box { background-color: ${ boxColor }}`;
    });

});