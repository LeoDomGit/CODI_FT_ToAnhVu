$(document).ready(function() {
    login();
    logout();
    loadMore();
    loadData();
    
})
const url = 'https://students.trungthanhweb.com/api/';
// khai báo toast message
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }                                    
})
//Login
function login() {
    $('#loginBtn').click(function(event){
        event.preventDefault();
        var modal = $('#loginModal')
        $('#loginModal').modal('show');
        $('#submitLoginBtn').click(function(event) {
            event.preventDefault();
            var email = $('#email').val().trim();
            if(email == ''){            
                Toast.fire({
                    icon: 'warning',
                    title: 'chưa nhập Email'
                })
            }
            else{
                $.ajax({
                    type : 'post',
                    url : 'https://students.trungthanhweb.com/api/checkLoginhtml',
                    data : {
                        email : email
                    },
                    dataType : 'JSON',
                    success : function(res) {
                        if(res.check == true){
                            console.log(res.apitoken);
                            localStorage.setItem('token', res.apitoken);
                            
                            Toast.fire({
                                icon: 'success',
                                title: 'Đăng nhập thành công'
                            }).then(()=>{
                                window.location.reload();                              
                            })
                        }
                        else{
                            
                            Toast.fire({
                                icon: 'error',
                                title: 'Đăng nhập thất bại'
                            }) 
                        }
                    }
                })
            }
        })
    })
}
//Logout
function logout() {
    $('#logoutBtn').click(function (e) { 
        e.preventDefault();
        if(localStorage.getItem('token') && localStorage.getItem('token') != null){
            localStorage.removeItem('token');
            Toast.fire({
                icon: 'info',
                title: 'Goodybe!!'
            }).then(()=>{
                $('#loginBtn').show();
                window.location.reload();
            })
           
        }
    });
}
//funtion LoadData lấy dữ liệu Brands, Categrories, Products
var nextPage = url+'home';
function loadData(){
    $('#todoTable').hide();
    $('#logoutBtn').hide();
    $('#apiBtn').hide();
    if(localStorage.getItem('token') && localStorage.getItem('token') != null){
        $('#logoutBtn').show();
        $('#loginBtn').hide();
        $('#apiBtn').show();
        $('#showMoreBtn').click(function (e) { 
            e.preventDefault();
            loadMore();
        });
        
    }
}
// Xem thêm sản phẩm
function loadMore() { 
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
            if(products.length > 0){
                var str = '';
                products.forEach(el => {               
                    str +=`                         
                        <div class="col-12 col-lg-3 col-md-6 productItem">
                            <div class="card">
                                <img src="https://students.trungthanhweb.com/images/`+el.images+`" class="card-img-top" alt="...">
                                <div class="card-body">
                                    <h5 class="card-title">`+el.name+`</h5>
                                    <p class="card-text">Giá : `+Intl.NumberFormat('en-US').format(el.price)+`</p>
                                    <p class="card-text">`+el['catename']+`</p>
                                    <p class="card-text">`+el.brandname+`</p>
                                    <a href="detail.html?id=`+el.id+`" class="btn btn-primary viewBtn" data-id="`+el.id+`">Chi tiết</a>
                                    <a href="#" class="btn btn-success addBtn" data-id="`+el.id+`">Thêm</a>
                                </div>
                            </div>    
                        </div>
                    `
                });
                $('#prouductList').append(str);
                nextPage = res.products.next_page_url;
                if(res.products.next_page_url !== null){
                    nextPage = res.products.next_page_url;                    
                }
                else {
                    $('#showMoreBtn').hide();
                }
                addToCart();
            }
        }
    });       
}
// Function Thêm vào giỏ hàng
function addToCart(){
    if(!localStorage.getItem('cart') || localStorage.getItem('cart') == null){
        var arr = [];
    }
    else {
        var cart = localStorage.getItem('cart');
        var arr = JSON.parse(cart);
    }
    
    $('.addBtn').click(function (e) { 
        e.preventDefault();
        var id = Number($(this).attr('data-id'));
        var quantity = 1;
        var item = [id,quantity];
        var check = 0;
        arr.forEach(el => {
            if(el[0] == id){
                el[1]++;               
                check = 1;
            }
        });
        if(check == 0){
            arr.push(item);
        }
        localStorage.setItem('cart',JSON.stringify(arr));
        Toast.fire({
            icon: 'success',
            title: 'Đã thêm sản phẩm vào giỏ hàng'
        })
    });
}
