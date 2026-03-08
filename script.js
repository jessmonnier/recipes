document.addEventListener("DOMContentLoaded", function(){

    const checkboxes = document.querySelectorAll(".ingredients input");

    checkboxes.forEach(box => {

        box.addEventListener("change", function(){

            if(this.checked){
                this.parentElement.classList.add("checked");
            } else {
                this.parentElement.classList.remove("checked");
            }

        });

    });

});