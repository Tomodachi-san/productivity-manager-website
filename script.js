document.addEventListener("keydown", e => {
    if(e.ctrlKey && e.key === "s"){
        e.preventDefault();
        save();
        console.log("Saved");
    }
})

// Save Test Feature
function save(){
    sessionStorage.setItem("document", document.body.innerHTML);
}
function load(){
    document.body.innerHTML = sessionStorage.getItem("document");
    addListeners();
}


// Global Variables
let label_one = "Label One";
let label_two = "Label Two";
let label_three = "Label Three";
let label_four = "Label Four";
let label_five = "Label Five";
let label_six = "Label Six";

let toggleLabelBool = false;


if(navigator.userAgentData.mobile){
    if(window.innerHeight > window.innerWidth){
        alert("Portrait");
    } else alert("Landscape");
}

//document.getElementById("rearrange_button").addEventListener("click", test);

function allowDrop(ev){
    ev.preventDefault();
}

var original_pos;
var original_source;
function drag(ev){
    original_source = event.target.id.replace(/[0-9]/g, '');

    if(original_source === "task_box_"){
        ev.dataTransfer.setData("text", event.target.id);
    } else if(original_source === "sub_box_"){
        ev.dataTransfer.setData("text", event.target.id);
    }
}

// Note the difference between the methods of drag and drop, wherein in drop .children is used in combo with getElementById
// Meanwhile in drag, getElementsByClassName is used. This might break if task box is not the only object in task_boxes.

function test(){
    let wrapper = document.getElementById("task_boxes").children;
    let xCoords = [0];

    let bodyRect = document.body.getBoundingClientRect().left;

    for(let i = 0; i < wrapper.length; i++){
        let xPos = wrapper[i].getBoundingClientRect().right - bodyRect;
        xCoords.push(xPos);
    }

    let string = "The order of the elements is:";
    for(let i = 0; i < xCoords.length; i++){
        string = string.concat(" ", xCoords[i], ",");
    }
    string = string.concat(" .");

    alert(string);
}

let xCoords = [];
function updatePositions(){
    xCoords.length = 0;
    xCoords.push(0);

    let wrapper = document.getElementById("task_boxes").children;
    

    let bodyRect = document.body.getBoundingClientRect().left;

    let prev_num = 0;
    for(let i = 0; i < wrapper.length; i++){
        let xPos = (wrapper[i].getBoundingClientRect().right - bodyRect);
        let xPos_half = Math.round((xPos - prev_num)/2);
        xCoords.push(xPos_half + prev_num);
        xCoords.push(xPos);
        
        prev_num = xPos;
    }
}

updatePositions();

let order = [];
function updateOrder(){
    order.length = 0;

    let items = document.getElementById("task_boxes").children;

    for(let i = 0; i < items.length; i++){
        order.push(items[i].id.replace(/\D/g,''));
    }

    let string = "The order of the elements is:";
    for(let i = 0; i < order.length; i++){
        string = string.concat(" ", order[i], ",");
    }
    string = string.concat(" .");

    //alert(string)
}

updateOrder();

let yCoords = [];


function drop(ev){
    if(original_source === "task_box_"){
        let wrapper = document.getElementById("task_boxes");
        let items = wrapper.children;

        for(let i = 0; (i + 1) < xCoords.length; i++){
            if(event.pageX > xCoords[i] && event.pageX < xCoords[i + 1] && (i + 1) % 2 != 0){
                console.log(`${xCoords[i]} > ${event.pageX} < ${xCoords[i]} ${i}`);

                //alert("odd");
                let data = ev.dataTransfer.getData("text");
                wrapper.insertBefore(document.getElementById(data), items[i / 2]);
                //console.log(items[i]);
                addListeners();

                updatePositions();
                updateOrder();
            } else if(event.pageX > xCoords[i] && event.pageX < xCoords[i + 1] && (i + 1) % 2 === 0){
                console.log(`${xCoords[i]} > ${event.pageX} < ${xCoords[i]} ${i}`);

                //alert("odd");
                let data = ev.dataTransfer.getData("text");
                wrapper.insertBefore(document.getElementById(data), items[(i + 1) / 2]);
                //console.log(items[i]);
                addListeners();

                updatePositions();
                updateOrder();
            }
        }
    }
    
    if(original_source === "sub_box_"){
        for(let i = 0; (i * 2) < xCoords.length; i++){
            if(event.clientX > xCoords[(i*2)] && event.clientX < xCoords[(i + 1)*2]){
                //console.log(order[i]);

                let bodyRect = document.body.getBoundingClientRect().top;

                let wrapper = document.getElementById(`task_box_${(order[i])}`).children[1];
                let items = wrapper.children;

                

                if(items.length === 0){
                    let data = ev.dataTransfer.getData("text");
                    wrapper.appendChild(document.getElementById(data));
                    addListeners();
                } else {
                    yCoords.length = 0;
                    yCoords.push(Math.round(items[0].getBoundingClientRect().top - bodyRect));

                    
                    let prev_num = Math.round(items[0].getBoundingClientRect().top - bodyRect);
                    for(let i = 0; i < items.length; i++){
                        let yPos = Math.round(items[i].getBoundingClientRect().bottom - bodyRect);
                        let yPos_half = Math.round((yPos - prev_num) / 2);
                        yCoords.push(prev_num + yPos_half);
                        yCoords.push(yPos);

                        prev_num = yPos;
                    }

                    for(let j = 0; (j + 1) < yCoords.length; j++){
                        if(event.pageY > yCoords[j] && event.pageY < yCoords[j + 1] && (j + 1) % 2 != 0){
                            console.log(`${yCoords[j]} > ${event.pageY} < ${yCoords[j]} ${j} odd`);

                            let data = ev.dataTransfer.getData("text");
                            wrapper.insertBefore(document.getElementById(data), items[j / 2]);
                            addListeners();
                        } else if(event.pageY > yCoords[j] && event.pageY < yCoords[j + 1] && (j + 1) % 2 === 0){
                            console.log(`${yCoords[j]} > ${event.pageY} < ${yCoords[j]} ${j} even`);

                            let data = ev.dataTransfer.getData("text");
                            wrapper.insertBefore(document.getElementById(data), items[(j + 1) / 2]);
                            addListeners();
                        }
                    }
                }
            }
        }

        let string = "The order of the elements is:";
        for(let i = 0; i < yCoords.length; i++){
            string = string.concat(" ", yCoords[i], ",");
        }
        string = string.concat(" .");

        //alert(string);
    }
        

    //alert(event.clientX);
    
}

function rearrange(){
    let wrapper = document.getElementById("task_boxes");
    let items = wrapper.children;
    let elements = document.createDocumentFragment();

    let order = [];

    for(let i = 0; i < items.length; i++){
        order.push(i);
    }

    let temp_num;

    for(let i = 0; i < items.length; i++){
        if(i === 0){
            temp_num = order[i];
            order[i] = order[i + 1];
        }
        else if(i === items.length - 1) order[i] = temp_num;
        else order[i] = order[i + 1];
    }

    order.forEach(function(idx){
        elements.appendChild(items[idx].cloneNode(true));
    });

    wrapper.innerHTML = null;
    wrapper.appendChild(elements);
    addListeners();
}

let counter = 1;
let counter_sub_box = 1;
let prev_width = 0;

// General Listeners such as when not currently in a description modal.
function addListeners(){
    document.getElementById("create_new_task_box_button").addEventListener("click", addTaskBox);
    for(let i = 0; i < document.getElementsByClassName("task_box").length; i++){
        try {
            document.getElementById(`add_sub_box_button_${i + 1}`).addEventListener("click", addSubBox);
        } catch(error) {
            console.log("Missing Sub Box Index LOL");
        }
    }
        
    for(let i = 0; i < document.getElementsByClassName("sub_box").length; i++){
        document.getElementById(`description_button_${i + 1}`).addEventListener("click", showDescription);
        document.getElementById(`description_close_button_${i + 1}`).addEventListener("click", () => {
            document.getElementById(`sub_box_description_${i + 1}`).style.display = "none";
        });
    }
}

addListeners();

