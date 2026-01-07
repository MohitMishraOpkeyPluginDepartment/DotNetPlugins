var accordionHeader = document.getElementById('accordion-header');
var accordionContent = document.querySelector('.table_format_accordian');
var dropdownIcon = document.querySelector('.dropdown-icon');
if(accordionHeader != null){
    accordionHeader.addEventListener('click', function() {
        accordionContent.style.display = (accordionContent.style.display === 'none' || accordionContent.style.display === '') ? 'block' : 'none';
        accordionHeader.classList.toggle('opened');
    });
}
