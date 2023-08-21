$(document).ready(function() {
    loadMenu();
})
const url = 'https://students.trungthanhweb.com/api/';
var nextPage = url+'home';
// Load Menu dropdown
function loadMenu() {
    if(localStorage.getItem('token') && localStorage.getItem('token') != null){
        $.ajax({
            type: "get",
            url: nextPage,
            data: {
                apitoken : localStorage.getItem('token')
    
            },
            dataType: "JSON",
            success: function (res) {
                // Get value for dropdown Loại Sản Phẩm
                var categrories = res.categrories;
                // Get value for dropdown Thương Hiệu
                var brands = res.brands;
                // Get value for prouduct
                var products = res.products.data;
                if(categrories.length > 0){
                    str = '';
                    categrories.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#typePro').html(str);
                }
                if(brands.length > 0){
                    var str = '';
                    brands.forEach(el => {
                        str +=`
                        <li>
                            <a class="dropdown-item text-primary" href="#">
                                `+el.name+`
                            </a>
                        </li>
                        `
                    });
                    $('#thuonghieu').html(str);
                }              
            }
        });       
    } 
}