function addTaskBox(){
    let new_task_box = document.createElement("div");

    // Apply CSS styles by making them part of Classes
    new_task_box.classList.add("task_box");

    new_task_box.setAttribute("id", `task_box_${counter}`);
    new_task_box.setAttribute("draggable", "true");
    new_task_box.setAttribute("ondrop", "drop(event)");
    new_task_box.setAttribute("ondragover", "allowDrop(event)");
    new_task_box.setAttribute("ondragstart", "drag(event)");

    let new_task_box_initial_text = document.createElement("input");

    // Apply CSS styles by making them part of Classes
    new_task_box_initial_text.classList.add("box_title");

    new_task_box_initial_text.setAttribute("placeholder", "Task List Name");
    new_task_box_initial_text.setAttribute("autocomplete", "off");
    new_task_box_initial_text.setAttribute("type", "text");
    new_task_box_initial_text.setAttribute("maxlength", "22");
    new_task_box_initial_text.setAttribute("size", "22");
    

    new_task_box.appendChild(new_task_box_initial_text);

    // Append new collection of sub boxes on the new task box
    let new_sub_box_collection = document.createElement("div");
    new_sub_box_collection.classList.add("sub_box_collection")
    new_task_box.appendChild(new_sub_box_collection);


    // Append Sub Box Prompt that only appears when the add sub box button is pressed
    let new_sub_box_add_prompt_division = document.createElement("div");
    new_sub_box_add_prompt_division.classList.add("add_sub_box_prompt");
    new_sub_box_add_prompt_division.setAttribute("id", `sub_box_${counter_sub_box}_add_sub_box_prompt`);

    let new_sub_box_input_outer_paragraph = document.createElement("p");
    let new_sub_box_input = document.createElement("span");
    new_sub_box_input.setAttribute("id", `sub_box_${counter_sub_box}_title_input`);
    new_sub_box_input_outer_paragraph.classList.add("add_sub_box_title_input_outer_paragraph");
    new_sub_box_input.classList.add("add_sub_box_title_input");
    new_sub_box_input.setAttribute("role", "textbox");
    new_sub_box_input.setAttribute("contenteditable", "");

    new_sub_box_input_outer_paragraph.appendChild(new_sub_box_input);
    new_sub_box_add_prompt_division.appendChild(new_sub_box_input_outer_paragraph);



    let add_sub_box_button = document.createElement("button");
    add_sub_box_button.setAttribute("id", `sub_box_${counter_sub_box}_add_sub_box_button`);
    add_sub_box_button.classList.add("add_sub_box_button_prompt");
    let add_sub_box_button_textnode = document.createTextNode("ADD TASK");
    add_sub_box_button.appendChild(add_sub_box_button_textnode);

    
    new_sub_box_add_prompt_division.appendChild(add_sub_box_button);


    let dismiss_sub_box_button = document.createElement("button");
    dismiss_sub_box_button.setAttribute("id", `sub_box_${counter_sub_box}_dismiss_sub_box_button`);
    dismiss_sub_box_button.classList.add("dismiss_sub_box_button_prompt");
    let dismiss_sub_box_button_textnode = document.createTextNode('\u00D7');
    dismiss_sub_box_button.appendChild(dismiss_sub_box_button_textnode);

    
    new_sub_box_add_prompt_division.appendChild(dismiss_sub_box_button);
    


    new_task_box.appendChild(new_sub_box_add_prompt_division);


    // Append Create Sub Box Button On the bottom of the new task box
    let new_sub_box_button = document.createElement("button");

    let new_sub_box_button_textnode = document.createTextNode("+ Add a new task");
    new_sub_box_button.appendChild(new_sub_box_button_textnode)

    new_sub_box_button.setAttribute("id", `add_sub_box_button_${counter}`);
    new_sub_box_button.classList.add("add_sub_box_button");

    new_task_box.appendChild(new_sub_box_button);

    document.getElementById("task_boxes").append(new_task_box);



    // Add event listener for the add sub box button embedded within this new task box
    document.getElementById(`add_sub_box_button_${counter}`).addEventListener("click", addSubBox);
    counter += 1;

    updatePositions();
    updateOrder();
}

addTaskBox();
document.getElementById("task_boxes").children[0].children[0].value = "TO DO";

addTaskBox();
document.getElementById("task_boxes").children[1].children[0].value = "DOING";

addTaskBox();
document.getElementById("task_boxes").children[2].children[0].value = "DONE";

//document.getElementById("task_boxes").children[0].remove();


function addSubBoxPrompt(event){

}


function addSubBox(event){
    let initial_sub_box = document.createElement("div");

    // Apply CSS styles by making them part of Classes
    initial_sub_box.classList.add("sub_box");

    // Label Unit
    let initial_label_unit = document.createElement("div");
    initial_label_unit.classList.add("labels_collection");

    let initial_label_one_container = document.createElement("div");
    initial_label_one_container.setAttribute("onclick", "toggleLabels()");
    initial_label_one_container.setAttribute("id", `sub_box_${counter_sub_box}_label_one_front`);
    initial_label_one_container.classList.add("label_one_container");
    let initial_label_one_text = document.createElement("p");
    initial_label_one_text.classList.add("label_text");
    let initial_label_one_text_textnode = document.createTextNode(`${label_one}`);
    initial_label_one_text.appendChild(initial_label_one_text_textnode);

    initial_label_one_container.appendChild(initial_label_one_text);


    let initial_label_two_container = document.createElement("div");
    initial_label_two_container.setAttribute("onclick", "toggleLabels()");
    initial_label_two_container.setAttribute("id", `sub_box_${counter_sub_box}_label_two_front`);
    initial_label_two_container.classList.add("label_two_container");
    let initial_label_two_text = document.createElement("p");
    initial_label_two_text.classList.add("label_text");
    let initial_label_two_text_textnode = document.createTextNode(`${label_two}`);
    initial_label_two_text.appendChild(initial_label_two_text_textnode);

    initial_label_two_container.appendChild(initial_label_two_text);


    let initial_label_three_container = document.createElement("div");
    initial_label_three_container.setAttribute("onclick", "toggleLabels()");
    initial_label_three_container.setAttribute("id", `sub_box_${counter_sub_box}_label_three_front`);
    initial_label_three_container.classList.add("label_three_container");
    let initial_label_three_text = document.createElement("p");
    initial_label_three_text.classList.add("label_text");
    let initial_label_three_text_textnode = document.createTextNode(`${label_three}`);
    initial_label_three_text.appendChild(initial_label_three_text_textnode);

    initial_label_three_container.appendChild(initial_label_three_text);


    let initial_label_four_container = document.createElement("div");
    initial_label_four_container.setAttribute("onclick", "toggleLabels()");
    initial_label_four_container.setAttribute("id", `sub_box_${counter_sub_box}_label_four_front`);
    initial_label_four_container.classList.add("label_four_container");
    let initial_label_four_text = document.createElement("p");
    initial_label_four_text.classList.add("label_text");
    let initial_label_four_text_textnode = document.createTextNode(`${label_four}`);
    initial_label_four_text.appendChild(initial_label_four_text_textnode);

    initial_label_four_container.appendChild(initial_label_four_text);


    let initial_label_five_container = document.createElement("div");
    initial_label_five_container.setAttribute("onclick", "toggleLabels()");
    initial_label_five_container.setAttribute("id", `sub_box_${counter_sub_box}_label_five_front`);
    initial_label_five_container.classList.add("label_five_container");
    let initial_label_five_text = document.createElement("p");
    initial_label_five_text.classList.add("label_text");
    let initial_label_five_text_textnode = document.createTextNode(`${label_five}`);
    initial_label_five_text.appendChild(initial_label_five_text_textnode);

    initial_label_five_container.appendChild(initial_label_five_text);


    let initial_label_six_container = document.createElement("div");
    initial_label_six_container.setAttribute("onclick", "toggleLabels()");
    initial_label_six_container.setAttribute("id", `sub_box_${counter_sub_box}_label_six_front`);
    initial_label_six_container.classList.add("label_six_container");
    let initial_label_six_text = document.createElement("p");
    initial_label_six_text.classList.add("label_text");
    let initial_label_six_text_textnode = document.createTextNode(`${label_six}`);
    initial_label_six_text.appendChild(initial_label_six_text_textnode);

    initial_label_six_container.appendChild(initial_label_six_text);


    initial_label_unit.appendChild(initial_label_one_container);
    initial_label_unit.appendChild(initial_label_two_container);
    initial_label_unit.appendChild(initial_label_three_container);
    initial_label_unit.appendChild(initial_label_four_container);
    initial_label_unit.appendChild(initial_label_five_container);
    initial_label_unit.appendChild(initial_label_six_container);

    

    

    initial_sub_box.appendChild(initial_label_unit);
    

    


    let sub_box_initial_title_outer_paragraph = document.createElement("p");
    let sub_box_initial_title = document.createElement("span");
    sub_box_initial_title_outer_paragraph.classList.add("sub_box_title_outer_paragraph");
    sub_box_initial_title.classList.add("sub_box_title_paragraph");
    sub_box_initial_title.setAttribute("id", `sub_box_${counter_sub_box}_title`);
    sub_box_initial_title.setAttribute("role", "textbox");
    sub_box_initial_title.setAttribute("contenteditable", "");

    sub_box_initial_title_outer_paragraph.appendChild(sub_box_initial_title);
    initial_sub_box.appendChild(sub_box_initial_title_outer_paragraph);

    let new_description_unit = document.createElement("div");
    new_description_unit.classList.add("description_unit")
    new_description_unit.setAttribute("id", `sub_box_${counter_sub_box}_description_unit`);

    let new_description_unit_description_division = document.createElement("div");
    new_description_unit_description_division.setAttribute("id", `sub_box_${counter_sub_box}_description_unit_description_division`);

    let new_description_button = document.createElement("button");
    new_description_button.classList.add("description_button")

    let new_description_image = document.createElement("img");
    new_description_image.setAttribute("id", `description_button_${counter_sub_box}`);
    new_description_image.setAttribute("src", "Description.png");
    new_description_image.setAttribute("style", "border-radius: 4px;");

    new_description_button.appendChild(new_description_image);

    new_description_unit_description_division.appendChild(new_description_button);


    let new_description_unit_due_dates_division = document.createElement("div");
    new_description_unit_due_dates_division.setAttribute("id", `sub_box_${counter_sub_box}_description_unit_due_dates_division`);

    

    let new_description_unit_checklist_division = document.createElement("div");
    new_description_unit_checklist_division.setAttribute("id", `sub_box_${counter_sub_box}_description_unit_checklist_division`);
    new_description_unit_checklist_division.classList.add("checklist_division");
    

    let new_description_unit_checklist_image = document.createElement("img");
    new_description_unit_checklist_image.classList.add("checklist_button");
    new_description_unit_checklist_image.setAttribute("src", "Checklist.png");
    

    let new_description_unit_checklist_counter = document.createElement("p");
    new_description_unit_checklist_counter.setAttribute("id", `sub_box_${counter_sub_box}_checklist_counter`);
    new_description_unit_checklist_counter.classList.add("sub_box_checklist_counter");
    let new_description_unit_checklist_counter_textnode = document.createTextNode("0/0");
    new_description_unit_checklist_counter.appendChild(new_description_unit_checklist_counter_textnode);


    new_description_unit_checklist_division.appendChild(new_description_unit_checklist_image);
    new_description_unit_checklist_division.appendChild(new_description_unit_checklist_counter);



    let new_description_unit_attachment_division = document.createElement("div");
    new_description_unit_attachment_division.setAttribute("id", `sub_box_${counter_sub_box}_description_unit_attachment_division`);
    new_description_unit_attachment_division.classList.add("attachment_division");
    


    let new_description_unit_footnote_division = document.createElement("div");
    new_description_unit_footnote_division.setAttribute("id", `sub_box_${counter_sub_box}_description_unit_footnote_division`);
    new_description_unit_footnote_division.classList.add("footnote_division");


    let new_description_unit_footnote_image = document.createElement("img");
    new_description_unit_footnote_image.classList.add("footnote_button");
    new_description_unit_footnote_image.setAttribute("src", "Footnote.png");
    

    let new_description_unit_footnote_counter = document.createElement("p");
    new_description_unit_footnote_counter.setAttribute("id", `sub_box_${counter_sub_box}_footnote_counter`);
    new_description_unit_footnote_counter.classList.add("sub_box_front_footnote_counter");
    let new_description_unit_footnote_counter_textnode = document.createTextNode("0");
    new_description_unit_footnote_counter.appendChild(new_description_unit_footnote_counter_textnode);


    new_description_unit_footnote_division.appendChild(new_description_unit_footnote_image);
    new_description_unit_footnote_division.appendChild(new_description_unit_footnote_counter);



    new_description_unit.appendChild(new_description_unit_description_division);
    new_description_unit.appendChild(new_description_unit_due_dates_division);
    new_description_unit.appendChild(new_description_unit_checklist_division);
    new_description_unit.appendChild(new_description_unit_attachment_division);
    new_description_unit.appendChild(new_description_unit_footnote_division);



    let new_description = document.createElement("div");
    new_description.classList.add("sub_box_description")
    new_description.setAttribute("id", `sub_box_description_${counter_sub_box}`);

    let new_description_content = document.createElement("div");
    new_description_content.classList.add("sub_box_description_content");
    new_description_content.setAttribute("id", `sub_box_${counter_sub_box}_description_content`);


    let new_description_title_image = document.createElement("img");
    new_description_title_image.setAttribute("src", "Description_Title.png");

    let sub_box_description_title = document.createElement("p");
    sub_box_description_title.classList.add("sub_box_description_title");
    let sub_box_description_title_textnode = document.createTextNode("(Task Title)");
    sub_box_description_title.appendChild(sub_box_description_title_textnode);

    let task_box_title = event.target.closest(".task_box").children[0].value;
    if(task_box_title == null) task_box_title = "No Task List Title";

    let sub_box_description_subtitle = document.createElement("p");
    sub_box_description_subtitle.classList.add("sub_box_description_subtitle");
    let sub_box_description_subtitle_textnode = document.createTextNode(`in ${task_box_title}`);
    sub_box_description_subtitle.appendChild(sub_box_description_subtitle_textnode);

    // Labels, Due Dates and maybe in the future add Members
    // Additional Description Division = Labels, Due dates and possibly Members
    let new_additional_description_division = document.createElement("div");

    // Labels
    let new_labels_division = document.createElement("div");
    new_labels_division.setAttribute("id", `labels_division_${counter_sub_box}`);

    let new_labels_collection = document.createElement("div");
    new_labels_collection.setAttribute("id", `labels_collection_${counter_sub_box}`);

    new_labels_division.appendChild(new_labels_collection);

    new_additional_description_division.appendChild(new_labels_division);


    



    // Description
    let new_description_division = document.createElement("div");
    new_description_division.setAttribute("style", "margin: 0px 0px 20px 0px;")

    let new_description_content_image = document.createElement("img");
    new_description_content_image.setAttribute("src", "Description.png");

    let sub_box_description_header = document.createElement("p");
    sub_box_description_header.classList.add("sub_box_description_header");
    let sub_box_description_header_textnode = document.createTextNode(`Description`);
    sub_box_description_header.appendChild(sub_box_description_header_textnode);

    let new_description_outer_paragraph = document.createElement("p");
    let new_description_paragraph = document.createElement("span");
    new_description_outer_paragraph.classList.add("sub_box_description_outer_paragraph");
    new_description_paragraph.classList.add("sub_box_description_paragraph");
    new_description_paragraph.setAttribute("role", "textbox");
    new_description_paragraph.setAttribute("contenteditable", "");
    new_description_outer_paragraph.appendChild(new_description_paragraph);

    new_description_division.appendChild(new_description_content_image);
    new_description_division.appendChild(sub_box_description_header);
    new_description_division.appendChild(new_description_outer_paragraph);


    // Checklists
    let new_checklist_division = document.createElement("div");
    new_checklist_division.setAttribute("id", `checklist_division_${counter_sub_box}`);

    let new_checklist_collection = document.createElement("div");
    new_checklist_collection.setAttribute("id", `checklist_collection_${counter_sub_box}`);

    new_checklist_division.appendChild(new_checklist_collection);



    // Footnotes
    let new_footnote_division = document.createElement("div");
    
    let new_description_footnote_image = document.createElement("img");
    new_description_footnote_image.setAttribute("src", "Footnote.png");
    new_description_footnote_image.classList.add("sub_box_footnote_image");

    let sub_box_footnote_header = document.createElement("p");
    sub_box_footnote_header.classList.add("sub_box_footnote_header");
    let sub_box_footnote_header_textnode = document.createTextNode(`Footnotes`);
    sub_box_footnote_header.appendChild(sub_box_footnote_header_textnode);

    let new_footnote_collection = document.createElement("div");
    new_footnote_collection.setAttribute("id", `footnote_collection_${counter_sub_box}`);

    let new_description_add_footnote_button = document.createElement("button");
    new_description_add_footnote_button.setAttribute("id", `footnote_button_${counter_sub_box}`);
    new_description_add_footnote_button.classList.add("sub_box_add_footnote_button");
    let new_description_add_footnote_button_textnode = document.createTextNode("Add Footnote");
    new_description_add_footnote_button.appendChild(new_description_add_footnote_button_textnode);

    new_footnote_division.appendChild(new_description_footnote_image);
    new_footnote_division.appendChild(sub_box_footnote_header);
    new_footnote_division.appendChild(new_footnote_collection);
    new_footnote_division.appendChild(new_description_add_footnote_button);

    
    new_description_content.appendChild(new_description_title_image);
    new_description_content.appendChild(sub_box_description_title);
    new_description_content.appendChild(sub_box_description_subtitle);
    new_description_content.appendChild(new_additional_description_division);
    new_description_content.appendChild(new_description_division);
    new_description_content.appendChild(new_checklist_division);
    new_description_content.appendChild(new_footnote_division)



    let new_description_sidebar = document.createElement("div");
    new_description_sidebar.classList.add("sub_box_description_sidebar");
    new_description_sidebar.setAttribute("id", `sub_box_${counter_sub_box}_description_sidebar`);


    let new_description_sidebar_add_buttons = document.createElement("div");
    new_description_sidebar_add_buttons.classList.add("sub_box_description_sidebar_add_buttons");


    let new_description_close_button = document.createElement("span");
    new_description_close_button.classList.add("sub_box_description_close_button");
    new_description_close_button.setAttribute("id", `description_close_button_${counter_sub_box}`);
    let new_description_close_button_textnode = document.createTextNode('\u00D7');
    new_description_close_button.appendChild(new_description_close_button_textnode);

    let new_description_add_text = document.createElement("p");
    new_description_add_text.classList.add("sub_box_description_add_text");
    let new_description_add_text_textnode = document.createTextNode("Add");
    new_description_add_text.appendChild(new_description_add_text_textnode);

    let new_description_add_labels_button = document.createElement("button");
    new_description_add_labels_button.classList.add("sub_box_description_add_labels_button");
    new_description_add_labels_button.setAttribute("id", `description_add_labels_button_${counter_sub_box}`);
    let new_description_add_labels_button_textnode = document.createTextNode("Labels");
    new_description_add_labels_button.appendChild(new_description_add_labels_button_textnode);

    let new_description_add_checklist_button = document.createElement("button");
    new_description_add_checklist_button.classList.add("sub_box_description_add_checklist_button");
    new_description_add_checklist_button.setAttribute("id", `description_add_checklist_button_${counter_sub_box}`);
    let new_description_add_checklist_button_textnode = document.createTextNode("Checklist");
    new_description_add_checklist_button.appendChild(new_description_add_checklist_button_textnode);

    let new_description_add_dates_button = document.createElement("button");
    new_description_add_dates_button.classList.add("sub_box_description_add_dates_button");
    new_description_add_dates_button.setAttribute("id", `description_add_dates_button_${counter_sub_box}`);
    let new_description_add_dates_button_textnode = document.createTextNode("Dates");
    new_description_add_dates_button.appendChild(new_description_add_dates_button_textnode);

    let new_description_add_attachments_button = document.createElement("button");
    new_description_add_attachments_button.classList.add("sub_box_description_add_attachments_button");
    new_description_add_attachments_button.setAttribute("id", `description_add_attachments_button_${counter_sub_box}`);
    let new_description_add_attachments_button_textnode = document.createTextNode("Attachments");
    new_description_add_attachments_button.appendChild(new_description_add_attachments_button_textnode);

    new_description_sidebar_add_buttons.appendChild(new_description_add_text);
    new_description_sidebar_add_buttons.appendChild(new_description_add_labels_button);
    new_description_sidebar_add_buttons.appendChild(new_description_add_checklist_button);
    new_description_sidebar_add_buttons.appendChild(new_description_add_dates_button);
    new_description_sidebar_add_buttons.appendChild(new_description_add_attachments_button);



    let new_description_sidebar_add_buttons_popups = document.createElement("div");
    new_description_sidebar_add_buttons_popups.classList.add("sub_box_sidebar_popups");


    let new_description_label_popup = document.createElement("div");
    new_description_label_popup.classList.add("sub_box_label_popup");
    new_description_label_popup.setAttribute("id", `description_label_popup_${counter_sub_box}`);

    let new_description_label_text = document.createElement("p");
    new_description_label_text.classList.add("sub_box_label_text");
    new_description_label_text.setAttribute("style", "margin: 1px 0px 10px 3px; color: black;");
    let new_description_label_text_textnode = document.createTextNode("Labels");
    new_description_label_text.appendChild(new_description_label_text_textnode);

    let new_description_label_close_button = document.createElement("span");
    new_description_label_close_button.classList.add("sub_box_description_label_close_button");
    new_description_label_close_button.setAttribute("id", `description_label_close_button_${counter_sub_box}`);
    let new_description_label_close_button_textnode = document.createTextNode('\u00D7');
    new_description_label_close_button.appendChild(new_description_label_close_button_textnode);

    // Labels

    let new_description_label_one = document.createElement("div");
    new_description_label_one.classList.add("sub_box_label_one");

    let new_description_label_one_container = document.createElement("label");
    new_description_label_one_container.classList.add("sub_box_label_container");

    let new_description_label_one_checklist_box = document.createElement("input");
    new_description_label_one_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_one_checklist_box.setAttribute("id", `description_label_one_checklist_box_${counter_sub_box}`);
    new_description_label_one_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_one_checklist_checkmark = document.createElement("span");
    new_description_label_one_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_one_input = document.createElement("input");
    new_description_label_one_input.classList.add("sub_box_label_input");

    new_description_label_one_input.setAttribute("autocomplete", "off");
    new_description_label_one_input.setAttribute("type", "text");
    new_description_label_one_input.setAttribute("maxlength", "15");
    new_description_label_one_input.setAttribute("size", "15");
    new_description_label_one_input.setAttribute("id", `sub_box_${counter_sub_box}_label_one`);
    new_description_label_one_input.setAttribute("value", `${label_one}`);

    new_description_label_one_container.appendChild(new_description_label_one_checklist_box);
    new_description_label_one_container.appendChild(new_description_label_one_checklist_checkmark);
    new_description_label_one_container.appendChild(new_description_label_one_input);

    new_description_label_one.appendChild(new_description_label_one_container);



    let new_description_label_two = document.createElement("div");
    new_description_label_two.classList.add("sub_box_label_two");

    let new_description_label_two_container = document.createElement("label");
    new_description_label_two_container.classList.add("sub_box_label_container");

    let new_description_label_two_checklist_box = document.createElement("input");
    new_description_label_two_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_two_checklist_box.setAttribute("id", `description_label_two_checklist_box_${counter_sub_box}`);
    new_description_label_two_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_two_checklist_checkmark = document.createElement("span");
    new_description_label_two_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_two_input = document.createElement("input");
    new_description_label_two_input.classList.add("sub_box_label_input");

    new_description_label_two_input.setAttribute("autocomplete", "off");
    new_description_label_two_input.setAttribute("type", "text");
    new_description_label_two_input.setAttribute("maxlength", "15");
    new_description_label_two_input.setAttribute("size", "15");
    new_description_label_two_input.setAttribute("id", `sub_box_${counter_sub_box}_label_two`);
    new_description_label_two_input.setAttribute("value", `${label_two}`);

    new_description_label_two_container.appendChild(new_description_label_two_checklist_box);
    new_description_label_two_container.appendChild(new_description_label_two_checklist_checkmark);
    new_description_label_two_container.appendChild(new_description_label_two_input);

    new_description_label_two.appendChild(new_description_label_two_container);
    


    let new_description_label_three = document.createElement("div");
    new_description_label_three.classList.add("sub_box_label_three");

    let new_description_label_three_container = document.createElement("label");
    new_description_label_three_container.classList.add("sub_box_label_container");

    let new_description_label_three_checklist_box = document.createElement("input");
    new_description_label_three_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_three_checklist_box.setAttribute("id", `description_label_three_checklist_box_${counter_sub_box}`);
    new_description_label_three_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_three_checklist_checkmark = document.createElement("span");
    new_description_label_three_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_three_input = document.createElement("input");
    new_description_label_three_input.classList.add("sub_box_label_input");

    new_description_label_three_input.setAttribute("autocomplete", "off");
    new_description_label_three_input.setAttribute("type", "text");
    new_description_label_three_input.setAttribute("maxlength", "15");
    new_description_label_three_input.setAttribute("size", "15");
    new_description_label_three_input.setAttribute("id", `sub_box_${counter_sub_box}_label_three`);
    new_description_label_three_input.setAttribute("value", `${label_three}`);

    new_description_label_three_container.appendChild(new_description_label_three_checklist_box);
    new_description_label_three_container.appendChild(new_description_label_three_checklist_checkmark);
    new_description_label_three_container.appendChild(new_description_label_three_input);

    new_description_label_three.appendChild(new_description_label_three_container);



    let new_description_label_four = document.createElement("div");
    new_description_label_four.classList.add("sub_box_label_four");

    let new_description_label_four_container = document.createElement("label");
    new_description_label_four_container.classList.add("sub_box_label_container");

    let new_description_label_four_checklist_box = document.createElement("input");
    new_description_label_four_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_four_checklist_box.setAttribute("id", `description_label_four_checklist_box_${counter_sub_box}`);
    new_description_label_four_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_four_checklist_checkmark = document.createElement("span");
    new_description_label_four_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_four_input = document.createElement("input");
    new_description_label_four_input.classList.add("sub_box_label_input");

    new_description_label_four_input.setAttribute("autocomplete", "off");
    new_description_label_four_input.setAttribute("type", "text");
    new_description_label_four_input.setAttribute("maxlength", "15");
    new_description_label_four_input.setAttribute("size", "15");
    new_description_label_four_input.setAttribute("id", `sub_box_${counter_sub_box}_label_four`);
    new_description_label_four_input.setAttribute("value", `${label_four}`);

    new_description_label_four_container.appendChild(new_description_label_four_checklist_box);
    new_description_label_four_container.appendChild(new_description_label_four_checklist_checkmark);
    new_description_label_four_container.appendChild(new_description_label_four_input);

    new_description_label_four.appendChild(new_description_label_four_container);



    let new_description_label_five = document.createElement("div");
    new_description_label_five.classList.add("sub_box_label_five");

    let new_description_label_five_container = document.createElement("label");
    new_description_label_five_container.classList.add("sub_box_label_container");

    let new_description_label_five_checklist_box = document.createElement("input");
    new_description_label_five_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_five_checklist_box.setAttribute("id", `description_label_five_checklist_box_${counter_sub_box}`);
    new_description_label_five_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_five_checklist_checkmark = document.createElement("span");
    new_description_label_five_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_five_input = document.createElement("input");
    new_description_label_five_input.classList.add("sub_box_label_input");

    new_description_label_five_input.setAttribute("autocomplete", "off");
    new_description_label_five_input.setAttribute("type", "text");
    new_description_label_five_input.setAttribute("maxlength", "15");
    new_description_label_five_input.setAttribute("size", "15");
    new_description_label_five_input.setAttribute("id", `sub_box_${counter_sub_box}_label_five`);
    new_description_label_five_input.setAttribute("value", `${label_five}`);

    new_description_label_five_container.appendChild(new_description_label_five_checklist_box);
    new_description_label_five_container.appendChild(new_description_label_five_checklist_checkmark);
    new_description_label_five_container.appendChild(new_description_label_five_input);

    new_description_label_five.appendChild(new_description_label_five_container);



    let new_description_label_six = document.createElement("div");
    new_description_label_six.classList.add("sub_box_label_six");

    let new_description_label_six_container = document.createElement("label");
    new_description_label_six_container.classList.add("sub_box_label_container");

    let new_description_label_six_checklist_box = document.createElement("input");
    new_description_label_six_checklist_box.classList.add("sub_box_description_label_checklist_box");
    new_description_label_six_checklist_box.setAttribute("id", `description_label_six_checklist_box_${counter_sub_box}`);
    new_description_label_six_checklist_box.setAttribute("type", "checkbox");

    let new_description_label_six_checklist_checkmark = document.createElement("span");
    new_description_label_six_checklist_checkmark.classList.add("sub_box_description_label_checklist_checkmark");

    let new_description_label_six_input = document.createElement("input");
    new_description_label_six_input.classList.add("sub_box_label_input");

    new_description_label_six_input.setAttribute("autocomplete", "off");
    new_description_label_six_input.setAttribute("type", "text");
    new_description_label_six_input.setAttribute("maxlength", "15");
    new_description_label_six_input.setAttribute("size", "15");
    new_description_label_six_input.setAttribute("id", `sub_box_${counter_sub_box}_label_six`);
    new_description_label_six_input.setAttribute("value", `${label_six}`);

    new_description_label_six_container.appendChild(new_description_label_six_checklist_box);
    new_description_label_six_container.appendChild(new_description_label_six_checklist_checkmark);
    new_description_label_six_container.appendChild(new_description_label_six_input);

    new_description_label_six.appendChild(new_description_label_six_container);


    new_description_label_popup.appendChild(new_description_label_text);
    new_description_label_popup.appendChild(new_description_label_close_button);
    new_description_label_popup.appendChild(new_description_label_one);
    new_description_label_popup.appendChild(new_description_label_two);
    new_description_label_popup.appendChild(new_description_label_three);
    new_description_label_popup.appendChild(new_description_label_four);
    new_description_label_popup.appendChild(new_description_label_five);
    new_description_label_popup.appendChild(new_description_label_six);


    new_description_sidebar_add_buttons_popups.appendChild(new_description_label_popup);
    

    let new_description_checklist_popup = document.createElement("div");
    new_description_checklist_popup.classList.add("sub_box_checklist_popup");
    new_description_checklist_popup.setAttribute("id", `description_checklist_popup_${counter_sub_box}`);

    let new_description_checklist_text = document.createElement("p");
    new_description_checklist_text.classList.add("sub_box_checklist_text");
    new_description_checklist_text.setAttribute("style", "margin: 1px 0px 10px 3px; color: black;");
    let new_description_checklist_text_textnode = document.createTextNode("Add Checklist");
    new_description_checklist_text.appendChild(new_description_checklist_text_textnode);

    let new_description_checklist_close_button = document.createElement("span");
    new_description_checklist_close_button.classList.add("sub_box_description_checklist_close_button");
    new_description_checklist_close_button.setAttribute("id", `description_checklist_close_button_${counter_sub_box}`);
    let new_description_checklist_close_button_textnode = document.createTextNode('\u00D7');
    new_description_checklist_close_button.appendChild(new_description_checklist_close_button_textnode);

    new_description_checklist_popup.appendChild(new_description_checklist_text);
    new_description_checklist_popup.appendChild(new_description_checklist_close_button);


    let new_description_checklist_inputs = document.createElement("div");

    new_description_checklist_text = document.createElement("p");
    new_description_checklist_text.classList.add("sub_box_checklist_text");
    new_description_checklist_text.setAttribute("style", "margin: 0px 0px 5px 3px; color: black;");
    new_description_checklist_text_textnode = document.createTextNode("Title");
    new_description_checklist_text.appendChild(new_description_checklist_text_textnode);

    new_description_checklist_inputs.appendChild(new_description_checklist_text);


    let new_description_checklist_input_outer_paragraph = document.createElement("p");
    let new_description_checklist_input = document.createElement("span");
    new_description_checklist_input.setAttribute("id", `sub_box_${counter_sub_box}_new_checklist_title_input`);
    new_description_checklist_input_outer_paragraph.classList.add("add_checklist_title_outer_paragraph");
    new_description_checklist_input.classList.add("add_checklist_title_paragraph");
    new_description_checklist_input.setAttribute("role", "textbox");
    new_description_checklist_input.setAttribute("contenteditable", "");

    new_description_checklist_input_outer_paragraph.appendChild(new_description_checklist_input);
    new_description_checklist_inputs.appendChild(new_description_checklist_input_outer_paragraph);



    new_description_checklist_text = document.createElement("p");
    new_description_checklist_text.setAttribute("id", `sub_box_${counter_sub_box}_invalid_title_warning`);
    new_description_checklist_text.setAttribute("style", "margin: 3px 0px 10px 0px; color: red; font-size: 80%; display: none;");
    new_description_checklist_text_textnode = document.createTextNode("Invalid Title");
    new_description_checklist_text.appendChild(new_description_checklist_text_textnode);

    new_description_checklist_inputs.appendChild(new_description_checklist_text);

    
    


    let new_description_checklist_create_button = document.createElement("button");

    let new_description_checklist_create_button_textnode = document.createTextNode("Add");
    new_description_checklist_create_button.appendChild(new_description_checklist_create_button_textnode);

    new_description_checklist_create_button.setAttribute("id", `sub_box_${counter_sub_box}_create_checklist_button`);
    new_description_checklist_create_button.classList.add("sub_box_checklist_create_button")

    new_description_checklist_inputs.appendChild(new_description_checklist_create_button);
    
    new_description_checklist_popup.appendChild(new_description_checklist_inputs);

    

    new_description_sidebar_add_buttons_popups.appendChild(new_description_checklist_popup);



    new_description_sidebar.appendChild(new_description_close_button);
    new_description_sidebar.appendChild(new_description_sidebar_add_buttons);
    new_description_sidebar.appendChild(new_description_sidebar_add_buttons_popups);
    
    new_description.appendChild(new_description_content);
    new_description.appendChild(new_description_sidebar);

    initial_sub_box.appendChild(new_description);



    initial_sub_box.appendChild(new_description_unit);

    initial_sub_box.setAttribute("id", `sub_box_${counter_sub_box}`);
    initial_sub_box.setAttribute("draggable", "true");
    initial_sub_box.setAttribute("ondrop", "drop(event)");
    initial_sub_box.setAttribute("ondragover", "allowDrop(event)");
    initial_sub_box.setAttribute("ondragstart", "drag(event)");
    
    event.target.parentElement.children[1].append(initial_sub_box);

    // Automatically closes the labels when others are already closed
    if(toggleLabelBool == true){
        prev_width = initial_label_one_text.clientWidth + "px";
        initial_label_one_text.style.display = "none";
        initial_label_one_text.parentElement.style.width = prev_width;

        prev_width = initial_label_two_text.clientWidth + "px";
        initial_label_two_text.style.display = "none";
        initial_label_two_text.parentElement.style.width = prev_width;

        prev_width = initial_label_three_text.clientWidth + "px";
        initial_label_three_text.style.display = "none";
        initial_label_three_text.parentElement.style.width = prev_width;

        prev_width = initial_label_four_text.clientWidth + "px";
        initial_label_four_text.style.display = "none";
        initial_label_four_text.parentElement.style.width = prev_width;

        prev_width = initial_label_five_text.clientWidth + "px";
        initial_label_five_text.style.display = "none";
        initial_label_five_text.parentElement.style.width = prev_width;

        prev_width = initial_label_six_text.clientWidth + "px";
        initial_label_six_text.style.display = "none";
        initial_label_six_text.parentElement.style.width = prev_width;
    }

    initial_label_one_container.style.display = "none";
    initial_label_two_container.style.display = "none";
    initial_label_three_container.style.display = "none";
    initial_label_four_container.style.display = "none";
    initial_label_five_container.style.display = "none";
    initial_label_six_container.style.display = "none";
        


    document.getElementById(`description_button_${counter_sub_box}`).addEventListener("click", showDescription);
    document.getElementById(`description_close_button_${counter_sub_box}`).addEventListener("click", () => {
        document.getElementById(`sub_box_description_${counter_sub_box - 1}`).style.display = "none";
    });
    document.getElementById(`footnote_button_${counter_sub_box}`).addEventListener("click", addFootnote);
    document.getElementById(`description_add_labels_button_${counter_sub_box}`).addEventListener("click", showLabels);
    document.getElementById(`description_add_checklist_button_${counter_sub_box}`).addEventListener("click", showCreateChecklists);

    // Automatically set cursor position to the title
    sub_box_initial_title.focus();

    document.addEventListener("keydown", e => {
        console.log(e)
        if(e.key === "Enter"){
            e.preventDefault();
            console.log("User pressed Enter");
        }
    })

    counter_sub_box += 1;
}

function showCreateChecklists(event){
    let sub_box_id = event.target.id.replace(/\D/g,'');

    if(document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display === "none" || document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display === ""){
        document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "block";
    } else if(document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display === "block"){
        document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";
    }

    // Add Create Checklists Button Functionality
    document.getElementById(`sub_box_${sub_box_id}_create_checklist_button`).addEventListener("click", addChecklist);
    
    

    window.addEventListener("click", (event) => {
        if(event.target == document.getElementById(`sub_box_${sub_box_id}_description_content`)){
            document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
            document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";
        } else if (event.target == document.getElementById(`sub_box_${sub_box_id}_description_sidebar`)){
            document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
            document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";
        } else if (event.target == document.getElementById(`sub_box_description_${sub_box_id}`)){
            document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
            document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";
        } 
    });

    document.getElementById(`description_checklist_close_button_${sub_box_id}`).addEventListener("click", () => {
        document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";
    });
}

function addChecklist(event){
    let sub_box_id = event.target.id.replace(/\D/g,'');

    let counter_checklist = 1;

    if(document.getElementById(`checklist_collection_${sub_box_id}`).children.length === 0){
        counter_checklist = 1;
        document.getElementById(`sub_box_${sub_box_id}_description_unit_checklist_division`).style.display = "flex";
    } else counter_checklist = document.getElementById(`checklist_collection_${sub_box_id}`).children.length + 1;

    let similarItems = false;

    
    for(let i = 1; i < document.getElementById(`checklist_collection_${sub_box_id}`).children.length + 1; i++){
        console.log(sub_box_id + " " + i);
        console.log(document.getElementById(`checklist_collection_${sub_box_id}`).children.length)
        if(document.getElementById(`sub_box_${sub_box_id}_new_checklist_title_input`).innerHTML === document.getElementById(`checklist_collection_${sub_box_id}_checklist_${i}_title`).innerHTML){
            similarItems = true;
        }
    }

    if(similarItems == true){
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).innerHTML = "Invalid Title, there is alread a checklist " + "<br />" + "with that name!";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "block";
    } else if(document.getElementById(`sub_box_${sub_box_id}_new_checklist_title_input`).innerHTML === ""){
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).innerHTML = "Invalid Title, put something in!";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "block";
    } else if(document.getElementById(`sub_box_${sub_box_id}_new_checklist_title_input`).innerHTML != ""){
        document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";

        let title = document.getElementById(`sub_box_${sub_box_id}_new_checklist_title_input`).innerHTML;
        document.getElementById(`sub_box_${sub_box_id}_new_checklist_title_input`).innerHTML = "";

        

        let new_checklist = document.createElement("div");
        new_checklist.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}`);
        new_checklist.classList.add("checklist");


        let new_checklist_header = document.createElement("div");
        new_checklist_header.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_header`);
        new_checklist_header.classList.add("checklist_header");

        let new_checklist_header_text = document.createElement("div");
        new_checklist_header_text.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_header_text`);
        new_checklist_header_text.classList.add("checklist_header_text");

        let new_checklist_icon = document.createElement("img");
        new_checklist_icon.setAttribute("src", "Checklist.png");
        new_checklist_icon.classList.add("checklist_icon");

        new_checklist_header_text.appendChild(new_checklist_icon);


        let new_checklist_title_outer_paragraph = document.createElement("p");
        let new_checklist_title_paragraph = document.createElement("span");
        new_checklist_title_paragraph.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_title`);
        new_checklist_title_outer_paragraph.classList.add("checklist_title_outer_paragraph");
        new_checklist_title_paragraph.classList.add("checklist_title_paragraph");
        new_checklist_title_paragraph.setAttribute("role", "textbox");
        new_checklist_title_paragraph.setAttribute("contenteditable", "");
        new_checklist_title_paragraph.innerHTML= `${title}`;


        new_checklist_title_outer_paragraph.appendChild(new_checklist_title_paragraph);
        new_checklist_header_text.appendChild(new_checklist_title_outer_paragraph);


        let new_checklist_header_buttons = document.createElement("div");
        new_checklist_header_buttons.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_header_buttons`);


        let new_checklist_delete_button = document.createElement("span");
        new_checklist_delete_button.classList.add("checklist_delete_button");
        new_checklist_delete_button.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_delete_button`);
        let new_checklist_delete_button_textnode = document.createTextNode('\u00D7');
        new_checklist_delete_button.appendChild(new_checklist_delete_button_textnode);

        new_checklist_header_buttons.appendChild(new_checklist_delete_button);

        
        new_checklist_header.appendChild(new_checklist_header_text);
        new_checklist_header.appendChild(new_checklist_header_buttons);



        let new_checklist_progressbar_division = document.createElement("div");
        new_checklist_progressbar_division.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_progressbar_division`);


        let new_checklist_percentage = document.createElement("p");
        new_checklist_percentage.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_percentage`);
        new_checklist_percentage.classList.add("checklist_percentage");
        new_checklist_percentage_textnode = document.createTextNode("0.00%");
        new_checklist_percentage.appendChild(new_checklist_percentage_textnode);

        new_checklist_progressbar_division.appendChild(new_checklist_percentage);


        let new_checklist_progressbar = document.createElement("progress");
        new_checklist_progressbar.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_progressbar`);
        new_checklist_progressbar.classList.add("checklist_progressbar");
        new_checklist_progressbar.setAttribute("value", "0");
        new_checklist_progressbar.setAttribute("max", "1");

        new_checklist_progressbar_division.appendChild(new_checklist_progressbar);


        let new_checklist_items = document.createElement("div");
        new_checklist_items.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_items`);


        let new_checklist_add_item_button = document.createElement("button");
        new_checklist_add_item_button.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${counter_checklist}_add_item_button`);
        new_checklist_add_item_button.classList.add("checklist_add_items_button");
        let new_checklist_add_item_button_textnode = document.createTextNode("Add item");
        new_checklist_add_item_button.appendChild(new_checklist_add_item_button_textnode);


        new_checklist.appendChild(new_checklist_header);
        new_checklist.appendChild(new_checklist_progressbar_division);
        new_checklist.appendChild(new_checklist_items);
        new_checklist.appendChild(new_checklist_add_item_button);

        document.getElementById(`checklist_collection_${sub_box_id}`).appendChild(new_checklist);

        //Double Check just to be sure.
        calculateTotalChecklists(sub_box_id);

        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${counter_checklist}_add_item_button`).addEventListener("click", addChecklistItems);
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${counter_checklist}_delete_button`).addEventListener("click", deleteChecklist);
    }
}

function deleteChecklist(event){
    let sub_box_id = event.target.parentElement.parentElement.parentElement.parentElement.id.replace(/\D/g,'');


    document.getElementById(`${event.target.parentElement.parentElement.parentElement.id}`).remove();

    if(document.getElementById(`checklist_collection_${sub_box_id}`).children.length != 0){
        for(let i = 1; i < document.getElementById(`checklist_collection_${sub_box_id}`).children.length + 1; i++){
            let new_checklist_number = `checklist_collection_${sub_box_id}_checklist_${i}`;
            document.getElementById(`checklist_collection_${sub_box_id}`).children[i - 1].id = `${new_checklist_number}`;

            document.getElementById(`${new_checklist_number}`).children[0].id = `${new_checklist_number}_header`;

            document.getElementById(`${new_checklist_number}_header`).children[0].id = `${new_checklist_number}_header_text`;
            document.getElementById(`${new_checklist_number}_header_text`).children[1].children[0].id = `${new_checklist_number}_title`;


            document.getElementById(`${new_checklist_number}_header`).children[1].id = `${new_checklist_number}_header_buttons`;
            document.getElementById(`${new_checklist_number}_header_buttons`).children[0].id = `${new_checklist_number}_delete_button`;
            

            document.getElementById(`${new_checklist_number}`).children[1].id = `${new_checklist_number}_progressbar_division`;
            document.getElementById(`${new_checklist_number}_progressbar_division`).children[0].id = `${new_checklist_number}_percentage`;
            document.getElementById(`${new_checklist_number}_progressbar_division`).children[1].id = `${new_checklist_number}_progressbar`;


            document.getElementById(`${new_checklist_number}`).children[2].id = `${new_checklist_number}_items`;
            for(let j = 1; j < document.getElementById(`${new_checklist_number}_items`).children.length + 1; j++){
                document.getElementById(`${new_checklist_number}_items`).children[j - 1].id = `${new_checklist_number}_item_${j}`;

                document.getElementById(`${new_checklist_number}_item_${j}`).children[0].id = `${new_checklist_number}_item_${j}_inputs`;
                document.getElementById(`${new_checklist_number}_item_${j}_inputs`).children[0].id = `${new_checklist_number}_checkbox_${j}`;
                document.getElementById(`${new_checklist_number}_item_${j}_inputs`).children[1].children[0].id = `${new_checklist_number}_text_${j}`;
            }

            calculateTotalChecklists(sub_box_id);

            document.getElementById(`${new_checklist_number}`).children[3].id = `${new_checklist_number}_add_item_button`;
        }
    } else if(document.getElementById(`checklist_collection_${sub_box_id}`).children.length === 0){
        document.getElementById(`sub_box_${sub_box_id}_description_unit_checklist_division`).style.display = "none";
    }
}

function addChecklistItems(event){
    let sub_box_id = event.target.parentElement.parentElement.id.replace(/\D/g,'');
    let checklist_id = event.target.parentElement.id.replace(`checklist_collection_${sub_box_id}_checklist_`, '');
    let counter_checklist_item = 1;

    console.log(sub_box_id);
    console.log(checklist_id);
    
    if(event.target.parentElement.children[2].children.length === 0){
        counter_checklist_item = 1
    } else counter_checklist_item = event.target.parentElement.children[2].children.length + 1;

    let new_checklist_item = document.createElement("div");
    new_checklist_item.classList.add("checklist_items");
    new_checklist_item.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${counter_checklist_item}`);

    let new_checklist_inputs = document.createElement("div");
    new_checklist_inputs.classList.add("checklist_item_inputs");
    new_checklist_inputs.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${counter_checklist_item}_inputs`);

    let new_checklist_checkbox = document.createElement("input");
    new_checklist_checkbox.classList.add("checklist_checkbox");
    new_checklist_checkbox.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${counter_checklist_item}`);
    new_checklist_checkbox.setAttribute("type", "checkbox");

    let new_checklist_text_outer_paragraph = document.createElement("p");
    let new_checklist_text = document.createElement("span");
    new_checklist_text.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_text_${counter_checklist_item}`);
    new_checklist_text_outer_paragraph.classList.add("checklist_text_outer_paragraph");
    new_checklist_text.classList.add("checklist_text");
    new_checklist_text.setAttribute("role", "textbox");
    new_checklist_text.setAttribute("contenteditable", "");

    new_checklist_text_outer_paragraph.appendChild(new_checklist_text);

    new_checklist_inputs.append(new_checklist_checkbox);
    new_checklist_inputs.append(new_checklist_text_outer_paragraph);

    new_checklist_item.appendChild(new_checklist_inputs);


    let new_checklist_buttons = document.createElement("div");
    new_checklist_buttons.classList.add("checklist_items_buttons");
    new_checklist_buttons.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${counter_checklist_item}_buttons`);

    let new_checklist_item_delete_button = document.createElement("span");
    new_checklist_item_delete_button.classList.add("checklist_item_delete_button");
    new_checklist_item_delete_button.setAttribute("id", `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${counter_checklist_item}_delete_button`);
    let new_checklist_item_delete_button_textnode = document.createTextNode('\u00D7');
    new_checklist_item_delete_button.appendChild(new_checklist_item_delete_button_textnode);

    new_checklist_buttons.append(new_checklist_item_delete_button);

    new_checklist_item.appendChild(new_checklist_buttons);
    


    console.log(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`);

    if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length === 0){
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).max = 1;
    } else if (document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length > 0){
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).max += 1;
    }
    
    

    event.target.parentElement.children[2].appendChild(new_checklist_item);


    let sum = 0;

    for(let i = 0; i < document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length; i++){
        console.log(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i + 1}`));
        if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i + 1}`).checked){
            sum += 1;
        }
    }

    percentage = (Math.round((sum / document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length) * 10000) / 100).toFixed(2);

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_percentage`).innerHTML = percentage + "%";

    calculateTotalChecklists(sub_box_id);

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${counter_checklist_item}`).addEventListener("click", recalculateProgressBar);
    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${counter_checklist_item}_delete_button`).addEventListener("click", deleteChecklistItems);
}


function deleteChecklistItems(event){
    let sub_box_id = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.id.replace(/\D/g,'');
    let checklist_id = event.target.parentElement.parentElement.parentElement.parentElement.id.replace(`checklist_collection_${sub_box_id}_checklist_`,'');



    let collection = event.target.parentElement.parentElement.parentElement.id;

    document.getElementById(`${event.target.parentElement.parentElement.id}`).remove();

    for(let i = 1; i < document.getElementById(collection).children.length + 1; i++){
        console.log(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`);
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children[i - 1].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}`;

        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}`).children[0].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_inputs`;
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_inputs`).children[0].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i}`;
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_inputs`).children[1].children[0].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_text_${i}`;

        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}`).children[1].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_buttons`;
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_buttons`).children[0].id = `checklist_collection_${sub_box_id}_checklist_${checklist_id}_item_${i}_delete_button`;
    }

    // Delete one unit of max from the progress bar
    if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length === 1){
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).max = 1;
    } else if (document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length > 1){
        document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).max -= 1;
    }

    recalculateProgressBarChecklistItemDeletion(sub_box_id, checklist_id);
}


function recalculateProgressBar(event){
    let sub_box_id = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.id.replace(/\D/g,'');
    let checklist_id = event.target.parentElement.parentElement.parentElement.parentElement.id.replace(`checklist_collection_${sub_box_id}_checklist_`, '');

    let sum = 0;
        
    console.log(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`);
    for(let i = 0; i < document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length; i++){
        console.log(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i}`));
        if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i + 1}`).checked){
            sum += 1;
        }
    }

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).value = sum;

    percentage = (Math.round((sum / document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length) * 10000) / 100).toFixed(2);

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_percentage`).innerHTML = percentage + "%";

    calculateTotalChecklists(sub_box_id);
}


function recalculateProgressBarChecklistItemDeletion(sub_box_id, checklist_id){
    let sum = 0;
        
    console.log(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`);
    for(let i = 0; i < document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length; i++){
        if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_checkbox_${i + 1}`).checked){
            sum += 1;
        }
    }

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_progressbar`).value = sum;

    if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length != 0){
        percentage = (Math.round((sum / document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length) * 10000) / 100).toFixed(2);
    } else if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_items`).children.length === 0){
        percentage = "0.00";
    }

    document.getElementById(`checklist_collection_${sub_box_id}_checklist_${checklist_id}_percentage`).innerHTML = percentage + "%";

    calculateTotalChecklists(sub_box_id);
}

function calculateTotalChecklists(sub_box_id){
    let total_checked = 0;
    let total_checklist_items = 0;

    for(let i = 1; i < document.getElementById(`checklist_collection_${sub_box_id}`).children.length + 1; i++){
        for(let j = 1; j < document.getElementById(`checklist_collection_${sub_box_id}_checklist_${i}_items`).children.length + 1; j++){
            total_checklist_items += 1;
            if(document.getElementById(`checklist_collection_${sub_box_id}_checklist_${i}_checkbox_${j}`).checked) total_checked += 1;
        }
    }

    document.getElementById(`sub_box_${sub_box_id}_checklist_counter`).innerHTML = total_checked + "/" + total_checklist_items;
}


function showLabels(event){
    let sub_box_id = event.target.id.replace(/\D/g,'');

    if(document.getElementById(`description_label_popup_${sub_box_id}`).style.display === "none" || document.getElementById(`description_label_popup_${sub_box_id}`).style.display === ""){
        document.getElementById(`sub_box_${sub_box_id}_label_one`).value = label_one;
        document.getElementById(`sub_box_${sub_box_id}_label_two`).value = label_two;
        document.getElementById(`sub_box_${sub_box_id}_label_three`).value = label_three;
        document.getElementById(`sub_box_${sub_box_id}_label_four`).value = label_four;
        document.getElementById(`sub_box_${sub_box_id}_label_five`).value = label_five;
        document.getElementById(`sub_box_${sub_box_id}_label_six`).value = label_six;

        document.getElementById(`description_label_popup_${sub_box_id}`).style.display = "block";

        // Close other popups
        document.getElementById(`description_checklist_popup_${sub_box_id}`).style.display = "none";
        document.getElementById(`sub_box_${sub_box_id}_invalid_title_warning`).style.display = "none";

        // Enable Label Checkbox Functionality
        document.getElementById(`description_label_one_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_one_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_one_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_one_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_one_front`).style.display = "none";
            }
        });
        document.getElementById(`description_label_two_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_two_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_two_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_two_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_two_front`).style.display = "none";
            }
        });
        document.getElementById(`description_label_three_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_three_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_three_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_three_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_three_front`).style.display = "none";
            }
        });
        document.getElementById(`description_label_four_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_four_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_four_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_four_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_four_front`).style.display = "none";
            }
        });
        document.getElementById(`description_label_five_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_five_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_five_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_five_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_five_front`).style.display = "none";
            }
        });
        document.getElementById(`description_label_six_checklist_box_${sub_box_id}`).addEventListener("click", () => {
            if(document.getElementById(`description_label_six_checklist_box_${sub_box_id}`).checked === true){
                document.getElementById(`sub_box_${sub_box_id}_label_six_front`).style.display = "inline-block";
            } else if(document.getElementById(`description_label_six_checklist_box_${sub_box_id}`).checked === false){
                document.getElementById(`sub_box_${sub_box_id}_label_six_front`).style.display = "none";
            }
        });

        window.addEventListener("click", (event) => {
            if(event.target == document.getElementById(`sub_box_${sub_box_id}_description_content`)){
                closeLabels(event);
            } else if (event.target == document.getElementById(`sub_box_${sub_box_id}_description_sidebar`)){
                closeLabels(event);
            }
        });

        document.getElementById(`description_label_close_button_${sub_box_id}`).addEventListener("click", closeLabels);
    } else if(document.getElementById(`description_label_popup_${sub_box_id}`).style.display === "block"){
        closeLabels(event);
    }
}

function closeLabels(event){
    let sub_box_id = event.target.id.replace(/\D/g,'');

    // Update the titles
    if(label_one != document.getElementById(`sub_box_${sub_box_id}_label_one`).value){
        label_one = document.getElementById(`sub_box_${sub_box_id}_label_one`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_one_front`).children[0].innerHTML = label_one;
            document.getElementById(`sub_box_${i}_label_one_front`).style.width = document.getElementById(`sub_box_${i}_label_one_front`).children[0].clientWidth + "px";
        }
    }
    if(label_two != document.getElementById(`sub_box_${sub_box_id}_label_two`).value){
        label_two = document.getElementById(`sub_box_${sub_box_id}_label_two`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_two_front`).children[0].innerHTML = label_two;
            document.getElementById(`sub_box_${i}_label_two_front`).style.width = document.getElementById(`sub_box_${i}_label_two_front`).children[0].clientWidth + "px";
        }
    }
    if(label_three != document.getElementById(`sub_box_${sub_box_id}_label_three`).value){
        label_three = document.getElementById(`sub_box_${sub_box_id}_label_three`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_three_front`).children[0].innerHTML = label_three;
            document.getElementById(`sub_box_${i}_label_three_front`).style.width = document.getElementById(`sub_box_${i}_label_three_front`).children[0].clientWidth + "px";
        }
    }
    if(label_four != document.getElementById(`sub_box_${sub_box_id}_label_four`).value){
        label_four = document.getElementById(`sub_box_${sub_box_id}_label_four`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_four_front`).children[0].innerHTML = label_four;
            document.getElementById(`sub_box_${i}_label_four_front`).style.width = document.getElementById(`sub_box_${i}_label_four_front`).children[0].clientWidth + "px";
        }
    }
    if(label_five != document.getElementById(`sub_box_${sub_box_id}_label_five`).value){
        label_five = document.getElementById(`sub_box_${sub_box_id}_label_five`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_five_front`).children[0].innerHTML = label_five;
            document.getElementById(`sub_box_${i}_label_five_front`).style.width = document.getElementById(`sub_box_${i}_label_five_front`).children[0].clientWidth + "px";
        }
    }
    if(label_six != document.getElementById(`sub_box_${sub_box_id}_label_six`).value){
        label_six = document.getElementById(`sub_box_${sub_box_id}_label_six`).value;

        for(let i = 1; i < counter_sub_box; i++){
            document.getElementById(`sub_box_${i}_label_six_front`).children[0].innerHTML = label_six;
            document.getElementById(`sub_box_${i}_label_six_front`).style.width = document.getElementById(`sub_box_${i}_label_six_front`).children[0].clientWidth + "px";
        }
    }
    
    document.getElementById(`description_label_popup_${sub_box_id}`).style.display = "none";
}

function addFootnote(event){
    let counter_footnote = document.getElementById(`footnote_collection_${event.target.id.replace(/\D/g,'')}`).children.length + 1;

    let sub_box_id = event.target.id.replace(/\D/g,'');
    let new_footnote = document.createElement("div");
    new_footnote.classList.add("sub_box_footnote");
    new_footnote.setAttribute("id", `sub_box_${sub_box_id}_footnote_${counter_footnote}`);
    new_footnote.setAttribute("style", "margin: 0px 0px 10px 0px;")

    let new_footnote_text = document.createElement("div");
    new_footnote_text.classList.add("sub_box_footnote_text");

    let sub_box_footnote_counter = document.createElement("p");
    sub_box_footnote_counter.classList.add("sub_box_footnote_counter");
    let sub_box_footnote_counter_textnode = document.createTextNode(`${counter_footnote}.`);
    sub_box_footnote_counter.appendChild(sub_box_footnote_counter_textnode);

    let sub_box_footnote_outer_paragraph = document.createElement("p");
    let sub_box_footnote = document.createElement("span");
    sub_box_footnote_outer_paragraph.classList.add("sub_box_footnote_outer_paragraph");
    sub_box_footnote.classList.add("sub_box_footnote");
    sub_box_footnote.setAttribute("role", "textbox");
    //new_description.setAttribute("placeholder", "Add Description...");
    sub_box_footnote.setAttribute("contenteditable", "");
    sub_box_footnote_outer_paragraph.appendChild(sub_box_footnote);

    new_footnote_text.appendChild(sub_box_footnote_counter);
    new_footnote_text.appendChild(sub_box_footnote_outer_paragraph);


    let new_footnote_actions = document.createElement("div");
    new_footnote_actions.classList.add("sub_box_footnote_actions");

    let new_footnote_delete_button = document.createElement("span");
    new_footnote_delete_button.classList.add("sub_box_footnote_delete_button");
    new_footnote_delete_button.setAttribute("id", `sub_box_${sub_box_id}_footnote_delete_button_${counter_footnote}`);
    let new_footnote_delete_button_textnode = document.createTextNode('\u00D7');
    new_footnote_delete_button.appendChild(new_footnote_delete_button_textnode);

    new_footnote_actions.appendChild(new_footnote_delete_button);

    new_footnote.appendChild(new_footnote_text);
    new_footnote.appendChild(new_footnote_actions);

    event.target.parentElement.children[2].appendChild(new_footnote);

    document.getElementById(`sub_box_${sub_box_id}_description_unit_footnote_division`).style.display = "flex";

    let total_footnote = 0;
    for(let i = 0; i < document.getElementById(`footnote_collection_${sub_box_id}`).children.length; i++){
        total_footnote += 1;
    }

    document.getElementById(`sub_box_${sub_box_id}_footnote_counter`).innerHTML = `${total_footnote}`;

    document.getElementById(`sub_box_${sub_box_id}_footnote_delete_button_${counter_footnote}`).addEventListener("click", deleteFootnote);
}

function deleteFootnote(event){
    console.log(`${event.target.parentElement.parentElement.parentElement.id}`);

    let collection = event.target.parentElement.parentElement.parentElement;
    let items = collection.children;
    let sub_box_id = event.target.parentElement.parentElement.parentElement.id.replace(/\D/g,'');

    document.getElementById(`${event.target.parentElement.parentElement.id}`).remove();

    let total_footnote = 0;
    for(let i = 0; i < document.getElementById(`footnote_collection_${sub_box_id}`).children.length; i++){
        total_footnote += 1;
    }

    document.getElementById(`sub_box_${sub_box_id}_footnote_counter`).innerHTML = `${total_footnote}`;

    if(items.length != 0){
        for(let i = 0; i < items.length; i++){
            // Set ID Attribute to proper value
            collection.children[i].setAttribute("id", `sub_box_${sub_box_id}_footnote_${(i + 1)}`);
            collection.children[i].children[1].children[0].setAttribute("id", `sub_box_${sub_box_id}_footnote_delete_button_${(i + 1)}`);

            // Change Paragraph
            collection.children[i].children[0].children[0].innerHTML = `${(i + 1)}.`;
        }
    } else document.getElementById(`sub_box_${sub_box_id}_description_unit_footnote_division`).style.display = "none";
}

// Event triggers when user clicks on the footnote icon of a sub task
function showFootnote(event){

    
    showDescription(event);
}

function showDescription(event){
    preventDragging();

    // Update Sub Box Title
    let updated_sub_box_title = event.target.closest(".sub_box").children[1].children[0].textContent;
    if(updated_sub_box_title === "") updated_sub_box_title = "No Task Name";
    event.target.closest(".sub_box").children[2].children[0].children[1].innerHTML = updated_sub_box_title;

    // Update Task Box Title
    let updated_task_box_title = event.target.closest(".task_box").children[0].value;
    if(updated_task_box_title === "") updated_task_box_title = "No Task List Name";
    event.target.closest(".sub_box").children[2].children[0].children[2].innerHTML = " in " + updated_task_box_title;

    let sub_box_description_id = event.target.id.replace(/\D/g,'');
    let sub_box_description = document.getElementById(`sub_box_description_${sub_box_description_id}`);
    sub_box_description.style.display = "flex";

    // Event Listeners for Buttons to Close
    document.getElementById(`description_close_button_${sub_box_description_id}`).addEventListener("click", () => {
        sub_box_description.style.display = "none";
        document.getElementById(`description_label_popup_${sub_box_description_id}`).style.display = "none";

        document.getElementById(`description_checklist_popup_${sub_box_description_id}`).style.display = "none";
        
        closeLabels(event);
        allowDragging();
    });

    window.addEventListener("click", (event) => {
        if(event.target == sub_box_description){
            sub_box_description.style.display = "none";
            document.getElementById(`description_label_popup_${sub_box_description_id}`).style.display = "none";

            document.getElementById(`description_checklist_popup_${sub_box_description_id}`).style.display = "none";

            closeLabels(event);
            allowDragging();
        }
    });
}

function toggleLabels(){
    if(toggleLabelBool == false){
        for(let i = 0; i < document.getElementsByClassName("label_text").length; i++){
            let prev_width = 2 + document.getElementsByClassName("label_text")[i].clientWidth + "px";
            document.getElementsByClassName("label_text")[i].style.display = "none";
            document.getElementsByClassName("label_text")[i].parentElement.style.width = prev_width;
        }
        
        toggleLabelBool = true;

    } else if(toggleLabelBool == true){
        for(let i = 0; i < document.getElementsByClassName("label_text").length; i++){
            document.getElementsByClassName("label_text")[i].style.display = "inline-block";
        }

        toggleLabelBool = false;
    }
}

function preventDragging(){
    for(let i = 0; i < document.getElementsByClassName("task_box").length; i++){
        document.getElementsByClassName("task_box")[i].setAttribute("draggable", "false");
    }

    for(let i = 0; i < document.getElementsByClassName("sub_box").length; i++){
        document.getElementsByClassName("sub_box")[i].setAttribute("draggable", "false");
    }
}

function allowDragging(){
    for(let i = 0; i < document.getElementsByClassName("task_box").length; i++){
        document.getElementsByClassName("task_box")[i].setAttribute("draggable", "true");
    }

    for(let i = 0; i < document.getElementsByClassName("sub_box").length; i++){
        document.getElementsByClassName("sub_box")[i].setAttribute("draggable", "true");
    }
}